/// Service Worker for SamGov PWA
/// Caches decision trees and static assets for offline use

const CACHE_NAME = "samgov-v1";
const STATIC_CACHE = "samgov-static-v1";

// Static assets to pre-cache on install
const PRECACHE_URLS = ["/", "/explore", "/schemes"];

// Install: pre-cache essential pages
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME && key !== STATIC_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Fetch: network-first for API, cache-first for static
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== "GET") return;

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith("http")) return;

  // Supabase API calls (decision trees, schemes) - network first, cache fallback
  if (url.hostname.includes("supabase.co")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful GET responses from Supabase
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clone);
            });
          }
          return response;
        })
        .catch(() => {
          // Offline: serve from cache
          return caches.match(event.request);
        })
    );
    return;
  }

  // Same-origin navigation requests - network first with cache fallback
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request).then(
          (cached) => cached || caches.match("/")
        );
      })
    );
    return;
  }

  // Static assets - cache first
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.endsWith(".svg")
  ) {
    event.respondWith(
      caches.match(event.request).then(
        (cached) =>
          cached ||
          fetch(event.request).then((response) => {
            if (response.ok) {
              const clone = response.clone();
              caches.open(STATIC_CACHE).then((cache) => {
                cache.put(event.request, clone);
              });
            }
            return response;
          })
      )
    );
    return;
  }
});
