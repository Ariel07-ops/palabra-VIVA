const CACHE_NAME = "palabra-viva-v4";
const urlsToCache = [
  "./",
  "./index.html",
  "./data/biblia.json",
  "./manifest.json",
  "./data/estados.json",
  "./data/contenido.json",
  "./data/camino.json",
  "./data/promesa.json",
  "./assets/imagen/logo-redondo.png",
  "./assets/imagen/cruz-nitida.png",
  "./css/style.css",
  "./js/ariel.js",

  // Si tenés estilos CSS propios o iconos, agregalos acá también
];

// Instalación: guarda los archivos en la caché del celular
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Archivos cacheados correctamente");
      return cache.addAll(urlsToCache);
    }),
  );
});

// Activación: limpia cachés antiguas si actualizás la app
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Borrando caché antigua:", cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});

// Intercepta las peticiones: si no hay internet, sirve los archivos desde la caché
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Si está en caché, lo devuelve. Si no, intenta buscarlo en la red.
      return response || fetch(event.request);
    }),
  );
});
