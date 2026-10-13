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
import { cambiarIdioma } from "./core/i18n.js";
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

// 3. INICIALIZACIÓN TRAS CARGAR EL DOM
document.addEventListener("DOMContentLoaded", () => {
  console.log("Palabra Viva iniciada – versión modular completa");

  if (typeof initSearch === "function") initSearch();
  if (typeof initBoxesEvents === "function") initBoxesEvents();
  if (typeof initUI === "function") initUI();
  if (typeof initChatEvents === "function") initChatEvents();
});
document.addEventListener("DOMContentLoaded", () => {
  const linkAsistente = document.getElementById("link-asistente");
  if (linkAsistente) {
    linkAsistente.addEventListener("click", (e) => {
      e.preventDefault(); // Evita el salto del href="#"
      changeScreen("screen-asistente");
      // Si querés que cierre el menú lateral al hacer clic, descomentá la línea de abajo:
      // cerrarMenu();
    });
  }
});
