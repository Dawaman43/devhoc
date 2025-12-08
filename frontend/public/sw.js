const CACHE_NAME = 'devhoc-cache-v1'
const OFFLINE_URL = '/offline.html'

self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([OFFLINE_URL])
    }),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // clean up old caches if necessary
      const keys = await caches.keys()
      await Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
      )
      await self.clients.claim()
    })(),
  )
})

function isNavigationRequest(request) {
  return (
    request.mode === 'navigate' ||
    (request.method === 'GET' &&
      request.headers.get('accept')?.includes('text/html'))
  )
}

self.addEventListener('fetch', (event) => {
  const { request } = event

  // Always try network for API requests (network-first with fallback to cache)
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          // optionally cache API responses here
          return res
        })
        .catch(async () => {
          // fallback to cache if network fails
          const cache = await caches.open(CACHE_NAME)
          return cache.match(request) || cache.match(OFFLINE_URL)
        }),
    )
    return
  }

  // Navigation requests: try network, fallback to offline page
  if (isNavigationRequest(request)) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          return res
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME)
          return cache.match(OFFLINE_URL)
        }),
    )
    return
  }

  // For other requests (static assets), use cache-first strategy
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached
      return fetch(request)
        .then((res) => {
          // put a copy in cache for future.
          if (
            request.method === 'GET' &&
            request.url.startsWith(self.location.origin)
          ) {
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(request, res.clone()))
          }
          return res
        })
        .catch(() => caches.match(OFFLINE_URL))
    }),
  )
})
