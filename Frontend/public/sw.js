const CACHE_NAME = 'profineart-v2'; // Increment version to force update
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // BYPASS: Do not intercept Cloudinary, IBB, or YouTube. Let the browser's 
  // native optimized multi-threaded loader handle these heavy assets.
  if (url.hostname.includes('cloudinary') || url.hostname.includes('ibb.co') || url.hostname.includes('youtube')) {
    return; 
  }

  // STRATEGY: Stale-While-Revalidate for local assets (Instant load from cache)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse.clone()));
        return networkResponse;
      });
      return cachedResponse || fetchPromise;
    })
  );
});