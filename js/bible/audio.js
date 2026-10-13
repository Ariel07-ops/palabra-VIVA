// js/bible/audio.js
// Módulo de sintetizador de voz y lectura bíblica fluida por frases

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
// 2. MOTOR DE AUDIO BÍBLICO (POR FRASES)
// ==========================================
export function ejecutarLecturaVoz() {
  if (!("speechSynthesis" in window)) {
    alert("Tu dispositivo no soporta la síntesis de voz.");
    return;
  }

  const btnAudio = document.getElementById("btn-hablar-lectura");
  const areaLecturaFinal = document.getElementById("texto-lectura-final");

  if (!areaLecturaFinal) return;

  // --- BOTÓN DETENER / INTERRUPTOR INSTANTÁNEO ---
  if (estaReproduciendo || window.speechSynthesis.speaking) {
    estaReproduciendo = false;
    window.speechSynthesis.cancel();
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

  // 3. SEPARAR EL CAPÍTULO EN FRASES
  const frases = textoLimpio.match(/[^.!?]+[.!?]+/g) || [textoLimpio];

  // 4. Cancelación preventiva del buffer
  window.speechSynthesis.cancel();

  // 5. Cadena de lectura fluida
  setTimeout(() => {
    const idiomaApp =
      window.idiomaActual || localStorage.getItem("idiomaApp") || "es";
    const configIdioma =
      CONFIG_IDIOMAS_VOZ[idiomaApp] || CONFIG_IDIOMAS_VOZ["es"];
    const vozSeleccionada = obtenerVozPorIdioma(idiomaApp);

    let indiceFrase = 0;
    estaReproduciendo = true;

    if (btnAudio) {
      btnAudio.innerHTML = '<i class="fas fa-stop"></i> Detener';
    }

    // Función recursiva que encadena las oraciones
    function reproducirSiguienteFrase() {
      if (!estaReproduciendo || indiceFrase >= frases.length) {
        estaReproduciendo = false;
        window.speechSynthesis.cancel();
        if (btnAudio) {
          btnAudio.innerHTML = '<i class="fas fa-volume-up"></i> Escuchar';
        }
        return;
      }

      const textoFrase = frases[indiceFrase].trim();

      if (!textoFrase) {
        indiceFrase++;
        reproducirSiguienteFrase();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(textoFrase);
      if (vozSeleccionada) utterance.voice = vozSeleccionada;
      utterance.lang = configIdioma.lang;

      // CONFIGURACIÓN REFLEXIVA / PAUSADA
      utterance.rate = 0.82;
      utterance.pitch = 0.95;

      utterance.onend = () => {
        indiceFrase++;
        reproducirSiguienteFrase();
      };

      utterance.onerror = (e) => {
        console.error("Error en frase de voz:", e);
        estaReproduciendo = false;
        window.speechSynthesis.cancel();
        if (btnAudio) {
          btnAudio.innerHTML = '<i class="fas fa-volume-up"></i> Escuchar';
        }
      };

      window.speechSynthesis.speak(utterance);
    }

    reproducirSiguienteFrase();
  }, 150);
}
