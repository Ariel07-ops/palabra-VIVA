const CACHE_NAME = "palabra-viva-v21"; // Subí la versión para incluir los nuevos íconos

const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/style.css",
  "./js/main.js",
  "./js/core/i18n.js",
  "./js/core/ui.js",
  "./js/core/moods.js",
  "./js/bible/reader.js",
  "./js/bible/search.js",
  "./js/bible/audio.js",
  "./js/bible/boxes.js",
  "./js/bible/canon.js",
  "./js/assistant/chat.js",
  "./js/assistant/engine.js",
  // Imágenes principales y splash
  "./assets/imagen/logo-redondo.png",
  "./assets/imagen/logo-192.png",
  "./assets/imagen/splash-cruz-nitida.png",
  "./assets/imagen/splash.png",
  "./assets/imagen/splash1.png",
  "./assets/imagen/pagina1.jpg",
  "./assets/imagen/camino1.jpg",
  "./assets/imagen/camino2.jpg",
  "./assets/imagen/camino3.jpg",
  "./assets/imagen/camino4.jpg",
  "./assets/imagen/escalon1.jpg",
  "./assets/imagen/escalon2.jpg",
  "./assets/imagen/escalon3.jpg",
  "./assets/imagen/escalon4.jpg",
  "./assets/imagen/escalon5.jpg",
  "./assets/imagen/escalon6.jpg",
  "./assets/imagen/escalon7.jpg",
  "./assets/imagen/escalon8.jpg",
  // Nuevos íconos de menú en oro y plata
  "./assets/imagen/inicio.jpeg",
  "./assets/imagen/biblia.jpeg",
  "./assets/imagen/buscar.jpeg",
  "./assets/imagen/idioma.jpeg",
  "./assets/imagen/enlaces.jpeg",
  "./assets/imagen/herramientas.jpeg",
  "./assets/imagen/acerca.jpeg",
  "./assets/imagen/asistente.jpeg",
  // Audio (importante para el splash)
  "./assets/audio/intro.mp3",
  // Datos
  "./data/SpaPlatense.json",
  "./data/bibleweb.json",
  "./data/biblia_pt_completa.json",
  "./data/estados.json",
  "./data/contenido.json",
  "./data/camino.json",
  "./data/promesa.json",
  "./data/config.json",
  "./data/respuestas_asistente.json",
  "./data/glosario.json",
  "./data/referencias-cruzadas.json",
];

// Instalación
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log("[SW] Cacheando recursos de Palabra Viva...");
      for (const url of urlsToCache) {
        try {
          await cache.add(url);
        } catch (e) {
          console.warn("[SW] No se pudo cachear:", url, e);
        }
      }
      return self.skipWaiting();
    }),
  );
});

// Activación: limpia cachés viejas
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("[SW] Eliminando caché antigua:", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => self.clients.claim()),
  );
});

// Estrategia Cache-First + fallback offline
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  // No cacheamos ni interceptamos requests a CDNs externos
  const url = new URL(event.request.url);
  if (
    url.hostname.includes("fonts.googleapis.com") ||
    url.hostname.includes("fonts.gstatic.com") ||
    url.hostname.includes("cdnjs.cloudflare.com") ||
    url.hostname.includes("archive.org")
  ) {
    return; // Dejamos que fallen offline
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          // Opcional: cachear dinámicamente recursos de la misma origin
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            url.origin === self.location.origin
          ) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Fallback para navegación
          if (
            event.request.mode === "navigate" ||
            event.request.headers.get("accept")?.includes("text/html")
          ) {
            return caches.match("./index.html");
          }
          // Para otros recursos fallidos, devolvemos un Response vacío o el index
          return new Response("", { status: 503, statusText: "Offline" });
        });
    }),
  );
});
