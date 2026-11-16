// IELTS Pro — API du site (Supabase Edge Function « api »).
// Le site appelle POST /functions/v1/api avec { action, ... } et l'en-tête x-session.
// Toutes les tables sont fermées au public : seule cette fonction (clé service) y accède.
import { createClient } from "jsr:@supabase/supabase-js@2";

const GOOGLE_CLIENT_ID = "244682237571-eoe9ni7aobshloth5c1ss3kdlvnphtat.apps.googleusercontent.com";
const ALLOWED_ORIGINS = ["https://solvarynlabs-spec.github.io", "http://localhost:8080", "http://localhost:5500"];
const SESSION_DAYS = 30;
const PLAN_RANK: Record<string, number> = { level: 1, prep: 2, premium: 3 };

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });

/* ---------- utilitaires ---------- */
const enc = new TextEncoder();
const b64u = (b: Uint8Array) => btoa(String.fromCharCode(...b)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const fromB64u = (s: string) => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4)), c => c.charCodeAt(0));
async function sha256(s: string) { return [...new Uint8Array(await crypto.subtle.digest("SHA-256", enc.encode(s)))].map(b => b.toString(16).padStart(2, "0")).join(""); }
let hmacKey: CryptoKey | null = null;
async function key() {
  if (hmacKey) return hmacKey;
  const raw = await crypto.subtle.digest("SHA-256", enc.encode("ielts-pro-session:" + Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")));
  hmacKey = await crypto.subtle.importKey("raw", raw, { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
  return hmacKey;
}
async function makeSession(uid: string) {
  const payload = b64u(enc.encode(JSON.stringify({ uid, exp: Date.now() + SESSION_DAYS * 864e5 })));
  const sig = b64u(new Uint8Array(await crypto.subtle.sign("HMAC", await key(), enc.encode(payload))));
  return payload + "." + sig;
}
async function readSession(tok: string | null): Promise<string | null> {
  if (!tok || !tok.includes(".")) return null;
  const [payload, sig] = tok.split(".");
  try {
    const ok = await crypto.subtle.verify("HMAC", await key(), fromB64u(sig), enc.encode(payload));
    if (!ok) return null;
    const p = JSON.parse(new TextDecoder().decode(fromB64u(payload)));
    return p.exp > Date.now() ? p.uid : null;
  } catch { return null; }
}
class HttpError extends Error { constructor(public status: number, msg: string) { super(msg); } }
const fail = (status: number, msg: string): never => { throw new HttpError(status, msg); };
const clean = (s: unknown, max = 2000) => String(s ?? "").slice(0, max);
const isTeacherActive = (p: any) => p.role === "teacher" && p.teacher_status === "active" && (!p.teacher_until || new Date(p.teacher_until) > new Date());

function publicProfile(p: any) {
  return {
    id: p.id, email: p.email, name: p.name, photo: p.photo, role: p.role, plan: p.plan, plan_since: p.plan_since,
    live_credits: p.live_credits, teacher_status: p.teacher_status, teacher_until: p.teacher_until, teacher_active: isTeacherActive(p),
    teacher_bio: p.teacher_bio, teacher_slots: p.teacher_slots, teacher_closed: p.teacher_closed, created_at: p.created_at
  };
}
async function getProfile(uid: string) {
  const { data } = await db.from("profiles").select("*").eq("id", uid).maybeSingle();
  if (!data) fail(401, "Account not found. Please log in again.");
  return data;
}
async function adminEmails(): Promise<string[]> {
  const { data } = await db.from("settings").select("value").eq("key", "admin_emails").maybeSingle();
  return (data?.value || []).map((e: string) => e.toLowerCase());
}
const stateSummary = (st: any) => st ? { level: st.level || null, band: st.placement?.band ?? null, xp: st.xp || 0, fullTests: Object.keys(st.fullTests || {}).length, lastTest: st.placement?.date || null } : null;

/* ---------- actions ---------- */
type Ctx = { uid: string | null; body: any };
const actions: Record<string, (c: Ctx) => Promise<unknown>> = {

  async login({ body }) {
    const idToken = clean(body.idToken, 5000);
    const r = await fetch("https://oauth2.googleapis.com/tokeninfo?id_token=" + encodeURIComponent(idToken));
    if (!r.ok) fail(401, "Google sign-in could not be verified.");
    const g = await r.json();
    if (g.aud !== GOOGLE_CLIENT_ID || !g.sub || (g.email_verified !== "true" && g.email_verified !== true)) fail(401, "Google sign-in could not be verified.");
    const email = String(g.email || "").toLowerCase();
    const { data: existing } = await db.from("profiles").select("*").eq("id", g.sub).maybeSingle();
    const admins = await adminEmails();
    const wantTeacher = body.as === "teacher";
    const row: any = { id: g.sub, email, name: clean(g.name, 120), photo: clean(g.picture, 500), last_seen: new Date().toISOString() };
    if (admins.includes(email)) row.role = "admin";
    else if (!existing && wantTeacher) { row.role = "teacher"; row.teacher_status = "pending"; }
    const { data, error } = await db.from("profiles").upsert(row).select("*").single();
    if (error) fail(500, error.message);
    return { session: await makeSession(g.sub), profile: publicProfile(data), state: data.state, state_updated: data.state_updated, isNew: !existing };
  },

  async me({ uid }) {
    const p = await getProfile(uid!);
    await db.from("profiles").update({ last_seen: new Date().toISOString() }).eq("id", uid);
    return { profile: publicProfile(p), state: p.state, state_updated: p.state_updated };
  },

  async saveState({ uid, body }) {
    const st = body.state;
    const json = JSON.stringify(st ?? null);
    if (json.length > 800_000) fail(413, "Progress is too large to save.");
    const updated = Number(body.updated) || Date.now();
    // on ne garde pas les champs que seul le serveur décide
    if (st && typeof st === "object") { delete st.plan; delete st.premium; delete st.live; delete st.ownerTest; }
    const { error } = await db.from("profiles").update({ state: st, state_updated: updated }).eq("id", uid).lt("state_updated", updated);
    if (error) fail(500, error.message);
    return { ok: true };
  },

  async becomeTeacher({ uid, body }) {
    const p = await getProfile(uid!);
    if (p.role === "admin") return { profile: publicProfile(p) };
    const { data } = await db.from("profiles").update({ role: "teacher", teacher_status: p.teacher_status === "active" ? "active" : "pending", teacher_bio: clean(body.bio, 1500) }).eq("id", uid).select("*").single();
    return { profile: publicProfile(data) };
  },

  async redeem({ uid, body }) {
    const code = clean(body.code, 30).trim().toUpperCase().replace(/\s+/g, "");
    if (!/^(IELTS|LIVE|TEACH)-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code)) fail(400, "The code should look like IELTS-XXXX-XXXX, LIVE-XXXX-XXXX or TEACH-XXXX-XXXX.");
    const p = await getProfile(uid!);
    const { data, error } = await db.rpc("redeem_code", { p_user: uid, p_hash: await sha256(code) });
    if (error) fail(500, error.message);
    if (!data || !data.length) fail(400, "This code is not valid or was already used.");
    const { kind, value } = data[0];
    const upd: any = {}; let message = "";
    if (kind === "plan") {
      if ((PLAN_RANK[value] || 0) > (PLAN_RANK[p.plan] || 0)) { upd.plan = value; upd.plan_since = new Date().toISOString(); }
      message = "plan";
    } else if (kind === "live") {
      upd.live_credits = p.live_credits + Number(value); message = "live";
    } else if (kind === "teacher") {
      const base = p.teacher_until && new Date(p.teacher_until) > new Date() ? new Date(p.teacher_until) : new Date();
      base.setMonth(base.getMonth() + Number(value));
      upd.teacher_until = base.toISOString(); upd.teacher_status = "active";
      if (p.role !== "admin") upd.role = "teacher";
      message = "teacher";
    }
    const { data: np } = await db.from("profiles").update(upd).eq("id", uid).select("*").single();
    await db.from("grants").insert({ user_id: uid, kind, value, granted_by: "code", note: code.slice(0, 6) + "…" + code.slice(-4) });
    return { kind, value, message, profile: publicProfile(np) };
  },

  async teachers() {
    const { data } = await db.from("profiles").select("*").eq("role", "teacher").eq("teacher_status", "active");
    const list = (data || []).filter(isTeacherActive);
    const today = new Date().toISOString().slice(0, 10);
    const { data: busy } = await db.from("bookings").select("teacher_id, day, slot").eq("status", "booked").gte("day", today);
    return { teachers: list.map(t => ({ id: t.id, name: t.name, photo: t.photo, bio: t.teacher_bio, slots: t.teacher_slots, closed: t.teacher_closed,
      busy: (busy || []).filter(b => b.teacher_id === t.id).map(b => b.day + " " + b.slot) })) };
  },

  async book({ uid, body }) {
    const t = await getProfile(clean(body.teacherId, 100));
    if (!isTeacherActive(t)) fail(400, "This teacher is not available.");
    const day = clean(body.day, 10), slot = clean(body.slot, 5);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !(t.teacher_slots || []).includes(slot)) fail(400, "Choose a valid day and time.");
    if (new Date(day + "T" + slot + ":00") < new Date()) fail(400, "This time has already passed.");
    const room = "IELTSPro-" + crypto.randomUUID().replace(/-/g, "").slice(0, 14);
    const { data, error } = await db.rpc("book_session", { p_student: uid, p_teacher: t.id, p_day: day, p_slot: slot, p_topic: clean(body.topic, 80), p_room: room });
    if (error) fail(400, /NO_CREDITS/.test(error.message) ? "You have no live session left. Buy a session first." : /duplicate|unique/i.test(error.message) ? "This time was just booked by someone else. Choose another time." : error.message);
    return { id: data, room };
  },

  async myBookings({ uid }) {
    const p = await getProfile(uid!);
    const col = p.role === "teacher" ? "teacher_id" : "student_id";
    const { data } = await db.from("bookings").select("*").eq(col, uid).order("day", { ascending: true }).order("slot", { ascending: true }).limit(200);
    const ids = [...new Set((data || []).flatMap(b => [b.student_id, b.teacher_id]))];
    const { data: people } = ids.length ? await db.from("profiles").select("id, name, email, photo, state").in("id", ids) : { data: [] };
    const by = Object.fromEntries((people || []).map(x => [x.id, x]));
    return { bookings: (data || []).map(b => ({ ...b,
      teacher: { name: by[b.teacher_id]?.name || "Teacher", photo: by[b.teacher_id]?.photo || "" },
      student: p.role === "student" ? undefined : { name: by[b.student_id]?.name || "Student", email: by[b.student_id]?.email || "", summary: stateSummary(by[b.student_id]?.state) } })) };
  },

  async cancelBooking({ uid, body }) {
    const { data: b } = await db.from("bookings").select("*").eq("id", clean(body.id, 60)).maybeSingle();
    if (!b || (b.student_id !== uid && b.teacher_id !== uid)) fail(404, "Class not found.");
    if (b.status !== "booked") fail(400, "This class is not active.");
    await db.from("bookings").update({ status: "cancelled" }).eq("id", b.id);
    const { data: s } = await db.from("profiles").select("live_credits").eq("id", b.student_id).single();
    await db.from("profiles").update({ live_credits: (s?.live_credits || 0) + 1 }).eq("id", b.student_id);
    return { ok: true };
  },

  async markDone({ uid, body }) {
    const { data: b } = await db.from("bookings").select("*").eq("id", clean(body.id, 60)).maybeSingle();
    if (!b || b.teacher_id !== uid) fail(404, "Class not found.");
    await db.from("bookings").update({ status: "done" }).eq("id", b.id);
    return { ok: true };
  },

  async updateTeacher({ uid, body }) {
    const p = await getProfile(uid!);
    if (p.role !== "teacher" && p.role !== "admin") fail(403, "Teacher accounts only.");
    const slots = (Array.isArray(body.slots) ? body.slots : []).map((s: unknown) => clean(s, 5)).filter((s: string) => /^\d{2}:\d{2}$/.test(s)).slice(0, 12).sort();
    const closed = (Array.isArray(body.closed) ? body.closed : []).map(Number).filter((d: number) => d >= 0 && d <= 6);
    const { data } = await db.from("profiles").update({ teacher_bio: clean(body.bio, 1500), teacher_slots: slots, teacher_closed: closed }).eq("id", uid).select("*").single();
    return { profile: publicProfile(data) };
  },

  async requestCorrection({ uid, body }) {
    const p = await getProfile(uid!);
    if ((PLAN_RANK[p.plan] || 0) < 3 && p.role !== "admin") fail(403, "Teacher correction is in the Preparation + Teacher plan.");
    const kind = body.kind === "speaking" ? "speaking" : "writing";
    const content = clean(body.content, 12000);
    if (content.trim().length < 20) fail(400, "Your answer is too short to be corrected.");
    const { data } = await db.from("requests").insert({ student_id: uid, kind, task: clean(body.task, 600), content, teacher_id: body.teacherId ? clean(body.teacherId, 100) : null }).select("*").single();
    return { request: data };
  },

  async myRequests({ uid }) {
    const p = await getProfile(uid!);
    let q = db.from("requests").select("*").order("created_at", { ascending: false }).limit(100);
    if (p.role === "teacher") q = q.or(`teacher_id.eq.${uid},and(teacher_id.is.null,status.eq.open)`);
    else if (p.role !== "admin") q = q.eq("student_id", uid);
    const { data } = await q;
    const ids = [...new Set((data || []).flatMap(r => [r.student_id, r.teacher_id]).filter(Boolean))];
    const { data: people } = ids.length ? await db.from("profiles").select("id, name, state").in("id", ids) : { data: [] };
    const by = Object.fromEntries((people || []).map(x => [x.id, x]));
    return { requests: (data || []).map(r => ({ ...r, student_name: by[r.student_id]?.name || "Student", student_level: by[r.student_id]?.state?.level || null, teacher_name: r.teacher_id ? by[r.teacher_id]?.name || "Teacher" : null })) };
  },

  async answerRequest({ uid, body }) {
    const p = await getProfile(uid!);
    if (!isTeacherActive(p) && p.role !== "admin") fail(403, "Only active teachers can answer.");
    const band = Number(body.band);
    const { data: r } = await db.from("requests").select("*").eq("id", clean(body.id, 60)).maybeSingle();
    if (!r || (r.teacher_id && r.teacher_id !== uid && p.role !== "admin")) fail(404, "Request not found.");
    const { data } = await db.from("requests").update({ feedback: clean(body.feedback, 8000), band: band >= 0 && band <= 9 ? Math.round(band * 2) / 2 : null, status: "answered", answered_at: new Date().toISOString(), teacher_id: r.teacher_id || uid }).eq("id", r.id).select("*").single();
    return { request: data };
  },

  /* ----- admin ----- */
  async adminStats({ uid }) {
    await requireAdmin(uid!);
    const { data: users } = await db.from("profiles").select("role, plan, teacher_status, live_credits, created_at, last_seen");
    const u = users || [];
    const day = 864e5, now = Date.now();
    const { count: bookingsActive } = await db.from("bookings").select("*", { count: "exact", head: true }).eq("status", "booked");
    const { count: bookingsDone } = await db.from("bookings").select("*", { count: "exact", head: true }).eq("status", "done");
    const { count: openReq } = await db.from("requests").select("*", { count: "exact", head: true }).eq("status", "open");
    const { data: codes } = await db.from("codes").select("kind, value, used_by");
    const codeStats: Record<string, { total: number; used: number }> = {};
    (codes || []).forEach(c => { const k = c.kind + ":" + c.value; codeStats[k] = codeStats[k] || { total: 0, used: 0 }; codeStats[k].total++; if (c.used_by) codeStats[k].used++; });
    return {
      users: u.length, students: u.filter(x => x.role === "student").length, teachers: u.filter(x => x.role === "teacher").length,
      teachersPending: u.filter(x => x.role === "teacher" && x.teacher_status === "pending").length, admins: u.filter(x => x.role === "admin").length,
      plans: { level: u.filter(x => x.plan === "level").length, prep: u.filter(x => x.plan === "prep").length, premium: u.filter(x => x.plan === "premium").length },
      newThisWeek: u.filter(x => now - new Date(x.created_at).getTime() < 7 * day).length,
      activeToday: u.filter(x => now - new Date(x.last_seen).getTime() < day).length,
      bookingsActive, bookingsDone, openRequests: openReq, codeStats
    };
  },

  async adminUsers({ uid, body }) {
    await requireAdmin(uid!);
    let q = db.from("profiles").select("*").order("created_at", { ascending: false }).limit(200);
    const s = clean(body.search, 80).trim();
    if (s) q = q.or(`email.ilike.%${s.replace(/[%,()]/g, "")}%,name.ilike.%${s.replace(/[%,()]/g, "")}%`);
    if (body.role) q = q.eq("role", clean(body.role, 10));
    const { data } = await q;
    return { users: (data || []).map(p => ({ ...publicProfile(p), last_seen: p.last_seen, summary: stateSummary(p.state) })) };
  },

  async adminUpdateUser({ uid, body }) {
    await requireAdmin(uid!);
    const id = clean(body.id, 100); const upd: any = {}; const notes: string[] = [];
    if (body.role && ["student", "teacher", "admin"].includes(body.role)) { upd.role = body.role; notes.push("role=" + body.role); }
    if (body.plan !== undefined) { upd.plan = PLAN_RANK[body.plan] ? body.plan : null; upd.plan_since = upd.plan ? new Date().toISOString() : null; notes.push("plan=" + upd.plan); }
    if (body.addCredits) { const p = await getProfile(id); upd.live_credits = Math.max(0, p.live_credits + Number(body.addCredits)); notes.push("credits" + (body.addCredits > 0 ? "+" : "") + body.addCredits); }
    if (body.teacherStatus && ["none", "pending", "active", "suspended"].includes(body.teacherStatus)) { upd.teacher_status = body.teacherStatus; notes.push("teacher=" + body.teacherStatus); }
    if (body.teacherMonths) {
      const p = await getProfile(id);
      const base = p.teacher_until && new Date(p.teacher_until) > new Date() ? new Date(p.teacher_until) : new Date();
      base.setMonth(base.getMonth() + Number(body.teacherMonths));
      upd.teacher_until = base.toISOString(); upd.teacher_status = "active"; if (p.role === "student") upd.role = "teacher";
      notes.push("teacher+" + body.teacherMonths + "m");
    }
    const { data, error } = await db.from("profiles").update(upd).eq("id", id).select("*").single();
    if (error) fail(400, error.message);
    await db.from("grants").insert({ user_id: id, kind: "admin", value: notes.join(", "), granted_by: uid, note: clean(body.note, 200) });
    return { user: publicProfile(data) };
  },

  async adminGenCodes({ uid, body }) {
    await requireAdmin(uid!);
    const kind = clean(body.kind, 10), value = clean(body.value, 10), n = Math.min(100, Math.max(1, Number(body.n) || 10));
    const ok = (kind === "plan" && PLAN_RANK[value]) || (kind === "live" && ["1", "4", "8"].includes(value)) || (kind === "teacher" && ["1", "3", "12"].includes(value));
    if (!ok) fail(400, "Unknown code type.");
    const prefix = kind === "plan" ? "IELTS" : kind === "live" ? "LIVE" : "TEACH";
    const { data, error } = await db.rpc("gen_codes", { p_kind: kind, p_value: value, p_n: n, p_prefix: prefix, p_by: uid });
    if (error) fail(500, error.message);
    return { codes: data };
  },

  async adminBookings({ uid }) {
    await requireAdmin(uid!);
    const { data } = await db.from("bookings").select("*").order("day", { ascending: false }).limit(300);
    const ids = [...new Set((data || []).flatMap(b => [b.student_id, b.teacher_id]))];
    const { data: people } = ids.length ? await db.from("profiles").select("id, name").in("id", ids) : { data: [] };
    const by = Object.fromEntries((people || []).map(x => [x.id, x.name]));
    return { bookings: (data || []).map(b => ({ ...b, student_name: by[b.student_id], teacher_name: by[b.teacher_id] })) };
  },

  async adminGrants({ uid }) {
    await requireAdmin(uid!);
    const { data } = await db.from("grants").select("*").order("created_at", { ascending: false }).limit(100);
    return { grants: data };
  }
};
async function requireAdmin(uid: string) { const p = await getProfile(uid); if (p.role !== "admin") fail(403, "Admin only."); return p; }

Deno.serve(async req => {
  const origin = req.headers.get("origin") || "";
  const cors = {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "content-type, x-session, apikey, authorization, x-client-info",
    "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin"
  };
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
  try {
    if (req.method !== "POST") fail(405, "POST only");
    const body = await req.json().catch(() => ({}));
    const fn = actions[body.action];
    if (!fn) fail(404, "Unknown action");
    const uid = await readSession(req.headers.get("x-session"));
    if (body.action !== "login" && !uid) fail(401, "Please log in again.");
    return json(200, await fn({ uid, body }));
  } catch (e) {
    if (e instanceof HttpError) return json(e.status, { error: e.message });
    console.error(e);
    return json(500, { error: "Server error. Please try again." });
  }
});
