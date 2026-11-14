// js/bible/audio.js
// Módulo de sintetizador de voz y lectura bíblica fluida por frases con Media Session y Modo Continuo

import { hablarTextoPorFrases, resetAudioState } from "../core/voz.js";

let estaReproduciendo = false;

// ==========================================
// 1. CONFIGURACIÓN Y HELPER MULTILINGÜE
// ==========================================
export const CONFIG_IDIOMAS_VOZ = {
  es: { lang: "es-ES", filtro: ["Paulina", "Monica", "Helena", "Sabina"] },
  en: {
    lang: "en-US",
    filtro: ["Samantha", "Victoria", "Karen", "Zira", "Google US English"],
  },
  pt: {
    lang: "pt-BR",
    filtro: ["Luciana", "Heloisa", "Camila", "Google Português"],
  },
};

export function obtenerVozPorIdioma(idiomaCodigo) {
  if (!("speechSynthesis" in window)) return null;
  const voces = window.speechSynthesis.getVoices();
  const config = CONFIG_IDIOMAS_VOZ[idiomaCodigo] || CONFIG_IDIOMAS_VOZ["es"];

  // 1. Buscar por nombres preferidos de voces femeninas/cálidas
  for (let nombre of config.filtro) {
    const vozEncontrada = voces.find((v) => v.name.includes(nombre));
    if (vozEncontrada) return vozEncontrada;
  }

  // 2. Buscar cualquier voz femenina en ese idioma
  const vozFemenina = voces.find(
    (v) =>
      v.lang.startsWith(idiomaCodigo) &&
      v.name.toLowerCase().includes("female"),
  );
  if (vozFemenina) return vozFemenina;

  // 3. Fallback: la primera voz del idioma o la primera del sistema
  return voces.find((v) => v.lang.startsWith(idiomaCodigo)) || voces[0];
}

// ==========================================
// 2. MOTOR DE AUDIO BÍBLICO (CONECTADO AL NÚCLEO)
// ==========================================
export function ejecutarLecturaVoz() {
  if (!("speechSynthesis" in window)) {
    alert("Tu dispositivo no soporta la síntesis de voz.");
    return;
  }

  const btnAudio = document.getElementById("bible-audio-trigger");
  const areaLecturaFinal = document.getElementById("texto-lectura-final");

  if (!areaLecturaFinal) return;

  // --- BOTÓN DETENER / INTERRUPTOR INSTANTÁNEO ---
  if (estaReproduciendo || window.speechSynthesis.speaking) {
    estaReproduciendo = false;
    resetAudioState();
    if (btnAudio) {
      btnAudio.innerHTML = '<i class="fas fa-volume-up"></i> Escuchar';
    }
    return;
  }

  // 1. Clonación y limpieza del HTML (quita versículos, títulos y notas)
  const clone = areaLecturaFinal.cloneNode(true);
  clone
    .querySelectorAll("sup, h1, h2, h3, .filologia, .caja-filologica, ins, u")
    .forEach((el) => el.remove());

  // 2. Limpieza básica del texto
  let textoLimpio = clone.innerText
    .replace(/[^\w\sáéíóúÁÉÍÓÚüÜñÑ.,!?;]/g, "")
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!textoLimpio) {
    console.log("El texto quedó vacío tras la limpieza.");
    return;
  }

  // 3. Tomar libro y capítulo actuales para los metadatos del Media Session
  const libro =
    window.pvAudioEstado?.libro ||
    document.getElementById("titulo-libro-seleccionado")?.textContent ||
    "Sagrada Escritura";

  const capitulo =
    window.pvAudioEstado?.capitulo ||
    document
      .querySelector("#titulo-lectura-completa")
      ?.textContent.match(/CAP\.?\s*(\d+)/i)?.[1] ||
    "";

  estaReproduciendo = true;
  if (btnAudio) {
    btnAudio.innerHTML = '<i class="fas fa-stop"></i> Detener';
  }

  // 4. Delegamos la reproducción por frases al núcleo unificado (voz.js)
  if (typeof hablarTextoPorFrases === "function") {
    hablarTextoPorFrases(textoLimpio, { libro, capitulo });
  } else {
    console.error("No se encontró la función hablarTextoPorFrases en voz.js");
  }
}

// Exponer globalmente para la interfaz y botones
window.ejecutarLecturaVoz = ejecutarLecturaVoz;
// --- MODO PANTALLA NEGRA Y WAKE LOCK PARA LA BIBLIA ---
let wakeLockBiblia = null;

async function activarPantallaNegraBiblia() {
  try {
    if ("wakeLock" in navigator) {
      wakeLockBiblia = await navigator.wakeLock.request("screen");
    }
  } catch (err) {
    console.warn(`Wake Lock no disponible: ${err.message}`);
  }

  let overlay = document.getElementById("overlay-pantalla-negra-biblia");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "overlay-pantalla-negra-biblia";
    overlay.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      background: #000000;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #d4af37;
      font-family: var(--font-roman, sans-serif);
      cursor: pointer;
    `;

    overlay.innerHTML = `
      <div style="text-align: center; opacity: 0.8;">
        <i class="fas fa-moon" style="font-size: 2.5rem; margin-bottom: 15px;"></i>
        <p style="font-size: 1rem; margin: 0;">Tocá la pantalla para volver</p>
      </div>
    `;

    overlay.addEventListener("click", () => {
      overlay.style.display = "none";
      if (wakeLockBiblia !== null) {
        wakeLockBiblia.release().then(() => {
          wakeLockBiblia = null;
        });
      }
    });

    document.body.appendChild(overlay);
  } else {
    overlay.style.display = "flex";
  }
}

window.activarPantallaNegraBiblia = activarPantallaNegraBiblia;
