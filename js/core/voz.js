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

// Función global que usan Chat, Catequesis, etc.
export function hablarTextoGlobal(texto) {
  if (!("speechSynthesis" in window) || !texto) return;

  window.speechSynthesis.cancel(); // Cancela audios anteriores

  const idiomaApp =
    window.idiomaActual || localStorage.getItem("idiomaApp") || "es";
  const configIdioma =
    CONFIG_IDIOMAS_VOZ[idiomaApp] || CONFIG_IDIOMAS_VOZ["es"];
  const vozSeleccionada = obtenerVozPorIdioma(idiomaApp);

  const utterance = new SpeechSynthesisUtterance(texto);
  if (vozSeleccionada) utterance.voice = vozSeleccionada;
  utterance.lang = configIdioma.lang;

  // CONFIGURACIÓN REFLEXIVA / PAUSADA
  utterance.rate = 0.82;
  utterance.pitch = 0.95;

  window.speechSynthesis.speak(utterance);
}
