// js/core/i18n.js
// Módulo de traducción e internacionalización de la interfaz
import { state } from "./state.js";
import { limpiarBuscador } from "../bible/search.js";

/**
 * Obtiene el idioma guardado o detecta el idioma por defecto del navegador
 */
export function obtenerIdiomaInicial() {
  // 1. Revisa si hay un idioma guardado previamente en alguna de las claves
  const guardado =
    localStorage.getItem("idioma") ||
    localStorage.getItem("palabraViva_idioma") ||
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

/**
 * Cambia el idioma global de la app, limpia la memoria del buscador y actualiza la UI
 */
export function cambiarIdioma(lang) {
  // Si no se le pasa ningún idioma (ej. al arrancar), busca el inicial
  if (!lang) {
    lang = obtenerIdiomaInicial();
  }

  // 1. Actualizar el estado global de la app
  state.idiomaActual = lang;
  window.idiomaActual = lang;

  // 2. Persistencia unificada en localStorage (todas las variantes para compatibilidad)
  localStorage.setItem("idioma", lang);
  localStorage.setItem("palabraViva_idioma", lang);
  localStorage.setItem("palabra_viva_idioma", lang);
  localStorage.setItem("idiomaApp", lang);

  // 3. Limpiar e invalidar la caché del buscador para forzar la nueva Biblia
  if (typeof limpiarBuscador === "function") {
    limpiarBuscador();
  }

  // 4. Traducir elementos de la UI
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

  // 5. Destacar botón activo en la pantalla de ajustes
  const botonesIdioma = document.querySelectorAll("#screen-idioma button");
  botonesIdioma.forEach((btn) => btn.classList.remove("active"));

  const botonActivo = document.querySelector(
    `#screen-idioma button[data-lang="${lang}"]`,
  );
  if (botonActivo) {
    botonActivo.classList.add("active");
  }

  // 6. Traducir el placeholder del buscador
  const inputBusqueda = document.getElementById("input-busqueda");
  if (inputBusqueda) {
    const placeholderTraducido = inputBusqueda.getAttribute(
      `data-${lang}-placeholder`,
    );
    if (placeholderTraducido) {
      inputBusqueda.placeholder = placeholderTraducido;
    }
  }

  // 7. Detener lectura de voz si estaba reproduciendo
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    if (typeof window.estaReproduciendo !== "undefined") {
      window.estaReproduciendo = false;
    }
  }

  console.log("🌐 Idioma cambiado y guardado con éxito:", lang);
}
