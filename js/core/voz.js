// core/voz.js
// Módulo central de síntesis de voz, MediaSession API y control de estados (Core)

import { desactivarModoFibron } from "../bible/reader.js";

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

let utteranceActual = null;
let listaCapitulosActual = [];
let indiceCapituloActual = 0;

export function obtenerVozPorIdioma(idiomaCodigo) {
  if (!("speechSynthesis" in window)) return null;
  const voces = window.speechSynthesis.getVoices();
  const config = CONFIG_IDIOMAS_VOZ[idiomaCodigo] || CONFIG_IDIOMAS_VOZ["es"];

  for (let nombre of config.filtro) {
    const vozEncontrada = voces.find((v) => v.name.includes(nombre));
    if (vozEncontrada) return vozEncontrada;
  }

  const vozFemenina = voces.find(
    (v) =>
      v.lang.startsWith(idiomaCodigo) &&
      v.name.toLowerCase().includes("female"),
  );
  if (vozFemenina) return vozFemenina;

  return voces.find((v) => v.lang.startsWith(idiomaCodigo)) || voces[0];
}

// ==========================================
// RESETEO TOTAL (ANTI-FANTASMAS Y LIMPIEZA)
// ==========================================
export function resetAudioState() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }

  limpiarEstadoPausa();

  const btnAudio = document.getElementById("btn-hablar-lectura");
  if (btnAudio) {
    btnAudio.innerHTML = '<i class="fas fa-volume-up"></i> Escuchar';
    btnAudio.classList.remove("titilando");
  }

  if ("mediaSession" in navigator) {
    navigator.mediaSession.playbackState = "none";
  }
}

// Función global mejorada con control de MediaSession (Bluetooth / Auto / Bloqueo)
export function hablarTextoGlobal(texto, listaCompleta = null) {
  if (!("speechSynthesis" in window) || !texto) return;

  // 1. Limpieza total preventiva
  resetAudioState();

  if (typeof desactivarModoFibron === "function") {
    desactivarModoFibron();
  }
  if (listaCompleta) {
    listaCapitulosActual = listaCompleta;
    indiceCapituloActual = 0;
  }

  const idiomaApp =
    window.idiomaActual || localStorage.getItem("idiomaApp") || "es";
  const configIdioma =
    CONFIG_IDIOMAS_VOZ[idiomaApp] || CONFIG_IDIOMAS_VOZ["es"];
  const vozSeleccionada = obtenerVozPorIdioma(idiomaApp);

  utteranceActual = new SpeechSynthesisUtterance(texto);
  if (vozSeleccionada) utteranceActual.voice = vozSeleccionada;
  utteranceActual.lang = configIdioma.lang;

  // Configuración reflexiva y pausada
  utteranceActual.rate = 0.82;
  utteranceActual.pitch = 0.95;

  utteranceActual.onend = () => {
    resetAudioState();
  };

  utteranceActual.onerror = (e) => {
    console.error("Error en síntesis global:", e);
    resetAudioState();
  };

  // 2. Configurar controles para auriculares Bluetooth y pantalla de bloqueo (MediaSession)
  if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: "Palabra Viva - Lectura Bíblica",
      artist: "Acompañamiento Espiritual",
      album: "Estudio Bíblico",
      artwork: [
        { src: "img/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "img/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
    });

    navigator.mediaSession.setActionHandler("play", () => {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        limpiarEstadoPausa();
        navigator.mediaSession.playbackState = "playing";
      }
    });

    navigator.mediaSession.setActionHandler("pause", () => {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        marcarEstadoPausa();
        navigator.mediaSession.playbackState = "paused";
      }
    });

    navigator.mediaSession.setActionHandler("stop", () => {
      resetAudioState();
    });

    navigator.mediaSession.setActionHandler("nexttrack", () => {
      siguienteCapituloAudio();
    });

    navigator.mediaSession.playbackState = "playing";
  }

  window.speechSynthesis.speak(utteranceActual);
}
// ==========================================
// CONTROL DE PAUSA / REANUDACIÓN (TESTIGO)
// ==========================================
export function alternarPausaAudio() {
  if (!("speechSynthesis" in window)) return;

  // Si está hablando y NO está pausado -> Pausamos
  if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
    window.speechSynthesis.pause();
    marcarEstadoPausa();
    if ("mediaSession" in navigator)
      navigator.mediaSession.playbackState = "paused";
  }
  // Si está pausado -> Reanudamos
  else if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
    limpiarEstadoPausa();
    if ("mediaSession" in navigator)
      navigator.mediaSession.playbackState = "playing";
  }
}

function marcarEstadoPausa() {
  const btnPausa = document.getElementById("btn-pausa-lectura");
  if (btnPausa) {
    // Activamos el estado de pausa pero sin titilar, mostrando el icono de Play para reanudar
    btnPausa.classList.add("btn-pausa-activo");
    btnPausa.classList.remove("titilando");
    btnPausa.innerHTML = '<i class="fas fa-play"></i>';
  }
}

function limpiarEstadoPausa() {
  const btnPausa = document.getElementById("btn-pausa-lectura");
  if (btnPausa) {
    // Volvemos al estado normal mostrando el icono de Pausa
    btnPausa.classList.remove("btn-pausa-activo", "titilando");
    btnPausa.innerHTML = '<i class="fas fa-pause"></i>';
  }
}

function siguienteCapituloAudio() {
  resetAudioState();
  if (
    listaCapitulosActual.length > 0 &&
    indiceCapituloActual < listaCapitulosActual.length - 1
  ) {
    indiceCapituloActual++;
    const siguienteTexto = listaCapitulosActual[indiceCapituloActual];
    hablarTextoGlobal(siguienteTexto);
  }
}

// Exponer globalmente para HTML / UI
window.alternarPausaAudio = alternarPausaAudio;
window.resetAudioState = resetAudioState;
