const CACHE_V = 'v2'
const STATIC = `olegagapov-static-${CACHE_V}`  // hashed assets, fonts, images
const PAGES  = `olegagapov-pages-${CACHE_V}`   // HTML — kept only as offline fallback

const isHtml    = req => req.mode === 'navigate'
const isHashed  = url => url.pathname.includes('/_astro/')
const isFont    = url => url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com'
const isImage   = url => /\.(jpe?g|png|svg|webp|ico)$/.test(url.pathname)

self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== STATIC && k !== PAGES).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return

  const url = new URL(e.request.url)
  const sameOrigin = url.origin === self.location.origin
  if (!sameOrigin && !isFont(url)) return

  // HTML → network-first; fall back to cache only when offline
  if (isHtml(e.request)) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          if (res.status === 200) {
            const clone = res.clone()
            caches.open(PAGES).then(c => c.put(e.request, clone))
          }
          return res
        })
        .catch(() => caches.match(e.request))
    )
    return
  }

  // Hashed assets, fonts, images → cache-first (safe: filenames change with content)
  if (isHashed(url) || isFont(url) || isImage(url)) {
    e.respondWith(
      caches.match(e.request).then(cached => cached ?? fetch(e.request).then(res => {
        if (res.status === 200) {
          const clone = res.clone()
          caches.open(STATIC).then(c => c.put(e.request, clone))
        }
        return res
      }))
    )
    return
  }

  // Everything else → network only
  e.respondWith(fetch(e.request))
})
