const CACHE_NAME = "palabra-viva-v6";
const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/style.css",
  "./js/ariel.js",
  "./assets/imagen/logo-redondo.png",
  "./assets/imagen/splash-cruz-nitida.png",
  "./assets/imagen/splash.png",
  "./assets/imagen/splash1.png",
  "./assets/imagen/pagina1.jpg",
  "./data/biblia.json",
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
      console.log("Cacheando archivos...");
      for (let url of urlsToCache) {
        try {
          await cache.add(url);
        } catch (e) {
          console.warn("No se pudo cachear", url);
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
