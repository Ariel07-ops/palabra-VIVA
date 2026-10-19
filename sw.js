const CACHE_NAME = "palabra-viva-v13"; // Incrementamos la versión para que fuerce el refresco

const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/style.css",
  // Core y Lógica JS
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
  // Imágenes e Isologotipos
  "./assets/imagen/logo-redondo.png",
  "./assets/imagen/splash-cruz-nitida.png",
  "./assets/imagen/splash.png",
  "./assets/imagen/splash1.png",
  "./assets/imagen/pagina1.jpg",
  // JSONs Bíblicos Multilingües
  "./data/SpaPlatense.json",
  "./data/bibleweb.json",
  "./data/bibliaAveMaria.json",
  // JSONs de Contenido y Asistente
  "./data/estados.json",
  "./data/contenido.json",
  "./data/camino.json",
  "./data/promesa.json",
  "./data/catequesis.json",
  "./data/config.json",
  "./data/palabraviva.json",
  "./data/respuestas_asistente.json",
];

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
      console.log("Archivos cacheados correctamente");
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Eliminando caché antigua:", cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});
