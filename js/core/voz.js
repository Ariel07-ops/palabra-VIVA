// js/core/voz.js
// Núcleo de voz + MediaSession + modo continuo

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

let estaReproduciendo = false;
let indiceFrase = 0;
let frasesActuales = [];
let utteranceActual = null;

// Estado del libro/capítulo actual (para next/prev)
window.pvAudioEstado = window.pvAudioEstado || {
  libro: null,
  capitulo: null,
  autoContinuar: localStorage.getItem("pv_modo_continuo") === "true",
};

// ======================
// HELPERS
// ======================
export function obtenerVozPorIdioma(idiomaCodigo) {
  if (!("speechSynthesis" in window)) return null;
  const voces = window.speechSynthesis.getVoices();
  const config = CONFIG_IDIOMAS_VOZ[idiomaCodigo] || CONFIG_IDIOMAS_VOZ.es;

  for (let nombre of config.filtro) {
    const voz = voces.find((v) => v.name.includes(nombre));
    if (voz) return voz;
  }
  const femenina = voces.find(
    (v) =>
      v.lang.startsWith(idiomaCodigo) &&
      v.name.toLowerCase().includes("female"),
  );
  if (femenina) return femenina;
  return voces.find((v) => v.lang.startsWith(idiomaCodigo)) || voces[0];
}

export function resetAudioState() {
  estaReproduciendo = false;
  indiceFrase = 0;
  frasesActuales = [];
  utteranceActual = null;

  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }

  const btnAudio = document.getElementById("bible-audio-trigger");
  if (btnAudio) {
    btnAudio.innerHTML = '<i class="fas fa-volume-up"></i> Escuchar';
    btnAudio.classList.remove("titilando");
  }

  if ("mediaSession" in navigator) {
    navigator.mediaSession.playbackState = "none";
  }
}

// ======================
/// ======================
// MEDIA SESSION
// ======================
function configurarMediaSession() {
  if (!("mediaSession" in navigator)) return;

  navigator.mediaSession.setActionHandler("play", () => {
    if (typeof window.ejecutarLecturaVoz === "function") {
      window.ejecutarLecturaVoz();
    }
  });

  navigator.mediaSession.setActionHandler("pause", () => {
    resetAudioState();
  });

  navigator.mediaSession.setActionHandler("stop", () => {
    resetAudioState();
  });

  navigator.mediaSession.setActionHandler("nexttrack", () => {
    if (typeof window.irAlSiguienteCapitulo === "function") {
      window.irAlSiguienteCapitulo(true); // true = auto-reproducir
    }
  });

  navigator.mediaSession.setActionHandler("previoustrack", () => {
    if (typeof window.irAlCapituloAnterior === "function") {
      window.irAlCapituloAnterior(true);
    }
  });
}

function actualizarMediaSession(titulo, capitulo) {
  if (!("mediaSession" in navigator)) return;

  navigator.mediaSession.metadata = new MediaMetadata({
    title: capitulo ? `${titulo} – Cap. ${capitulo}` : titulo || "Palabra Viva",
    artist: "Palabra Viva",
    album: "Lectura Bíblica",
    artwork: [
      { src: "img/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "img/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  });

  navigator.mediaSession.playbackState = estaReproduciendo
    ? "playing"
    : "paused";
}

// Llamar una vez al iniciar la app
configurarMediaSession();

// ======================

// ======================
// LECTURA POR FRASES (capítulo actual)
// ======================
export function hablarTextoPorFrases(textoLimpio, meta = {}) {
  if (!("speechSynthesis" in window) || !textoLimpio) return;

  resetAudioState();

  if (typeof desactivarModoFibron === "function") {
    desactivarModoFibron();
  }

  // Guardar meta para MediaSession y next/prev
  if (meta.libro) window.pvAudioEstado.libro = meta.libro;
  if (meta.capitulo) window.pvAudioEstado.capitulo = meta.capitulo;

  frasesActuales = textoLimpio.match(/[^.!?]+[.!?]+/g) || [textoLimpio];
  indiceFrase = 0;
  estaReproduciendo = true;

  const btnAudio = document.getElementById("bible-audio-trigger");
  if (btnAudio) {
    btnAudio.innerHTML = '<i class="fas fa-stop"></i> Detener';
  }

  actualizarMediaSession(meta.libro || "Palabra Viva", meta.capitulo);

  const idiomaApp =
    window.idiomaActual || localStorage.getItem("idiomaApp") || "es";
  const configIdioma = CONFIG_IDIOMAS_VOZ[idiomaApp] || CONFIG_IDIOMAS_VOZ.es;
  const vozSeleccionada = obtenerVozPorIdioma(idiomaApp);

  function reproducirSiguienteFrase() {
    if (!estaReproduciendo || indiceFrase >= frasesActuales.length) {
      // Terminó el capítulo
      estaReproduciendo = false;
      if (btnAudio)
        btnAudio.innerHTML = '<i class="fas fa-volume-up"></i> Escuchar';
      if ("mediaSession" in navigator)
        navigator.mediaSession.playbackState = "none";

      // --- BYPASS: MODO CONTINUO ---
      const modoContinuo = localStorage.getItem("pv_modo_continuo") === "true";
      if (modoContinuo && typeof window.irAlSiguienteCapitulo === "function") {
        setTimeout(() => {
          window.irAlSiguienteCapitulo(true); // Salta y reproduce automáticamente
        }, 900);
      }
      return;
    }

    const textoFrase = frasesActuales[indiceFrase].trim();
    if (!textoFrase) {
      indiceFrase++;
      reproducirSiguienteFrase();
      return;
    }

    utteranceActual = new SpeechSynthesisUtterance(textoFrase);
    if (vozSeleccionada) utteranceActual.voice = vozSeleccionada;
    utteranceActual.lang = configIdioma.lang;
    utteranceActual.rate = 0.82;
    utteranceActual.pitch = 0.95;

    utteranceActual.onend = () => {
      indiceFrase++;
      reproducirSiguienteFrase();
    };

    utteranceActual.onerror = () => {
      resetAudioState();
    };

    window.speechSynthesis.speak(utteranceActual);
  }

  // Pequeño delay para evitar bugs de cancelación
  setTimeout(() => reproducirSiguienteFrase(), 150);
}

// Exponer

window.resetAudioState = resetAudioState;
window.hablarTextoPorFrases = hablarTextoPorFrases;
