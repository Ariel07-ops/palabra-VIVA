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

      // Si no lo tocan, desaparece igual a los 7 segundos y queda marcado como visto
      const timerTooltip = setTimeout(ocultarYGuardar, 7000);

      // Si lo tocan antes, se oculta al instante, se limpia el timer y queda guardado
      btnAsistente.addEventListener("click", () => {
        clearTimeout(timerTooltip);
        ocultarYGuardar();
      });
    }
  }
});
function actualizarTooltipSubrayados(aleatorio = true) {
  const yaVisto =
    localStorage.getItem("pv_tooltip_versiculos_visto") === "true";
  const versiculos = Array.from(document.querySelectorAll(".linea-versiculo"));

  // Limpiamos cualquier marca previa al cambiar de capítulo
  versiculos.forEach((el) => {
    el.classList.remove(
      "tooltip-subrayado-activo",
      "ocultar-tooltip-versiculo",
    );
  });

  if (yaVisto) {
    versiculos.forEach((el) => el.classList.add("ocultar-tooltip-versiculo"));
    return;
  }

  // Filtramos solo los versículos que realmente están subrayados en este capítulo
  const subrayados = versiculos.filter((el) => {
    const styleAttr = (el.getAttribute("style") || "").toLowerCase();
    return (
      styleAttr.includes("border-bottom") || el.classList.contains("subrayado")
    );
  });

  if (subrayados.length === 0) return;

  const elegido = aleatorio
    ? subrayados[Math.floor(Math.random() * subrayados.length)]
    : subrayados[0];

  elegido.classList.add("tooltip-subrayado-activo");
}

// Al tocar un versículo subrayado, marcamos como visto y ocultamos
document.addEventListener("click", (e) => {
  const versiculo = e.target.closest(".linea-versiculo");
  if (!versiculo) return;

  const esSubrayado =
    (versiculo.getAttribute("style") || "")
      .toLowerCase()
      .includes("border-bottom") || versiculo.classList.contains("subrayado");

  if (esSubrayado) {
    localStorage.setItem("pv_tooltip_versiculos_visto", "true");
    document.querySelectorAll(".linea-versiculo").forEach((el) => {
      el.classList.add("ocultar-tooltip-versiculo");
    });
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
