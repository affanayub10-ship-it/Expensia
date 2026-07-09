const CACHE_NAME = "expensia-cache-v1";
const ASSETS = ["/", "/manifest.json", "/favicon.ico", "/icon.svg"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }),
  );
});

self.addEventListener("fetch", (e) => {
  // Only handle GET requests for static assets, let server functions and SSR pass through normally
  if (e.request.method !== "GET" || e.request.url.includes("/_server/")) {
    return;
  }
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    }),
  );
});
