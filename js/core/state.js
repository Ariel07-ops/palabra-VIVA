// js/core/state.js
// Estado centralizado de toda la aplicación

export const state = {
  // Idioma actual
  idiomaActual: "es", // "es" | "en" | "pt"

  // Resultados de búsqueda
  resultadosBusqueda: [],

  // Datos de la Biblia cargados
  bibliaData: null,

  // Pantalla actual
  pantallaActual: "splash",

  // Voz / audio
  estaReproduciendo: false,
  estaPausado: false,

  // Categoría activa
  categoriaActiva: null,
};
