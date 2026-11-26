const CACHE_NAME = "palabra-viva-v27";

const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/style.css",
  "./js/main.js",
  "./js/core/i18n.js",
  "./js/core/ui.js",
  "./js/core/moods.js",
  "./js/core/state.js",
  "./js/core/voz.js",
  "./js/core/utils.js",
  "./js/bible/reader.js",
  "./js/bible/search.js",
  "./js/bible/audio.js",
  "./js/bible/boxes.js",
  "./js/bible/canon.js",
  "./js/assistant/chat.js",
  "./js/assistant/engine.js",
  // Imágenes
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
  "./assets/imagen/inicio.jpeg",
  "./assets/imagen/biblia.jpeg",
  "./assets/imagen/buscar.jpeg",
  "./assets/imagen/idioma.jpeg",
  "./assets/imagen/enlaces.jpeg",
  "./assets/imagen/herramientas.jpeg",
  "./assets/imagen/acerca.jpeg",
  "./assets/imagen/asistente.jpeg",
  // Audio
  "./assets/audio/intro.mp3",
  // Datos
  "./data/SpaPlatense.json",
  "./data/bibleweb.json",
  "./data/biblia_pt_completa.json",
  "./data/estados.json",
  "./data/contenido.json",
  "./data/introduccion_libro.json",
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
      console.log("[SW] Cacheando recursos...");
      for (const url of urlsToCache) {
        try {
          await cache.add(url);
        } catch (e) {
          console.warn("[SW] Falló cachear:", url);
        }
      }
      return self.skipWaiting();
    }),
  );
});

// Activación – limpia cachés viejas
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => {
              console.log("[SW] Borrando caché vieja:", key);
              return caches.delete(key);
            }),
        );
      })
      .then(() => self.clients.claim()),
  );
});

// Fetch – Cache First + fallback robusto
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Dejamos fallar los recursos externos (fuentes, CDNs)
  if (
    url.hostname.includes("fonts.googleapis.com") ||
    url.hostname.includes("fonts.gstatic.com") ||
    url.hostname.includes("cdnjs.cloudflare.com") ||
    url.hostname.includes("archive.org")
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached; // Cache First
      }

      // Si no está en caché, intentamos red
      return fetch(event.request)
        .then((networkResponse) => {
          // Cacheamos en caliente recursos de la misma origin
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            url.origin === self.location.origin
          ) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Fallback fuerte: si es navegación → index.html
          if (
            event.request.mode === "navigate" ||
            (event.request.headers.get("accept") || "").includes("text/html")
          ) {
            return caches.match("./index.html");
          }

          // Para cualquier otro recurso que falle offline
          return new Response("Recurso no disponible offline", {
            status: 503,
            statusText: "Offline",
            headers: { "Content-Type": "text/plain" },
          });
        });
    }),
  );
});
