// core/voz.js

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

// Función global mejorada con control de MediaSession (Bluetooth / Auto)
export function hablarTextoGlobal(texto, listaCompleta = null) {
  if (!("speechSynthesis" in window) || !texto) return;

  // 1. Limpieza total para que no se encimen audios viejos de otros capítulos
  window.speechSynthesis.cancel();

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

  // 2. Configurar controles para el estéreo del auto o auriculares (MediaSession)
  if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: "Palabra Viva - Lectura Bíblica",
      artist: "Acompañamiento Espiritual",
      album: "Catequesis de Confirmación",
      artwork: [
        { src: "img/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "img/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
    });

    navigator.mediaSession.setActionHandler("play", () => {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    });

    navigator.mediaSession.setActionHandler("pause", () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
      }
    });

    navigator.mediaSession.setActionHandler("nexttrack", () => {
      siguienteCapituloAudio();
    });
  }

  window.speechSynthesis.speak(utteranceActual);
}

// Funciones auxiliares para pausar, reanudar o pasar de capítulo desde la UI o el auto
// Función única de Pausa/Reanudación con indicador visual ("freno de mano")
export function alternarPausaAudio() {
  if (!("speechSynthesis" in window)) return;
  const btnPausa = document.getElementById("btn-pausa-lectura");

  if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
    window.speechSynthesis.pause();
    if (btnPausa) btnPausa.classList.add("btn-pausa-activo"); // Prende el testigo
  } else if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
    if (btnPausa) btnPausa.classList.remove("btn-pausa-activo"); // Apaga el testigo
  }
}

// Asegurarnos de apagar el testigo si el audio termina solo o se cancela
function limpiarEstadoPausa() {
  const btnPausa = document.getElementById("btn-pausa-lectura");
  if (btnPausa) btnPausa.classList.remove("btn-pausa-activo");
}

// En tu función hablarTextoGlobal (cuando arranca un audio nuevo), asegurate de limpiar el estado:
// limpiarEstadoPausa();

window.alternarPausaAudio = alternarPausaAudio;
export function reanudarAudioGlobal() {
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }
}

function siguienteCapituloAudio() {
  window.speechSynthesis.cancel();
  if (
    listaCapitulosActual.length > 0 &&
    indiceCapituloActual < listaCapitulosActual.length - 1
  ) {
    indiceCapituloActual++;
    const siguienteTexto = listaCapitulosActual[indiceCapituloActual];
    hablarTextoGlobal(siguienteTexto);
  }
}
// Exponer la función globalmente para que el HTML la reconozca
window.alternarPausaAudio = alternarPausaAudio;
