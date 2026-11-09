const CACHE_NAME = "palabra-viva-v19"; // Subimos la versión

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
  "./assets/imagen/logo-redondo.png",
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
  "./data/SpaPlatense.json",
  "./data/bibleweb.json",
  "./data/biblia_pt_completa.json",
  "./data/estados.json",
  "./data/contenido.json",
  "./data/camino.json",
  "./data/promesa.json",
  "./data/catequesis.json",
  "./data/config.json",
  "./data/palabraviva.json",
  "./data/respuestas_asistente.json",
];

// Instalación: cachea los recursos esenciales de forma independiente
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log("Cacheando archivos de Palabra Viva...");
      for (let url of urlsToCache) {
        try {
          await cache.add(url);
        } catch (e) {
          console.warn("No se pudo cachear archivo individual:", url);
        }
      }
      return self.skipWaiting();
    }),
  );
});

// Activación: limpia las cachés viejas inmediatamente
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("Eliminando caché antigua:", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => self.clients.claim()),
  );
});

// Fetch robusto con estrategia de respaldo offline
self.addEventListener("fetch", (event) => {
  // Ignoramos peticiones que no sean GET (como extensiones o analytics si los hubiera)
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Si está en caché, lo devolvemos al instante
      if (cachedResponse) {
        return cachedResponse;
      }

      // Si no está en caché, intentamos buscarlo en la red
      return fetch(event.request)
        .then((networkResponse) => {
          return networkResponse;
        })
        .catch(() => {
          // Si falla la red y es una petición de navegación ( HTML ), devolvemos el index.html cacheado
          if (
            event.request.mode === "navigate" ||
            event.request.headers.get("accept")?.includes("text/html")
          ) {
            return caches.match("./index.html");
          }
        });
    }),
  );
});
