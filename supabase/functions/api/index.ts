// IELTS Pro — API du site (Supabase Edge Function « api »).
// Le site appelle POST /functions/v1/api avec { action, ... } et l'en-tête x-session.
// Toutes les tables sont fermées au public : seule cette fonction (clé service) y accède.
import { createClient } from "jsr:@supabase/supabase-js@2";

const GOOGLE_CLIENT_ID = "244682237571-eoe9ni7aobshloth5c1ss3kdlvnphtat.apps.googleusercontent.com";
const ALLOWED_ORIGINS = ["https://solvarynlabs-spec.github.io", "http://localhost:8080", "http://localhost:5500"];
const SESSION_DAYS = 30;
const PLAN_RANK: Record<string, number> = { level: 1, prep: 2, premium: 3 };

const SITE = "https://solvarynlabs-spec.github.io/iels/";
// Prix en DA (les mêmes que config.js). Le serveur calcule toujours le montant lui-même.
const PRICES: Record<string, Record<string, number>> = {
  plan: { level: 1500, prep: 4500, premium: 8000 },
  live: { "1": 2000, "4": 7000, "8": 12000 },
  teacher: { "1": 3000, "3": 8000, "12": 28000 }
};
const SOFIZ_ACCOUNT = "GCBOEMS52WXFD2IC2YUJVQI74TTP3RBETE74TM6ZHGQL3R4B43RMMMKI";
// Clé publique de SofizPay (kit officiel sofizpay-sdk-js) pour vérifier ses confirmations signées
const SOFIZ_PUBLIC_KEY = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1N+bDPxpqeB9QB0affr/02aeRXAAnqHuLrgiUlVNdXtF7t+2w8pnEg+m9RRlc+4YEY6UyKTUjVe6k7v2p8JjUItk/fMNOEg/zY222EbqsKZ2mF4hzqgyJ3QHPXjZEEqABkbcYVv4ZyV2Wq0x0ykI+Hy/5YWKeah4RP2uEML1FlXGpuacnMXpW6n36dne3fUN+OzILGefeRpmpnSGO5+iJmpF2mRdKL3hs9WgaLSg6uQyrQuJA9xqcCpUmpNbIGYXN9QZxjdyRGnxivTE8awxTHV3WRcKrP2krz3ruRGF6yP6PVHEuPc0YDLsYjV5uhfs7JtIksNKhRRAQ16bAsj/9wIDAQAB`;
const REFERRAL_REWARD = 1; // séance offerte au parrain

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
    teacher_bio: p.teacher_bio, teacher_slots: p.teacher_slots, teacher_closed: p.teacher_closed, created_at: p.created_at,
    ref_code: p.ref_code, group_id: p.group_id
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
// Mot de passe admin : PBKDF2-SHA256, format pbkdf2$iterations$sel$empreinte (base64)
async function pbkdf2(password: string, salt: Uint8Array, iterations: number) {
  const k = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  return new Uint8Array(await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations, hash: "SHA-256" }, k, 256));
}
const b64 = (u: Uint8Array) => btoa(String.fromCharCode(...u));
const unb64 = (s: string) => Uint8Array.from(atob(s), c => c.charCodeAt(0));
async function checkPassword(password: string, rec: string) {
  const [, it, salt, hash] = String(rec).split("$");
  const got = await pbkdf2(password, unb64(salt), Number(it));
  const want = unb64(hash);
  if (got.length !== want.length) return false;
  let d = 0; for (let i = 0; i < got.length; i++) d |= got[i] ^ want[i];
  return d === 0;
}
async function makePasswordRecord(password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16)), it = 150000;
  return `pbkdf2$${it}$${b64(salt)}$${b64(await pbkdf2(password, salt, it))}`;
}
// Applique un achat (code, paiement ou admin) à un compte, + récompense de parrainage
async function applyGrant(uid: string, kind: string, value: string, source: string, note = "") {
  const p = await getProfile(uid);
  const upd: any = {};
  if (kind === "plan") {
    if ((PLAN_RANK[value] || 0) > (PLAN_RANK[p.plan] || 0)) { upd.plan = value; upd.plan_since = new Date().toISOString(); }
  } else if (kind === "live") {
    upd.live_credits = p.live_credits + Number(value);
  } else if (kind === "teacher") {
    const base = p.teacher_until && new Date(p.teacher_until) > new Date() ? new Date(p.teacher_until) : new Date();
    base.setMonth(base.getMonth() + Number(value));
    upd.teacher_until = base.toISOString(); upd.teacher_status = "active";
    if (p.role !== "admin") upd.role = "teacher";
  }
  // parrainage : le premier achat du filleul offre une séance au parrain
  if (p.referred_by && !p.ref_rewarded && source !== "admin") {
    upd.ref_rewarded = true;
    const { data: r } = await db.from("profiles").select("id, live_credits").eq("id", p.referred_by).maybeSingle();
    if (r) {
      await db.from("profiles").update({ live_credits: r.live_credits + REFERRAL_REWARD }).eq("id", r.id);
      await db.from("grants").insert({ user_id: r.id, kind: "live", value: String(REFERRAL_REWARD), granted_by: "referral", note: "friend: " + (p.name || p.email) });
    }
  }
  const { data: np } = Object.keys(upd).length ? await db.from("profiles").update(upd).eq("id", uid).select("*").single() : { data: p };
  await db.from("grants").insert({ user_id: uid, kind, value, granted_by: source, note });
  return np;
}
const priceOf = (kind: string, value: string) => (PRICES[kind] || {})[value] || 0;
function refCodeFor(id: string) { let h = 0; for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0; return "R" + h.toString(36).toUpperCase().slice(0, 6); }
async function verifySofizSignature(message: string, sigUrlSafe: string) {
  try {
    const der = Uint8Array.from(atob(SOFIZ_PUBLIC_KEY), c => c.charCodeAt(0));
    const k = await crypto.subtle.importKey("spki", der, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
    return await crypto.subtle.verify("RSASSA-PKCS1-v1_5", k, fromB64u(sigUrlSafe), enc.encode(message));
  } catch { return false; }
}
// Cherche sur le registre public de SofizPay (Stellar) un paiement reçu avec la référence de la commande
async function findPaymentOnLedger(ref: string, amount: number) {
  try {
    const r = await fetch(`https://horizon.stellar.org/accounts/${SOFIZ_ACCOUNT}/payments?order=desc&limit=200&join=transactions`);
    if (!r.ok) return null;
    const j = await r.json();
    for (const op of j._embedded?.records || []) {
      if (op.to !== SOFIZ_ACCOUNT) continue;
      const memo = String(op.transaction?.memo || "");
      if (memo.toUpperCase().includes(ref) && Number(op.amount) >= amount * 0.99) return { tx: op.transaction_hash, amount: op.amount, memo };
    }
  } catch { /* registre indisponible */ }
  return null;
}
async function markOrderPaid(o: any, source: string, raw: unknown) {
  const { data: upd } = await db.from("orders").update({ status: "paid", paid_at: new Date().toISOString(), source, raw }).eq("id", o.id).eq("status", "pending").select("*");
  if (!upd || !upd.length) return false; // déjà payée
  await applyGrant(o.user_id, o.kind, o.value, "payment", "order " + o.id + (o.promo ? " · promo " + o.promo : ""));
  return true;
}
const weekXP = (st: any) => { const a = st?.activity || {}; let n = 0; for (let i = 0; i < 7; i++) { const d = new Date(Date.now() - i * 864e5).toISOString().slice(0, 10); n += a[d] || 0; } return n; };
const shortName = (n: string) => { const w = String(n || "Student").trim().split(/\s+/); return w[0] + (w[1] ? " " + w[1][0] + "." : ""); };
async function sharesBooking(a: string, b: string) {
  const { count } = await db.from("bookings").select("*", { count: "exact", head: true }).or(`and(student_id.eq.${a},teacher_id.eq.${b}),and(student_id.eq.${b},teacher_id.eq.${a})`);
  return (count || 0) > 0;
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
    if (!existing || !existing.ref_code) row.ref_code = refCodeFor(g.sub);
    if (!existing && body.ref) {
      const { data: parrain } = await db.from("profiles").select("id").eq("ref_code", clean(body.ref, 12).toUpperCase()).maybeSingle();
      if (parrain && parrain.id !== g.sub) row.referred_by = parrain.id;
    }
    const { data, error } = await db.from("profiles").upsert(row).select("*").single();
    if (error) fail(500, error.message);
    return { session: await makeSession(g.sub), profile: publicProfile(data), state: data.state, state_updated: data.state_updated, isNew: !existing };
  },

  async adminPasswordLogin({ body }) {
    const email = clean(body.email, 200).trim().toLowerCase(), password = clean(body.password, 200);
    const since = new Date(Date.now() - 15 * 60000).toISOString();
    const { count } = await db.from("login_attempts").select("*", { count: "exact", head: true }).eq("email", email).eq("ok", false).gte("at", since);
    if ((count || 0) >= 5) fail(429, "Too many wrong attempts. Wait 15 minutes and try again.");
    const { data: st } = await db.from("settings").select("value").eq("key", "admin_password").maybeSingle();
    const ok = !!st && st.value.email === email && await checkPassword(password, st.value.hash);
    await db.from("login_attempts").insert({ email, ok });
    if (!ok) fail(401, "Wrong email or password.");
    // le compte admin : celui qui a cet e-mail (connexion Google) ou un compte admin dédié
    const { data: found } = await db.from("profiles").select("*").eq("email", email).limit(1);
    let prof = found && found[0];
    if (!prof) {
      const { data } = await db.from("profiles").insert({ id: "admin:" + email, email, name: "Administrator", role: "admin" }).select("*").single();
      prof = data;
    } else if (prof.role !== "admin") {
      const { data } = await db.from("profiles").update({ role: "admin" }).eq("id", prof.id).select("*").single();
      prof = data;
    }
    await db.from("profiles").update({ last_seen: new Date().toISOString() }).eq("id", prof.id);
    return { session: await makeSession(prof.id), profile: publicProfile(prof), state: prof.state, state_updated: prof.state_updated };
  },

  async adminSetPassword({ uid, body }) {
    const p = await requireAdmin(uid!);
    const { data: st } = await db.from("settings").select("value").eq("key", "admin_password").maybeSingle();
    if (!st || !(await checkPassword(clean(body.current, 200), st.value.hash))) fail(400, "Your current password is wrong.");
    const np = clean(body.newPassword, 200);
    if (np.length < 10 || !/[A-Za-z]/.test(np) || !/\d/.test(np)) fail(400, "Choose a password with at least 10 characters, letters and numbers.");
    await db.from("settings").update({ value: { email: st.value.email, hash: await makePasswordRecord(np) } }).eq("key", "admin_password");
    return { ok: true, email: p.email };
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
    if (/^SCHOOL-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code)) {
      const { data: g } = await db.from("groups").select("*").eq("code_hash", await sha256(code)).maybeSingle();
      if (!g) fail(400, "This school code is not valid.");
      const { count } = await db.from("profiles").select("*", { count: "exact", head: true }).eq("group_id", g.id);
      const me = await getProfile(uid!);
      if (me.group_id !== g.id && (count || 0) >= g.seats) fail(400, "This school has no free place left. Ask your school.");
      await db.from("profiles").update({ group_id: g.id }).eq("id", uid);
      const np = await applyGrant(uid!, "plan", g.plan, "school", g.name);
      return { kind: "school", value: g.plan, school: g.name, message: "school", profile: publicProfile(np) };
    }
    if (!/^(IELTS|LIVE|TEACH)-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code)) fail(400, "The code should look like IELTS-XXXX-XXXX, LIVE-XXXX-XXXX or TEACH-XXXX-XXXX.");
    const p = await getProfile(uid!);
    const { data, error } = await db.rpc("redeem_code", { p_user: uid, p_hash: await sha256(code) });
    if (error) fail(500, error.message);
    if (!data || !data.length) fail(400, "This code is not valid or was already used.");
    const { kind, value } = data[0];
    void p;
    const np = await applyGrant(uid!, kind, value, "code", code.slice(0, 6) + "…" + code.slice(-4));
    return { kind, value, message: kind, profile: publicProfile(np) };
  },

  async teachers() {
    const { data } = await db.from("profiles").select("*").eq("role", "teacher").eq("teacher_status", "active");
    const list = (data || []).filter(isTeacherActive);
    const today = new Date().toISOString().slice(0, 10);
    const { data: busy } = await db.from("bookings").select("teacher_id, day, slot").eq("status", "booked").gte("day", today);
    const { data: revs } = await db.from("reviews").select("teacher_id, stars, comment, created_at").order("created_at", { ascending: false });
    const out = list.map(t => {
      const r = (revs || []).filter(x => x.teacher_id === t.id);
      const avg = r.length ? r.reduce((a, x) => a + x.stars, 0) / r.length : 0;
      return { id: t.id, name: t.name, photo: t.photo, bio: t.teacher_bio, slots: t.teacher_slots, closed: t.teacher_closed,
        rating: Math.round(avg * 10) / 10, reviews: r.length, lastReviews: r.filter(x => x.comment).slice(0, 3).map(x => ({ stars: x.stars, comment: x.comment })),
        busy: (busy || []).filter(b => b.teacher_id === t.id).map(b => b.day + " " + b.slot) };
    });
    out.sort((a, b) => (b.rating * Math.min(b.reviews, 5)) - (a.rating * Math.min(a.reviews, 5)));
    return { teachers: out };
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
    const { data: revs } = (data || []).length ? await db.from("reviews").select("booking_id, stars").in("booking_id", (data || []).map(b => b.id)) : { data: [] };
    const rv = Object.fromEntries((revs || []).map(r => [r.booking_id, r.stars]));
    return { bookings: (data || []).map(b => ({ ...b, my_stars: rv[b.id] || null,
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
    const audio = body.audioPath ? clean(body.audioPath, 200) : null;
    if (audio && !audio.startsWith(uid + "/")) fail(400, "Invalid recording.");
    if (!audio && content.trim().length < 20) fail(400, "Your answer is too short to be corrected.");
    const { data } = await db.from("requests").insert({ student_id: uid, kind, task: clean(body.task, 600), content, audio_path: audio, teacher_id: body.teacherId ? clean(body.teacherId, 100) : null }).select("*").single();
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
    const urls: Record<string, string> = {};
    for (const r of data || []) if (r.audio_path) { const { data: su } = await db.storage.from("recordings").createSignedUrl(r.audio_path, 3600); if (su) urls[r.id] = su.signedUrl; }
    return { requests: (data || []).map(r => ({ ...r, audio_url: urls[r.id] || null, student_name: by[r.student_id]?.name || "Student", student_level: by[r.student_id]?.state?.level || null, teacher_name: r.teacher_id ? by[r.teacher_id]?.name || "Teacher" : null })) };
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


  /* ----- paiement automatique ----- */
  async checkPromo({ body }) {
    const code = clean(body.code, 30).trim().toUpperCase();
    const { data: pr } = await db.from("promos").select("*").eq("code", code).maybeSingle();
    if (!pr || !pr.active || (pr.expires_at && new Date(pr.expires_at) < new Date()) || (pr.max_uses && pr.used >= pr.max_uses)) fail(400, "This promo code is not valid.");
    return { code, percent: pr.percent };
  },

  async createOrder({ uid, body }) {
    const kind = clean(body.kind, 10), value = clean(body.value, 10);
    const base = priceOf(kind, value);
    if (!base) fail(400, "Unknown offer.");
    let amount = base, promo: string | null = null;
    if (body.promo) {
      const pc = await db.rpc("use_promo", { p_code: clean(body.promo, 30) });
      if (pc.data) { promo = clean(body.promo, 30).toUpperCase(); amount = Math.round(base * (100 - pc.data) / 100); }
    }
    const ref = "P" + crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
    await db.from("orders").insert({ id: ref, user_id: uid, kind, value, amount, promo });
    const returnUrl = Deno.env.get("SUPABASE_URL") + "/functions/v1/api?pay=return&ref=" + ref;
    return { ref, amount, base, promo, memo: "IELTS " + ref, returnUrl, account: SOFIZ_ACCOUNT };
  },

  async checkOrder({ uid, body }) {
    const { data: o } = await db.from("orders").select("*").eq("id", clean(body.ref, 20)).eq("user_id", uid).maybeSingle();
    if (!o) fail(404, "Order not found.");
    if (o.status === "pending") {
      const pay = await findPaymentOnLedger(o.id, o.amount);
      if (pay) await markOrderPaid(o, "ledger", pay);
    }
    const { data: o2 } = await db.from("orders").select("*").eq("id", o.id).single();
    const p = await getProfile(uid!);
    return { order: o2, profile: publicProfile(p) };
  },

  async myOrders({ uid }) {
    const { data } = await db.from("orders").select("*").eq("user_id", uid).order("created_at", { ascending: false }).limit(20);
    return { orders: data };
  },

  /* ----- avis ----- */
  async review({ uid, body }) {
    const { data: b } = await db.from("bookings").select("*").eq("id", clean(body.bookingId, 60)).maybeSingle();
    if (!b || b.student_id !== uid) fail(404, "Class not found.");
    if (b.status === "cancelled" || new Date(b.day + "T" + b.slot + ":00") > new Date()) fail(400, "You can rate a class after it took place.");
    const stars = Math.round(Number(body.stars));
    if (!(stars >= 1 && stars <= 5)) fail(400, "Choose 1 to 5 stars.");
    await db.from("reviews").upsert({ booking_id: b.id, student_id: uid, teacher_id: b.teacher_id, stars, comment: clean(body.comment, 600) }, { onConflict: "booking_id" });
    if (b.status === "booked") await db.from("bookings").update({ status: "done" }).eq("id", b.id);
    return { ok: true };
  },

  /* ----- enregistrements Speaking ----- */
  async uploadUrl({ uid, body }) {
    const p = await getProfile(uid!);
    if ((PLAN_RANK[p.plan] || 0) < 3 && p.role !== "admin") fail(403, "Teacher correction is in the Preparation + Teacher plan.");
    const ext = ["webm", "ogg", "mp3", "m4a", "wav", "mp4"].includes(String(body.ext)) ? body.ext : "webm";
    const path = `${uid}/${crypto.randomUUID()}.${ext}`;
    const { data, error } = await db.storage.from("recordings").createSignedUploadUrl(path);
    if (error) fail(500, error.message);
    return { path, url: data.signedUrl, token: data.token };
  },

  /* ----- classement ----- */
  async leaderboard({ uid }) {
    const { data } = await db.from("profiles").select("id, name, state").eq("role", "student").not("state", "is", null).limit(2000);
    const rows = (data || []).filter(p => !p.state?.hideRank).map(p => ({ id: p.id, name: shortName(p.name), xp: weekXP(p.state), streak: p.state?.streak?.count || 0, level: p.state?.level || null }))
      .filter(r => r.xp > 0).sort((a, b) => b.xp - a.xp);
    const meIdx = rows.findIndex(r => r.id === uid);
    return { top: rows.slice(0, 20).map((r, i) => ({ rank: i + 1, name: r.name, xp: r.xp, streak: r.streak, level: r.level, me: r.id === uid })),
      me: meIdx >= 0 ? { rank: meIdx + 1, xp: rows[meIdx].xp } : null, players: rows.length };
  },

  /* ----- parrainage ----- */
  async referrals({ uid }) {
    const p = await getProfile(uid!);
    let code = p.ref_code;
    if (!code) { code = refCodeFor(uid!); await db.from("profiles").update({ ref_code: code }).eq("id", uid); }
    const { data } = await db.from("profiles").select("name, ref_rewarded, created_at").eq("referred_by", uid).order("created_at", { ascending: false });
    return { code, friends: (data || []).map(f => ({ name: shortName(f.name), paid: f.ref_rewarded, date: f.created_at })) };
  },

  /* ----- messagerie ----- */
  async chatList({ uid }) {
    const p = await getProfile(uid!);
    let partnerIds: string[] = [];
    if (p.role === "admin") {
      const { data } = await db.from("messages").select("sender_id, receiver_id").or(`sender_id.eq.${uid},receiver_id.eq.${uid}`).limit(1000);
      partnerIds = (data || []).map(m => m.sender_id === uid ? m.receiver_id : m.sender_id);
    }
    const { data: bk } = await db.from("bookings").select("student_id, teacher_id").or(`student_id.eq.${uid},teacher_id.eq.${uid}`);
    partnerIds = [...new Set([...partnerIds, ...(bk || []).map(b => b.student_id === uid ? b.teacher_id : b.student_id)])].filter(x => x !== uid);
    if (!partnerIds.length) return { chats: [] };
    const { data: people } = await db.from("profiles").select("id, name, photo, role").in("id", partnerIds);
    const { data: msgs } = await db.from("messages").select("*").or(`sender_id.eq.${uid},receiver_id.eq.${uid}`).order("created_at", { ascending: false }).limit(1000);
    return { chats: (people || []).map(x => {
      const mine = (msgs || []).filter(m => m.sender_id === x.id || m.receiver_id === x.id);
      return { id: x.id, name: x.name, photo: x.photo, role: x.role, last: mine[0] ? { body: mine[0].body, at: mine[0].created_at, fromMe: mine[0].sender_id === uid } : null,
        unread: mine.filter(m => m.receiver_id === uid && !m.read_at).length };
    }).sort((a, b) => String(b.last?.at || "").localeCompare(String(a.last?.at || ""))) };
  },

  async chatGet({ uid, body }) {
    const other = clean(body.with, 100);
    const me = await getProfile(uid!);
    if (me.role !== "admin" && !(await sharesBooking(uid!, other))) fail(403, "You can only write to your teacher or your students.");
    const { data } = await db.from("messages").select("*").or(`and(sender_id.eq.${uid},receiver_id.eq.${other}),and(sender_id.eq.${other},receiver_id.eq.${uid})`).order("created_at", { ascending: true }).limit(300);
    await db.from("messages").update({ read_at: new Date().toISOString() }).eq("sender_id", other).eq("receiver_id", uid).is("read_at", null);
    const { data: o } = await db.from("profiles").select("id, name, photo, role").eq("id", other).maybeSingle();
    return { with: o, messages: (data || []).map(m => ({ id: m.id, body: m.body, at: m.created_at, fromMe: m.sender_id === uid })) };
  },

  async chatSend({ uid, body }) {
    const other = clean(body.to, 100), text = clean(body.body, 2000).trim();
    if (!text) fail(400, "Write a message.");
    const me = await getProfile(uid!);
    if (me.role !== "admin" && !(await sharesBooking(uid!, other))) fail(403, "You can only write to your teacher or your students.");
    await db.from("messages").insert({ sender_id: uid, receiver_id: other, body: text });
    return { ok: true };
  },

  async unread({ uid }) {
    const { count } = await db.from("messages").select("*", { count: "exact", head: true }).eq("receiver_id", uid).is("read_at", null);
    return { unread: count || 0 };
  },

  /* ----- école ----- */
  async mySchool({ uid }) {
    const p = await getProfile(uid!);
    const { data: groups } = await db.from("groups").select("*").eq("manager_email", p.email);
    const out = [];
    for (const g of groups || []) {
      const { data: m } = await db.from("profiles").select("name, email, state, last_seen").eq("group_id", g.id);
      out.push({ id: g.id, name: g.name, plan: g.plan, seats: g.seats, members: (m || []).map(x => ({ name: x.name, email: x.email, last_seen: x.last_seen, summary: stateSummary(x.state), weekXP: weekXP(x.state) })) });
    }
    return { schools: out };
  },

  /* ----- admin : ventes, promos, écoles, commandes ----- */
  async adminRevenue({ uid }) {
    await requireAdmin(uid!);
    const { data: orders } = await db.from("orders").select("kind, value, amount, status, paid_at, created_at").eq("status", "paid");
    const { data: grants } = await db.from("grants").select("kind, value, granted_by, created_at").in("granted_by", ["code", "school"]);
    const months: Record<string, { paid: number; codes: number }> = {};
    const offers: Record<string, number> = {};
    const add = (d: string, k: "paid" | "codes", n: number) => { const m = d.slice(0, 7); months[m] = months[m] || { paid: 0, codes: 0 }; months[m][k] += n; };
    (orders || []).forEach(o => { add(o.paid_at || o.created_at, "paid", o.amount); offers[o.kind + ":" + o.value] = (offers[o.kind + ":" + o.value] || 0) + 1; });
    (grants || []).forEach(g => { add(g.created_at, "codes", priceOf(g.kind, g.value)); offers[g.kind + ":" + g.value] = (offers[g.kind + ":" + g.value] || 0) + 1; });
    const { data: bk } = await db.from("bookings").select("teacher_id, status").neq("status", "cancelled");
    const tcount: Record<string, number> = {}; (bk || []).forEach(b => tcount[b.teacher_id] = (tcount[b.teacher_id] || 0) + 1);
    const tids = Object.keys(tcount);
    const { data: tp } = tids.length ? await db.from("profiles").select("id, name").in("id", tids) : { data: [] };
    const { data: revs } = await db.from("reviews").select("teacher_id, stars");
    const topTeachers = (tp || []).map(t => { const r = (revs || []).filter(x => x.teacher_id === t.id); return { name: t.name, classes: tcount[t.id], rating: r.length ? Math.round(r.reduce((a, x) => a + x.stars, 0) / r.length * 10) / 10 : null }; }).sort((a, b) => b.classes - a.classes).slice(0, 10);
    return { months, offers, topTeachers };
  },

  async adminOrders({ uid }) {
    await requireAdmin(uid!);
    const { data } = await db.from("orders").select("*").order("created_at", { ascending: false }).limit(200);
    const ids = [...new Set((data || []).map(o => o.user_id))];
    const { data: people } = ids.length ? await db.from("profiles").select("id, name, email").in("id", ids) : { data: [] };
    const by = Object.fromEntries((people || []).map(x => [x.id, x]));
    return { orders: (data || []).map(o => ({ ...o, raw: undefined, name: by[o.user_id]?.name, email: by[o.user_id]?.email })) };
  },

  async adminMarkPaid({ uid, body }) {
    await requireAdmin(uid!);
    const { data: o } = await db.from("orders").select("*").eq("id", clean(body.ref, 20)).maybeSingle();
    if (!o) fail(404, "Order not found.");
    if (!(await markOrderPaid(o, "admin", { by: uid }))) fail(400, "This order is already paid.");
    return { ok: true };
  },

  async adminPromos({ uid, body }) {
    await requireAdmin(uid!);
    if (body.create) {
      const code = clean(body.create.code, 20).trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
      const percent = Math.round(Number(body.create.percent));
      if (code.length < 3 || !(percent >= 1 && percent <= 90)) fail(400, "Use a code of 3+ letters and a discount between 1 and 90 %.");
      const { error } = await db.from("promos").insert({ code, percent, max_uses: body.create.maxUses ? Number(body.create.maxUses) : null, expires_at: body.create.expires || null });
      if (error) fail(400, /duplicate/.test(error.message) ? "This code already exists." : error.message);
    }
    if (body.toggle) { const { data: pr } = await db.from("promos").select("active").eq("code", clean(body.toggle, 20)).maybeSingle(); if (pr) await db.from("promos").update({ active: !pr.active }).eq("code", clean(body.toggle, 20)); }
    const { data } = await db.from("promos").select("*").order("created_at", { ascending: false });
    return { promos: data };
  },

  async adminGroups({ uid, body }) {
    await requireAdmin(uid!);
    let newCode: string | null = null;
    if (body.create) {
      const c = body.create;
      if (!PLAN_RANK[c.plan] || !(Number(c.seats) > 0) || !String(c.name || "").trim() || !/@/.test(String(c.email || ""))) fail(400, "Fill the school name, manager email, plan and number of places.");
      const A = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", r = crypto.getRandomValues(new Uint8Array(8));
      const part = [...r].map(x => A[x % 32]).join("");
      newCode = "SCHOOL-" + part.slice(0, 4) + "-" + part.slice(4);
      await db.from("groups").insert({ name: clean(c.name, 120), manager_email: clean(c.email, 200).toLowerCase(), plan: c.plan, seats: Number(c.seats), code_hash: await sha256(newCode) });
    }
    const { data: groups } = await db.from("groups").select("*").order("created_at", { ascending: false });
    const out = [];
    for (const g of groups || []) { const { count } = await db.from("profiles").select("*", { count: "exact", head: true }).eq("group_id", g.id); out.push({ ...g, code_hash: undefined, members: count || 0 }); }
    return { groups: out, newCode };
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
  const u = new URL(req.url);
  if (req.method === "GET" && u.searchParams.get("pay") === "return") {
    const ref = (u.searchParams.get("ref") || "").toUpperCase().slice(0, 20);
    let state = "pending";
    try {
      const { data: o } = await db.from("orders").select("*").eq("id", ref).maybeSingle();
      if (o) {
        const params = Object.fromEntries(u.searchParams.entries());
        const message = params.message || "", sig = params.signature_url_safe || params.signature || "";
        let ok = false, source = "";
        if (o.status === "paid") { state = "paid"; }
        else {
          if (message && sig && message.toUpperCase().includes(ref) && await verifySofizSignature(message, sig)) { ok = true; source = "signature"; }
          if (!ok) { const pay = await findPaymentOnLedger(ref, o.amount); if (pay) { ok = true; source = "ledger"; } }
          if (ok && await markOrderPaid(o, source, params)) state = "paid";
          else await db.from("orders").update({ raw: params }).eq("id", ref);
        }
      }
    } catch (e) { console.error(e); }
    return new Response(null, { status: 302, headers: { Location: `${SITE}#/plans/paid-${state}-${ref}` } });
  }
  const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
  try {
    if (req.method !== "POST") fail(405, "POST only");
    const body = await req.json().catch(() => ({}));
    const fn = actions[body.action];
    if (!fn) fail(404, "Unknown action");
    const uid = await readSession(req.headers.get("x-session"));
    if (!["login", "adminPasswordLogin"].includes(body.action) && !uid) fail(401, "Please log in again.");
    return json(200, await fn({ uid, body }));
  } catch (e) {
    if (e instanceof HttpError) return json(e.status, { error: e.message });
    console.error(e);
    return json(500, { error: "Server error. Please try again." });
  }
});
