// js/core/i18n.js
// Módulo de traducción e internacionalización de la interfaz

export function cambiarIdioma(lang) {
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

  // Persistencia y control de voz
  localStorage.setItem("idiomaApp", lang);
  window.idiomaActual = lang;

  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    if (typeof window.estaReproduciendo !== "undefined")
      window.estaReproduciendo = false;
  }

  console.log("Idioma guardado en localStorage:", lang);
}
