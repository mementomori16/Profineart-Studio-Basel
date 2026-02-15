const CACHE_NAME = 'profineart-v3';
const STATIC_ASSETS = [
  '/manifest.json',
  '/logo.svg',
  '/logo-maskable.png',
  '/favicon.ico'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Do not cache navigation requests (HTML)
  if (event.request.mode === 'navigate') return;

  // Skip caching for external heavy assets
  if (url.hostname.includes('cloudinary') || url.hostname.includes('ibb.co') || url.hostname.includes('youtube')) return;

  // Stale-while-revalidate for static assets
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResponse.clone()));
        return networkResponse;
      });
      return cachedResponse || fetchPromise;
    })
  );
});
