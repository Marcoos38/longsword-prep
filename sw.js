/*
  Offline support. Bump CACHE_VERSION whenever you change files, and add any
  new page (for example sword.html) to APP_FILES so it works offline too.
*/
const CACHE_VERSION = "v5";
const CACHE = "longsword-prep-" + CACHE_VERSION;
const APP_FILES = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png"
];
/*
  Conditioning and sword training are now one page (index.html), with
  everything else inlined into it, so this list is shorter than before.
  sword.html, style.css, and the old workouts.js/sword.js/figures.js/app.js
  files are no longer used, but you can leave them in the repository;
  nothing links to them anymore.
*/

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(APP_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Google Fonts: cache after first load so the app looks right offline.
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    event.respondWith(
      caches.open(CACHE).then((c) =>
        c.match(req).then((hit) => hit || fetch(req).then((res) => { c.put(req, res.clone()); return res; }))
      )
    );
    return;
  }

  if (url.origin !== self.location.origin) return;

  // App files: serve from cache instantly, refresh the cache in the background.
  event.respondWith(
    caches.open(CACHE).then((c) =>
      c.match(req, { ignoreSearch: true }).then((hit) => {
        const refresh = fetch(req)
          .then((res) => { if (res && res.ok) c.put(req, res.clone()); return res; })
          .catch(() => hit);
        return hit || refresh;
      })
    )
  );
});
