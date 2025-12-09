const CACHE_NAME = 'devhoc-cache-v2'
const OFFLINE_URL = '/offline.html'
const PRECACHE_URLS = ['/', '/manifest.json', '/robots.txt', OFFLINE_URL]

// Simple offline mutation queue (best-effort)
const mutationQueue = []

self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS)
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

  // API requests
  if (request.url.includes('/api/')) {
    // Queue mutations when offline
    if (request.method !== 'GET') {
      event.respondWith(
        (async () => {
          try {
            const res = await fetch(request)
            return res
          } catch (e) {
            // Best-effort: store minimal data to retry later
            const body = await request
              .clone()
              .text()
              .catch(() => '')
            mutationQueue.push({
              url: request.url,
              method: request.method,
              headers: [...request.headers],
              body,
            })
            // Notify clients
            const clientsArr = await self.clients.matchAll()
            clientsArr.forEach((client) =>
              client.postMessage({ type: 'mutation-queued', url: request.url }),
            )
            // Return a synthetic response
            return new Response(JSON.stringify({ queued: true }), {
              status: 202,
              headers: { 'Content-Type': 'application/json' },
            })
          }
        })(),
      )
      return
    }

    // GET requests: network-first with cache fallback and cache population
    event.respondWith(
      fetch(request)
        .then((res) => {
          // cache a copy
          const resClone = res.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, resClone))
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

self.addEventListener('online', async () => {
  // try flushing queued mutations
  while (mutationQueue.length > 0) {
    const next = mutationQueue.shift()
    try {
      await fetch(next.url, {
        method: next.method,
        headers: next.headers,
        body: next.body,
      })
    } catch (e) {
      // put back and break
      mutationQueue.unshift(next)
      break
    }
  }
})
