"use strict";
/* =========================================================
   IELTS Pro — application (SPA sans dépendance)
   ========================================================= */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const app = $("#app");
const KEY = "ielts-pro-v1";
const LETTERS = "ABCDE";
const ICONS = { grammar: "book", vocab: "cards", reading: "open", listening: "headphones" };

/* ---------------- Icônes (SVG au trait) ---------------- */
const IC = {
  home: '<path d="M3 10.5 12 3l9 7.5V21H3z"/><path d="M9 21v-7h6v7"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
  cards: '<rect x="3" y="7" width="13" height="14" rx="2"/><path d="M8 3h11a2 2 0 0 1 2 2v12"/>',
  open: '<path d="M2 4h7a3 3 0 0 1 3 3v14a2 2 0 0 0-2-2H2z"/><path d="M22 4h-7a3 3 0 0 0-3 3v14a2 2 0 0 1 2-2h8z"/>',
  headphones: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z"/>',
  pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v5M8 22h8"/>',
  chart: '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 6-7"/>',
  flame: '<path d="M12 22c4 0 7-3 7-7 0-5-5-7-5-12-3 2-4 5-4 7-1-1-2-2-2-4-2 2-3 5-3 9 0 4 3 7 7 7z"/>',
  zap: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  check: '<path d="m5 12 5 5 9-10"/>',
  checkc: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  play: '<path d="M7 4v16l13-8z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
  flask: '<path d="M9 2h6M10 2v6L4 19a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3L14 8V2"/><path d="M7 15h10"/>',
  volume: '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  bulb: '<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/>',
  refresh: '<path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/>',
  layers: '<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>',
  star: '<path d="m12 2 3 6.5 7 .8-5.2 4.8 1.5 7L12 17.6 5.7 21l1.5-7L2 9.3l7-.8z"/>'
};
const ic = (n, cls = "") => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${IC[n] || ""}</svg>`;

/* ---------------- Photos (Unsplash) ---------------- */
// Photos de l'Angleterre (Londres)
const PH = {
  hero: "1520986606214-8b456906c813",      // Big Ben et bus rouge
  smileA: "1529655683826-aba9b3e77383",
  smileB: "1500380804539-4e1e8c1e7118",
  group: "1488747279002-c8523379faaa",     // Westminster et bus rouge
  test: "1533929736458-ca588d08c8be",      // Tower Bridge
  grad: "1529655683826-aba9b3e77383",      // Big Ben au coucher du soleil
  grammar: "1486299267070-83823f5448dd",   // Palais de Westminster
  vocab: "1543832923-44667a44c804",        // Tower Bridge au crépuscule
  reading: "1513635269975-59663e0ac1ad",   // la Tamise vue du ciel
  listening: "1517394834181-95ed159986c7", // cabine téléphonique rouge
  writing: "1505761671935-60b3a7427bad",   // pont de Westminster
  speaking: "1526129318478-62ed807ebdf9",  // rue pavoisée de drapeaux britanniques
  progress: "1494922275507-58dc039ed337",  // Westminster au lever du soleil
  friends: "1500380804539-4e1e8c1e7118",   // Big Ben
  toolkit: "1543832923-44667a44c804"
};

/* ---------------- Drapeaux (SVG) ---------------- */
let flagId = 0;
function flagUK() {
  const id = "uk" + (++flagId);
  return `<svg class="flag-svg" viewBox="0 0 60 30" role="img" aria-label="Flag of the United Kingdom"><clipPath id="${id}a"><path d="M0,0 v30 h60 v-30 z"/></clipPath><clipPath id="${id}b"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath><g clip-path="url(#${id}a)"><path d="M0,0 v30 h60 v-30 z" fill="#012169"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/><path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#${id}b)" stroke="#C8102E" stroke-width="4"/><path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/><path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6"/></g></svg>`;
}
function flagDZ() {
  return `<svg class="flag-svg" viewBox="0 0 900 600" role="img" aria-label="Flag of Algeria"><rect width="450" height="600" fill="#006233"/><rect x="450" width="450" height="600" fill="#fff"/><path d="M579.9 225a150 150 0 1 0 0 150a120 120 0 1 1 0-150" fill="#d21034"/><path d="M500 300l122-39.6-75.4 103.9v-128.6l75.4 103.9z" fill="#d21034"/></svg>`;
}
const flagPair = (cls = "") => `<span class="flag-pair ${cls}"><span class="flag wave">${flagDZ()}</span><span class="flag wave">${flagUK()}</span></span>`;

const photo = (k, w = 1200) => `https://images.unsplash.com/photo-${PH[k]}?w=${w}&q=75&auto=format&fit=crop`;
const pageHero = (img, tag, title, sub, right = "") => `<section class="page-hero">
  <img src="${photo(img, 1600)}" alt="" loading="eager">
  <div class="row" style="align-items:flex-end"><div style="flex:1;min-width:240px"><span class="tag">${tag}</span><h1>${title}</h1>${sub ? `<p>${sub}</p>` : ""}</div>${right}</div>
</section>`;

/* ---------------- État & stockage ---------------- */
function defaults() {
  return { placement: null, history: [], level: null, done: {}, xp: 0, streak: { last: null, count: 0 }, writings: [], theme: null, known: {}, drafts: {}, activity: {} };
}
let S = (() => {
  try { return Object.assign(defaults(), JSON.parse(localStorage.getItem(KEY)) || {}); }
  catch { return defaults(); }
})();
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* stockage indisponible */ } }

const lvl = () => LEVELS.find(l => l.id === S.level);
const lvlIndex = id => LEVELS.findIndex(l => l.id === id);
// Chaque module contient plusieurs exercices ; le score du module = moyenne (exercices non faits = 0)
const itemsOf = (key, L = lvl()) => key === "speaking" ? L.speaking.cards : L[key];
const itemScore = (key, i, level = S.level) => S.done[`${level}:${key}:${i}`];
const score = (key, level = S.level) => {
  const L = LEVELS.find(l => l.id === level), n = itemsOf(key, L).length;
  let sum = 0, any = false;
  for (let i = 0; i < n; i++) { const s = itemScore(key, i, level); if (s !== undefined) { any = true; sum += s; } }
  return any ? Math.round(sum / n) : undefined;
};
const doneCount = (key, level = S.level) => itemsOf(key, LEVELS.find(l => l.id === level)).filter((_, i) => itemScore(key, i, level) !== undefined).length;
const validated = (key, level = S.level) => itemsOf(key, LEVELS.find(l => l.id === level)).every((_, i) => itemScore(key, i, level) >= 70);
const firstTodo = key => { const n = itemsOf(key).length; for (let i = 0; i < n; i++) if (itemScore(key, i) === undefined) return i; for (let i = 0; i < n; i++) if (itemScore(key, i) < 70) return i; return 0; };
const allItemsCount = L => MODULES.reduce((n, m) => n + itemsOf(m.key, L).length, 0);

/* ---------------- Utilitaires ---------------- */
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const paras = t => t.split(/\n\s*\n/).map(p => `<p>${esc(p.trim())}</p>`).join("");
const fmt = sec => { sec = Math.max(0, Math.round(sec)); return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`; };
const today = () => new Date().toISOString().slice(0, 10);
function prep(q) { const order = q.o.map((_, i) => i); if (!q.noShuffle) shuffle(order); return { ...q, order }; }
const toBand = p => Math.min(9, Math.max(3.5, Math.round((3.5 + p * 5) * 2) / 2));
const bandToLevel = b => b < 5 ? "A2" : b < 6 ? "B1" : b < 7 ? "B2" : "C1";
const pctColor = p => p >= 70 ? "var(--good)" : p >= 45 ? "var(--warn)" : "var(--bad)";

let cleanups = [];
const onLeave = fn => cleanups.push(fn);

function toast(msg) {
  const t = $("#toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 2600);
}

function addXP(n) { S.xp += n; S.activity = S.activity || {}; S.activity[today()] = (S.activity[today()] || 0) + n; }

function bumpStreak() {
  const d = today(); if (S.streak.last === d) return;
  const y = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  S.streak.count = S.streak.last === y ? S.streak.count + 1 : 1;
  S.streak.last = d;
}

function award(key, i, pct) {
  const k = `${S.level}:${key}:${i}`; const prev = S.done[k]; const first = prev === undefined;
  S.done[k] = Math.max(prev ?? 0, pct);
  const gain = first ? Math.round(20 + pct / 2) : Math.round(5 + pct / 10);
  addXP(gain); bumpStreak(); save(); updateTop();
  toast(`Score saved: ${pct}%`);

  return gain;
}

/* ---------------- Synthèse vocale ---------------- */
let speakToken = 0;
function pickVoice() {
  const v = speechSynthesis.getVoices();
  return v.find(x => /en-GB/i.test(x.lang) && /Natural|Online|Google/i.test(x.name))
    || v.find(x => /en-GB/i.test(x.lang))
    || v.find(x => /^en/i.test(x.lang));
}
function speak(text, { rate = 1, onend } = {}) {
  if (!("speechSynthesis" in window)) { toast("Text-to-speech is not available in this browser"); onend && onend(); return; }
  speechSynthesis.cancel();
  const token = ++speakToken;
  const parts = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text]; // phrase par phrase (évite les coupures de Chrome)
  const voice = pickVoice();
  parts.forEach((p, i) => {
    const u = new SpeechSynthesisUtterance(p.trim());
    u.lang = "en-GB"; u.rate = rate; if (voice) u.voice = voice;
    if (i === parts.length - 1) u.onend = () => { if (token === speakToken && onend) onend(); };
    speechSynthesis.speak(u);
  });
}
function stopSpeak() { speakToken++; if ("speechSynthesis" in window) speechSynthesis.cancel(); }
if ("speechSynthesis" in window) speechSynthesis.getVoices();

function audioWidget(text, maxPlays = 2, withSpeed = false) {
  const id = "a" + Math.random().toString(36).slice(2, 8);
  const html = `<div class="audio-box" id="${id}">
    <button class="play-btn" aria-label="Play audio">▶</button>
    <div class="wave">${"<i></i>".repeat(20)}</div>
    <div><b>Listen carefully</b><div class="muted small plays">${maxPlays} play(s) left</div></div>
    ${withSpeed ? `<div class="spacer"></div><select class="speed" aria-label="Speed"><option value="0.8">Slow 0.8×</option><option value="1" selected>Normal 1×</option><option value="1.15">Fast 1.15×</option></select>` : ""}
  </div>`;
  const bind = () => {
    const box = $("#" + id); if (!box) return;
    let left = maxPlays, playing = false;
    const btn = $(".play-btn", box), wave = $(".wave", box), plays = $(".plays", box);
    const end = () => { playing = false; btn.classList.remove("playing"); wave.classList.remove("playing-wave"); btn.textContent = "▶"; btn.disabled = left <= 0; };
    btn.onclick = () => {
      if (playing) { stopSpeak(); end(); return; }
      if (left <= 0) return;
      left--; plays.textContent = left > 0 ? `${left} play(s) left` : "No plays left";
      playing = true; btn.classList.add("playing"); wave.classList.add("playing-wave"); btn.textContent = "■";
      const rate = withSpeed ? +$(".speed", box).value : 0.95;
      speak(text, { rate, onend: end });
    };
  };
  return { html, bind };
}

/* ---------------- Confettis ---------------- */
function confetti() { return;
  const c = $("#confetti"), ctx = c.getContext("2d");
  c.width = innerWidth; c.height = innerHeight;
  const colors = ["#5b4cf0", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#0ea5e9"];
  const P = Array.from({ length: 160 }, () => ({
    x: innerWidth / 2 + (Math.random() - .5) * 200, y: innerHeight / 3,
    vx: (Math.random() - .5) * 16, vy: Math.random() * -14 - 4, s: Math.random() * 8 + 4,
    r: Math.random() * 6, vr: (Math.random() - .5) * .3, c: colors[Math.floor(Math.random() * colors.length)]
  }));
  let f = 0;
  (function tick() {
    ctx.clearRect(0, 0, c.width, c.height);
    P.forEach(p => { p.vy += .4; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); ctx.restore(); });
    if (++f < 180) requestAnimationFrame(tick); else ctx.clearRect(0, 0, c.width, c.height);
  })();
}

/* ---------------- Thème & barre du haut ---------------- */
function applyTheme() {
  const t = S.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  document.documentElement.dataset.theme = t;
}
function toggleTheme() {
  S.theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  save(); applyTheme(); updateTop();
}

const PAGE_TITLES = { dashboard: "Dashboard", grammar: "Grammar", vocab: "Vocabulary", reading: "Reading", listening: "Listening", writing: "Writing", speaking: "Speaking", progress: "My progress", toolkit: "Toolkit", books: "Collins books", book: "My study book" };
const brandHTML = `<a href="#/" class="brand"><span class="brand-logo">i</span><span>IELTS<b>Pro</b></span></a>`;

function updateTop() {
  const [route, p] = location.hash.replace(/^#\/?/, "").split("/");
  const isApp = !!S.level && (NEEDS_LEVEL.includes(route) || route === "books" || route === "book");
  document.body.classList.toggle("appmode", isApp);
  document.body.classList.toggle("public", !isApp);
  const dark = document.documentElement.dataset.theme === "dark";
  const themeBtn = `<button class="icon-btn" id="themeBtn" title="Change theme" aria-label="Change theme">${ic(dark ? "sun" : "moon")}</button>`;

  if (isApp) {
    const L = lvl();
    const valid = MODULES.filter(m => validated(m.key)).length;
    const link = (r, icon, name, key, color) => {
      const active = r === route || (r === "book" && route === "book");
      const n = key ? itemsOf(key).length : 0, d = key ? doneCount(key) : 0;
      return `<a href="#/${r === "book" ? "book/" + S.level : r}" class="side-link ${active ? "active" : ""}" style="--mc:${color || "var(--accent)"}"><span class="side-ic">${ic(icon)}</span><span>${name}</span>${key ? `<span class="dot ${validated(key) ? "ok" : d ? "mid" : ""}">${d}/${n}</span>` : ""}</a>`;
    };
    $("#sidebar").innerHTML = `${brandHTML}
      <div class="side-label">General</div>
      ${link("dashboard", "grid", "Dashboard", null, "#8b5cf6")}
      ${link("progress", "chart", "My progress", null, "#10b981")}
      ${link("toolkit", "layers", "Toolkit", null, "#f43f5e")}
      ${link("book", "open", "My study book", null, "#e4002b")}
      ${link("books", "book", "Collins books", null, "#e4002b")}
      <div class="side-label">${L.id} modules</div>
      ${MODULES.map(m => link(m.route, m.icon, m.name, m.key, m.color)).join("")}
      <div class="side-level">
        <div class="small" style="opacity:.9;font-weight:700">Current course</div>
        <div class="row" style="align-items:baseline;gap:8px"><span class="lv">${L.id}</span><b>${L.name}</b></div>
        <div class="bar"><div style="width:${valid / MODULES.length * 100}%"></div></div>
        <div class="row small"><span>${valid}/${MODULES.length} completed</span><div class="spacer"></div><a href="#/test">Retake the test</a></div>
      </div>`;
    $("#topbar").innerHTML = `<div class="page-title"><div class="crumb">${L.id} course · ${L.name}</div><h2>${PAGE_TITLES[route] || ""}</h2></div>
      <div class="top-actions">
        <span class="chip-stat fire" title="Study streak">${ic("calendar")}${S.streak.count} <span class="lbl">day${S.streak.count > 1 ? "s" : ""}</span></span>
        <span class="chip-stat xp" title="Activity points">${ic("chart")}${S.xp} <span class="lbl">pts</span></span>
        ${themeBtn}<span class="avatar" title="My profile">${L.id}</span>
      </div>`;
    $("#footer").innerHTML = `<div class="app-footer">IELTS Pro · scores are estimates, not official results.</div>`;
  } else {
    $("#sidebar").innerHTML = "";
    const onHome = route === "";
    $("#topbar").innerHTML = `${brandHTML}
      <nav class="pubnav">${onHome ? [["format", "The exam"], ["score", "Score calculator"], ["criteres", "Criteria"], ["modules", "Practice"], ["faq", "FAQ"]].map(([id, n]) => `<button data-scroll="${id}">${n}</button>`).join("") : `<button data-go="">Home</button>`}<button data-go="books">Books</button></nav>
      <div class="top-actions">${flagPair("sm")}${themeBtn}
        ${S.level ? `<a class="btn btn-dark btn-sm" href="#/dashboard">My dashboard ${ic("arrow", "sm arrow")}</a>` : route === "test" ? "" : `<a class="btn btn-primary btn-sm" href="#/test">Take the test ${ic("arrow", "sm arrow")}</a>`}
      </div>`;
    $("#footer").innerHTML = onHome ? `<footer class="site-footer"><div class="wrap">
        <div class="foot-grid">
          <div>${brandHTML}${flagPair("foot")}<p style="max-width:320px;margin-top:14px">Complete IELTS Academic preparation: a placement test, a personalised course and progress tracking.</p></div>
          <div><h4>Get started</h4><a href="#/test">Placement test</a>${S.level ? `<a href="#/dashboard">Dashboard</a>` : ""}</div>
          <div><h4>Practice</h4><button data-scroll="modules">Reading & Listening</button><button data-scroll="modules">Writing</button><button data-scroll="modules">Speaking</button></div>
          <div><h4>Help</h4><button data-scroll="faq">FAQ</button><button data-scroll="levels">Levels</button></div>
        </div>
        <div class="foot-bottom"><span>© ${new Date().getFullYear()} IELTS Pro — an independent practice site, not affiliated with IELTS, the British Council, IDP or Cambridge.</span><span>Scores are estimates, not official results.</span></div>
      </div></footer>` : "";
  }
  $("#themeBtn").onclick = toggleTheme;
  $$("[data-scroll]").forEach(b => b.onclick = () => document.getElementById(b.dataset.scroll)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  $$("[data-go]").forEach(b => b.onclick = () => location.hash = "#/" + b.dataset.go);
}

/* ---------------- Animations : titres, barre de lecture, parallaxe ---------------- */
function splitTitles() {
  $$("h1.display", app).forEach(h => {
    if (h.dataset.split) return; h.dataset.split = 1;
    const words = h.textContent.trim().split(/\s+/);
    h.innerHTML = words.map((w, i) => `<span class="split-word"><span style="animation-delay:${.1 + i * .07}s">${esc(w)}</span></span>`).join(" ");
  });
}
addEventListener("scroll", () => {
  const h = document.documentElement, max = h.scrollHeight - h.clientHeight;
  const bar = $("#scrollbar"); if (bar) bar.style.width = (max > 0 ? scrollY / max * 100 : 0) + "%";
  $$(".hero-visual .hv-main, .exam-card img").forEach(el => {
    const r = el.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
    el.style.translate = `0 ${((r.top + r.height / 2) - innerHeight / 2) * -0.06}px`;
  });
}, { passive: true });

/* ---------------- Animations : apparition au scroll, compteurs, ripple ---------------- */
let revealObs = null;
function initReveal() {
  revealObs && revealObs.disconnect();
  revealObs = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    if (e.target.dataset.count !== undefined) countUp(e.target);
    $$("[data-count]", e.target).forEach(countUp);
    revealObs.unobserve(e.target);
  }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal, [data-count]", app).forEach(el => revealObs.observe(el));
}
function countUp(el) {
  if (el.dataset.counted) return; el.dataset.counted = 1;
  const end = parseFloat(el.dataset.count), dec = (el.dataset.count.split(".")[1] || "").length, suf = el.dataset.suffix || "";
  const t0 = performance.now(), dur = 1400;
  (function f(t) { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); el.textContent = (end * e).toFixed(dec) + suf; if (k < 1) requestAnimationFrame(f); })(t0);
}
document.addEventListener("pointerdown", e => {
  const b = e.target.closest(".btn"); if (!b) return;
  const r = b.getBoundingClientRect(), s = Math.max(r.width, r.height), sp = document.createElement("span");
  sp.className = "ripple"; sp.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
  b.appendChild(sp); setTimeout(() => sp.remove(), 650);
});
addEventListener("scroll", () => $("#topbar")?.classList.toggle("scrolled", scrollY > 10), { passive: true });

/* ---------------- Composants de quiz ---------------- */
function optionButtons(q) {
  return q.order.map((oi, k) => `<button class="option" data-oi="${oi}"><span class="key">${LETTERS[k]}</span><span>${esc(q.o[oi])}</span></button>`).join("");
}

// Quiz question par question avec correction immédiate
function stepQuiz(el, questions, onDone) {
  const qs = questions.map(prep); let i = 0, correct = 0;
  function show() {
    const q = qs[i];
    el.innerHTML = `<div class="card fade-in">
      <div class="test-head"><span class="tag">Question ${i + 1} / ${qs.length}</span><span class="muted small">✅ ${correct} correct</span></div>
      <div class="progress"><div style="width:${i / qs.length * 100}%"></div></div>
      <div class="question">${esc(q.q)}</div>
      <div class="options">${optionButtons(q)}</div>
      <div class="fb"></div>
      <p class="muted small" style="margin:14px 0 0">Tip: press <kbd>1</kbd>–<kbd>4</kbd> to answer and <kbd>Enter</kbd> to continue.</p>
    </div>`;
    $$(".option", el).forEach(b => b.onclick = () => answer(+b.dataset.oi));
  }
  function answer(oi) {
    const q = qs[i]; const ok = oi === q.a; if (ok) correct++;
    $$(".option", el).forEach(b => { b.disabled = true; const v = +b.dataset.oi; if (v === q.a) b.classList.add("correct"); else if (v === oi) b.classList.add("wrong"); });
    $(".fb", el).innerHTML = `<div class="explain ${ok ? "good" : "bad"}"><b>${ok ? "✅ Correct!" : "❌ Not quite."}</b> ${q.e ? esc(q.e) : ""}</div>
      <div class="row" style="margin-top:14px"><div class="spacer"></div><button class="btn btn-primary next">${i < qs.length - 1 ? "Next question →" : "See my score"}</button></div>`;
    $(".next", el).onclick = () => { i++; i < qs.length ? show() : onDone(Math.round(correct / qs.length * 100), correct, qs.length); };
  }
  show();
}

// Toutes les questions affichées, validation à la fin (Reading / Listening)
function formQuiz(el, questions, onSubmit) {
  const qs = questions.map(prep); const sel = {};
  el.innerHTML = qs.map((q, qi) => `<div class="qgroup card" style="margin-bottom:12px" data-qi="${qi}">
      <div style="font-weight:600;margin-bottom:10px">${qi + 1}. ${esc(q.q)}</div>
      <div class="options">${optionButtons(q)}</div></div>`).join("")
    + `<div class="row"><span class="muted small cnt">0 / ${qs.length} answered</span><div class="spacer"></div><button class="btn btn-primary submit" disabled>Check my answers</button></div>`;
  $$(".qgroup", el).forEach(g => {
    const qi = +g.dataset.qi;
    $$(".option", g).forEach(b => b.onclick = () => {
      sel[qi] = +b.dataset.oi;
      $$(".option", g).forEach(x => x.classList.toggle("selected", x === b));
      const n = Object.keys(sel).length;
      $(".cnt", el).textContent = `${n} / ${qs.length} answered`;
      $(".submit", el).disabled = n < qs.length;
    });
  });
  $(".submit", el).onclick = () => {
    let c = 0;
    $$(".qgroup", el).forEach(g => {
      const qi = +g.dataset.qi, q = qs[qi]; if (sel[qi] === q.a) c++;
      $$(".option", g).forEach(b => { b.disabled = true; b.classList.remove("selected"); const v = +b.dataset.oi;
        if (v === q.a) b.classList.add("correct"); else if (v === sel[qi]) b.classList.add("wrong"); });
    });
    $(".submit", el).closest(".row").remove();
    onSubmit(Math.round(c / qs.length * 100), c, qs.length);
  };
}

/* ---------------- Graphique (Writing Task 1) ---------------- */
function chartSVG(ch) {
  const W = 600, H = 320, L = 44, R = 12, T = 20, B = 70;
  const single = ch.years.length === 1;
  const palette = ["#6366f1", "#f59e0b", "#ec4899", "#10b981", "#06b6d4"];
  const colors = ["#fbbf24", "#6366f1", "#ec4899"];
  const max = ch.max || 100, unit = ch.unit || "";
  const gw = (W - L - R) / ch.series.length, bw = Math.min(single ? 60 : 30, (gw - 20) / ch.years.length);
  const y = v => T + (H - T - B) * (1 - v / max);
  let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Bar chart">`;
  for (let k = 0; k <= 5; k++) { const v = Math.round(max * k / 5 * 10) / 10; s += `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" stroke="var(--line)"/><text x="${L - 8}" y="${y(v) + 4}" text-anchor="end" font-size="11" fill="var(--muted)">${v}${unit}</text>`; }
  ch.series.forEach((se, gi) => {
    const gx = L + gi * gw + (gw - bw * ch.years.length) / 2;
    se.values.forEach((v, yi) => {
      const x = gx + yi * bw;
      s += `<rect class="chart-bar" style="animation-delay:${(gi * 3 + yi) * 50}ms" x="${x}" y="${y(v)}" width="${bw - 4}" height="${y(0) - y(v)}" rx="6" fill="${single ? palette[gi % 5] : colors[yi]}"><title>${se.name} ${ch.years[yi]} : ${v}${unit}</title></rect>
            <text x="${x + (bw - 4) / 2}" y="${y(v) - 5}" text-anchor="middle" font-size="10" fill="var(--muted)">${v}</text>`;
    });
    s += `<text x="${L + gi * gw + gw / 2}" y="${H - B + 20}" text-anchor="middle" font-size="13" font-weight="600" fill="var(--text)">${se.name}</text>`;
  });
  const lx = W / 2 - ch.years.length * 40;
  if (!single) ch.years.forEach((yr, i) => { s += `<rect x="${lx + i * 80}" y="${H - 26}" width="14" height="14" rx="3" fill="${colors[i]}"/><text x="${lx + i * 80 + 20}" y="${H - 15}" font-size="12" fill="var(--text)">${yr}</text>`; });
  return s + "</svg>";
}

/* ---------------- Analyse Writing ---------------- */
const countWords = t => t.split(/\s+/).filter(w => /[a-z0-9]/i.test(w)).length; // comme à l'IELTS : les nombres comptent

function analyzeWriting(text, min, target = 7) {
  const lower = text.toLowerCase();
  const words = lower.match(/[a-z]+(?:'[a-z]+)?/g) || [];
  const wc = countWords(text);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().split(/\s+/).length >= 3);
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 20).length;
  const avgSent = sentences.length ? wc / sentences.length : 0;
  const unique = new Set(words).size;
  const ttr = words.length ? unique / Math.sqrt(words.length * 2) : 0; // diversité lexicale corrigée (Guiraud)
  const longWords = words.filter(w => w.length >= 8).length;
  const has = w => new RegExp(`\\b${w.replace(/ /g, "\\s+")}\\b`).test(lower);
  const linkers = LINKERS.filter(has);
  const informal = INFORMAL.filter(has);
  const contractions = (lower.match(/\b\w+(n't|'re|'ll|'ve|'m|'d)\b/g) || []);
  const allVocab = LEVELS.slice(1).flatMap(l => l.vocab.flatMap(set => set.words).map(v => ({ w: v.w, lvl: l.id }))); // vocabulaire académique (B1+)
  const academic = allVocab.filter(v => lower.includes(v.w.slice(0, Math.max(5, v.w.length - 2))));
  const complex = [
    /\b(which|who|whose|whom)\b/g, /\b(is|are|was|were|been|be|being)\s+\w+ed\b/g, /\bif\b/g,
    /\b(although|whereas|while|despite|unless)\b/g, /\b(never|rarely|seldom|not only|only when|only after)\b\s+(do|does|did|have|has|had|is|are|was|were|can|could|should|would)\b/g
  ].reduce((n, r) => n + (lower.match(r) || []).length, 0);
  const clamp = x => Math.max(0, Math.min(1, x));
  const crit = {
    task: clamp(wc / min),
    coherence: (clamp(paragraphs / 4) + clamp(linkers.length / 8)) / 2,
    lexical: clamp((clamp((ttr - 4.5) / 3.5) + clamp((longWords / Math.max(1, words.length) - 0.06) / 0.16) + clamp(academic.length / 6)) / 3 - informal.length * 0.04 - contractions.length * 0.03),
    grammar: 0.65 * clamp(complex / Math.max(4, sentences.length * 0.7)) + 0.35 * (avgSent >= 12 && avgSent <= 26 ? 1 : avgSent >= 8 ? 0.6 : 0.3)
  };
  const raw = 3.5 + crit.task * 0.75 + crit.coherence * 1 + crit.lexical * 1.75 + crit.grammar * 1.5; // max 8.5
  const band = wc < 40 ? 3.5 : Math.round(raw * 2) / 2;
  const pctOut = Math.max(0, Math.min(100, Math.round((band - 3.5) / (target + 0.5 - 3.5) * 100))); // relatif à l'objectif du niveau
  const fb = [];
  fb.push(wc >= min ? ["✅", `Length OK: ${wc} words (min. ${min}).`] : ["⚠️", `Too short: ${wc} of ${min} words. Short answers lose marks for Task Achievement.`]);
  fb.push(paragraphs >= 4 ? ["✅", `${paragraphs} paragraphs: clear structure.`] : ["⚠️", `Only ${paragraphs} paragraph(s). Aim for an introduction, 2 body paragraphs and a conclusion (leave a blank line between them).`]);
  fb.push(linkers.length >= 6 ? ["✅", `Good range of linking words (${linkers.length}).`] : ["⚠️", `Few linking words (${linkers.length}). Try: however, moreover, as a result, whereas…`]);
  fb.push(avgSent > 28 ? ["⚠️", `Very long sentences (${avgSent.toFixed(0)} words on average): higher risk of errors. Split some of them.`] : avgSent < 10 ? ["⚠️", `Short sentences (${avgSent.toFixed(0)} words on average). Combine them with which, although, while…`] : ["✅", `Balanced sentence length (${avgSent.toFixed(0)} words on average).`]);
  fb.push(complex >= 5 ? ["✅", `Good range of complex structures (${complex} found: relative clauses, passives, conditionals…).`] : ["⚠️", `Few complex structures (${complex}). Add relative clauses, passives and conditionals.`]);
  fb.push(academic.length >= 4 ? ["✅", `Course vocabulary used: ${academic.length} word(s).`] : ["💡", `Reuse the vocabulary you have studied (${academic.length} word(s) found).`]);
  if (informal.length) fb.push(["⚠️", `Informal or vague words: ${informal.join(", ")}. Replace them with precise terms.`]);
  if (contractions.length) fb.push(["⚠️", `Avoid contractions in academic writing: ${[...new Set(contractions)].join(", ")}.`]);
  return { wc, paragraphs, sentences: sentences.length, avgSent, linkers, informal, academic, complex, crit, band, pct: pctOut, fb, ttr };
}

/* ---------------- Enregistreur (Speaking) ---------------- */
function recorder(el, { maxSec = 0, label = "🎙️ Start speaking", onResult } = {}) {
  el.innerHTML = `<div class="row"><button class="btn btn-primary rec">${label}</button><span class="status muted small"></span><div class="spacer"></div><span class="timer t">0:00${maxSec ? " / " + fmt(maxSec) : ""}</span></div>
    <div class="transcript" style="margin-top:12px"><span class="muted">Your answer will be transcribed here…</span></div><div class="res"></div>`;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const btn = $(".rec", el), status = $(".status", el), tr = $(".transcript", el), t = $(".t", el), res = $(".res", el);
  let rec = null, media = null, stream = null, chunks = [], running = false, startT = 0, finalText = "", iv = null;

  async function start() {
    running = true; finalText = ""; startT = Date.now(); res.innerHTML = "";
    btn.textContent = "⏹ Stop"; status.innerHTML = '<span class="rec-dot"></span> Recording…';
    tr.innerHTML = '<span class="muted">Speak in English…</span>';
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      media = new MediaRecorder(stream); chunks = [];
      media.ondataavailable = e => chunks.push(e.data); media.start();
    } catch { media = null; }
    if (SR) {
      rec = new SR(); rec.lang = "en-GB"; rec.continuous = true; rec.interimResults = true;
      rec.onresult = e => {
        let interim = "";
        for (let i = e.resultIndex; i < e.results.length; i++) { const r = e.results[i]; if (r.isFinal) finalText += r[0].transcript + " "; else interim += r[0].transcript; }
        tr.innerHTML = esc(finalText) + `<span class="muted">${esc(interim)}</span>`;
      };
      rec.onend = () => { if (running) try { rec.start(); } catch { } };
      rec.onerror = e => { if (e.error === "not-allowed") status.textContent = "Microphone blocked — allow it in your browser."; };
      try { rec.start(); } catch { }
    } else {
      tr.innerHTML = '<span class="muted">Automatic transcription is not available here (use Chrome or Edge). Your voice is still recorded so you can listen back.</span>';
    }
    iv = setInterval(() => { const s = (Date.now() - startT) / 1000; t.textContent = fmt(s) + (maxSec ? " / " + fmt(maxSec) : ""); t.classList.toggle("low", maxSec && maxSec - s < 15); if (maxSec && s >= maxSec) stop(); }, 250);
  }
  function stop() {
    if (!running) return;
    running = false; clearInterval(iv); btn.textContent = "↻ Try again"; status.textContent = "Analysing…";
    try { rec && rec.stop(); } catch { }
    const dur = (Date.now() - startT) / 1000;
    const finish = url => setTimeout(() => showRes(url, dur), 700);
    if (media && media.state !== "inactive") {
      media.onstop = () => { stream.getTracks().forEach(x => x.stop()); finish(URL.createObjectURL(new Blob(chunks, { type: media.mimeType }))); };
      media.stop();
    } else finish(null);
  }
  function showRes(url, dur) {
    status.textContent = "";
    const text = finalText.trim(); const words = text.toLowerCase().match(/[a-z']+/g) || [];
    const wpm = dur > 5 ? Math.round(words.length / (dur / 60)) : 0;
    const lower = " " + text.toLowerCase() + " ";
    const fillers = FILLERS.reduce((n, f) => n + (lower.match(new RegExp(`\\b${f}\\b`, "g")) || []).length, 0);
    const unique = new Set(words).size;
    const linkers = LINKERS.filter(l => new RegExp(`\\b${l}\\b`).test(lower));
    let pct;
    if (words.length) {
      const fluency = Math.min(1, wpm / 120), fill = 1 - Math.min(1, fillers / Math.max(1, words.length) * 12), lex = Math.min(1, unique / Math.max(1, words.length) / 0.6), len = maxSec ? Math.min(1, dur / (maxSec * 0.75)) : 1;
      pct = Math.round((fluency + fill + lex + len) / 4 * 100);
    } else pct = dur >= 60 ? 70 : Math.round(dur / 60 * 70);
    res.innerHTML = `<div class="grid grid-4" style="margin-top:14px">
        <div class="metric"><div class="muted small">Duration</div><div class="v">${fmt(dur)}</div></div>
        <div class="metric"><div class="muted small">Words</div><div class="v">${words.length || "—"}</div></div>
        <div class="metric"><div class="muted small">Speed</div><div class="v">${wpm ? wpm + " <span class='small muted'>wpm</span>" : "—"}</div></div>
        <div class="metric"><div class="muted small">Fillers</div><div class="v">${words.length ? fillers : "—"}</div></div>
      </div>
      ${url ? `<div style="margin-top:12px"><div class="muted small">🔁 Listen back:</div><audio controls src="${url}" style="width:100%;margin-top:6px"></audio></div>` : ""}
      <ul class="feedback-list" style="margin-top:12px">
        ${words.length ? `<li>${wpm >= 100 && wpm <= 170 ? "✅" : "⚠️"} Speed ${wpm} words/min — ideally between 110 and 160.</li>
        <li>${fillers <= 3 ? "✅" : "⚠️"} ${fillers} filler(s) (um, like, you know…). ${fillers > 3 ? "Replace them with a short pause." : ""}</li>
        <li>${linkers.length >= 2 ? "✅" : "💡"} Linking words used: ${linkers.length ? linkers.join(", ") : "none"}.</li>` : `<li>💡 No transcript: assess yourself by listening back. Did you speak without long pauses? Did you develop each point?</li>`}
        ${maxSec && dur < maxSec * 0.75 ? `<li>⚠️ You spoke for ${fmt(dur)}. In Part 2, try to keep going for 2 minutes.</li>` : ""}
      </ul>`;
    onResult && onResult({ pct, dur, words: words.length });
  }
  btn.onclick = () => running ? stop() : start();
  onLeave(() => {
    running = false; clearInterval(iv);
    try { rec && rec.abort(); } catch { }
    try { if (media && media.state !== "inactive") media.stop(); stream && stream.getTracks().forEach(x => x.stop()); } catch { }
  });
}

/* =========================================================
   VUES
   ========================================================= */

/* ---------- Expertise IELTS : format, barème, critères ---------- */
const EXAM_FORMAT = [
  ["listening", "#ec4899", "Listening", "30 min (+10 min transfer time on paper, 2 min on computer)", "40 questions · 4 parts", "Conversations and monologues from everyday and academic life. You hear each recording once."],
  ["reading", "#10b981", "Reading", "60 min", "40 questions · 3 passages", "Academic texts (journals, books, newspapers) of increasing difficulty, about 2,700 words in total."],
  ["writing", "#f97316", "Writing", "60 min", "2 tasks", "Task 1: describe a graph or a process (150 words, ~20 min). Task 2: an argumentative essay (250 words, ~40 min). Task 2 counts double."],
  ["speaking", "#06b6d4", "Speaking", "11–14 min", "3 parts", "A face-to-face interview with an examiner: personal questions, a 2-minute talk, then a discussion."]
];
const LR_TABLE = { // barème indicatif (Academic) — score brut sur 40 → band
  listening: [[39, 9], [37, 8.5], [35, 8], [32, 7.5], [30, 7], [26, 6.5], [23, 6], [18, 5.5], [16, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5], [0, 0]],
  reading: [[39, 9], [37, 8.5], [35, 8], [33, 7.5], [30, 7], [27, 6.5], [23, 6], [19, 5.5], [15, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5], [0, 0]]
};
const rawToBand = (skill, raw) => LR_TABLE[skill].find(([min]) => raw >= min)[1];
const overallBand = arr => { const avg = arr.reduce((a, b) => a + b, 0) / arr.length; const f = avg - Math.floor(avg); return Math.floor(avg) + (f < .25 ? 0 : f < .75 ? .5 : 1); };
const CRITERIA = {
  writing: [
    ["Task Achievement / Response", "Answer every part of the question, with a clear position (Task 2) or an overview of the main trends (Task 1)."],
    ["Coherence & Cohesion", "Logical paragraphs, one central idea per paragraph, and a range of linking words used appropriately."],
    ["Lexical Resource", "Precise, varied vocabulary, natural collocations and few errors in spelling or word formation."],
    ["Grammatical Range & Accuracy", "A mix of simple and complex sentences, with most sentences free of errors."]
  ],
  speaking: [
    ["Fluency & Coherence", "Speak at length without noticeable effort, with little hesitation and well-connected ideas."],
    ["Lexical Resource", "Discuss a range of topics with flexible vocabulary, including idiomatic language and paraphrasing."],
    ["Grammatical Range & Accuracy", "Use complex structures with ease and make few errors."],
    ["Pronunciation", "Be understood without effort: sounds, word stress, intonation. Your accent itself is not penalised."]
  ]
};
const BANDS = [
  [9, "Expert user", "Full command of the language: accurate, fluent and fully understood."],
  [8, "Very good user", "Fully operational command with only occasional inaccuracies, mostly in unfamiliar situations."],
  [7, "Good user", "Operational command with some errors; handles detailed reasoning well."],
  [6, "Competent user", "Generally effective command despite errors; comfortable in familiar situations."],
  [5, "Modest user", "Partial command; copes with overall meaning but makes many mistakes."],
  [4, "Limited user", "Basic competence limited to familiar situations; frequent problems in understanding."]
];

function calculatorHTML() {
  return `<div class="calc card" id="calc">
    <div class="calc-grid">
      <label class="calc-field" style="--mc:#ec4899"><span>Listening <small>correct answers / 40</small></span><input type="range" min="0" max="40" value="30" data-k="listening"><b data-o="listening"></b></label>
      <label class="calc-field" style="--mc:#10b981"><span>Reading <small>correct answers / 40</small></span><input type="range" min="0" max="40" value="28" data-k="reading"><b data-o="reading"></b></label>
      <label class="calc-field" style="--mc:#f97316"><span>Writing <small>estimated band</small></span><input type="range" min="4" max="9" step="0.5" value="6" data-k="writing"><b data-o="writing"></b></label>
      <label class="calc-field" style="--mc:#06b6d4"><span>Speaking <small>estimated band</small></span><input type="range" min="4" max="9" step="0.5" value="6.5" data-k="speaking"><b data-o="speaking"></b></label>
    </div>
    <div class="calc-result"><div><div class="small">Overall band score</div><div class="calc-band" id="calcOut" data-x="">—</div></div><div class="calc-explain small" id="calcExp"></div></div>
    <p class="muted small" style="margin:12px 0 0">Listening/Reading conversion is approximate (Academic) and varies slightly between test versions. The overall score is the average of the 4 sections, rounded to the nearest half band (x.25 → x.5 and x.75 → x+1).</p>
  </div>`;
}
function bindCalculator(root = document) {
  const calc = $("#calc", root); if (!calc) return;
  const upd = () => {
    const v = {}; $$("input[type=range]", calc).forEach(i => v[i.dataset.k] = +i.value);
    const b = { listening: rawToBand("listening", v.listening), reading: rawToBand("reading", v.reading), writing: v.writing, speaking: v.speaking };
    $("[data-o=listening]", calc).textContent = `${v.listening}/40 → ${b.listening.toFixed(1)}`;
    $("[data-o=reading]", calc).textContent = `${v.reading}/40 → ${b.reading.toFixed(1)}`;
    $("[data-o=writing]", calc).textContent = b.writing.toFixed(1);
    $("[data-o=speaking]", calc).textContent = b.speaking.toFixed(1);
    const avg = (b.listening + b.reading + b.writing + b.speaking) / 4, ov = overallBand(Object.values(b));
    const co = $("#calcOut"); if (co.textContent !== ov.toFixed(1)) { co.textContent = ov.toFixed(1); co.classList.remove("bump"); void co.offsetWidth; co.classList.add("bump"); }
    $("#calcExp").innerHTML = `(${b.listening} + ${b.reading} + ${b.writing} + ${b.speaking}) ÷ 4 = <b>${avg.toFixed(3)}</b> → rounded to <b>${ov.toFixed(1)}</b><br>Level: <b>${BANDS.find(x => ov >= x[0])?.[1] || "Limited user"}</b>`;
  };
  $$("input[type=range]", calc).forEach(i => i.addEventListener("input", upd)); upd();
}
function examSectionsHTML() {
  const durs = { listening: ["30", "min"], reading: ["60", "min"], writing: ["60", "min"], speaking: ["11–14", "min"] };
  const ladderRows = [9, 8.5, 8, 7.5, 7, 6.5, 6, 5.5, 5, 4.5, 4].map((b, k) => {
    const r = s => { const t = LR_TABLE[s], i = t.findIndex(x => x[1] === b); return i <= 0 ? `${t[i][0]}–40` : `${t[i][0]}–${t[i - 1][0] - 1}`; };
    return `<div class="rung"><span class="b">${b.toFixed(1)}</span><div class="track"><div class="fill" style="--w:${30 + (b - 4) / 5 * 70}%;--dd:${k * .07}s">Listening ${r("listening")} · Reading ${r("reading")}</div></div></div>`;
  }).join("");
  return `
    <section class="sec" id="format">
      <div class="wrap">
        <div class="sec-head reveal"><span class="eyebrow">The exam</span><h2>The four sections of IELTS Academic</h2><p>About 2 hours 45 minutes in total. Listening, Reading and Writing are taken on the same day with no break; Speaking can be up to 7 days before or after. Hover over a section to see the details.</p></div>
        <div class="exam-cards">
          ${EXAM_FORMAT.map(([k, c, n, d, q, t], i) => `<article class="exam-card reveal" style="--d:${i * .12}s">
            <img src="${photo(k, 700)}" alt="" loading="lazy">
            <div><div class="dur">${durs[k][0]}<small>${durs[k][1]}</small></div><h3>${n}</h3><div class="q">${q}</div><div class="more">${t}</div></div>
          </article>`).join("")}
        </div>
      </div>
    </section>

    <section class="sec sec-dark" id="score">
      <div class="wrap">
        <div class="grid grid-2" style="align-items:start;gap:60px">
          <div class="reveal">
            <span class="eyebrow">The score</span><h2 class="h2-sec">From correct answers to a band score</h2>
            <p class="muted">Each section is scored from 0 to 9 in half bands. In Listening and Reading, your correct answers out of 40 are converted using this scale. In Writing and Speaking, the examiner scores four equally weighted criteria.</p>
            <div class="ladder">${ladderRows}</div>
          </div>
          <div class="reveal" style="--d:.15s">
            <span class="eyebrow">Simulator</span><h2 class="h2-sec">Calculate your overall score</h2>
            <p class="muted">Move the sliders: the overall score is the average of the four sections, rounded to the nearest half band.</p>
            ${calculatorHTML()}
          </div>
        </div>
      </div>
    </section>

    <section class="sec" id="criteres">
      <div class="wrap">
        <div class="sec-head reveal"><span class="eyebrow">The criteria</span><h2>What examiners look for</h2><p>Writing and Speaking are marked on four public criteria, each worth 25%. Every exercise on this site is built around them.</p></div>
        <div class="crit-wrap">
          ${["writing", "speaking"].map((k, j) => `<div class="crit-col reveal" style="--d:${j * .15}s"><h3>${k === "writing" ? "Writing" : "Speaking"}</h3>
            ${CRITERIA[k].map(([n, d], i) => `<button class="crit" data-crit="${k}:${i}"><span class="crit-n">0${i + 1}</span><div><b>${n}</b><p>${d}</p></div><span class="crit-go">Explore ${ic("arrow", "sm")}</span></button>`).join("")}
          </div>`).join("")}
        </div>
      </div>
    </section>

    <section class="sec sec-grey" id="bands">
      <div class="wrap">
        <div class="sec-head reveal"><span class="eyebrow">The scale</span><h2>What does each band mean?</h2><p>Most universities in the UK, Australia and Canada ask for 6.0 to 7.0, often with a minimum in each section. Always check the exact requirement for your programme.</p></div>
        <div class="band-scroller reveal">
          ${BANDS.map(([b, n, d]) => `<div class="band-card"><div class="num">${b}</div><b>${n}</b><p>${d}</p></div>`).join("")}
        </div>
      </div>
    </section>`;
}

function viewHome() {
  const has = !!S.level;
  const exercises = LEVELS.reduce((n, l) => n + allItemsCount(l), 0);
  const words = LEVELS.reduce((n, l) => n + l.vocab.reduce((a, s) => a + s.words.length, 0), 0);
  const features = [
    ["reading", "#10b981", "open", "Reading", "Reading", "12 exam-style passages with the most common question types: multiple choice, True / False / Not Given and detailed comprehension. The timer follows the real pace (about 20 minutes per passage).", ["Every question corrected", "Built-in highlighter", "Suggested time per passage"], ["Reading 30/40", "≈ band 7.0"]],
    ["listening", "#ec4899", "headphones", "Listening", "Listening", "12 recordings in British English: announcements, conversations and lectures. You practise the classic traps, such as speakers correcting themselves and distractors.", ["Adjustable speed", "Limited number of plays", "Transcript after marking"], ["Listening 32/40", "≈ band 7.5"]],
    ["writing", "#f97316", "pen", "Writing", "Writing", "12 Task 1 (graphs) and Task 2 (essays) questions to write under time pressure. Each answer is analysed against the four official criteria and compared with a model answer.", ["Word counter and timer", "Analysis on the 4 criteria", "A model answer for every task"], ["Task 2", "4 criteria scored"]],
    ["speaking", "#06b6d4", "mic", "Speaking", "Speaking", "12 Part 2 cue cards and more than 50 Part 1 and 3 questions. One minute to prepare, two minutes to speak, then your transcript, speaking speed and a recording of your voice.", ["Live transcription", "Speed and fillers measured", "Play back your recording"], ["Part 2", "1 min + 2 min"]]
  ];
  const faq = [
    ["Academic or General Training: which one should I prepare?", "Academic is required for university study and some professional registrations. General Training is mainly for migration and work. Listening and Speaking are the same; Reading and Writing are different. This site prepares you for Academic."],
    ["Is the placement test score official?", "No. It is an estimate based on 21 questions weighted by difficulty. It helps choose your course; it does not replace the real exam."],
    ["How long does it take to improve by half a band?", "It depends on your starting level and how much you study. The higher you go, the longer it takes: moving from 6.5 to 7 usually needs more work than from 5 to 5.5. Regular daily practice works better than long, occasional sessions."],
    ["Which section loses candidates the most marks?", "For most candidates it is Writing: no overview in Task 1, an unclear position in Task 2, and repeated errors (articles, plurals, prepositions). The Toolkit explains them in detail."],
    ["Does Speaking practice work in every browser?", "Voice recording works everywhere. Automatic transcription works in Chrome and Edge."],
    ["Do I need an account?", "No. Your progress is saved in your browser. Always use the same browser to find it again."]
  ];
  app.innerHTML = `
  <div class="wrap">
    <section class="hero2">
      <div class="stagger">
        <span class="eyebrow">IELTS Academic preparation</span>
        <h1 class="display">Prepare for IELTS the way examiners mark it.</h1>
        <p class="lead">A 15-minute placement test, then ${exercises} corrected exercises aligned with the official marking criteria, from band 4 to band 8.</p>
        <div class="row" style="margin-top:30px">
          ${has ? `<a class="btn btn-primary btn-lg" href="#/dashboard">Continue my course ${ic("arrow", "arrow")}</a><a class="btn btn-ghost btn-lg" href="#/test">Retake the test</a>`
                : `<a class="btn btn-primary btn-lg" href="#/test">Take the placement test ${ic("arrow", "arrow")}</a><button class="btn btn-ghost btn-lg" data-scroll="format">Understand the exam</button>`}
        </div>
        <div class="hero-facts">
          <div><b>21</b><span>questions to find your level</span></div>
          <div><b>${exercises}</b><span>corrected exercises</span></div>
          <div><b>4</b><span>official criteria analysed</span></div>
        </div>
      </div>
      <div class="hero-visual">
        <div class="hv-shape"></div>
        <img class="hv-main" src="${photo("hero", 900)}" alt="Big Ben and a red London bus">
        <img class="hv-small hv-a" src="${photo("smileA", 400)}" alt="">
        <img class="hv-small hv-b" src="${photo("smileB", 400)}" alt="">
        <div class="float-card fc1"><span class="ic-box" style="--mc:#ec4899;width:40px;height:40px">${ic("headphones", "sm")}</span><div><span class="muted small">Listening 32/40</span><b>Band 7.5</b></div></div>
        <div class="float-card fc2"><span class="ic-box" style="--mc:#f97316;width:40px;height:40px">${ic("pen", "sm")}</span><div><span class="muted small">Writing Task 2</span><b>268 words</b></div></div>
        <div class="float-card fc3"><span class="ic-box" style="--mc:#10b981;width:40px;height:40px">${ic("target", "sm")}</span><div><span class="muted small">Score global</span><b>7.0</b></div></div>
      </div>
    </section>

    <section class="stats-band reveal">
      <div style="--mc:#6366f1"><div class="n" data-count="16">0</div><div class="l">grammar lessons</div></div>
      <div style="--mc:#f59e0b"><div class="n" data-count="${words}">0</div><div class="l">academic words</div></div>
      <div style="--mc:#10b981"><div class="n" data-count="24">0</div><div class="l">passages and recordings</div></div>
      <div style="--mc:#ec4899"><div class="n" data-count="24">0</div><div class="l">writing and speaking tasks</div></div>
    </section>


    <section class="bridge reveal">
      <div class="bridge-side"><div class="big-flag wave">${flagDZ()}</div><b>Algeria</b><span>Where you start</span></div>
      <div class="bridge-mid">
        <svg viewBox="0 0 400 140" class="bridge-svg" aria-hidden="true">
          <path id="flightPath" d="M20 120 Q200 -40 380 120" fill="none" stroke="var(--line-2)" stroke-width="3" stroke-dasharray="8 10"/>
          <path d="M20 120 Q200 -40 380 120" fill="none" stroke="var(--red)" stroke-width="3" class="flight-line"/>
          <circle r="9" fill="var(--red)"><animateMotion dur="3.5s" repeatCount="indefinite" rotate="auto"><mpath href="#flightPath"/></animateMotion></circle>
        </svg>
        <h2>From Algeria to the United Kingdom</h2>
        <p>Built for Algerian students aiming for British universities: an English-only course, real exam formats and British English audio.</p>
      </div>
      <div class="bridge-side"><div class="big-flag wave">${flagUK()}</div><b>United Kingdom</b><span>Where IELTS can take you</span></div>
    </section>
  </div>
    ${examSectionsHTML()}
  <div class="wrap">

    <section class="sec" id="modules" style="padding-top:0">
      <div class="sec-head reveal"><span class="eyebrow">Practice</span><h2>Every section, with real question formats</h2><p>On top of grammar (16 lessons) and vocabulary (${words} words in flashcards), every level covers all four sections.</p></div>
      ${features.map(([img, color, icon, tag, title, text, list, badge], fi) => `
        <div class="feature-row" style="--mc:${color}">
          <div class="fr-media reveal from-left">
            <div class="fr-blob"></div>
            <img src="${photo(img, 1000)}" alt="${tag}" loading="lazy">
            <div class="float-card badge-float"><span class="ic-box" style="width:40px;height:40px">${ic(icon, "sm")}</span><div><b>${badge[0]}</b><span class="muted small">${badge[1]}</span></div></div>
          </div>
          <div class="fr-text reveal from-right">
            <span class="mc-ic">${ic(icon, "lg")}</span>
            <h3 data-n="0${fi + 1} — ${tag.toUpperCase()}">${title}</h3><p>${text}</p>
            <ul class="checks">${list.map(x => `<li><button class="check-btn" data-demo="${img}" title="See it in action">${x}<span class="ck-arrow">${ic("arrow", "sm")}</span></button></li>`).join("")}</ul>
            <div class="row fr-actions">
              <button class="btn btn-primary" data-start="${img}">Start ${tag} practice ${ic("arrow", "arrow")}</button>
              <button class="btn btn-ghost" data-demo="${img}">${ic("play", "sm")} Try a sample</button>
            </div>
          </div>
        </div>`).join("")}
    </section>

    <section class="sec" id="levels" style="padding-top:0">
      <div class="sec-head reveal"><span class="eyebrow">The courses</span><h2>Four levels, from band 4 to band 8</h2><p>The test places you automatically. Each course contains ${allItemsCount(LEVELS[0])} exercises; you move up once every exercise reaches 70%.</p></div>
      <div class="level-cards">
        ${LEVELS.map((l, i) => `<div class="level-card reveal" style="--c:${l.solid};--d:${i * .1}s;background:${l.solid}">
          <div class="lv">${l.id}</div>
          <span class="band">Band ${l.band}</span>
          <h3>${l.name}</h3><p>${l.goal}</p>
          <div class="lc-count">Target: band ${l.target.toFixed(1)}</div></div>`).join("")}
      </div>
    </section>

    <section class="books-teaser reveal">
      <div><span class="eyebrow">Revise with books</span><h2>Collins English for IELTS</h2><p>Which Collins book to choose for your band, what each one covers, and how to combine it with the exercises on this site.</p>
        <a class="btn btn-primary" href="#/books">See the Collins books ${ic("arrow", "arrow")}</a></div>
      <div class="bt-stack">${BOOKS.filter((b, i) => [0, 4, 6, 10].includes(i)).map((b, i) => `<div class="mini-cover" style="--bc:${b.color};--i:${i}"><span>${esc(b.series)}</span><b>${esc(b.title)}</b></div>`).join("")}</div>
    </section>

    <section class="sec" id="faq" style="padding-top:0">
      <div class="sec-head center reveal"><span class="eyebrow">FAQ</span><h2>What candidates ask us</h2></div>
      <div class="faq reveal">${faq.map(([q, a], i) => `<details ${i === 0 ? "open" : ""}><summary>${q}<span class="pm">${ic("plus", "sm")}</span></summary><div class="ans">${a}</div></details>`).join("")}</div>
    </section>

    <section class="cta-band reveal zoom">
      <img src="${photo("friends", 1600)}" alt="" loading="lazy">
      <div>
        <span class="eyebrow" style="color:#fff">Get started</span>
        <h2>Know your level before you revise.</h2>
        <p>21 questions, about 15 minutes, a detailed result for each skill and a course that fits you.</p>
        <div class="row" style="margin-top:24px">
          <a class="btn btn-white btn-lg" href="#/${has ? "dashboard" : "test"}">${has ? "My dashboard" : "Take the test"} ${ic("arrow", "arrow")}</a>
          <button class="btn btn-outline-white btn-lg" data-scroll="score">Calculate my score</button>
        </div>
      </div>
    </section>
  </div>`;
  $$(".faq details").forEach(d => d.addEventListener("toggle", () => { if (d.open) $$(".faq details").forEach(o => o !== d && (o.open = false)); }));
  bindCalculator(app); bindCriteria(app);
  $$("[data-demo]", app).forEach(b => b.onclick = () => openDemo(b.dataset.demo));
  $$("[data-start]", app).forEach(b => b.onclick = () => startModule(b.dataset.start));
}

/* ---------------- Fenêtre (modal) ---------------- */
function openModal(html, cls = "") {
  closeModal();
  const m = document.createElement("div");
  m.id = "modal"; m.className = "modal " + cls;
  m.innerHTML = `<div class="modal-backdrop" data-close></div><div class="modal-box" role="dialog" aria-modal="true"><button class="icon-btn modal-x" data-close aria-label="Close">${ic("plus", "sm")}</button>${html}</div>`;
  document.body.appendChild(m); document.body.style.overflow = "hidden";
  requestAnimationFrame(() => m.classList.add("open"));
  $$("[data-close]", m).forEach(x => x.onclick = closeModal);
  const esc = e => { if (e.key === "Escape") closeModal(); };
  document.addEventListener("keydown", esc); m._esc = esc;
  return m;
}
function closeModal() {
  const m = $("#modal"); if (!m) return;
  stopSpeak(); clearInterval(m._iv);
  document.removeEventListener("keydown", m._esc);
  m.remove(); document.body.style.overflow = "";
}

// Ouvrir un module : directement si un niveau est choisi, sinon choix du niveau
function startModule(key) {
  if (S.level) { location.hash = `#/${key}/${firstTodo(key)}`; return; }
  const m = openModal(`<div class="modal-head" style="--img:url('${photo(key, 900)}')"><span class="eyebrow">${modOf(key).name} practice</span><h2>Choose your level first</h2><p>Take the 15-minute placement test, or pick a level yourself if you already know it.</p></div>
    <div class="modal-body">
      <div class="lvl-pick">${LEVELS.map(l => `<button class="lvl-opt" data-lv="${l.id}"><b>${l.id}</b><span>${l.name}</span><small>Band ${l.band}</small></button>`).join("")}</div>
      <div class="row" style="margin-top:20px"><a class="btn btn-primary" href="#/test" data-close>Take the placement test ${ic("arrow", "arrow")}</a><button class="btn btn-ghost" data-demo-in="${key}">${ic("play", "sm")} Try a sample first</button></div>
    </div>`);
  $$("[data-lv]", m).forEach(b => b.onclick = () => { S.level = b.dataset.lv; save(); closeModal(); location.hash = `#/${key}/0`; });
  $$("a[data-close]", m).forEach(a => a.onclick = () => closeModal());
  $("[data-demo-in]", m).onclick = () => openDemo(key);
}

// Mini-exercices interactifs
function openDemo(key) {
  const L = lvl() || LEVELS[1];
  const head = (title, sub) => `<div class="modal-head" style="--img:url('${photo(key, 900)}')"><span class="eyebrow">Sample · ${modOf(key).name}</span><h2>${title}</h2><p>${sub}</p></div>`;
  const foot = `<div class="modal-foot"><span class="muted small">This is a short sample. The full module has ${itemsOf(key, L).length} ${modOf(key).unit}s per level.</span><button class="btn btn-primary" data-go-mod>Open the full ${modOf(key).name} module ${ic("arrow", "arrow")}</button></div>`;
  let body = "", m;
  if (key === "reading") {
    const R = L.reading[0];
    body = head(esc(R.title), "Read the extract, answer the question, and try the highlighter: select any words in the text.") +
      `<div class="modal-body demo-split"><div class="passage demo-passage" id="dPas">${paras(R.text.split(/\n\s*\n/).slice(0, 2).join("\n\n"))}</div><div id="dQ"></div></div>` + foot;
    m = openModal(body, "wide");
    const pas = $("#dPas", m);
    pas.addEventListener("mouseup", () => { const s = getSelection(); if (!s.rangeCount || s.isCollapsed) return; try { s.getRangeAt(0).surroundContents(document.createElement("mark")); } catch { } s.removeAllRanges(); });
    pas.addEventListener("click", e => { if (e.target.tagName === "MARK") e.target.replaceWith(...e.target.childNodes); });
    stepQuiz($("#dQ", m), [R.questions[0], R.questions[1]], (pct, c, n) => { $("#dQ", m).innerHTML = demoResult(pct, c, n); });
  }
  if (key === "listening") {
    const Li = L.listening[0]; const a = audioWidget(Li.script, 3, true);
    body = head(esc(Li.title), "Press play, listen carefully, then answer. Choose a slower speed if you need it.") +
      `<div class="modal-body">${a.html}<div id="dQ" style="margin-top:18px"></div><div id="dScript"></div></div>` + foot;
    m = openModal(body);
    a.bind();
    stepQuiz($("#dQ", m), [Li.questions[0], Li.questions[1]], (pct, c, n) => {
      $("#dQ", m).innerHTML = demoResult(pct, c, n);
      $("#dScript", m).innerHTML = `<h3 style="margin-top:18px">Transcript</h3><div class="passage" style="max-height:220px">${esc(Li.script)}</div>`;
    });
  }
  if (key === "writing") {
    const W = L.writing.find(w => w.chart) || L.writing[0];
    body = head(esc(W.type), "Start the timer and write a few sentences. The word counter updates as you type.") +
      `<div class="modal-body demo-split"><div><p class="demo-prompt">${esc(W.prompt)}</p>${W.chart ? chartSVG(W.chart) : ""}</div>
        <div><div class="row" style="margin-bottom:10px"><button class="btn btn-ghost btn-sm" id="dT">${ic("play", "sm")} Start 5-minute timer</button><span class="timer" id="dTime">5:00</span></div>
        <textarea id="dTxt" style="min-height:220px" placeholder="Write your introduction here…"></textarea>
        <div class="row" style="margin-top:10px"><span class="tag" id="dWc">0 words</span><span class="muted small" id="dTip">Tip: paraphrase the task in your first sentence.</span></div></div></div>` + foot;
    m = openModal(body, "wide");
    const ta = $("#dTxt", m);
    ta.oninput = () => { const n = countWords(ta.value); $("#dWc", m).textContent = `${n} word${n === 1 ? "" : "s"}`; $("#dWc", m).className = "tag " + (n >= 40 ? "good" : n >= 20 ? "warn" : ""); if (n >= 40) $("#dTip", m).textContent = "Good start! In the full module you get an analysis on the 4 criteria."; };
    let left = 300;
    $("#dT", m).onclick = () => { if (m._iv) return; ta.focus(); m._iv = setInterval(() => { left--; const t = $("#dTime", m); if (!t) return; t.textContent = fmt(left); t.classList.toggle("low", left < 30); if (left <= 0) { clearInterval(m._iv); toast("Time is up!"); } }, 1000); };
  }
  if (key === "speaking") {
    const card = L.speaking.cards[0];
    body = head("Part 2 cue card", "Read the card, prepare for one minute, then speak. You can record yourself in the full module.") +
      `<div class="modal-body demo-split"><div class="cue-card"><span class="tag warn">Cue card</span><h2 style="margin-top:12px">${esc(card.topic)}</h2><div class="muted">You should say:</div><ul>${card.points.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
        <button class="btn btn-ghost btn-sm" id="dSay">${ic("volume", "sm")} Listen to the task</button></div>
        <div style="text-align:center"><div class="muted small" style="font-weight:700">Preparation time</div><div class="big-timer" id="dPrep">1:00</div>
        <div class="prep-ring"><div id="dBar"></div></div>
        <button class="btn btn-primary" id="dGo" style="margin-top:16px">${ic("play", "sm")} Start preparation</button>
        <textarea id="dNotes" style="min-height:110px;margin-top:16px" placeholder="Your key words…"></textarea></div></div>` + foot;
    m = openModal(body, "wide");
    $("#dSay", m).onclick = () => speak(card.topic + " You should say: " + card.points.join(", "), { rate: .95 });
    let left = 60;
    $("#dGo", m).onclick = () => { if (m._iv) return; $("#dNotes", m).focus(); m._iv = setInterval(() => { left--; const t = $("#dPrep", m); if (!t) return; t.textContent = fmt(left); $("#dBar", m).style.width = ((60 - left) / 60 * 100) + "%"; if (left <= 0) { clearInterval(m._iv); t.textContent = "Speak!"; toast("Now speak for 1–2 minutes."); } }, 1000); };
  }
  $("[data-go-mod]", m).onclick = () => { closeModal(); startModule(key); };
}
function demoResult(pct, c, n) {
  return `<div class="demo-result fade-in"><div class="score-big" style="color:${pctColor(pct)}">${c}/${n}</div><p>${pct === 100 ? "Excellent — both answers correct." : "Check the corrections above, then try the full module."}</p></div>`;
}

/* ---------- Test de niveau ---------- */
let T = null;
function viewTest() {
  stopSpeak();
  app.innerHTML = `<div class="wrap" style="padding-top:30px;padding-bottom:60px"><div class="card test-intro">
    <div class="ti-img"><img src="${photo("test", 1100)}" alt="London"></div>
    <div class="ti-body stagger">
      <span class="eyebrow">Placement test</span>
      <h1 class="display" style="font-size:clamp(2.4rem,4.5vw,3.4rem);margin:12px 0">Find your <em>band score.</em></h1>
      <p class="muted">Answer honestly, without a dictionary. If you are unsure, go with your first instinct.</p>
      <div class="grid grid-2" style="margin:22px 0;gap:10px">
        ${["grammar", "vocab", "reading", "listening"].map(s => `<div class="metric row" style="gap:12px"><span class="ic-box" style="width:38px;height:38px">${ic(ICONS[s])}</span><div><b>${SKILL_NAMES[s]}</b><div class="muted small">${PLACEMENT.questions.filter(q => q.s === s).length} questions</div></div></div>`).join("")}
      </div>
      <div class="hero-meta" style="margin:0 0 24px"><span>${ic("clock", "sm")} About 15 min</span><span>${ic("volume", "sm")} Turn your sound on</span></div>
      <button class="btn btn-primary btn-lg" id="startTest">Start the test ${ic("arrow", "arrow")}</button>
    </div>
  </div></div>`;
  $("#startTest").onclick = () => {
    T = { i: 0, ans: [], qs: PLACEMENT.questions.map(prep), start: Date.now(), sel: undefined };
    renderTestQ();
    const iv = setInterval(() => { const e = $("#elapsed"); if (e && T) e.textContent = fmt((Date.now() - T.start) / 1000); }, 1000);
    onLeave(() => clearInterval(iv));
  };
}

function renderTestQ() {
  const q = T.qs[T.i], n = T.qs.length;
  const audio = q.audio ? audioWidget(q.audio, 2) : null;
  const firstOfSection = T.i === 0 || T.qs[T.i - 1].s !== q.s;
  app.innerHTML = `<div class="wrap test-wrap fade-in" style="padding-bottom:60px">
    <div class="test-head">
      <div class="row"><span class="tag">${ic(ICONS[q.s], "sm")} ${SKILL_NAMES[q.s]}</span><span class="muted small" style="font-weight:700">Question ${T.i + 1} / ${n}</span></div>
      <div class="row muted small" style="font-weight:700;gap:6px">${ic("clock", "sm")} <span id="elapsed">${fmt((Date.now() - T.start) / 1000)}</span></div>
    </div>
    <div class="progress-steps">${T.qs.map((_, k) => `<i class="${k < T.i ? "done" : k === T.i ? "cur" : ""}"></i>`).join("")}</div>
    ${firstOfSection && q.s === "listening" ? `<div class="explain" style="margin-top:16px">🎧 <b>Listening section</b> — click ▶ to listen. You can play each recording twice.</div>` : ""}
    ${firstOfSection && q.s === "reading" ? `<div class="explain" style="margin-top:16px">📖 <b>Reading section</b> — read the passage, then answer. The passage stays on screen for all 5 questions.</div>` : ""}
    <div style="margin-top:18px" class="${q.passage ? "split" : ""}">
      ${q.passage ? `<div class="passage"><h3>${esc(PLACEMENT.passage.title)}</h3>${paras(PLACEMENT.passage.text)}</div>` : ""}
      <div class="card" style="${q.passage ? "" : "max-width:760px;margin:0 auto"}">
        ${audio ? audio.html : ""}
        <div class="question">${esc(q.q)}</div>
        <div class="options">${optionButtons(q)}</div>
        <div class="row" style="margin-top:18px"><div class="spacer"></div><button class="btn btn-primary" id="nextBtn" disabled>${T.i < n - 1 ? "Next →" : "Finish the test"}</button></div>
      </div>
    </div></div>`;
  audio && audio.bind();
  T.sel = undefined;
  $$(".option", app).forEach(b => b.onclick = () => {
    T.sel = +b.dataset.oi;
    $$(".option", app).forEach(x => x.classList.toggle("selected", x === b));
    $("#nextBtn").disabled = false;
  });
  $("#nextBtn").onclick = () => {
    stopSpeak();
    T.ans[T.i] = T.sel === q.a;
    T.i++;
    if (T.i < n) { renderTestQ(); scrollTo(0, 0); } else finishTest();
  };
}

function finishTest() {
  const per = {}; let e = 0, t = 0;
  T.qs.forEach((q, i) => {
    const p = per[q.s] = per[q.s] || { e: 0, t: 0, c: 0, n: 0 };
    p.t += q.d; p.n++; t += q.d;
    if (T.ans[i]) { p.e += q.d; p.c++; e += q.d; }
  });
  const skills = {};
  Object.entries(per).forEach(([k, p]) => skills[k] = { pct: Math.round(p.e / p.t * 100), band: toBand(p.e / p.t), c: p.c, n: p.n });
  const band = toBand(e / t);
  S.placement = { band, level: bandToLevel(band), skills, date: new Date().toISOString(), duration: Math.round((Date.now() - T.start) / 1000), correct: T.ans.filter(Boolean).length, total: T.qs.length };
  S.history.push({ band, level: S.placement.level, date: S.placement.date });
  save();
  T = null;
  location.hash = "#/result";
}

/* ---------- Résultat ---------- */
function viewResult() {
  const P = S.placement;
  if (!P) { location.hash = "#/test"; return; }
  const L = LEVELS.find(l => l.id === P.level);
  const sorted = Object.entries(P.skills).sort((a, b) => b[1].pct - a[1].pct);
  const R = 100, C = 2 * Math.PI * R;
  app.innerHTML = `<div class="wrap fade-in" style="padding-top:24px;padding-bottom:60px">
    ${pageHero("grad", "Test result", "Well done, test complete!", "Here is your estimated level and the course we recommend.")}
    <div class="card" style="padding:32px">
      <div class="result-hero">
        <div class="ring">
          <svg width="240" height="240" viewBox="0 0 240 240">
            <defs><linearGradient id="rg" x1="0" x2="1"><stop offset="0" stop-color="#f2b33d"/><stop offset="1" stop-color="#e8613c"/></linearGradient></defs>
            <circle cx="120" cy="120" r="${R}" fill="none" stroke="var(--line)" stroke-width="16"/>
            <circle id="ringFg" cx="120" cy="120" r="${R}" fill="none" stroke="url(#rg)" stroke-width="16" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C}" style="transition:stroke-dashoffset 1.6s cubic-bezier(.2,.8,.2,1)"/>
          </svg>
          <div class="center"><div><div class="muted small">Estimated band</div><div class="band" id="bandNum">0.0</div><div class="muted small">out of 9.0</div></div></div>
        </div>
        <div>
          <span class="tag">Test result · ${P.correct}/${P.total} · ${fmt(P.duration)}</span>
          <h1 class="display" style="margin-top:12px;font-size:clamp(2.4rem,4vw,3.4rem)">Level ${L.id} — <em>${L.name}</em></h1>
          <p class="muted" style="font-size:1.05rem">${L.goal}</p>
          <p><b>Your target:</b> band <b>${L.target.toFixed(1)}</b>.
          Strongest skill: <b>${SKILL_NAMES[sorted[0][0]]}</b> · To work on: <b>${SKILL_NAMES[sorted[sorted.length - 1][0]]}</b>.</p>
          <div class="row" style="margin-top:16px">
            <button class="btn btn-primary btn-lg" id="go">Start my ${L.id} course ${ic("arrow", "arrow")}</button>
            <a class="btn btn-ghost btn-lg" href="#/book/${L.id}" id="goBook">Read my free ${L.id} book</a>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-2" style="margin-top:20px">
      <div class="card reveal"><h3>Results by skill</h3>
        ${sorted.map(([k, s]) => `<div class="skill-bar"><div class="label"><span class="row" style="gap:8px">${ic(ICONS[k], "sm")} ${SKILL_NAMES[k]}</span><span>${s.c}/${s.n} · band ≈ ${s.band.toFixed(1)}</span></div>
          <div class="bar"><div data-w="${s.pct}" style="width:0;background:${pctColor(s.pct)}"></div></div></div>`).join("")}
      </div>
      <div class="card reveal" style="--d:.1s"><h3>Levels</h3>
        ${LEVELS.map(l => `<div class="plan-day" style="${l.id === L.id ? "border-color:" + l.solid + ";border-width:2px" : ""}">
          <span class="check" style="background:${l.solid};border-color:${l.solid}">${l.id === L.id ? "★" : ""}</span>
          <span class="txt"><b>${l.id} · ${l.name}</b> <span class="muted small">— band ${l.band}</span></span><div class="spacer"></div>
          ${l.id !== L.id ? `<button class="btn btn-ghost btn-sm" data-pick="${l.id}">Choose</button>` : `<span class="tag good">Recommended</span>`}
        </div>`).join("")}
        <p class="muted small">You can choose another level if you think the test under- or overestimated you.</p>
      </div>
    </div></div>`;
  const pick = id => { S.level = id; save(); confetti(); location.hash = "#/dashboard"; };
  $("#go").onclick = () => pick(L.id);
  $("#goBook").onclick = () => { S.level = L.id; save(); };
  $$("[data-pick]").forEach(b => b.onclick = () => pick(b.dataset.pick));
  setTimeout(() => {
    const fg = $("#ringFg"); if (fg) fg.style.strokeDashoffset = C * (1 - P.band / 9);
    $$(".bar > div[data-w]").forEach(b => b.style.width = b.dataset.w + "%");
    const el = $("#bandNum"); let v = 0;
    const iv = setInterval(() => { v = Math.min(P.band, v + 0.1); if (el) el.textContent = v.toFixed(1); if (v >= P.band) { clearInterval(iv); if (el) el.textContent = P.band.toFixed(1); } }, 1400 / (P.band * 10));
    onLeave(() => clearInterval(iv));
  }, 80);
  if (P.band >= 6) setTimeout(confetti, 900);
}

/* ---------- Graphiques du tableau de bord ---------- */
function lastDays(n) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(Date.now() - (n - 1 - i) * 864e5); const k = d.toISOString().slice(0, 10);
    return { k, d, v: (S.activity || {})[k] || 0 };
  });
}
function barChart(days) {
  const W = 640, H = 230, L = 34, B = 30, T = 16, max = Math.max(40, ...days.map(d => d.v));
  const step = (W - L) / days.length, bw = step * 0.6;
  const y = v => T + (H - T - B) * (1 - v / max);
  const cols = ["#6366f1", "#f59e0b", "#10b981", "#ec4899", "#06b6d4", "#f97316", "#8b5cf6"];
  let s = `<svg class="chart-svg" viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Activity per day">`;
  [0, .5, 1].forEach(f => { const v = Math.round(max * f); s += `<line x1="${L}" x2="${W}" y1="${y(v)}" y2="${y(v)}" stroke="var(--line)" stroke-dasharray="4 5"/><text x="${L - 8}" y="${y(v) + 4}" text-anchor="end" font-size="11" fill="var(--muted)">${v}</text>`; });
  days.forEach((d, i) => {
    const x = L + i * step + (step - bw) / 2, isToday = i === days.length - 1;
    const h = Math.max(d.v ? 6 : 3, y(0) - y(d.v));
    s += `<rect class="chart-bar" style="animation-delay:${i * 40}ms" x="${x}" y="${y(0) - h}" width="${bw}" height="${h}" rx="8" fill="${d.v ? cols[i % cols.length] : "var(--line)"}"><title>${d.d.toLocaleDateString("en-GB")} : ${d.v} pts</title></rect>`;
    if (d.v) s += `<text x="${x + bw / 2}" y="${y(0) - h - 6}" text-anchor="middle" font-size="11" font-weight="800" fill="var(--text)">${d.v}</text>`;
    s += `<text x="${x + bw / 2}" y="${H - 8}" text-anchor="middle" font-size="11" fill="${isToday ? "var(--accent)" : "var(--muted)"}" font-weight="${isToday ? 800 : 600}">${isToday ? "Today" : d.d.toLocaleDateString("en-GB", { weekday: "short" }).slice(0, 3)}</text>`;
  });
  return s + "</svg>";
}
function radarChart(items) {
  const S0 = 300, c = S0 / 2, R = 100, n = items.length;
  const pt = (i, r) => { const a = -Math.PI / 2 + i * 2 * Math.PI / n; return [c + Math.cos(a) * r, c + Math.sin(a) * r]; };
  let s = `<svg class="chart-svg" viewBox="0 0 ${S0} ${S0}" width="100%" style="max-width:320px;display:block;margin:0 auto" role="img" aria-label="Skills profile">`;
  [.25, .5, .75, 1].forEach(f => s += `<polygon points="${items.map((_, i) => pt(i, R * f).join(",")).join(" ")}" fill="${f === 1 ? "var(--surface-2)" : "none"}" stroke="var(--line)" stroke-width="1.5"/>`);
  items.forEach((it, i) => { const [x, y] = pt(i, R); s += `<line x1="${c}" y1="${c}" x2="${x}" y2="${y}" stroke="var(--line)"/>`;
    const [lx, ly] = pt(i, R + 26); s += `<text x="${lx}" y="${ly + 4}" text-anchor="middle" font-size="12" font-weight="800" fill="${it.color}">${it.label}</text><text x="${lx}" y="${ly + 18}" text-anchor="middle" font-size="10.5" font-weight="700" fill="var(--muted)">${it.v === null || it.v === undefined ? "—" : it.v + "%"}</text>`; });
  const poly = items.map((it, i) => pt(i, R * Math.max(.04, (it.v || 0) / 100)).join(",")).join(" ");
  s += `<polygon class="radar-poly" points="${poly}" fill="color-mix(in srgb, var(--accent) 25%, transparent)" stroke="var(--accent)" stroke-width="3" stroke-linejoin="round"/>`;
  items.forEach((it, i) => { const [x, y] = pt(i, R * Math.max(.04, (it.v || 0) / 100)); s += `<circle class="radar-poly" cx="${x}" cy="${y}" r="6" fill="${it.color}" stroke="var(--surface)" stroke-width="2.5"/>`; });
  return s + "</svg>";
}
function sparkline(vals, color = "var(--accent)") {
  const W = 120, H = 46, max = Math.max(1, ...vals);
  const pts = vals.map((v, i) => [i * W / (vals.length - 1), H - 6 - (v / max) * (H - 14)]);
  const d = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  return `<svg class="spark" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><path d="${d} L${W} ${H} L0 ${H}Z" fill="${color}" opacity=".15"/><path class="draw" d="${d}" fill="none" stroke="${color}" stroke-width="2.6" stroke-linecap="round"/></svg>`;
}
function heatmap(weeks = 18) {
  const end = new Date(); const startOffset = (end.getDay() + 6) % 7;
  const total = weeks * 7 - (6 - startOffset);
  const days = lastDays(total);
  const lvlOf = v => v === 0 ? "" : v < 20 ? "l1" : v < 50 ? "l2" : v < 100 ? "l3" : "l4";
  return `<div class="heatmap">${days.map((d, i) => `<i class="${lvlOf(d.v)}" style="animation-delay:${i * 3}ms" title="${d.d.toLocaleDateString("en-GB")} : ${d.v} pts"></i>`).join("")}</div>`;
}

/* ---------- Composants communs aux modules ---------- */
const modOf = key => MODULES.find(m => m.key === key);
const itemTitle = (key, it) => key === "speaking" ? it.topic.replace(/^Describe /, "").replace(/\.$/, "") : key === "writing" ? it.type : it.title;
function clampIdx(p, key) { const n = itemsOf(key).length; const i = parseInt(p, 10); return Number.isFinite(i) && i >= 0 && i < n ? i : firstTodo(key); }
function picker(key, idx) {
  const m = modOf(key), items = itemsOf(key);
  return `<div class="picker" style="--mc:${m.color}">${items.map((it, i) => { const s = itemScore(key, i);
    return `<a href="#/${m.route}/${i}" class="pick ${i === idx ? "active" : ""} ${s >= 70 ? "ok" : ""}">
      <span class="pnum">${s >= 70 ? ic("check", "sm") : i + 1}</span>
      <span class="ptxt"><small>${m.unit} ${i + 1}</small><b>${esc(itemTitle(key, it))}</b></span>
      <span class="pscore">${s === undefined ? "" : s + "%"}</span></a>`; }).join("")}</div>`;
}
function scoreCard(pct, c, n, key, idx) {
  const m = modOf(key), total = itemsOf(key).length;
  const msg = pct === 100 ? "Perfect score." : pct >= 70 ? "Exercise completed." : pct >= 45 ? "Almost there: review the corrections and try again." : "Read the lesson again before retrying.";
  const next = idx + 1 < total ? `#/${m.route}/${idx + 1}` : "#/dashboard";
  return `<div class="card score-card fade-in" style="--mc:${m.color}">
    
    <div class="score-big" style="color:${pctColor(pct)}">${pct}%</div>
    <div class="muted" style="font-weight:700">${c} / ${n} correct answer(s)</div>
    <h3 style="margin-top:10px">${msg}</h3>
    <p class="muted small">You need at least 70% to complete the exercise.</p>
    <div class="row" style="justify-content:center;margin-top:10px">
      <button class="btn btn-ghost" onclick="render()">${ic("refresh", "sm")} Try again</button>
      <a class="btn btn-primary" href="${next}">${idx + 1 < total ? `Next ${m.unit}` : "Dashboard"} ${ic("arrow", "sm arrow")}</a>
    </div></div>`;
}

/* ---------- Tableau de bord ---------- */
function moduleSub(L, key) {
  const n = itemsOf(key, L).length, m = modOf(key);
  return `${n} ${m.unit}${n > 1 && m.unit !== "cue card" ? "s" : n > 1 ? "s" : ""}${key === "vocab" ? ` · ${L.vocab.reduce((a, s) => a + s.words.length, 0)} words` : ""}`;
}
function viewDashboard() {
  const L = lvl();
  const validN = MODULES.filter(m => validated(m.key)).length;
  const totalItems = allItemsCount(L);
  const doneItems = MODULES.reduce((a, m) => a + doneCount(m.key), 0);
  const scored = MODULES.map(m => score(m.key)).filter(s => s !== undefined);
  const avg = scored.length ? Math.round(MODULES.reduce((a, m) => a + (score(m.key) || 0), 0) / MODULES.length) : 0;
  const canUp = validN === MODULES.length;
  const next = LEVELS[lvlIndex(L.id) + 1];
  const tip = L.tips[new Date().getDate() % L.tips.length];
  const progress = Math.round(doneItems / totalItems * 100);
  const nextModule = MODULES.find(m => doneCount(m.key) < itemsOf(m.key).length) || MODULES.find(m => !validated(m.key));
  const week = lastDays(7), weekXP = week.reduce((a, d) => a + d.v, 0);
  const P = S.placement, band = P ? P.band : null;
  const sk = k => P && P.skills[k] ? P.skills[k].pct : undefined;
  const mix = (a, b) => a === undefined ? (b ?? null) : b === undefined ? a : Math.round((a + b) / 2);
  const radar = [
    { label: "Grammaire", color: "#6366f1", v: mix(score("grammar"), sk("grammar")) },
    { label: "Vocabulaire", color: "#f59e0b", v: mix(score("vocab"), sk("vocab")) },
    { label: "Reading", color: "#10b981", v: mix(score("reading"), sk("reading")) },
    { label: "Listening", color: "#ec4899", v: mix(score("listening"), sk("listening")) },
    { label: "Writing", color: "#f97316", v: score("writing") ?? null },
    { label: "Speaking", color: "#06b6d4", v: score("speaking") ?? null }
  ];
  const hour = new Date().getHours();
  const dateStr = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  const ringC = 2 * Math.PI * 70;
  const sDone = (k, i) => itemScore(k, i) !== undefined;
  const planOk = PLAN.map(p => p.check ? p.check(sDone) : canUp);
  const curPlan = planOk.findIndex(x => !x);

  app.innerHTML = `<div class="page-enter">
    <div class="welcome">
      <div>${flagPair("sm")}<span class="eyebrow" style="margin-left:10px">${dateStr}</span><h1>${hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"}, ready to study?</h1></div>
      <div class="row"><a class="btn btn-ghost" href="#/book/${L.id}">My ${L.id} study book</a><a class="btn btn-ghost" href="#/toolkit">${ic("layers", "sm")} Toolkit</a>
        ${nextModule ? `<a class="btn btn-primary" href="#/${nextModule.route}/${firstTodo(nextModule.key)}">Continue: ${nextModule.name} ${ic("arrow", "sm arrow")}</a>` : ""}</div>
    </div>

    ${canUp ? `<div class="card levelup-card reveal">
      <div class="row"><span class="mc-ic" style="--mc:#16a34a">${ic("trophy", "lg")}</span><div><h3 style="margin:0">Level ${L.id} completed — well done!</h3>
      <div class="muted">${next ? `You are ready for level ${next.id} — ${next.name}.` : "You have finished the most advanced course. Try a full IELTS mock test!"}</div></div>
      <div class="spacer"></div>${next ? `<button class="btn btn-primary" id="levelUp">Move up to ${next.id} ${ic("arrow", "sm arrow")}</button>` : `<a class="btn btn-primary" href="#/test">Retake the test</a>`}</div></div>` : ""}

    <div class="dash-grid">
      <section class="c-8 hero-card reveal">
        <img src="${photo("group", 1400)}" alt="London">
        <div><span class="tag">Level ${L.id} · band ${L.band}</span><h2>${L.name}</h2><p style="color:#eef1ff;max-width:440px;margin:0">${L.goal}</p></div>
        <div class="hc-bottom">
          <div class="hc-progress"><div class="row small" style="margin-bottom:8px;font-weight:800"><span>Course progress</span><div class="spacer"></div><span>${progress} %</span></div>
            <div class="bar"><div data-w="${progress}" style="width:0"></div></div>
            <div class="small" style="margin-top:8px;color:#eef1ff;font-weight:600">${doneItems} / ${totalItems} exercises done · ${validN} / ${MODULES.length} modules completed</div></div>
          ${nextModule ? `<a class="btn btn-white" href="#/${nextModule.route}/${firstTodo(nextModule.key)}">${ic(nextModule.icon, "sm")} ${nextModule.name} ${ic("arrow", "sm arrow")}</a>` : ""}
        </div>
      </section>

      <section class="c-4 card goal-card reveal" style="--d:.08s">
        <div class="card-head" style="width:100%"><span class="ic-box" style="--mc:#f43f5e">${ic("target")}</span><h3>Target band</h3></div>
        <div class="goal-ring">
          <svg width="170" height="170" viewBox="0 0 170 170"><defs><linearGradient id="gr1" x1="0" x2="1"><stop offset="0" stop-color="#f59e0b"/><stop offset="1" stop-color="#f43f5e"/></linearGradient></defs>
          <circle cx="85" cy="85" r="70" fill="none" stroke="var(--line)" stroke-width="16"/>
          <circle class="goal-fg" cx="85" cy="85" r="70" fill="none" stroke="url(#gr1)" stroke-width="16" stroke-linecap="round" stroke-dasharray="${ringC}" stroke-dashoffset="${ringC}" data-off="${ringC * (1 - Math.min(1, (band || 0) / L.target))}" style="transition:stroke-dashoffset 1.6s var(--ease)"/></svg>
          <div class="center"><div><div class="big" ${band ? `data-count="${band.toFixed(1)}"` : ""}>${band ? "0" : "—"}</div><div class="muted small" style="font-weight:700">target ${L.target.toFixed(1)}</div></div></div>
        </div>
        <p class="muted small" style="margin:0;font-weight:600">${band ? (band >= L.target ? "Target reached in the test: aim for the next level." : `<b style="color:var(--accent)">+${(L.target - band).toFixed(1)}</b> to go to reach your target.`) : "Take the test to find your band."}</p>
      </section>

      <section class="c-3 card kpi lift reveal" style="--d:.05s;--mc:#6366f1"><div class="top"><span class="ic-box">${ic("chart")}</span><span class="trend">+${weekXP} / 7 j</span></div>
        <div class="val" data-count="${S.xp}">0</div><div class="lbl">Activity points</div>${sparkline(week.map(d => d.v), "#6366f1")}</section>
      <section class="c-3 card kpi lift reveal" style="--d:.1s;--mc:#f97316"><div class="top"><span class="ic-box">${ic("calendar")}</span>${S.streak.last === today() ? `<span class="trend">done today</span>` : `<span class="trend warn">to do</span>`}</div>
        <div class="val"><span data-count="${S.streak.count}">0</span> <span style="font-size:1.1rem" class="muted">day${S.streak.count > 1 ? "s" : ""}</span></div><div class="lbl">Study streak</div>${sparkline(week.map(d => d.v ? 1 : 0), "#f97316")}</section>
      <section class="c-3 card kpi lift reveal" style="--d:.15s;--mc:#10b981"><div class="top"><span class="ic-box">${ic("checkc")}</span></div>
        <div class="val"><span data-count="${doneItems}">0</span><span style="font-size:1.1rem" class="muted"> / ${totalItems}</span></div><div class="lbl">Exercises done</div>
        <div class="bar" style="margin-top:12px"><div data-w="${progress}" style="width:0;background:#10b981"></div></div></section>
      <section class="c-3 card kpi lift reveal" style="--d:.2s;--mc:#ec4899"><div class="top"><span class="ic-box">${ic("star")}</span></div>
        <div class="val"><span data-count="${avg}">0</span><span style="font-size:1.1rem" class="muted"> %</span></div><div class="lbl">Average score</div>
        <div class="bar" style="margin-top:12px"><div data-w="${avg}" style="width:0;background:#ec4899"></div></div></section>

      <section class="c-12 reveal">
        <div class="section-title" style="margin-top:6px"><h2>My modules</h2><span class="muted small" style="font-weight:700">Click a module to continue</span></div>
        <div class="mod-cards">
          ${MODULES.map((m, k) => { const n = itemsOf(m.key).length, d = doneCount(m.key), s = score(m.key), v = validated(m.key);
            return `<a class="mod-card" href="#/${m.route}/${firstTodo(m.key)}" style="--mc:${m.color};--d:${k * .05}s">
              <div class="mc-top"><span class="mc-ic">${ic(m.icon, "lg")}</span>${v ? `<span class="tag good">Completed ✓</span>` : d ? `<span class="tag warn">In progress</span>` : `<span class="tag neutral">To do</span>`}</div>
              <h3>${m.name}</h3><div class="muted small" style="font-weight:600">${moduleSub(L, m.key)}</div>
              <div class="mc-dots">${itemsOf(m.key).map((_, i) => { const x = itemScore(m.key, i); return `<i class="${x >= 70 ? "ok" : x !== undefined ? "mid" : ""}"></i>`; }).join("")}</div>
              <div class="row small" style="font-weight:800"><span>${d}/${n} done</span><div class="spacer"></div><span>${s === undefined ? "—" : s + " %"}</span></div>
            </a>`; }).join("")}
        </div>
      </section>

      <section class="c-8 card reveal">
        <div class="card-head"><span class="ic-box" style="--mc:#6366f1">${ic("chart")}</span><div><h3>Activity</h3><div class="muted small">Activity points over 14 days</div></div><div class="spacer"></div><span class="tag neutral">${lastDays(14).reduce((a, d) => a + d.v, 0)} pts</span></div>
        ${barChart(lastDays(14))}
      </section>
      <section class="c-4 card reveal" style="--d:.08s">
        <div class="card-head"><span class="ic-box" style="--mc:#10b981">${ic("layers")}</span><div><h3>Skills profile</h3><div class="muted small">Test + exercises</div></div></div>
        ${radarChart(radar)}
      </section>

      <section class="c-4 card reveal">
        <div class="card-head"><span class="ic-box" style="--mc:#f59e0b">${ic("calendar")}</span><div><h3>7-day plan</h3><div class="muted small">One goal per day</div></div></div>
        <div class="timeline">
          ${PLAN.map((p, i) => `<div class="tl-item ${planOk[i] ? "done" : i === curPlan ? "current" : ""}"><span class="tl-dot">${planOk[i] ? ic("check", "sm") : i + 1}</span><div><div class="d">${p.day}</div><div class="t">${p.txt}</div></div></div>`).join("")}
        </div>
      </section>
      <section class="c-8 card reveal" style="--d:.08s">
        <div class="card-head"><span class="ic-box" style="--mc:#f97316">${ic("calendar")}</span><div><h3>Consistency</h3><div class="muted small">Your study days over 18 weeks</div></div><div class="spacer"></div>
          <div class="heat-legend">Less <i style="background:var(--line)"></i><i style="background:color-mix(in srgb,var(--accent) 35%,var(--line))"></i><i style="background:color-mix(in srgb,var(--accent) 65%,var(--line))"></i><i style="background:var(--accent)"></i> More</div></div>
        ${heatmap(18)}
        <div class="tip-inline"><span class="ic-box" style="--mc:#d97706;width:40px;height:40px">${ic("bulb")}</span><div><b>Tip of the day</b><p style="margin:2px 0 0">${esc(tip)}</p></div></div>
        <div class="row" style="margin-top:16px"><span class="muted small" style="font-weight:800">Change level:</span>${LEVELS.map(l => `<button class="btn btn-sm ${l.id === L.id ? "btn-dark" : "btn-ghost"}" data-lv="${l.id}">${l.id}</button>`).join("")}</div>
      </section>
    </div></div>`;
  $$("[data-lv]").forEach(b => b.onclick = () => { S.level = b.dataset.lv; save(); render(); toast(`Level ${S.level} selected`); });
  const up = $("#levelUp");
  if (up) up.onclick = () => { S.level = next.id; addXP(100); save(); confetti(); toast(`Welcome to level ${next.id}! New course unlocked.`); render(); };
  setTimeout(() => {
    $$(".bar > div[data-w]", app).forEach(b => b.style.width = b.dataset.w + "%");
    const g = $(".goal-fg", app); if (g) g.style.strokeDashoffset = Math.max(0, +g.dataset.off);
  }, 150);
}

/* ---------- Grammaire ---------- */
function viewGrammar(p) {
  const L = lvl(); const idx = clampIdx(p, "grammar"); const G = L.grammar[idx];
  const best = itemScore("grammar", idx);
  app.innerHTML = `<div>
    ${pageHero("grammar", `Grammar · ${L.id}`, esc(G.title), "Read the lesson, listen to the examples, then practise with corrected exercises.")}
    ${picker("grammar", idx)}
    <div class="grid grid-2" style="align-items:start">
      <div class="card lesson reveal"><div class="card-head"><span class="ic-box" style="--mc:#6366f1">${ic("book")}</span><h3>The lesson</h3></div>${G.html}
        <h3 style="margin-top:18px">Examples</h3>${G.examples.map(e => `<div class="example row" style="gap:8px"><span style="flex:1">${esc(e)}</span><button class="icon-btn" style="width:36px;height:36px" data-say="${esc(e)}" aria-label="Listen">${ic("volume", "sm")}</button></div>`).join("")}
        <div class="tipbox"><b>⚠️ Common mistake:</b> ${esc(G.tip)}</div>
      </div>
      <div id="quizZone" class="reveal" style="--d:.1s"><div class="card start-card" style="--mc:#6366f1">
        <span class="mc-ic" style="margin:0 auto 14px">${ic("pen", "lg")}</span><h3>Exercises — ${G.quiz.length} questions</h3>
        <p class="muted">Read the lesson, then test yourself. Every answer is explained.</p>
        ${best !== undefined ? `<p>Best score: <b style="color:${pctColor(best)}">${best} %</b></p>` : ""}
        <button class="btn btn-primary btn-lg" id="startQ">Start the exercises ${ic("arrow", "sm arrow")}</button></div></div>
    </div></div>`;
  $$("[data-say]").forEach(b => b.onclick = () => speak(b.dataset.say, { rate: .95 }));
  $("#startQ").onclick = () => stepQuiz($("#quizZone"), G.quiz, (pct, c, n) => {
    award("grammar", idx, pct);
    $("#quizZone").innerHTML = scoreCard(pct, c, n, "grammar", idx);
  });
}

/* ---------- Vocabulaire ---------- */
function viewVocab(p, tab = "cards") {
  const L = lvl(); const idx = clampIdx(p, "vocab"); const SET = L.vocab[idx]; const V = SET.words;
  S.known[L.id] = S.known[L.id] || [];
  const knownN = V.filter(v => S.known[L.id].includes(v.w)).length;
  app.innerHTML = `<div class="fade-in">
    ${pageHero("vocab", `Vocabulary · ${L.id}`, esc(SET.title), "Flip the cards, listen to the pronunciation, then complete the set with the quiz.")}
    ${picker("vocab", idx)}
    <div class="row" style="margin-bottom:18px">
      <div class="tabs">
        <button data-t="cards" class="${tab === "cards" ? "active" : ""}">Flashcards</button>
        <button data-t="quiz" class="${tab === "quiz" ? "active" : ""}">Quiz</button>
        <button data-t="list" class="${tab === "list" ? "active" : ""}">Liste</button>
      </div><div class="spacer"></div>
      <span class="chip-stat">${knownN} / ${V.length} words learned</span>
    </div><div id="vz"></div></div>`;
  $$("[data-t]").forEach(b => b.onclick = () => { cleanups.forEach(f => f()); cleanups = []; viewVocab(String(idx), b.dataset.t); });
  const z = $("#vz");

  if (tab === "cards") {
    const order = [...V.filter(v => !S.known[L.id].includes(v.w)), ...V.filter(v => S.known[L.id].includes(v.w))];
    let i = 0;
    const show = () => {
      const v = order[i]; const known = S.known[L.id].includes(v.w);
      z.innerHTML = `<div class="flash-wrap">
        <div class="muted small" style="text-align:center;margin-bottom:10px;font-weight:700">Card ${i + 1} / ${order.length} · click (or press <kbd>Space</kbd>) to flip</div>
        <div class="flashcard" id="fc">
          <div class="face front" style="--fc:${["#6366f1", "#f59e0b", "#10b981", "#ec4899", "#06b6d4", "#f97316"][i % 6]}"><div class="small" style="opacity:.9;font-weight:800">${known ? "Learned" : "New word"}</div><div class="word">${esc(v.w)}</div><div style="opacity:.9;font-weight:600">What does this word mean?</div></div>
          <div class="face back"><div class="muted small" style="font-weight:800">${esc(v.w)}</div><h3 style="font-size:1.25rem">${esc(v.d)}</h3><div class="example" style="text-align:left">${esc(v.ex)}</div><div class="tag" style="margin-top:8px">French: ${esc(v.fr)}</div></div>
        </div>
        <div class="row" style="justify-content:center;margin-top:20px">
          <button class="btn btn-ghost" id="prev" aria-label="Previous">←</button>
          <button class="btn btn-ghost" id="say">${ic("volume", "sm")} Listen</button>
          <button class="btn btn-ghost" id="again">🔁 Review again</button>
          <button class="btn btn-primary" id="know">✓ I know it</button>
          <button class="btn btn-ghost" id="nxt" aria-label="Next">→</button>
        </div></div>`;
      const fc = $("#fc"); fc.onclick = () => fc.classList.toggle("flipped");
      $("#say").onclick = () => speak(v.w + ". " + v.ex, { rate: .9 });
      const go = d => { i = (i + d + order.length) % order.length; show(); };
      $("#prev").onclick = () => go(-1); $("#nxt").onclick = () => go(1);
      $("#again").onclick = () => { S.known[L.id] = S.known[L.id].filter(w => w !== v.w); save(); go(1); };
      $("#know").onclick = () => {
        if (!S.known[L.id].includes(v.w)) { S.known[L.id].push(v.w); addXP(2); bumpStreak(); save(); updateTop(); }
        if (V.every(x => S.known[L.id].includes(x.w))) { toast("Set learned: now take the quiz."); }
        go(1);
      };
    };
    show();
    const key = e => { if (e.code === "Space" && $("#fc") && !e.target.matches("button,textarea,input")) { e.preventDefault(); $("#fc").classList.toggle("flipped"); } };
    document.addEventListener("keydown", key); onLeave(() => document.removeEventListener("keydown", key));
  }

  if (tab === "quiz") {
    const pick = shuffle([...V]).slice(0, 10);
    const qs = pick.map((v, k) => {
      const others = shuffle(V.filter(x => x.w !== v.w)).slice(0, 3).map(x => x.w);
      if (k % 2 === 0) return { q: `Which word means: “${v.d}”?`, o: [v.w, ...others], a: 0, e: `${v.w} (French: ${v.fr}). Example: ${v.ex}` };
      const gap = v.ex.replace(new RegExp(v.w.split(" ")[0].slice(0, Math.max(4, v.w.split(" ")[0].length - 2)) + "\\w*( \\w+)?", "i"), m => v.w.includes(" ") ? "_____" : m.replace(/^\S+/, "_____"));
      return { q: `Complete the sentence: ${gap}`, o: [v.w, ...others], a: 0, e: `Answer: ${v.ex}` };
    });
    stepQuiz(z, qs, (pct, c, n) => { award("vocab", idx, pct); z.innerHTML = scoreCard(pct, c, n, "vocab", idx); });
  }

  if (tab === "list") {
    z.innerHTML = `<div class="vocab-grid">${V.map((v, k) => `<div class="vcard fade-in" style="animation-delay:${k * 40}ms"><div class="w"><b>${esc(v.w)}</b><button class="icon-btn" style="width:34px;height:34px" data-say="${esc(v.w)}" aria-label="Listen">${ic("volume", "sm")}</button></div><div class="d">${esc(v.d)}</div><div class="ex">${esc(v.ex)}</div><div class="fr">FR: ${esc(v.fr)}${S.known[L.id].includes(v.w) ? " · learned" : ""}</div></div>`).join("")}</div>`;
    $$("[data-say]", z).forEach(b => b.onclick = () => speak(b.dataset.say, { rate: .85 }));
  }
}

/* ---------- Reading ---------- */
function viewReading(p) {
  const L = lvl(), idx = clampIdx(p, "reading"), R = L.reading[idx];
  let left = R.time * 60, done = false;
  app.innerHTML = `<div class="fade-in">
    ${pageHero("reading", `Reading · ${L.id}`, esc(R.title), "Read the passage, answer the questions and keep an eye on the timer.",
      `<div class="hero-timer"><div class="small">Suggested time</div><span class="timer" id="rt">${fmt(left)}</span></div>`)}
    ${picker("reading", idx)}
    <p class="muted small" style="font-weight:600">Tip: select part of the passage with your mouse to <mark style="background:var(--mark);color:inherit;border-radius:4px;padding:0 4px">highlight</mark> it (click it again to remove the highlight).</p>
    <div class="split">
      <div class="passage" id="passage" style="max-height:none"><h3>${esc(R.title)}</h3>${paras(R.text)}</div>
      <div id="rq"></div>
    </div></div>`;
  const iv = setInterval(() => { if (done) return; left--; const el = $("#rt"); if (!el) return; el.textContent = fmt(left); el.classList.toggle("low", left < 60); if (left <= 0) { clearInterval(iv); el.textContent = "0:00"; toast("Suggested time is up — finish your answers."); } }, 1000);
  onLeave(() => clearInterval(iv));
  const pas = $("#passage");
  pas.addEventListener("mouseup", () => {
    const sel = getSelection(); if (!sel.rangeCount || sel.isCollapsed) return;
    const r = sel.getRangeAt(0); if (!pas.contains(r.commonAncestorContainer)) return;
    try { const m = document.createElement("mark"); r.surroundContents(m); } catch { toast("Highlight within a single paragraph"); }
    sel.removeAllRanges();
  });
  pas.addEventListener("click", e => { if (e.target.tagName === "MARK") e.target.replaceWith(...e.target.childNodes); });
  formQuiz($("#rq"), R.questions, (pct, c, n) => {
    done = true; award("reading", idx, pct);
    $("#rq").insertAdjacentHTML("beforeend", scoreCard(pct, c, n, "reading", idx));
  });
}

/* ---------- Listening ---------- */
function viewListening(p) {
  const L = lvl(), idx = clampIdx(p, "listening"), Li = L.listening[idx];
  const a = audioWidget(Li.script, 3, true);
  app.innerHTML = `<div class="fade-in">
    ${pageHero("listening", `Listening · ${L.id}`, esc(Li.title), "Read the questions, then play the recording. You can listen 3 times.")}
    ${picker("listening", idx)}
    <div class="grid grid-2" style="align-items:start">
      <div>
        ${a.html}
        <div class="card" style="margin-top:16px"><div class="card-head"><span class="ic-box" style="--mc:#ec4899">${ic("bulb")}</span><h3>IELTS method</h3></div>
          <ol class="method-list">
            <li>Read all the questions <b>before</b> you listen.</li>
            <li>Underline the key words (places, numbers, days…).</li>
            <li>Watch out for speakers <b>correcting themselves</b>: the last information is the right one.</li>
            <li>In the exam you hear each recording <b>only once</b> — practise at 1×.</li>
          </ol></div>
        <div id="script"></div>
      </div>
      <div id="lq"></div>
    </div></div>`;
  a.bind();
  formQuiz($("#lq"), Li.questions, (pct, c, n) => {
    award("listening", idx, pct);
    $("#lq").insertAdjacentHTML("beforeend", scoreCard(pct, c, n, "listening", idx));
    $("#script").innerHTML = `<div class="card" style="margin-top:16px"><h3>Transcript</h3><div class="passage" style="max-height:none">${esc(Li.script)}</div>
      <button class="btn btn-ghost btn-sm" style="margin-top:10px" id="replay">${ic("volume", "sm")} Listen again while reading</button></div>`;
    $("#replay").onclick = () => speak(Li.script, { rate: .95 });
  });
}

/* ---------- Writing ---------- */
function viewWriting(p) {
  const L = lvl(), idx = clampIdx(p, "writing"), W = L.writing[idx]; const dk = `${L.id}:${idx}`;
  let left = W.time * 60, iv = null;
  app.innerHTML = `<div class="fade-in">
    ${pageHero("writing", `Writing · ${esc(W.type)}`, "Timed writing", `Write at least ${W.minWords} words in ${W.time} minutes, then run the analysis.`,
      `<div class="hero-timer"><button class="btn btn-white btn-sm" id="tbtn">${ic("play", "sm")} Start the timer</button><span class="timer" id="wt">${fmt(left)}</span></div>`)}
    ${picker("writing", idx)}
    <div class="grid grid-2" style="align-items:start">
      <div>
        <div class="card"><div class="card-head"><span class="ic-box" style="--mc:#f97316">${ic("pen")}</span><h3>Task</h3></div><p style="font-family:Georgia,serif;font-size:1.06rem">${esc(W.prompt)}</p>
          ${W.chart ? `<div style="margin-top:8px">${chartSVG(W.chart)}</div>` : ""}
          <p class="muted small" style="margin-bottom:0;font-weight:700">Write at least ${W.minWords} words.</p></div>
        <div class="card" style="margin-top:16px"><div class="card-head"><span class="ic-box" style="--mc:#f59e0b">${ic("bulb")}</span><h3>Tips</h3></div><ul class="method-list">${W.tips.map(t => `<li>${esc(t)}</li>`).join("")}</ul></div>
        <div id="analysis"></div>
      </div>
      <div class="card">
        <textarea id="essay" placeholder="Write your answer here… (leave a blank line between paragraphs)">${esc(S.drafts[dk] || "")}</textarea>
        <div class="row" style="margin-top:12px">
          <span id="wc" class="tag">0 words</span><span class="muted small">draft saved</span><div class="spacer"></div>
          <button class="btn btn-ghost" id="model">Model answer</button>
          <button class="btn btn-primary" id="analyze">${ic("chart", "sm")} Analyse</button>
        </div>
        <div id="modelZone"></div>
      </div>
    </div></div>`;
  const ta = $("#essay"), wc = $("#wc");
  const count = () => { const n = countWords(ta.value); wc.textContent = `${n} word${n === 1 ? "" : "s"}`; wc.className = "tag " + (n >= W.minWords ? "good" : n >= W.minWords * 0.7 ? "warn" : ""); };
  count();
  ta.addEventListener("input", () => { count(); S.drafts[dk] = ta.value; save(); });
  $("#tbtn").onclick = () => {
    if (iv) { clearInterval(iv); iv = null; $("#tbtn").innerHTML = `${ic("play", "sm")} Resume`; return; }
    $("#tbtn").textContent = "⏸ Pause"; ta.focus();
    iv = setInterval(() => { left--; const el = $("#wt"); if (!el) return; el.textContent = fmt(left); el.classList.toggle("low", left < 120);
      if (left <= 0) { clearInterval(iv); iv = null; el.textContent = "0:00"; toast("Time is up! Put your pen down and analyse your answer."); } }, 1000);
  };
  onLeave(() => clearInterval(iv));
  $("#model").onclick = () => {
    const z = $("#modelZone");
    z.innerHTML = z.innerHTML ? "" : `<hr><h3>Model answer (band ${L.target.toFixed(1)}+)</h3><div class="model-answer">${esc(W.model)}</div>`;
  };
  $("#analyze").onclick = () => {
    const text = ta.value.trim();
    if ((text.match(/[A-Za-z]+/g) || []).length < 30) { toast("Write at least 30 words before analysing."); return; }
    const A = analyzeWriting(text, W.minWords, L.target);
    award("writing", idx, A.pct);
    S.writings.unshift({ level: L.id, date: new Date().toISOString(), words: A.wc, band: A.band, pct: A.pct, task: W.type });
    S.writings = S.writings.slice(0, 30); save();
    const crit = [["Task Achievement", A.crit.task], ["Coherence & Cohesion", A.crit.coherence], ["Lexical Resource", A.crit.lexical], ["Grammatical Range", A.crit.grammar]];
    $("#analysis").innerHTML = `<div class="card fade-in" style="margin-top:16px">
      <div class="row"><h3 style="margin:0">Automatic analysis</h3><div class="spacer"></div><span class="muted small" style="font-weight:700">Estimated band</span><span class="score-big" style="font-size:2.4rem;color:${pctColor(A.pct)}">${A.band.toFixed(1)}</span></div>
      ${crit.map(([n, v]) => `<div class="skill-bar"><div class="label"><span>${n}</span><span>${Math.round(v * 100)}%</span></div><div class="bar"><div style="width:${v * 100}%;background:${pctColor(v * 100)}"></div></div></div>`).join("")}
      <ul class="feedback-list" style="margin-top:14px">${A.fb.map(([i, t]) => `<li><span>${i}</span><span>${esc(t)}</span></li>`).join("")}</ul>
      ${A.linkers.length ? `<div class="muted small" style="margin-top:8px;font-weight:700">Linking words found:</div><div>${A.linkers.map(l => `<span class="chip">${esc(l)}</span>`).join("")}</div>` : ""}
      ${A.academic.length ? `<div class="muted small" style="margin-top:8px;font-weight:700">Course vocabulary:</div><div>${A.academic.map(v => `<span class="chip">${esc(v.w)}</span>`).join("")}</div>` : ""}
      <p class="muted small" style="margin-bottom:0;margin-top:12px">⚠️ This estimate is based on indicators (length, structure, linking words, lexical variety). It does not check every grammar mistake, so compare your answer with the model answer too.</p>
    </div>`;
    $("#analysis").scrollIntoView({ behavior: "smooth", block: "start" });
  };
}

/* ---------- Speaking ---------- */
function viewSpeaking(p, part = "2") {
  const L = lvl(), Sp = L.speaking, idx = clampIdx(p, "speaking"), card = Sp.cards[idx];
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  app.innerHTML = `<div class="fade-in">
    ${pageHero("speaking", `Speaking · ${L.id}`, "Speaking: Parts 1, 2 and 3", "Listen to the question, prepare, then speak. Your answer is transcribed and analysed.")}
    ${picker("speaking", idx)}
    <div class="row" style="margin-bottom:14px">
      <div class="tabs">${[["1", "Part 1 · Questions"], ["2", "Part 2 · Cue card"], ["3", "Part 3 · Discussion"]].map(([k, n]) => `<button data-p="${k}" class="${k === part ? "active" : ""}">${n}</button>`).join("")}</div>
    </div>
    ${SR ? "" : `<div class="explain bad" style="margin-bottom:14px">Voice transcription works in <b>Chrome</b> or <b>Edge</b>. Here you can still record yourself and listen back.</div>`}
    <div id="sz"></div></div>`;
  $$("[data-p]").forEach(b => b.onclick = () => { stopSpeak(); cleanups.forEach(f => f()); cleanups = []; viewSpeaking(String(idx), b.dataset.p); });
  const z = $("#sz");

  if (part === "1" || part === "3") {
    const qs = part === "1" ? Sp.part1 : Sp.part3;
    z.innerHTML = `<div class="grid grid-2" style="align-items:start">
      <div class="card"><h3>${part === "1" ? "Part 1 — Introduction (4–5 min)" : "Part 3 — Discussion (4–5 min)"}</h3>
        <p class="muted small">${part === "1" ? "Simple questions about you. Answer in 2–3 sentences: answer + reason + example." : "Abstract questions. Give your opinion, qualify it and justify it: “It depends on…”, “On the whole…”."}</p>
        ${qs.map((q, i) => `<div class="plan-day"><span class="day">Q${i + 1}</span><span class="txt">${esc(q)}</span><div class="spacer"></div><button class="icon-btn" style="width:36px;height:36px" data-say="${esc(q)}" aria-label="Listen to the question">${ic("volume", "sm")}</button></div>`).join("")}
      </div>
      <div class="card"><h3>Your answer</h3><p class="muted small">Listen to a question, then record your answer. Repeat for each question.</p><div id="rec"></div></div>
    </div>`;
    $$("[data-say]", z).forEach(b => b.onclick = () => speak(b.dataset.say, { rate: .95 }));
    recorder($("#rec"), { maxSec: part === "1" ? 60 : 120 });
    return;
  }

  z.innerHTML = `<div class="grid grid-2" style="align-items:start">
    <div class="cue-card"><span class="tag warn">Part 2 — Cue card ${idx + 1}</span>
      <h2 style="margin-top:12px">${esc(card.topic)}</h2>
      <div class="muted" style="font-weight:700">You should say:</div>
      <ul>${card.points.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
      <button class="btn btn-ghost btn-sm" id="sayCue">${ic("volume", "sm")} Listen to the task</button>
      <hr><div class="small muted"><b>Method:</b> 1 minute to prepare (write key words, not sentences), then speak for 1 to 2 minutes without stopping. Follow the order of the points.</div>
    </div>
    <div class="card" id="p2"></div>
  </div>`;
  $("#sayCue").onclick = () => speak(card.topic + " You should say: " + card.points.join(", "), { rate: .95 });
  const p2 = $("#p2");
  p2.innerHTML = `<h3>Step 1 — Preparation</h3><div class="big-timer" id="prepT">1:00</div>
    <textarea id="notes" style="min-height:120px" placeholder="Your notes (key words)…"></textarea>
    <div class="row" style="margin-top:12px"><button class="btn btn-primary" id="prep">${ic("play", "sm")} Start preparation</button><button class="btn btn-ghost" id="ready">I'm ready ${ic("arrow", "sm arrow")}</button></div>`;
  let iv = null; onLeave(() => clearInterval(iv));
  const goSpeak = () => {
    clearInterval(iv);
    const notes = $("#notes").value;
    p2.innerHTML = `<h3>Step 2 — Speak for 2 minutes</h3>
      ${notes.trim() ? `<div class="example" style="white-space:pre-wrap;font-style:normal">${esc(notes)}</div>` : ""}
      <div id="rec" style="margin-top:12px"></div>`;
    recorder($("#rec"), { maxSec: 120, label: "Speak now", onResult: r => {
      if (r.dur < 20) { toast("Speak for at least 20 seconds to complete Part 2."); return; }
      award("speaking", idx, r.pct);
    } });
  };
  $("#prep").onclick = () => {
    let left = 60; $("#prep").disabled = true; $("#notes").focus();
    iv = setInterval(() => { left--; const t = $("#prepT"); if (!t) return; t.textContent = fmt(left); t.style.color = left <= 10 ? "var(--bad)" : ""; if (left <= 0) { toast("Your turn to speak!"); goSpeak(); } }, 1000);
  };
  $("#ready").onclick = goSpeak;
}

/* ---------- Boîte à outils ---------- */
function viewToolkit(p) {
  const exam = p === "exam"; const cur = TOOLKIT.find(t => t.id === p) || (exam ? { id: "exam", color: "#6366f1" } : TOOLKIT[0]);
  app.innerHTML = `<div class="fade-in">
    ${pageHero("toolkit", "Toolkit", "Useful phrases and official scoring", "Ready-to-use expressions for Writing and Speaking, plus common traps to avoid. Click the icon to listen.")}
    <div class="picker" style="--mc:${cur.color}"><a href="#/toolkit/exam" class="pick ${exam ? "active" : ""}" style="--mc:#6366f1"><span class="pnum">${ic("target", "sm")}</span><span class="ptxt"><small>Format, scoring, criteria</small><b>The exam & the score</b></span></a>${TOOLKIT.map(t => `<a href="#/toolkit/${t.id}" class="pick ${t.id === cur.id ? "active" : ""}" style="--mc:${t.color}"><span class="pnum">${ic(t.icon, "sm")}</span><span class="ptxt"><small>${t.groups.length} categories</small><b>${t.title}</b></span></a>`).join("")}</div>
    ${exam ? `<div class="wrap" style="padding:0">${examSectionsHTML()}</div>` : ""}<div class="tool-grid">
      ${(cur.groups || []).map((g, gi) => `<div class="card tool-card reveal" style="--mc:${cur.color};--d:${gi * .05}s">
        <h3>${esc(g.name)}</h3>
        ${g.items.map(([en, fr]) => `<div class="phrase"><div><b>${esc(en)}</b>${fr ? `<span>${esc(fr)}</span>` : ""}</div><button class="icon-btn" data-say="${esc(en.includes("✓") ? en.split("✓")[1] : en.replace(/^✗.*$/, ""))}" aria-label="Listen">${ic("volume", "sm")}</button></div>`).join("")}
      </div>`).join("")}
    </div></div>`;
  bindCalculator(app); bindCriteria(app);
  $$("[data-say]").forEach(b => b.onclick = () => b.dataset.say.trim() && speak(b.dataset.say.replace(/[…→]/g, " "), { rate: .9 }));
}

/* ---------- Progrès ---------- */
function viewProgress() {
  app.innerHTML = `<div>
    ${pageHero("progress", "Tracking", "My progress", "All your scores, tests and essays in one place.",
      `<div class="row"><a class="btn btn-white btn-sm" href="#/test">${ic("refresh", "sm")} Retake the test</a><button class="btn btn-outline-white btn-sm" id="reset">Reset everything</button></div>`)}
    <div class="grid grid-4">
      ${[["chart", "#0f2a4a", S.xp, "Activity points"], ["calendar", "#0f2a4a", S.streak.count, "Day streak"], ["checkc", "#10b981", Object.keys(S.done).length, "Exercises done"], ["pen", "#ec4899", S.writings.length, "Essays written"]]
        .map(([i, c, v, l], k) => `<div class="card kpi lift reveal" style="--d:${k * .06}s;--mc:${c}"><span class="ic-box">${ic(i)}</span><div class="val" data-count="${v}">0</div><div class="lbl">${l}</div></div>`).join("")}
    </div>

    <div class="section-title"><h2>Scores by level</h2></div>
    <div class="lvl-table reveal">${LEVELS.map(l => `<div class="lvl-row"><div class="lid ${l.id === S.level ? "cur" : ""}">${l.id}</div>${MODULES.map(m => { const sc = score(m.key, l.id), d = doneCount(m.key, l.id), n = itemsOf(m.key, l).length; return `<div class="lvl-cell"><small>${m.name}</small><b style="color:${sc === undefined ? "var(--muted)" : pctColor(sc)}">${sc === undefined ? "—" : sc + " %"}</b> <span class="muted small">${d}/${n}</span></div>`; }).join("")}</div>`).join("")}</div>

    <div class="grid grid-2" style="margin-top:28px;align-items:start">
      <div class="card reveal"><div class="card-head"><span class="ic-box" style="--mc:#8b5cf6">${ic("flask")}</span><h3>Test history</h3></div>
        ${S.history.length ? S.history.slice().reverse().map(h => `<div class="plan-day"><span class="tag">${h.level}</span><span class="txt">Band <b>${h.band.toFixed(1)}</b></span><div class="spacer"></div><span class="muted small">${new Date(h.date).toLocaleDateString("en-GB")}</span></div>`).join("") : '<p class="muted">No tests yet.</p>'}
      </div>
      <div class="card reveal" style="--d:.08s"><div class="card-head"><span class="ic-box" style="--mc:#f97316">${ic("pen")}</span><h3>Writing history</h3></div>
        ${S.writings.length ? S.writings.map(w => `<div class="plan-day"><span class="tag">${w.level}</span><span class="txt">${w.task ? esc(w.task) + " · " : ""}${w.words} words · band ≈ <b>${w.band.toFixed(1)}</b></span><div class="spacer"></div><span class="muted small">${new Date(w.date).toLocaleDateString("en-GB")}</span></div>`).join("") : '<p class="muted">No essays analysed yet.</p>'}
      </div>
    </div></div>`;
  $("#reset").onclick = () => {
    if (!confirm("Delete all your progress (test, scores, essays)? This cannot be undone.")) return;
    const theme = S.theme; S = defaults(); S.theme = theme; save(); location.hash = "#/"; render();
  };
}


/* ---------------- Critères : contenu détaillé ---------------- */
const CRIT_DETAILS = {
  writing: [
    {
      bands: {
        5: "Answers the question only partly; the position is unclear or the Task 1 overview is missing. Some ideas are irrelevant or not developed.",
        6: "Covers all parts of the task, but some ideas are not fully developed. A position is given, though it may not always be clear.",
        7: "Covers all parts of the task with a clear position throughout. Main ideas are extended and supported; Task 1 has a clear overview.",
        8: "Fully answers every part of the task with well-developed, relevant and well-supported ideas."
      },
      weak: "Technology is good and bad. Some people like it and some people don't like it. There are many things about technology.",
      strong: "While technology has made communication faster, I believe its effect on young people's concentration is largely negative, as I will explain.",
      why: "The strong version states a clear position and announces what the essay will argue. The weak version is vague and never answers the question.",
      tips: ["Underline every part of the question and check you answer each one.", "State your opinion in the introduction and repeat it in the conclusion.", "Task 1: always write an overview of the 2–3 main trends, without numbers."],
      quiz: [
        { q: "Task 2: “Do the advantages outweigh the disadvantages?” Which introduction ends better?", o: ["…In my view, the advantages clearly outweigh the drawbacks.", "…This essay will talk about this topic.", "…There are advantages and disadvantages.", "…Many people have different opinions."], a: 0, e: "It answers the exact question with a clear position." },
        { q: "Which sentence is a good Task 1 overview?", o: ["Overall, internet access rose sharply everywhere, with Japan highest throughout.", "In 2000, France had 14% and Japan had 30%.", "The chart is about the internet.", "I think the internet is very useful."], a: 0, e: "An overview summarises the main trends without detailed numbers or opinions." }
      ]
    },
    {
      bands: {
        5: "Some organisation, but paragraphs may be missing or confusing. Linking words are limited, repeated or wrong.",
        6: "Information is arranged logically, but linking can be mechanical or repetitive. Paragraphing is not always logical.",
        7: "Ideas are logically organised with clear progression. A range of linking devices is used, with some over- or under-use.",
        8: "Information is sequenced logically; cohesion is managed well and paragraphing is used skilfully."
      },
      weak: "Firstly, cars pollute. Secondly, cars are expensive. Thirdly, cars are dangerous. Fourthly, cars make noise.",
      strong: "Cars are a major source of pollution. This problem is made worse in cities, where traffic jams keep engines running for hours.",
      why: "The strong version links ideas through meaning (“This problem…”, “where…”), not just a list of “Firstly, Secondly”.",
      tips: ["One main idea per paragraph, introduced by a clear topic sentence.", "Use reference words (this, these, such, which) to connect sentences.", "Vary linking words, but never force them: “Moreover” in every sentence lowers your score."],
      quiz: [
        { q: "Which sentence links best to: “Prices rose by 30% in 2022.”?", o: ["This sharp increase led many families to cut spending.", "Moreover, prices rose.", "Firstly, families exist.", "In conclusion, prices."], a: 0, e: "“This sharp increase” refers back to the previous idea — real cohesion." },
        { q: "What is the main problem with “However, … Moreover, … However, … Furthermore, …” in every sentence?", o: ["Mechanical, over-used linking", "Too few linking words", "Spelling mistakes", "Wrong tense"], a: 0, e: "Examiners penalise linking that is mechanical or over-used." }
      ]
    },
    {
      bands: {
        5: "Limited vocabulary, often repeated. Noticeable spelling and word-formation errors that may cause difficulty for the reader.",
        6: "Adequate range for the task. Some less common words are attempted, with some errors in word choice or spelling.",
        7: "Enough range for flexibility and precision. Uses less common words and collocations, with occasional errors.",
        8: "A wide range used fluently and flexibly to convey precise meanings, with only rare errors."
      },
      weak: "There are a lot of bad things about pollution and it is a big problem for people's health.",
      strong: "Air pollution poses a serious threat to public health, contributing to respiratory diseases in densely populated areas.",
      why: "The strong version uses precise collocations (“poses a serious threat”, “densely populated”) instead of vague words like “bad things” and “big”.",
      tips: ["Replace vague words: thing, stuff, good, bad, big, a lot of.", "Learn collocations, not single words: “pose a threat”, “play a role”.", "Paraphrase the question instead of copying its words."],
      quiz: [
        { q: "Which is the most precise and academic?", o: ["Unemployment rose significantly.", "Unemployment got very big.", "There were a lot more jobless people.", "Unemployment became bad."], a: 0, e: "“rose significantly” is a natural, precise collocation." },
        { q: "Which collocation is correct?", o: ["to draw a conclusion", "to make a conclusion", "to do a conclusion", "to take a conclusion"], a: 0, e: "We “draw” or “reach” a conclusion." }
      ]
    },
    {
      bands: {
        5: "Mostly simple sentences; complex sentences are attempted but often inaccurate. Frequent errors in grammar and punctuation.",
        6: "A mix of simple and complex sentences, with some errors that rarely reduce communication.",
        7: "A variety of complex structures; frequent error-free sentences, with a few errors.",
        8: "A wide range of structures; the majority of sentences are error-free."
      },
      weak: "Many people move to cities. They want jobs. The cities become crowded. It is a problem.",
      strong: "Because many people move to cities in search of work, urban areas are becoming increasingly crowded, which puts pressure on housing.",
      why: "The strong version combines ideas with a subordinate clause, a passive-like structure and a relative clause — and stays accurate.",
      tips: ["Combine short sentences with because, although, which, while.", "Use a few passives and conditionals, but only if you can make them accurate.", "Keep 3 minutes at the end to check articles, plurals and verb agreement."],
      quiz: [
        { q: "Which sentence is both complex and correct?", o: ["Although prices rose, demand remained high.", "Although prices rose, but demand remained high.", "Prices rose, demand remained high although.", "Despite prices rose, demand remained high."], a: 0, e: "“Although” is not used with “but”, and “despite” needs a noun." },
        { q: "Which sentence has an error?", o: ["The informations are useful.", "The information is useful.", "This research is useful.", "The advice was useful."], a: 0, e: "“information” is uncountable: no -s, singular verb." }
      ]
    }
  ],
  speaking: [
    {
      bands: {
        5: "Usually keeps going, but relies on repetition, self-correction or slow speech. Simple linking is overused.",
        6: "Willing to speak at length, though coherence may be lost at times because of hesitation or repetition.",
        7: "Speaks at length without noticeable effort. Some hesitation, but uses a range of connectives flexibly.",
        8: "Speaks fluently with only rare repetition or self-correction; develops topics coherently."
      },
      weak: "Um… I like… um… my city. It's… er… nice. Yes.",
      strong: "I really like my city, mainly because it's right by the sea, so in summer I can go swimming after work, which is great for switching off.",
      why: "The strong answer keeps going naturally: answer + reason + example, linked with “because”, “so”, “which”.",
      tips: ["Use the formula: answer + reason + example.", "Replace “um” with a short silent pause or a phrase like “Let me think…”.", "Practise talking for 2 minutes non-stop with the Part 2 timer."],
      quiz: [
        { q: "“Do you like reading?” Which answer is most fluent?", o: ["Yes, especially novels — they help me relax after a long day at university.", "Yes.", "Um… yes… er… books.", "Reading is reading."], a: 0, e: "A direct answer, extended with a reason." },
        { q: "What is the best way to gain thinking time?", o: ["“That's an interesting question…”", "Saying “um” many times", "Staying silent for 10 seconds", "Changing the subject"], a: 0, e: "A natural phrase keeps you fluent while you think." }
      ]
    },
    {
      bands: {
        5: "Manages familiar topics, but with limited flexibility on unfamiliar ones. Rarely paraphrases.",
        6: "Has a wide enough vocabulary to discuss topics at length; generally paraphrases successfully.",
        7: "Uses vocabulary flexibly on many topics, with some less common and idiomatic words.",
        8: "A wide, flexible range used to convey precise meaning; skilful use of idiomatic language."
      },
      weak: "My hometown is good. There are good places and good food. People are good.",
      strong: "My hometown is quite laid-back — there's a lively old market, the food is fantastic, and people are really welcoming.",
      why: "The strong answer replaces “good” three times with precise, natural words (laid-back, lively, welcoming).",
      tips: ["Prepare topic vocabulary: hometown, work, studies, technology, environment.", "If you forget a word, paraphrase it: “the thing you use to…”.", "Use a few natural idioms, but never force them."],
      quiz: [
        { q: "Which word best replaces “very good” for a holiday?", o: ["unforgettable", "goodly", "very nice good", "ok"], a: 0, e: "Precise adjectives score higher than “very + basic word”." },
        { q: "You forget the word “umbrella”. What should you do?", o: ["Paraphrase: “the thing you hold over your head when it rains”", "Stop talking", "Say the word in French or Arabic", "Change topic"], a: 0, e: "Paraphrasing shows lexical flexibility." }
      ]
    },
    {
      bands: {
        5: "Basic sentence forms are fairly accurate; complex structures are limited and usually contain errors.",
        6: "A mix of simple and complex structures, with frequent mistakes in complex ones that rarely cause problems.",
        7: "A range of complex structures used with some flexibility; frequent error-free sentences.",
        8: "A wide range of structures used flexibly; most sentences are error-free."
      },
      weak: "When I was child, I go to my grandmother house every summer and we was very happy.",
      strong: "When I was a child, I used to spend every summer at my grandmother's house, which is where I learned to cook.",
      why: "The strong answer is accurate (past tenses, articles, possessive) and adds “used to” and a relative clause.",
      tips: ["Practise past tenses for Part 2 stories (past simple, used to, past continuous).", "Add relative clauses and conditionals naturally.", "Record yourself and note your 3 most frequent mistakes."],
      quiz: [
        { q: "Which sentence is correct?", o: ["If I had more time, I would travel more.", "If I would have more time, I travel more.", "If I have more time, I would travel more.", "If I had more time, I will travel more."], a: 0, e: "Second conditional: If + past simple, would + base verb." },
        { q: "Which sentence is correct?", o: ["I have lived here since 2018.", "I live here since 2018.", "I am living here since 2018.", "I lived here since 2018."], a: 0, e: "“since” + an action that continues → present perfect." }
      ]
    },
    {
      bands: {
        5: "Shows some features of good pronunciation, but mispronunciations often reduce clarity.",
        6: "Generally understood, though some words or sounds are mispronounced at times.",
        7: "Easy to understand; uses features like stress and intonation effectively, with some lapses.",
        8: "Easy to understand throughout; the accent has minimal effect on intelligibility."
      },
      weak: "I am inTERESted in phoTOgraphy. (stress on the wrong syllables, flat intonation)",
      strong: "I'm REALly INterested in phoTOGraphy — it's my FAvourite hobby. (natural stress, contractions, rising and falling intonation)",
      why: "Correct word stress and natural intonation make you easier to understand. Your accent itself is never penalised.",
      tips: ["Learn the stress of common words: PHOtograph, phoTOgraphy, photoGRAphic.", "Use contractions when speaking: I'm, it's, don't.", "Shadow native speakers: listen, then repeat at the same speed."],
      quiz: [
        { q: "Where is the stress in “photography”?", o: ["pho-TO-gra-phy", "PHO-to-gra-phy", "pho-to-GRA-phy", "pho-to-gra-PHY"], a: 0, e: "The stress is on the second syllable: phoTOgraphy." },
        { q: "Is a strong Algerian or French accent penalised?", o: ["No — only clarity matters", "Yes, always", "Only in Part 1", "Only for band 9"], a: 0, e: "Examiners judge how easy you are to understand, not your accent." }
      ]
    }
  ]
};

function bindCriteria(root = document) {
  $$("[data-crit]", root).forEach(b => b.onclick = () => { const [k, i] = b.dataset.crit.split(":"); openCriterion(k, +i); });
}
function openCriterion(k, i) {
  const [name, short] = CRITERIA[k][i], D = CRIT_DETAILS[k][i];
  const m = openModal(`<div class="modal-head" style="--img:url('${photo(k, 900)}')"><span class="eyebrow">${k === "writing" ? "Writing" : "Speaking"} · criterion 0${i + 1} · 25%</span><h2>${esc(name)}</h2><p>${esc(short)}</p></div>
    <div class="modal-body">
      <div class="crit-tabs" role="tablist">${["Band levels", "Weak vs strong", "How to improve", "Quick check"].map((t, j) => `<button data-ct="${j}" class="${j ? "" : "active"}">${t}</button>`).join("")}</div>
      <div class="crit-pane" data-cp="0">
        <p class="muted">Click a band to see what the examiner expects for <b>${esc(name)}</b>.</p>
        <div class="band-btns">${[5, 6, 7, 8].map(b => `<button data-b="${b}" class="${b === 7 ? "active" : ""}">Band ${b}</button>`).join("")}</div>
        <div class="band-desc" id="bDesc"></div>
      </div>
      <div class="crit-pane" data-cp="1" hidden>
        <div class="vs">
          <div class="vs-card weak"><span class="tag bad">Weaker answer</span><p>${esc(D.weak)}</p></div>
          <div class="vs-card strong"><span class="tag good">Stronger answer</span><p>${esc(D.strong)}</p>${k === "speaking" ? `<button class="btn btn-ghost btn-sm" id="sayStrong">${ic("volume", "sm")} Listen</button>` : ""}</div>
        </div>
        <div class="why"><b>Why it scores higher:</b> ${esc(D.why)}</div>
      </div>
      <div class="crit-pane" data-cp="2" hidden>
        <ol class="improve">${D.tips.map(t => `<li>${esc(t)}</li>`).join("")}</ol>
      </div>
      <div class="crit-pane" data-cp="3" hidden><div id="cQuiz"></div></div>
    </div>
    <div class="modal-foot"><span class="muted small">${i > 0 ? `<button class="link-btn" data-nav="${i - 1}">← ${esc(CRITERIA[k][i - 1][0])}</button>` : ""}${i < 3 ? `<button class="link-btn" data-nav="${i + 1}">${esc(CRITERIA[k][i + 1][0])} →</button>` : ""}</span>
      <button class="btn btn-primary" id="cPractice">Practise ${k === "writing" ? "Writing" : "Speaking"} ${ic("arrow", "arrow")}</button></div>`, "wide");
  const showBand = b => { $$(".band-btns button", m).forEach(x => x.classList.toggle("active", +x.dataset.b === b)); const d = $("#bDesc", m); d.classList.remove("swap"); void d.offsetWidth; d.classList.add("swap"); d.innerHTML = `<div class="bd-num">${b}</div><p>${esc(D.bands[b])}</p>`; };
  $$(".band-btns button", m).forEach(x => x.onclick = () => showBand(+x.dataset.b)); showBand(7);
  let quizStarted = false;
  $$("[data-ct]", m).forEach(t => t.onclick = () => {
    $$("[data-ct]", m).forEach(x => x.classList.toggle("active", x === t));
    $$("[data-cp]", m).forEach(p => p.hidden = p.dataset.cp !== t.dataset.ct);
    if (t.dataset.ct === "3" && !quizStarted) { quizStarted = true; stepQuiz($("#cQuiz", m), D.quiz, (pct, c, n) => { $("#cQuiz", m).innerHTML = demoResult(pct, c, n); }); }
  });
  const say = $("#sayStrong", m); if (say) say.onclick = () => speak(D.strong.replace(/\(.*?\)/g, ""), { rate: .95 });
  $$("[data-nav]", m).forEach(b => b.onclick = () => openCriterion(k, +b.dataset.nav));
  $("#cPractice", m).onclick = () => { closeModal(); startModule(k); };
}


/* ---------------- Livres Collins English for IELTS ---------------- */
const COLLINS_SEARCH = q => `https://collins.co.uk/search?q=${encodeURIComponent(q)}`;
const BOOKS = [
  { id: "gr-reading", series: "Get Ready for IELTS", title: "Get Ready for IELTS Reading", tier: "start", band: "IELTS 4+ (A2+)", skill: "reading", color: "#0f766e",
    url: "https://collins.co.uk/products/9780007460649",
    about: "Builds the basic reading skills you need before IELTS-style passages: skimming, scanning and understanding the main question types step by step.",
    how: "Do one unit, then a Reading passage on this site at A2 or B1 level to apply the same strategy." },
  { id: "gr-listening", series: "Get Ready for IELTS", title: "Get Ready for IELTS Listening", tier: "start", band: "IELTS 4+ (A2+)", skill: "listening", color: "#0e7490",
    url: "https://collins.co.uk/products/9780008765422",
    about: "Comes with audio and trains you on everyday situations, numbers, spelling and short talks, for learners starting from around band 3–4.",
    how: "After each unit, practise a recording on this site at 0.8× speed, then again at 1×." },
  { id: "gr-writing", series: "Get Ready for IELTS", title: "Get Ready for IELTS Writing", tier: "start", band: "IELTS 4+ (A2+)", skill: "writing", color: "#b45309",
    url: COLLINS_SEARCH("Get Ready for IELTS Writing"),
    about: "Introduces Task 1 and Task 2 with simple models: organising paragraphs, describing a chart and giving a clear opinion.",
    how: "Write the matching Task on this site and use the automatic analysis to check length, paragraphs and linking words." },
  { id: "gr-speaking", series: "Get Ready for IELTS", title: "Get Ready for IELTS Speaking", tier: "start", band: "IELTS 4+ (A2+)", skill: "speaking", color: "#7c3aed",
    url: "https://collins.co.uk/products/9780008765446",
    about: "Comes with audio and helps you answer Part 1 questions, prepare a Part 2 talk and gain confidence speaking for longer.",
    how: "Record yourself on this site's Speaking module and compare your speed and fillers week by week." },
  { id: "sk-reading", series: "Collins English for IELTS", title: "Reading for IELTS", tier: "skills", band: "IELTS 5–6+ (B1+)", skill: "reading", color: "#047857",
    url: "https://collins.co.uk/products/9780008367503",
    about: "For learners whose reading is holding back their score: exam strategies, all the question types and timed practice on academic texts.",
    how: "Use it alongside the B1 and B2 Reading passages on this site and keep to 20 minutes per passage." },
  { id: "sk-listening", series: "Collins English for IELTS", title: "Listening for IELTS", tier: "skills", band: "IELTS 5–6+ (B1+)", skill: "listening", color: "#be185d",
    url: COLLINS_SEARCH("Listening for IELTS"),
    about: "Covers the four parts of the Listening test, with audio and strategies for predicting answers and avoiding distractors.",
    how: "Pair each unit with a B1/B2 recording on this site, listening only once at 1× speed." },
  { id: "sk-writing", series: "Collins English for IELTS", title: "Writing for IELTS", tier: "skills", band: "IELTS 5–6+ (B1+)", skill: "writing", color: "#c2410c",
    url: "https://collins.co.uk/products/9780008367534",
    about: "For Academic candidates at band 5–5.5 aiming for 6 or higher: Task 1 data description and Task 2 essay structure, with model answers.",
    how: "After each unit, write the same type of task here and compare with the model answer on this site." },
  { id: "sk-speaking", series: "Collins English for IELTS", title: "Speaking for IELTS", tier: "skills", band: "IELTS 5–6+ (B1+)", skill: "speaking", color: "#6d28d9",
    url: COLLINS_SEARCH("Speaking for IELTS"),
    about: "Topic-based units with audio for all three parts of the Speaking test, focusing on fluency and developing answers.",
    how: "Practise the same topic with a cue card on this site and check your transcript for repeated words." },
  { id: "sk-vocab", series: "Collins English for IELTS", title: "IELTS Vocabulary", tier: "skills", band: "IELTS 5–6+ (B1+)", skill: "vocab", color: "#a16207",
    url: "https://collins.co.uk/products/9780007456826",
    about: "Topic vocabulary for the exam, with answers and audio, aimed at learners around band 5–5.5 who want band 6 or higher.",
    how: "Add new words to your flashcard routine and reuse them in your next Writing task." },
  { id: "sk-grammar", series: "Collins English for IELTS", title: "IELTS Grammar", tier: "skills", band: "IELTS 5–6+ (B1+)", skill: "grammar", color: "#1d4ed8",
    url: "https://collins.co.uk/collections/all/products/9780007456833",
    about: "The grammar that matters most for IELTS, with answers, to improve accuracy and range in Writing and Speaking.",
    how: "Study a unit, then complete the matching grammar lesson on this site to test yourself." },
  { id: "practice", series: "Collins English for IELTS", title: "Practice Tests for IELTS", tier: "tests", band: "All levels", skill: "all", color: "#141414",
    url: COLLINS_SEARCH("Practice Tests for IELTS"),
    about: "Full practice tests in exam conditions, useful in the final weeks to check your timing and your overall band.",
    how: "Mark Listening and Reading out of 40, then use the score calculator on this site to estimate your overall band." }
];
const BOOK_TIERS = { start: "Starting out · band 4", skills: "Skills · band 5–6+", tests: "Exam practice" };
const SKILL_LABEL = { reading: "Reading", listening: "Listening", writing: "Writing", speaking: "Speaking", vocab: "Vocabulary", grammar: "Grammar", all: "All skills" };

function viewBooks() {
  S.books = S.books || {};
  const owned = BOOKS.filter(b => S.books[b.id]).length, done = BOOKS.filter(b => S.books[b.id] === "done").length;
  app.innerHTML = `<div class="${S.level ? "" : "wrap"}" style="${S.level ? "" : "padding-top:30px;padding-bottom:60px"}">
    ${pageHero("vocab", "Revise with books", "Collins English for IELTS", "A guide to the Collins books for IELTS: which one to choose for your level, what each covers, and how to use it with the exercises on this site.",
      `<div class="hero-timer"><div class="small">My reading list</div><span class="timer">${done}/${owned || 0}</span></div>`)}
    <div class="free-books"><div class="sec-head" style="margin-bottom:20px"><span class="eyebrow">Free</span><h2>IELTS Pro study books — free for every level</h2><p>Read online or save as PDF. Your placement test tells you which one to start with.</p></div>
      <div class="fb-grid">${LEVELS.map(l => `<a class="fb-card" href="#/book/${l.id}" style="--bc:${BOOK_COLORS[l.id]}"><div class="b3-cover small"><span>IELTS Pro · free</span><b>${l.id}</b><em>${l.name}</em></div><div><b>${l.id} study book</b><span>Band ${l.band} · ${S.placement && S.placement.level === l.id ? "recommended for you" : buildBook(l).length + " chapters"}</span></div></a>`).join("")}</div></div>
    <h2 class="paid-title">Collins English for IELTS <span>(paid books, optional)</span></h2>
    <div class="books-intro">
      <p>These books are sold by the publisher HarperCollins and are not included on this site. Use the links to see each book on <b>collins.co.uk</b>. Mark the ones you have so you can track your progress.</p>
      <div class="book-progress"><div class="row small" style="font-weight:700"><span>${owned} book${owned === 1 ? "" : "s"} in my list</span><div class="spacer"></div><span>${done} finished</span></div><div class="bar"><div style="width:${owned ? done / owned * 100 : 0}%;background:var(--red)"></div></div></div>
    </div>

    <div class="book-filters">
      <div class="filter-group"><span>Level</span>${[["all", "All"], ["start", "Band 4"], ["skills", "Band 5–6+"], ["tests", "Practice tests"]].map(([k, n], i) => `<button data-tier="${k}" class="${i ? "" : "active"}">${n}</button>`).join("")}</div>
      <div class="filter-group"><span>Skill</span>${[["all", "All"], ["reading", "Reading"], ["listening", "Listening"], ["writing", "Writing"], ["speaking", "Speaking"], ["vocab", "Vocabulary"], ["grammar", "Grammar"]].map(([k, n], i) => `<button data-skill="${k}" class="${i ? "" : "active"}">${n}</button>`).join("")}</div>
    </div>

    <div class="book-grid">
      ${BOOKS.map((b, i) => `<article class="book reveal" data-t="${b.tier}" data-s="${b.skill}" style="--bc:${b.color};--d:${(i % 4) * .06}s">
        <div class="cover"><span class="c-series">${esc(b.series)}</span><b>${esc(b.title)}</b><span class="c-band">${esc(b.band)}</span></div>
        <div class="book-body">
          <div class="row" style="gap:6px"><span class="tag neutral">${BOOK_TIERS[b.tier]}</span><span class="tag">${SKILL_LABEL[b.skill]}</span></div>
          <h3>${esc(b.title)}</h3>
          <p>${esc(b.about)}</p>
          <div class="book-how"><b>How to use it here:</b> ${esc(b.how)}</div>
          <div class="book-actions">
            <div class="own" role="group" aria-label="My list">
              <button data-own="${b.id}" data-v="have" class="${S.books[b.id] === "have" ? "on" : ""}">I have it</button>
              <button data-own="${b.id}" data-v="done" class="${S.books[b.id] === "done" ? "on" : ""}">Finished</button>
            </div>
            <a class="btn btn-ghost btn-sm" href="${b.url}" target="_blank" rel="noopener">View on collins.co.uk ${ic("arrow", "sm arrow")}</a>
            ${b.skill === "all" ? `<button class="btn btn-primary btn-sm" data-go-calc>Score calculator</button>` : `<button class="btn btn-primary btn-sm" data-practise="${b.skill}">Practise ${SKILL_LABEL[b.skill]}</button>`}
          </div>
        </div>
      </article>`).join("")}
    </div>

    <section class="sec" style="padding-bottom:0">
      <div class="sec-head reveal"><span class="eyebrow">Revision plan</span><h2>Books + this site, step by step</h2><p>A simple order to follow, depending on your band from the placement test.</p></div>
      <div class="plan-steps">
        ${[["01", "Band 3.5–4.5", "Get Ready for IELTS", "Start with the Get Ready books for your weakest skill. On this site, work through the A2 course and do one exercise a day.", "start"],
           ["02", "Band 5–6", "Skills books", "Move to Reading, Listening, Writing and Speaking for IELTS, plus IELTS Grammar and IELTS Vocabulary. On this site, follow the B1 then B2 course.", "skills"],
           ["03", "Final 4–6 weeks", "Practice Tests", "Do one full practice test per week in exam conditions, then revise your weak points with the C1 course and the Toolkit.", "tests"]]
          .map(([n, b, t, d, tier], i) => `<div class="pstep reveal" style="--d:${i * .12}s"><div class="pnum-big">${n}</div><span class="tag">${b}</span><h3>${t}</h3><p>${d}</p><button class="link-btn" data-tier-jump="${tier}">See these books →</button></div>`).join("")}
      </div>
    </section>
  </div>`;
  let tier = "all", skill = "all";
  const apply = () => $$(".book", app).forEach(c => { const ok = (tier === "all" || c.dataset.t === tier) && (skill === "all" || c.dataset.s === skill || c.dataset.s === "all"); c.classList.toggle("hide", !ok); if (ok) c.classList.add("in"); });
  $$("[data-tier]", app).forEach(b => b.onclick = () => { tier = b.dataset.tier; $$("[data-tier]", app).forEach(x => x.classList.toggle("active", x === b)); apply(); });
  $$("[data-skill]", app).forEach(b => b.onclick = () => { skill = b.dataset.skill; $$("[data-skill]", app).forEach(x => x.classList.toggle("active", x === b)); apply(); });
  $$("[data-tier-jump]", app).forEach(b => b.onclick = () => { $(`[data-tier="${b.dataset.tierJump}"]`, app).click(); $(".book-filters", app).scrollIntoView({ behavior: "smooth", block: "start" }); });
  $$("[data-own]", app).forEach(b => b.onclick = () => { const id = b.dataset.own, v = b.dataset.v; S.books[id] = S.books[id] === v ? undefined : v; if (!S.books[id]) delete S.books[id]; save(); const y = scrollY; viewBooks(); initReveal(); $$(".book", app).forEach(c => c.classList.add("in")); scrollTo(0, y); toast(S.books[id] === "done" ? "Book marked as finished" : S.books[id] ? "Added to your reading list" : "Removed from your list"); });
  $$("[data-practise]", app).forEach(b => b.onclick = () => startModule(b.dataset.practise));
  $$("[data-go-calc]", app).forEach(b => b.onclick = () => { location.hash = S.level ? "#/toolkit/exam" : "#/"; setTimeout(() => document.getElementById("score")?.scrollIntoView({ behavior: "smooth" }), 400); });
}


/* ---------------- Livres de révision gratuits (IELTS Pro) ---------------- */
const FREE_RESOURCES = [
  ["IELTS — official preparation resources", "Free sample questions and practice materials from the IELTS partners.", "https://ielts.org/take-a-test/preparation-resources"],
  ["IDP IELTS — Prepare", "Free practice tests, videos and preparation tips.", "https://ielts.idp.com/prepare"],
  ["BBC Learning English — 6 Minute English", "Short British English podcasts with transcripts, ideal for Listening.", "https://www.bbc.co.uk/learningenglish/english/features/6-minute-english"]
];
const BOOK_COLORS = { A2: "#0f766e", B1: "#1d4ed8", B2: "#c2410c", C1: "#7c3aed" };

function buildBook(L) {
  const ch = [];
  const answerBox = (txt) => `<details class="ans-box"><summary>Show answer</summary><div>${txt}</div></details>`;
  const quizBlock = (qs) => `<ol class="book-ex">${qs.map(q => `<li><p>${esc(q.q)}</p><div class="opts">${q.o.map((o, i) => `<span>${"abcd"[i]}) ${esc(o)}</span>`).join("")}</div>${answerBox(`<b>${esc(q.o[q.a])}</b>${q.e ? " — " + esc(q.e) : ""}`)}</li>`).join("")}</ol>`;
  // NB : dans les données, la bonne réponse est toujours la 1re option (elles sont mélangées à l'écran) → on mélange ici de façon stable.
  const shuffled = qs => qs.map((q, k) => { if (q.noShuffle) return q; const order = q.o.map((_, i) => i); const rot = (k * 3 + 1) % order.length; const o = order.slice(rot).concat(order.slice(0, rot)); return { ...q, o: o.map(i => q.o[i]), a: o.indexOf(q.a) }; });

  ch.push({ kicker: "Welcome", title: `Your ${L.id} study book`, html: `
    <p class="lead-p">This free book goes with the <b>${L.id} — ${L.name}</b> course on IELTS Pro (band ${L.band}). Your target is <b>band ${L.target.toFixed(1)}</b>.</p>
    <p>${esc(L.goal)}</p>
    <h3>How to use this book</h3>
    <ol><li>Read one chapter a day, in order.</li><li>Do the exercises <b>before</b> opening the answers.</li><li>After each chapter, do the matching exercise on the site to check your progress.</li><li>Keep a notebook of new words and your own mistakes.</li></ol>
    <h3>Your 7-day plan</h3>
    <ul class="plan-list">${PLAN.map(p => `<li><b>${p.day}</b> ${esc(p.txt)}</li>`).join("")}</ul>
    <h3>Key advice for your level</h3>
    <ul>${L.tips.map(t => `<li>${esc(t)}</li>`).join("")}</ul>` });

  L.grammar.forEach((g, i) => ch.push({ kicker: `Grammar ${i + 1}`, title: g.title, html: `
    ${g.html}
    <h3>Examples</h3>${g.examples.map(e => `<p class="ex-line">${esc(e)}</p>`).join("")}
    <div class="book-warn"><b>Common mistake:</b> ${esc(g.tip)}</div>
    <h3>Exercises</h3>${quizBlock(shuffled(g.quiz))}` }));

  L.vocab.forEach((set, i) => ch.push({ kicker: `Vocabulary ${i + 1}`, title: set.title, html: `
    <p>Learn each word with its example. Cover the definition and test yourself, then write your own sentence.</p>
    <div class="word-list">${set.words.map(v => `<div class="wl"><b>${esc(v.w)}</b><span class="fr">${esc(v.fr)}</span><p>${esc(v.d)}</p><em>${esc(v.ex)}</em></div>`).join("")}</div>
    <h3>Check yourself</h3>
    <ol class="book-ex">${set.words.slice(0, 6).map(v => `<li><p>Which word means: “${esc(v.d)}”?</p>${answerBox(`<b>${esc(v.w)}</b> — ${esc(v.ex)}`)}</li>`).join("")}</ol>` }));

  const R = L.reading[0];
  ch.push({ kicker: "Reading", title: "Reading strategies", html: `
    <h3>The method</h3>
    <ol><li><b>Read the questions first</b> and underline the key words.</li><li><b>Skim</b> the passage in 1–2 minutes to understand each paragraph's main idea.</li><li><b>Scan</b> for names, numbers and paraphrases of your key words.</li><li>For <b>True / False / Not Given</b>: False = the text says the opposite; Not Given = the text does not say.</li><li>Keep to about <b>20 minutes per passage</b>.</li></ol>
    <h3>Practice passage: ${esc(R.title)}</h3>
    <div class="book-passage">${paras(R.text)}</div>
    <h3>Questions</h3>${quizBlock(shuffled(R.questions))}` });

  const Li = L.listening[0];
  ch.push({ kicker: "Listening", title: "Listening strategies", html: `
    <h3>The method</h3>
    <ol><li>Use the reading time to <b>predict</b> the type of answer: a number, a name, a place?</li><li>Listen for <b>paraphrases</b>, not the exact words of the question.</li><li>Watch out for <b>corrections</b>: “sorry, I mean…” — the last information is the answer.</li><li>Check <b>spelling and plurals</b>: a wrong spelling is a wrong answer.</li></ol>
    <h3>Transcript practice: ${esc(Li.title)}</h3>
    <p>Play this recording on the site first. Then read the transcript and underline the answers.</p>
    <div class="book-passage">${esc(Li.script)}</div>
    <h3>Questions</h3>${quizBlock(shuffled(Li.questions))}` });

  ch.push({ kicker: "Writing", title: "Writing: tasks and model answers", html: `
    <p>Task 1 (about 20 minutes, 150+ words) describes data. Task 2 (about 40 minutes, 250+ words) is an essay and counts <b>double</b>.</p>
    ${L.writing.map((w, i) => `<h3>${i + 1}. ${esc(w.type)}</h3><p class="book-prompt">${esc(w.prompt)}</p>
      <ul>${w.tips.map(t => `<li>${esc(t)}</li>`).join("")}</ul>
      <p><b>Try it yourself first</b>, then compare with the model answer.</p>
      <details class="ans-box"><summary>Show model answer</summary><div class="model-answer">${esc(w.model)}</div></details>`).join("")}` });

  const SP = L.speaking;
  ch.push({ kicker: "Speaking", title: "Speaking: questions and cue cards", html: `
    <h3>Part 1 — about you (4–5 minutes)</h3><ul>${SP.part1.map(q => `<li>${esc(q)}</li>`).join("")}</ul>
    <h3>Part 2 — cue cards (1 minute to prepare, 2 minutes to speak)</h3>
    ${SP.cards.map(c => `<div class="book-cue"><b>${esc(c.topic)}</b><p>You should say:</p><ul>${c.points.map(p => `<li>${esc(p)}</li>`).join("")}</ul></div>`).join("")}
    <h3>Part 3 — discussion</h3><ul>${SP.part3.map(q => `<li>${esc(q)}</li>`).join("")}</ul>
    <h3>Useful phrases</h3>
    ${TOOLKIT.find(t => t.id === "speaking").groups.map(g => `<p><b>${esc(g.name)}:</b> ${g.items.map(x => esc(x[0])).join(" · ")}</p>`).join("")}` });

  const errs = TOOLKIT.find(t => t.id === "errors");
  ch.push({ kicker: "Accuracy", title: "Common mistakes to avoid", html: `
    <p>These mistakes appear again and again in IELTS answers. Learn the correct form and check your own writing for them.</p>
    ${errs.groups.map(g => `<h3>${esc(g.name)}</h3><ul>${g.items.map(([a, b]) => `<li>${esc(a)}${b ? ` <span class="muted">(${esc(b)})</span>` : ""}</li>`).join("")}</ul>`).join("")}
    <h3>Useful phrases for Writing</h3>
    ${["task1", "task2"].map(id => TOOLKIT.find(t => t.id === id)).map(t => `<p><b>${esc(t.title)}:</b> ${t.groups.map(g => g.items.slice(0, 2).map(x => esc(x[0])).join(" · ")).join(" · ")}</p>`).join("")}` });

  ch.push({ kicker: "Next steps", title: "Free official resources", html: `
    <p>When you finish this book, take a full practice test in exam conditions. These resources are <b>free</b>:</p>
    <div class="res-list">${FREE_RESOURCES.map(([t, d, u]) => `<a class="res" href="${u}" target="_blank" rel="noopener"><b>${esc(t)}</b><span>${esc(d)}</span><small>${u.replace(/^https:\/\//, "")}</small></a>`).join("")}</div>
    <p>Then come back to IELTS Pro, finish every exercise of your level at 70% and move up to the next level.</p>` });
  return ch;
}

function viewBook(p) {
  const parts = (location.hash.replace(/^#\/?/, "").split("/"));
  const L = LEVELS.find(l => l.id === (parts[1] || p)) || lvl() || LEVELS[0];
  const chapters = buildBook(L);
  S.bookRead = S.bookRead || {}; S.bookRead[L.id] = S.bookRead[L.id] || [];
  let cur = Math.min(chapters.length - 1, Math.max(0, parseInt(parts[2], 10) || S.bookRead[L.id].lastPage || 0));
  const color = BOOK_COLORS[L.id];
  app.innerHTML = `<div class="${S.level ? "" : "wrap"}" style="${S.level ? "" : "padding-top:30px;padding-bottom:60px"}">
    <div class="book-top" style="--bc:${color}">
      <div class="book-3d"><div class="b3-cover"><span>IELTS Pro · free study book</span><b>${L.id}</b><em>${L.name}</em><small>Band ${L.band} → ${L.target.toFixed(1)}</small></div></div>
      <div>
        <span class="eyebrow">Free study book</span><h1 class="book-h1">${L.id} — ${L.name}</h1>
        <p class="muted">${chapters.length} chapters · grammar, vocabulary, the four skills, model answers and an answer key. Free to read online or save as PDF.</p>
        <div class="bar" style="max-width:420px;margin:14px 0 6px"><div id="bookBar" style="background:var(--red)"></div></div>
        <div class="small muted" id="bookProg"></div>
        <div class="row" style="margin-top:16px">
          <button class="btn btn-primary" id="bkPdf">${ic("arrow", "sm")} Save as PDF</button>
          <div class="lvl-switch-books">${LEVELS.map(l => `<a href="#/book/${l.id}" class="${l.id === L.id ? "on" : ""}">${l.id}</a>`).join("")}</div>
        </div>
      </div>
    </div>
    <div class="reader">
      <nav class="toc" aria-label="Chapters">${chapters.map((c, i) => `<button data-ch="${i}"><span class="tn">${String(i + 1).padStart(2, "0")}</span><span><small>${esc(c.kicker)}</small>${esc(c.title)}</span><i class="tick-dot"></i></button>`).join("")}</nav>
      <div class="sheet-wrap">
        <article class="sheet" id="sheet"></article>
        <div class="sheet-nav"><button class="btn btn-ghost" id="bkPrev">← Previous</button><span class="small muted" id="bkCount"></span><button class="btn btn-primary" id="bkNext">Next →</button></div>
      </div>
    </div>
    <div id="printBook" class="print-only"></div>
  </div>`;
  const show = (i, dir = 0) => {
    cur = i; const c = chapters[i];
    if (!S.bookRead[L.id].includes(i)) S.bookRead[L.id].push(i);
    S.bookRead[L.id].lastPage = i; save();
    const sh = $("#sheet"); sh.className = "sheet " + (dir > 0 ? "turn-next" : dir < 0 ? "turn-prev" : "turn-in");
    sh.innerHTML = `<div class="sheet-kicker">Chapter ${i + 1} · ${esc(c.kicker)}</div><h2>${esc(c.title)}</h2>${c.html}<div class="sheet-foot">${L.id} study book · page ${i + 1}</div>`;
    $$(".toc button").forEach((b, k) => { b.classList.toggle("active", k === i); b.classList.toggle("read", S.bookRead[L.id].includes(k)); });
    $("#bkPrev").disabled = i === 0;
    $("#bkNext").textContent = i === chapters.length - 1 ? "Practise on the site →" : "Next →";
    $("#bkCount").textContent = `${i + 1} / ${chapters.length}`;
    const n = S.bookRead[L.id].length; $("#bookBar").style.width = (n / chapters.length * 100) + "%";
    $("#bookProg").textContent = `${n} of ${chapters.length} chapters read`;
    history.replaceState(null, "", `#/book/${L.id}/${i}`);
  };
  $$(".toc button").forEach(b => b.onclick = () => { show(+b.dataset.ch, +b.dataset.ch > cur ? 1 : -1); $(".sheet-wrap").scrollIntoView({ behavior: "smooth", block: "start" }); });
  $("#bkPrev").onclick = () => { if (cur > 0) { show(cur - 1, -1); $(".sheet-wrap").scrollIntoView({ behavior: "smooth", block: "start" }); } };
  $("#bkNext").onclick = () => { if (cur < chapters.length - 1) { show(cur + 1, 1); $(".sheet-wrap").scrollIntoView({ behavior: "smooth", block: "start" }); } else { if (!S.level) { S.level = L.id; save(); } location.hash = "#/dashboard"; } };
  const key = e => { if (e.target.matches("input,textarea")) return; if (e.key === "ArrowRight") $("#bkNext").click(); if (e.key === "ArrowLeft" && cur > 0) $("#bkPrev").click(); };
  document.addEventListener("keydown", key); onLeave(() => document.removeEventListener("keydown", key));
  $("#bkPdf").onclick = () => {
    $("#printBook").innerHTML = `<div class="pb-cover" style="--bc:${color}"><span>IELTS Pro · free study book</span><h1>${L.id} — ${L.name}</h1><p>Band ${L.band} → target ${L.target.toFixed(1)}</p></div>` +
      chapters.map((c, i) => `<section class="pb-ch"><div class="sheet-kicker">Chapter ${i + 1} · ${esc(c.kicker)}</div><h2>${esc(c.title)}</h2>${c.html}</section>`).join("");
    $$("#printBook details").forEach(d => d.open = true);
    toast("Choose “Save as PDF” in the print window");
    setTimeout(() => window.print(), 300);
  };
  show(cur);
}

/* =========================================================
   ROUTEUR
   ========================================================= */
const ROUTES = {
  "": viewHome, test: viewTest, result: viewResult,
  dashboard: viewDashboard, grammar: viewGrammar, vocab: p => viewVocab(p, "cards"), toolkit: viewToolkit, books: viewBooks, book: viewBook,
  reading: viewReading, listening: viewListening, writing: viewWriting, speaking: p => viewSpeaking(p, "2"), progress: viewProgress
};
const NEEDS_LEVEL = ["toolkit", "dashboard", "grammar", "vocab", "reading", "listening", "writing", "speaking", "progress"];

function render() {
  cleanups.forEach(f => { try { f(); } catch { } }); cleanups = [];
  closeModal();
  stopSpeak();
  const [r, p] = location.hash.replace(/^#\/?/, "").split("/");
  if (NEEDS_LEVEL.includes(r) && !S.level) { toast("Take the placement test first"); location.hash = "#/test"; return; }
  updateTop();
  (ROUTES[r] || viewHome)(p);
  app.classList.remove("page-enter"); void app.offsetWidth; app.classList.add("page-enter");
  initReveal();
  splitTitles();
  scrollTo(0, 0);
}

// Raccourcis clavier : 1-4 / A-D pour répondre, Entrée pour continuer
document.addEventListener("keydown", e => {
  if (e.target.matches("textarea, input, select") || e.ctrlKey || e.metaKey || e.altKey) return;
  const k = e.key.toUpperCase();
  let idx = "1234".indexOf(k); if (idx < 0 && k.length === 1) idx = "ABCD".indexOf(k);
  if (idx >= 0 && k.length === 1 && !$(".qgroup", app)) {
    const opts = $$(".option", app);
    if (opts.length && opts[idx] && !opts[idx].disabled) opts[idx].click();
  }
  if (e.key === "Enter" && !(document.activeElement && document.activeElement.tagName === "BUTTON")) {
    const n = $(".next", app) || $("#nextBtn:not(:disabled)", app);
    if (n) { e.preventDefault(); n.click(); }
  }
});

window.addEventListener("hashchange", render);
applyTheme();
render();
