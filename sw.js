const CACHE_NAME = "jara-seisan-shell-v5"
const assetUrl = (path) => new URL(path, self.location.href).pathname
const APP_ROOT = assetUrl("./")
const APP_SHELL = [
  APP_ROOT,
  assetUrl("manifest.webmanifest"),
  assetUrl("icons/icon-192.png"),
  assetUrl("icons/icon-512.png"),
  assetUrl("icons/apple-touch-icon.png"),
  assetUrl("loading-koga-mahjong-cute.png"),
  assetUrl("loading-koga-exercise-cute.png"),
  assetUrl("loading-koga-cooking-cute.png"),
  assetUrl("loading-koga-strength-cute.png"),
  assetUrl("loading-koga-hip-dance-cute.png"),
  assetUrl("loading-koga-pachinko-cute.png"),
  assetUrl("loading-koga-camping-cute.png"),
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  )
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
  )
  self.clients.claim()
})

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy))
        return response
      })
      .catch(() =>
        caches
          .match(event.request)
          .then((cached) => cached ?? caches.match(APP_ROOT))
      )
  )
})
