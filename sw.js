const CACHE = "lldc-hub-v1.2.1";
const CORE = ["./", "./index.html", "./data/nodes.geojson", "./logo.svg", "./favicon.svg"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
});

// Network first for data and app shell; cache first for map tiles
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  const isTile = /basemaps\.cartocdn\.com|tile\.openstreetmap\.org/.test(url.host);
  if (isTile) {
    e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request).then((res) => {
      const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return res;
    })));
    return;
  }
  e.respondWith(fetch(e.request).then((res) => {
    const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return res;
  }).catch(() => caches.match(e.request)));
});
