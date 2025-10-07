// // Service Worker for ShareBite PWA
// // Provides offline functionality and caching for better performance

// const CACHE_VERSION = 'v1';
// const CACHE_NAME = `sharebite-pwa-${CACHE_VERSION}`;

// // Core assets to cache immediately
// const CORE_ASSETS = [
//   './',
//   './index.html',
//   './login.html',
//   './manifest.json',
//   './css/style.css',
//   './css/pwa-styles.css',
//   './js/script.js',
//   './js/theme.js',
//   './js/pwa-install.js'
// ];

// // External resources to cache
// const EXTERNAL_RESOURCES = [
//   'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
//   'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
// ];

// // Install event - cache core assets
// self.addEventListener('install', (event) => {
//   console.log('[Service Worker] Installing ShareBite PWA...');
  
//   event.waitUntil(
//     caches.open(CACHE_NAME)
//       .then((cache) => {
//         console.log('[Service Worker] Caching core assets');
        
//         // Cache core assets (fail silently for missing files)
//         return Promise.allSettled([
//           ...CORE_ASSETS.map(url => 
//             cache.add(url).catch(err => 
//               console.warn(`[Service Worker] Failed to cache: ${url}`, err)
//             )
//           ),
//           ...EXTERNAL_RESOURCES.map(url =>
//             cache.add(url).catch(err =>
//               console.warn(`[Service Worker] Failed to cache external: ${url}`, err)
//             )
//           )
//         ]);
//       })
//       .then(() => {
//         console.log('[Service Worker] Installation complete');
//         return self.skipWaiting(); // Activate immediately
//       })
//       .catch(err => {
//         console.error('[Service Worker] Installation failed:', err);
//       })
//   );
// });

// // Activate event - clean up old caches
// self.addEventListener('activate', (event) => {
//   console.log('[Service Worker] Activating...');
  
//   event.waitUntil(
//     caches.keys()
//       .then((cacheNames) => {
//         return Promise.all(
//           cacheNames
//             .filter((name) => name.startsWith('sharebite-') && name !== CACHE_NAME)
//             .map((name) => {
//               console.log('[Service Worker] Deleting old cache:', name);
//               return caches.delete(name);
//             })
//         );
//       })
//       .then(() => {
//         console.log('[Service Worker] Activation complete');
//         return self.clients.claim(); // Take control immediately
//       })
//   );
// });

// // Fetch event - serve from cache with network fallback
// self.addEventListener('fetch', (event) => {
//   const { request } = event;
  
//   // Skip non-GET requests
//   if (request.method !== 'GET') {
//     return;
//   }

//   // Network-first strategy for HTML pages (prevents stale content)
//   if (request.mode === 'navigate' || request.destination === 'document') {
//     event.respondWith(
//       fetch(request)
//         .then((response) => {
//           // Clone and cache the response
//           const responseClone = response.clone();
//           caches.open(CACHE_NAME).then((cache) => {
//             cache.put(request, responseClone);
//           });
//           return response;
//         })
//         .catch(() => {
//           // Fallback to cache if network fails
//           return caches.match(request)
//             .then(cached => cached || caches.match('./index.html'));
//         })
//     );
//     return;
//   }

//   // Cache-first strategy for static assets
//   event.respondWith(
//     caches.match(request)
//       .then((cachedResponse) => {
//         if (cachedResponse) {
//           return cachedResponse;
//         }

//         // Not in cache, fetch from network
//         return fetch(request)
//           .then((response) => {
//             // Check if valid response
//             if (!response || response.status !== 200 || response.type !== 'basic') {
//               return response;
//             }

//             // Clone and cache the response
//             const responseClone = response.clone();
            
//             // Only cache same-origin requests
//             if (request.url.startsWith(self.location.origin)) {
//               caches.open(CACHE_NAME).then((cache) => {
//                 cache.put(request, responseClone);
//               });
//             }

//             return response;
//           })
//           .catch(() => {
//             // Return offline message for failed requests
//             return new Response('Offline - ShareBite unavailable', {
//               status: 503,
//               statusText: 'Service Unavailable',
//               headers: new Headers({
//                 'Content-Type': 'text/plain'
//               })
//             });
//           });
//       })
//   );
// });

// // Handle messages from the client
// self.addEventListener('message', (event) => {
//   if (event.data === 'SKIP_WAITING') {
//     console.log('[Service Worker] Skipping waiting...');
//     self.skipWaiting();
//   }
  
//   if (event.data === 'CLAIM_CLIENTS') {
//     console.log('[Service Worker] Claiming clients...');
//     self.clients.claim();
//   }
// });

// Service Worker for ShareBite PWA
// Provides offline functionality and caching for better performance

// const CACHE_VERSION = 'v1';
// const CACHE_NAME = `sharebite-pwa-${CACHE_VERSION}`;

// // Core assets to cache immediately
// const CORE_ASSETS = [
//     './',
//     './index.html',
//     './login.html',
//     './manifest.json',
//     './css/style.css',
//     './js/script.js',
//     './js/theme.js'
// ];

// // External resources to cache
// const EXTERNAL_RESOURCES = [
//     'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
//     'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
// ];

// // Install event - cache core assets
// self.addEventListener('install', (event) => {
//     console.log('[Service Worker] Installing ShareBite PWA...');
    
//     event.waitUntil(
//         caches.open(CACHE_NAME)
//             .then((cache) => {
//                 console.log('[Service Worker] Caching core assets');
//                 // Cache core assets (fail silently for missing files)
//                 return Promise.allSettled([
//                     ...CORE_ASSETS.map(url => 
//                         cache.add(url).catch(err => 
//                             console.warn(`[Service Worker] Failed to cache: ${url}`)
//                         )
//                     ),
//                     ...EXTERNAL_RESOURCES.map(url => 
//                         cache.add(url).catch(err => 
//                             console.warn(`[Service Worker] Failed to cache external: ${url}`)
//                         )
//                     )
//                 ]);
//             })
//             .then(() => {
//                 console.log('[Service Worker] Installation complete');
//                 return self.skipWaiting();
//             })
//     );
// });

// // Activate event - clean up old caches
// self.addEventListener('activate', (event) => {
//     console.log('[Service Worker] Activating...');
    
//     event.waitUntil(
//         caches.keys()
//             .then((cacheNames) => {
//                 return Promise.all(
//                     cacheNames.map((cacheName) => {
//                         if (cacheName !== CACHE_NAME) {
//                             console.log(`[Service Worker] Deleting old cache: ${cacheName}`);
//                             return caches.delete(cacheName);
//                         }
//                     })
//                 );
//             })
//             .then(() => {
//                 console.log('[Service Worker] Activation complete');
//                 return self.clients.claim();
//             })
//     );
// });

// // Fetch event - serve cached content when offline
// self.addEventListener('fetch', (event) => {
//     // Skip non-GET requests
//     if (event.request.method !== 'GET') return;
    
//     // Skip chrome-extension and other non-http requests
//     if (!event.request.url.startsWith('http')) return;

//     event.respondWith(
//         caches.match(event.request)
//             .then((response) => {
//                 // Return cached version if available
//                 if (response) {
//                     return response;
//                 }

//                 // Otherwise, fetch from network
//                 return fetch(event.request)
//                     .then((response) => {
//                         // Don't cache if not a valid response
//                         if (!response || response.status !== 200 || response.type !== 'basic') {
//                             return response;
//                         }

//                         // Clone the response for caching
//                         const responseToCache = response.clone();

//                         caches.open(CACHE_NAME)
//                             .then((cache) => {
//                                 cache.put(event.request, responseToCache);
//                             });

//                         return response;
//                     })
//                     .catch(() => {
//                         // If both cache and network fail, return offline page for navigations
//                         if (event.request.destination === 'document') {
//                             return caches.match('./index.html');
//                         }
//                     });
//             })
//     );
// });

// // Handle background sync
// self.addEventListener('sync', (event) => {
//     if (event.tag === 'background-sync') {
//         console.log('[Service Worker] Background sync triggered');
//         // Add any background sync logic here
//     }
// });

// // Handle push notifications (for future use)
// self.addEventListener('push', (event) => {
//     if (event.data) {
//         console.log('[Service Worker] Push notification received');
//         // Add push notification logic here
//     }
// });

// // Listen for skip waiting message
// self.addEventListener('message', (event) => {
//     if (event.data && event.data.type === 'SKIP_WAITING') {
//         self.skipWaiting();
//     }
// });

// ShareBite PWA Service Worker (robust, non-destructive)
const CACHE_VERSION = 'v1';
const CACHE_NAME = `sharebite-pwa-${CACHE_VERSION}`;

// Core assets to cache (same-origin paths)
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/login.html',
  '/manifest.json',
  '/css/style.css',
  '/js/script.js',
  '/js/theme.js',
  '/logo/logo-192.png',
  '/logo/logo-512.png'
];

// External resources that are useful to cache but may fail
const EXTERNAL_ASSETS = [
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Install: cache core assets (fail gracefully if some fail)
self.addEventListener('install', event => {
  console.log('[SW] Install event');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // Use Promise.allSettled to avoid failing the install if some resources are unreachable
        const corePromises = CORE_ASSETS.map(u => cache.add(u).catch(err => {
          console.warn('[SW] Failed to cache', u, err);
        }));
        const externPromises = EXTERNAL_ASSETS.map(u => cache.add(u).catch(err => {
          console.warn('[SW] Failed to cache external', u, err);
        }));
        return Promise.allSettled([...corePromises, ...externPromises]);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate: cleanup old caches
self.addEventListener('activate', event => {
  console.log('[SW] Activate event');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) {
          console.log('[SW] Deleting old cache', key);
          return caches.delete(key);
        }
      }));
    }).then(() => self.clients.claim())
  );
});

// Fetch: network-first for navigations (HTML), cache-first for other requests
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const request = event.request;

  // Network-first for navigation requests (HTML pages)
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then(networkResponse => {
          // Update cache
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          return networkResponse;
        })
        .catch(() => {
          // Fallback to cache
          return caches.match(request).then(cached => cached || caches.match('/index.html'));
        })
    );
    return;
  }

  // For other requests (CSS, JS, images): try cache first, then network and cache it
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        if (cachedResponse) return cachedResponse;
        return fetch(request)
          .then(networkResponse => {
            if (!networkResponse || networkResponse.status !== 200) return networkResponse;
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              // Only cache same-origin requests to avoid CORS issues with some CDNs
              if (request.url.startsWith(self.location.origin)) {
                cache.put(request, copy);
              }
            });
            return networkResponse;
          })
          .catch(() => {
            // If offline and resource not cached, respond with nothing (browser will handle)
            return;
          });
      })
  );
});

// Listen for messages from the client (skip waiting)
self.addEventListener('message', event => {
  if (!event.data) return;
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
