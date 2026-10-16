// js/core/i18n.js
// Módulo de traducción e internacionalización de la interfaz

export function obtenerIdiomaInicial() {
  // 1. Revisa si hay un idioma guardado previamente
  const guardado =
    localStorage.getItem("palabra_viva_idioma") ||
    localStorage.getItem("idiomaApp");
  if (guardado) {
    return guardado;
  }

  // 2. Si no hay nada guardado, detecta el idioma del navegador
  const navLang = (
    navigator.language ||
    navigator.userLanguage ||
    "es"
  ).toLowerCase();
  if (navLang.startsWith("pt")) return "pt";
  if (navLang.startsWith("en")) return "en";
  return "es";
}

export function cambiarIdioma(lang) {
  // Si no se le pasa ningún idioma (por ejemplo al arrancar), busca el inicial
  if (!lang) {
    lang = obtenerIdiomaInicial();
  }

  const elementosTraducibles = document.querySelectorAll(
    "[data-es][data-en][data-pt]",
  );

  elementosTraducibles.forEach((el) => {
    if (lang === "en") {
      el.innerText = el.getAttribute("data-en");
    } else if (lang === "pt") {
      el.innerText = el.getAttribute("data-pt");
    } else {
      el.innerText = el.getAttribute("data-es");
    }
  });

  const botonesIdioma = document.querySelectorAll("#screen-idioma button");
  botonesIdioma.forEach((btn) => btn.classList.remove("active"));

  // Marca activo el botón del idioma seleccionado en la pantalla de ajustes
  const botonActivo = document.querySelector(
    `#screen-idioma button[data-lang="${lang}"]`,
  );
  if (botonActivo) {
    botonActivo.classList.add("active");
  }

  // Traducción del placeholder de búsqueda
  const inputBusqueda = document.getElementById("input-busqueda");
  if (inputBusqueda) {
    const placeholderTraducido = inputBusqueda.getAttribute(
      `data-${lang}-placeholder`,
    );
    if (placeholderTraducido) {
      inputBusqueda.placeholder = placeholderTraducido;
    }
  }

  // Persistencia unificada para la interfaz y el lector de biblias
  localStorage.setItem("idiomaApp", lang);
  localStorage.setItem("palabra_viva_idioma", lang);
  window.idiomaActual = lang;

  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    if (typeof window.estaReproduciendo !== "undefined")
      window.estaReproduciendo = false;
  }

  console.log("Idioma guardado en localStorage:", lang);
}
