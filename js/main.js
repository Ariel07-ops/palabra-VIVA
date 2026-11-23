// js/main.js

// 1. IMPORTACIONES

import {
  initSearch,
  cerrarCajita,
  abrirResultadoPorIndice,
  cerrarModalHerramientas,
} from "./bible/search.js";
import {
  abrirAntiguoTestamento,
  abrirNuevoTestamento,
} from "./bible/reader.js";
import { ejecutarLecturaVoz } from "./bible/audio.js";
import {
  aplicarSubrayadosCapitulo,
  initBoxesEvents,
  cerrarPanelPorCompleto,
} from "./bible/boxes.js";
import { cargarEstadoAnimo } from "./core/moods.js";
import { cambiarIdioma, obtenerIdiomaInicial } from "./core/i18n.js";
import {
  cambiarTamanio,
  actualizarIndicadorVisual,
  initUI,
  comenzarExperiencia,
  changeScreen,
  redirigir,
  abrirPasoEmaus,
  abrirPeldaño,
} from "./core/ui.js";
import { initChatEvents, devolverFocoPC } from "./assistant/chat.js";
import {
  manejarCaminoRazon,
  manejarCaminoTrinidad,
  manejarCaminoAlma,
  manejarCaminoPascua,
  manejarCaminoDobleNaturaleza,
  leerTextoDirecto,
  construirRespuestaCatequesis,
} from "./assistant/engine.js";

// 2. EXPOSICIÓN GLOBAL A WINDOW
window.abrirAntiguoTestamento = abrirAntiguoTestamento;
window.abrirNuevoTestamento = abrirNuevoTestamento;
window.ejecutarLecturaVoz = ejecutarLecturaVoz;
window.aplicarSubrayadosCapitulo = aplicarSubrayadosCapitulo;
window.cerrarPanelPorCompleto = cerrarPanelPorCompleto;
window.cargarEstadoAnimo = cargarEstadoAnimo;
window.cambiarIdioma = cambiarIdioma;
window.cerrarCajita = cerrarCajita;
window.abrirResultadoPorIndice = abrirResultadoPorIndice;
window.cerrarModalHerramientas = cerrarModalHerramientas;
window.cambiarTamanio = cambiarTamanio;
window.actualizarIndicadorVisual = actualizarIndicadorVisual;
window.comenzarExperiencia = comenzarExperiencia;
window.changeScreen = changeScreen;
window.redirigir = redirigir;
window.abrirPasoEmaus = abrirPasoEmaus;
window.abrirPeldaño = abrirPeldaño;
window.manejarCaminoRazon = manejarCaminoRazon;
window.manejarCaminoTrinidad = manejarCaminoTrinidad;
window.manejarCaminoAlma = manejarCaminoAlma;
window.manejarCaminoPascua = manejarCaminoPascua;
window.manejarCaminoDobleNaturaleza = manejarCaminoDobleNaturaleza;
window.leerTextoDirecto = leerTextoDirecto;
window.construirRespuestaCatequesis = construirRespuestaCatequesis;
window.devolverFocoPC = devolverFocoPC;
window.obtenerIdiomaInicial = obtenerIdiomaInicial;

// 3. INICIALIZACIÓN TRAS CARGAR EL DOM
document.addEventListener("DOMContentLoaded", () => {
  console.log("Palabra Viva iniciada – versión modular completa");

  // APLICA EL IDIOMA GUARDADO O DETECTADO APENAS ARRANCA
  if (typeof cambiarIdioma === "function") {
    cambiarIdioma();
  }

  if (typeof initSearch === "function") initSearch();
  if (typeof initBoxesEvents === "function") initBoxesEvents();
  if (typeof initUI === "function") initUI();
  if (typeof initChatEvents === "function") initChatEvents();

  // Listener para el enlace del asistente
  const linkAsistente = document.getElementById("link-asistente");
  if (linkAsistente) {
    linkAsistente.addEventListener("click", (e) => {
      e.preventDefault(); // Evita el salto del href="#"
      changeScreen("screen-asistente");
    });
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const modalBienvenida = document.getElementById("modal-bienvenida");
  const btnCerrar = document.getElementById("btn-cerrar-bienvenida");

  // Verificamos si es la primera vez que abre la app
  if (modalBienvenida && !localStorage.getItem("pv_bienvenida_vista")) {
    // Le damos un pequeño respiro (ej. 1.5 seg) por si está pasando el splash screen
    setTimeout(() => {
      modalBienvenida.style.display = "flex";
    }, 1500);
  }

  if (btnCerrar) {
    btnCerrar.addEventListener("click", () => {
      modalBienvenida.style.display = "none";
      localStorage.setItem("pv_bienvenida_vista", "true");
    });
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const btnAsistente = document.getElementById("btn-asistente-home");

  if (btnAsistente) {
    // Si ya usó o vio el aviso en otra sesión, lo ocultamos de entrada
    if (localStorage.getItem("pv_tooltip_asistente_visto")) {
      btnAsistente.classList.add("ocultar-tooltip");
    } else {
      const ocultarYGuardar = () => {
        btnAsistente.classList.add("ocultar-tooltip");
        localStorage.setItem("pv_tooltip_asistente_visto", "true");
      };

      // Si no lo tocan, desaparece igual a los 20 segundos y queda marcado como visto
      const timerTooltip = setTimeout(ocultarYGuardar, 20000);

      // Si lo tocan antes, se oculta al instante, se limpia el timer y queda guardado
      btnAsistente.addEventListener("click", () => {
        clearTimeout(timerTooltip);
        ocultarYGuardar();
      });
    }
  }
});

function esVersiculoSubrayado(el) {
  const styleAttr = (el.getAttribute("style") || "").toLowerCase();
  const borderComputado = window.getComputedStyle(el).borderBottomStyle;
  return (
    styleAttr.includes("border-bottom") ||
    el.classList.contains("subrayado") ||
    (borderComputado && borderComputado !== "none")
  );
}

function ocultarTodosLosTooltipsVersiculos() {
  document.querySelectorAll(".linea-versiculo").forEach((el) => {
    el.classList.remove("tooltip-subrayado-activo");
    el.classList.add("ocultar-tooltip-versiculo");
  });
}

function actualizarTooltipSubrayados(aleatorio = true) {
  const yaVisto =
    localStorage.getItem("pv_tooltip_versiculos_visto") === "true";
  const versiculos = Array.from(document.querySelectorAll(".linea-versiculo"));

  versiculos.forEach((el) => {
    el.classList.remove(
      "tooltip-subrayado-activo",
      "ocultar-tooltip-versiculo",
    );
  });

  if (yaVisto || versiculos.length === 0) {
    versiculos.forEach((el) => el.classList.add("ocultar-tooltip-versiculo"));
    return;
  }

  const subrayados = versiculos.filter(esVersiculoSubrayado);
  if (subrayados.length === 0) return;

  const elegido = aleatorio
    ? subrayados[Math.floor(Math.random() * subrayados.length)]
    : subrayados[0];

  elegido.classList.add("tooltip-subrayado-activo");
}

document.addEventListener("click", (e) => {
  const versiculo = e.target.closest(".linea-versiculo");
  if (!versiculo) return;

  if (esVersiculoSubrayado(versiculo)) {
    localStorage.setItem("pv_tooltip_versiculos_visto", "true");
    ocultarTodosLosTooltipsVersiculos();
  }
});
// ==========================================
// PEDIR ALMACENAMIENTO PERSISTENTE
// ==========================================
async function pedirPersistencia() {
  if (navigator.storage && navigator.storage.persist) {
    try {
      const yaEsPersistente = await navigator.storage.persisted();

      if (yaEsPersistente) {
        console.log("✓ El almacenamiento ya es persistente");
        return;
      }

      const concedido = await navigator.storage.persist();
      console.log(
        concedido
          ? "✓ Almacenamiento persistente concedido"
          : "⚠ El navegador no concedió persistencia",
      );
    } catch (error) {
      console.warn("No se pudo pedir persistencia:", error);
    }
  }
}

// Llamarla al iniciar
document.addEventListener("DOMContentLoaded", () => {
  // ... tu código actual de inicialización ...

  // Pedir persistencia (no bloquea)
  pedirPersistencia();
});
// === Modal de Bienvenida: idioma inicial y aparición única ===
(function () {
  function detectarIdiomaInicial() {
    const guardado = localStorage.getItem("idiomaPalabraViva");
    if (guardado && ["es", "en", "pt"].includes(guardado)) {
      return guardado;
    }

    const candidatos =
      Array.isArray(navigator.languages) && navigator.languages.length
        ? navigator.languages
        : [navigator.language || "es"];

    for (const raw of candidatos) {
      const lang = String(raw).toLowerCase();
      if (lang.startsWith("pt")) return "pt";
      if (lang.startsWith("en")) return "en";
      if (lang.startsWith("es")) return "es";
    }

    return "es";
  }

  function aplicarIdiomasData(idioma) {
    document.documentElement.lang = idioma;
    localStorage.setItem("idiomaPalabraViva", idioma);

    document.querySelectorAll("[data-es]").forEach((el) => {
      const texto =
        el.getAttribute(`data-${idioma}`) || el.getAttribute("data-es");
      if (texto !== null) {
        el.textContent = texto;
      }
    });
  }

  function iniciarBienvenida() {
    const idioma = detectarIdiomaInicial();

    if (typeof cambiarIdioma === "function") {
      cambiarIdioma(idioma);
    } else {
      aplicarIdiomasData(idioma);
    }

    const modal = document.getElementById("modal-bienvenida");
    const btnComenzar = document.getElementById("btn-cerrar-bienvenida");
    const claveVista = "palabraVivaBienvenidaVista_v1";

    if (!modal) return;

    if (localStorage.getItem(claveVista) === "1") {
      modal.style.display = "none";
      return;
    }

    modal.style.display = "flex";

    if (btnComenzar) {
      btnComenzar.addEventListener("click", () => {
        modal.style.display = "none";
        localStorage.setItem(claveVista, "1");
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarBienvenida);
  } else {
    iniciarBienvenida();
  }
})(); // === Modal de Bienvenida: idioma inicial y aparición única ===
(function () {
  function detectarIdiomaInicial() {
    const guardado = localStorage.getItem("idiomaPalabraViva");
    if (guardado && ["es", "en", "pt"].includes(guardado)) {
      return guardado;
    }

    const candidatos =
      Array.isArray(navigator.languages) && navigator.languages.length
        ? navigator.languages
        : [navigator.language || "es"];

    for (const raw of candidatos) {
      const lang = String(raw).toLowerCase();
      if (lang.startsWith("pt")) return "pt";
      if (lang.startsWith("en")) return "en";
      if (lang.startsWith("es")) return "es";
    }

    return "es";
  }

  function aplicarIdiomasData(idioma) {
    document.documentElement.lang = idioma;
    localStorage.setItem("idiomaPalabraViva", idioma);

    document.querySelectorAll("[data-es]").forEach((el) => {
      const texto =
        el.getAttribute(`data-${idioma}`) || el.getAttribute("data-es");
      if (texto !== null) {
        el.textContent = texto;
      }
    });
  }

  function iniciarBienvenida() {
    const idioma = detectarIdiomaInicial();

    if (typeof cambiarIdioma === "function") {
      cambiarIdioma(idioma);
    } else {
      aplicarIdiomasData(idioma);
    }

    const modal = document.getElementById("modal-bienvenida");
    const btnComenzar = document.getElementById("btn-cerrar-bienvenida");
    const claveVista = "palabraVivaBienvenidaVista_v1";

    if (!modal) return;

    if (localStorage.getItem(claveVista) === "1") {
      modal.style.display = "none";
      return;
    }

    modal.style.display = "flex";

    if (btnComenzar) {
      btnComenzar.addEventListener("click", () => {
        modal.style.display = "none";
        localStorage.setItem(claveVista, "1");
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarBienvenida);
  } else {
    iniciarBienvenida();
  }
})();
