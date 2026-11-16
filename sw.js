/* IELTS Pro — service worker : l'application s'installe et s'ouvre même avec une connexion faible.
   Les pages du site sont servies depuis le réseau d'abord, puis depuis le cache si le réseau manque.
   Le serveur (Supabase) et les paiements ne sont jamais mis en cache. */
const CACHE = "ielts-pro-v41";
const CORE = ["./", "index.html", "style.css", "config.js", "data.js", "tests.js", "i18n.js", "app.js", "manifest.webmanifest", "assets/icon-192.png", "assets/icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); if (r.ok) caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match("index.html"))));
});
