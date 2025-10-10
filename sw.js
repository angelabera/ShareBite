// Basic Service Worker for ShareBite
// Provides simple offline caching of core assets when served over HTTP (not file://)
// Note: Service workers require a secure context (https or localhost)

// Increment this version when making structural/content changes you want to invalidate
const CACHE_VERSION = 'v4'; // bumped for auth fix
const CACHE_NAME = `sharebite-static-${CACHE_VERSION}`;
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/script.js',
  '/js/auth.js',
  '/js/theme.js',
  '/sw.js'
];

self.addEventListener('install', (event) => {
  console.log('[SW] Installing version:', CACHE_VERSION);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating version:', CACHE_VERSION);
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => {
        console.log('[SW] Deleting old cache:', k);
        return caches.delete(k);
      })
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // CRITICAL: Never cache API calls, auth endpoints, or POST requests
  const isApiCall = url.pathname.startsWith('/api/') || 
                    url.pathname.startsWith('/login') || 
                    url.pathname.startsWith('/logout') || 
                    url.pathname.startsWith('/signup');
  
  if (request.method !== 'GET' || isApiCall) {
    console.log('[SW] Bypassing cache for:', url.pathname);
    event.respondWith(fetch(request));
    return;
  }

  // Network-first for HTML to reduce stale index.html issues
  if (request.mode === 'navigate' || (request.destination === 'document')) {
    event.respondWith(
      fetch(request)
        .then(resp => {
          const copy = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          return resp;
        })
        .catch(() => caches.match(request)
          .then(cached => cached || caches.match('/index.html'))
        )
    );
    return;
  }

  // Cache-first for other static assets
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) {
        console.log('[SW] Serving from cache:', url.pathname);
        return cached;
      }
      return fetch(request).then(response => {
        const copy = response.clone();
        if (response.ok && request.url.startsWith(self.location.origin)) {
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});

// Allow manual skip waiting from page if needed
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    console.log('[SW] Received SKIP_WAITING, updating...');
    self.skipWaiting();
  }
});