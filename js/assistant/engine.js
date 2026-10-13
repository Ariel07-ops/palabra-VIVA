// js/assistant/engine.js
// Núcleo lógico, normalizador y motores de búsqueda del asistente

let esperandoConfirmacionMic = false;
let preguntasExploradasEnSesion = new Set();
let esperandoNombre = false;

export function getEsperandoNombre() {
  return esperandoNombre;
}
export function setEsperandoNombre(valor) {
  esperandoNombre = valor;
}

export function escaparHTML(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

// Helper universal de idioma para el chatbot
export function obtenerTextoIdioma(itemTexto) {
  if (!itemTexto) return "";
  const idioma =
    window.idiomaActual || localStorage.getItem("idiomaApp") || "es";

  let textoObtenido = "";
  if (typeof itemTexto === "object") {
    textoObtenido = itemTexto[idioma] || itemTexto.es || "";
  } else {
    textoObtenido = itemTexto;
  }

  // Inyección automática de nombre
  const nombreActual = localStorage.getItem("nombrePalabraViva") || "amigo";
  textoObtenido = textoObtenido
    .replace(/\$\{nombreIngresado\}/g, nombreActual)
    .replace(/\$\{nombreGuardado\}/g, nombreActual);

  return textoObtenido;
}

// Lista ampliada de palabras a ignorar
const palabrasIgnoradas = new Set([
  "el",
  "la",
  "los",
  "las",
  "un",
  "una",
  "unos",
  "unas",
  "de",
  "del",
  "al",
  "a",
  "en",
  "con",
  "por",
  "para",
  "y",
  "o",
  "u",
  "e",
  "ni",
  "que",
  "qué",
  "cual",
  "cuál",
  "cuales",
  "cuáles",
  "quien",
  "quién",
  "quienes",
  "quiénes",
  "donde",
  "dónde",
  "cuando",
  "cuándo",
  "como",
  "cómo",
  "porque",
  "porqué",
  "si",
  "ya",
  "pero",
  "aunque",
  "sino",
  "me",
  "te",
  "se",
  "nos",
  "les",
  "lo",
  "le",
  "mi",
  "tu",
  "su",
  "este",
  "esta",
  "estos",
  "estas",
  "ese",
  "esa",
  "esos",
  "esas",
  "aquel",
  "aquella",
  "hay",
  "ser",
  "estar",
  "tiene",
  "tienen",
  "soy",
  "eres",
  "es",
  "somos",
  "son",
  "hola",
  "buenas",
  "dias",
  "tardes",
  "noches",
]);

// Normalización robusta
export function normalizarTexto(texto) {
  if (!texto) return "";
  return texto
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[¿?¡!,.;:()[\]{}"'`´]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Extrae palabras válidas
export function obtenerPalabras(texto) {
  return normalizarTexto(texto)
    .split(" ")
    .filter((palabra) => palabra.length > 2 && !palabrasIgnoradas.has(palabra));
}

// Buscador genérico con puntuación
export function buscarEnSeccionJson(texto, seccion) {
  if (!seccion) return null;

  let mejorNodo = null;
  let maxPuntos = 0;

  const calcularPuntos = (nodo) => {
    const keywords = nodo.keywords || nodo.palabras_clave;
    if (!keywords || !Array.isArray(keywords)) return 0;

    let puntos = 0;

    keywords.forEach((kw) => {
      const palabra = typeof kw === "object" ? kw.palabra || kw.texto : kw;
      const pesoExtra = typeof kw === "object" ? kw.peso || 0 : 0;

      const kwLimpia = normalizarTexto(palabra);
      if (!kwLimpia || kwLimpia.length < 3) return;

      if (texto === kwLimpia) {
        puntos += 120 + pesoExtra;
      } else if (
        texto.includes(` ${kwLimpia} `) ||
        texto.startsWith(kwLimpia + " ") ||
        texto.endsWith(" " + kwLimpia)
      ) {
        puntos += 45 + pesoExtra;
      } else if (texto.includes(kwLimpia)) {
        puntos += 18 + pesoExtra;
      }
    });

    return puntos;
  };

  if (Array.isArray(seccion)) {
    seccion.forEach((nodo) => {
      const puntos = calcularPuntos(nodo);
      if (puntos > maxPuntos) {
        maxPuntos = puntos;
        mejorNodo = nodo;
      }
    });
  } else {
    Object.values(seccion).forEach((nodo) => {
      const puntos = calcularPuntos(nodo);
      if (puntos > maxPuntos) {
        maxPuntos = puntos;
        mejorNodo = nodo;
      }
    });
  }

  if (!mejorNodo || maxPuntos < 30) return null;

  if (Array.isArray(mejorNodo.respuestas)) {
    const respAleatoria =
      mejorNodo.respuestas[
        Math.floor(Math.random() * mejorNodo.respuestas.length)
      ];
    return obtenerTextoIdioma(respAleatoria);
  }

  return obtenerTextoIdioma(
    mejorNodo.respuesta || mejorNodo.mensaje || mejorNodo,
  );
}

// Síntesis de voz
export function hacerHablarAlRobot(texto) {
  if (!("speechSynthesis" in window)) return;
  if (!texto) return;

  window.speechSynthesis.cancel();

  const idiomaApp =
    window.idiomaActual || localStorage.getItem("idiomaApp") || "es";
  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang =
    idiomaApp === "en" ? "en-US" : idiomaApp === "pt" ? "pt-BR" : "es-AR";
  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  window.speechSynthesis.speak(utterance);
}
// ==========================================
// EL CAMINO DE LA RAZÓN (Multilingüe: ES, EN, PT)
// ==========================================

const caminoRazonTraducciones = {
  es: [
    {
      paso: 1,
      pregunta:
        "Partamos de algo sencillo: el universo existe, posee un orden inteligible y nosotros podemos conocerlo mediante la razón y la ciencia. También existimos nosotros, capaces de preguntarnos por qué hay algo en vez de nada. ¿Te parece que la existencia del universo necesita una explicación, o considerás que es un hecho sin explicación ulterior?",
      siguiente: 2,
    },
    {
      paso: 2,
      pregunta:
        "La ciencia estudia cómo funcionan los fenómenos observables, mientras que la filosofía pregunta por sus fundamentos: por qué existe el universo y por qué existen seres capaces de conocer la verdad. La investigación científica y la fe no compiten, sino que se ayudan mutuamente. ¿Querés que exploremos cómo las cosas no se explican solo a sí mismas?",
      siguiente: 3,
    },
    {
      paso: 3,
      pregunta:
        "Múltiples realidades que conocemos podrían no haber existido o ser diferentes; son contingentes. Si todo dependiera únicamente de otra realidad contingente, seguiría sin explicarse por qué existe algo. Por eso la razón se pregunta si existe una realidad necesaria. ¿Te hace sentido pensar que hay un fundamento que no recibe de otro su existencia?",
      siguiente: 4,
    },
    {
      paso: 4,
      pregunta:
        "El universo manifiesta orden e inteligibilidad, y en nosotros hay conciencia, libertad y capacidad de reconocer el bien. Esto permite ver que una causa inteligente y personal ofrece una explicación razonable del origen de todo. ¿Queremos dar el último paso para ver cómo esto conecta con la fe?",
      siguiente: 5,
    },
    {
      paso: 5,
      pregunta:
        "La razón nos conduce hasta el umbral: reconoce una causa primera, inteligente y fundamento del ser, a la que llamamos Dios. Pero para conocer su intimidad —que es Trinidad y que se ha revelado en Jesucristo— necesitamos su misma revelación. ¿Te gustaría profundizar en cómo Jesús ilumina todo este camino?",
      siguiente: 6,
    },
    {
      paso: 6,
      pregunta:
        "Aquí se cruzan la cumbre de la filosofía y el centro de la fe: Dios no es solo una Causa Primera lejana, sino que en Jesucristo se hizo historia, carne y cercanía. Jesús es el Verbo que se pone a caminar con nosotros. La razón llega hasta la puerta; Jesús es quien nos abre y nos hace entrar a la casa del Padre. Quédate un momento en silencio y piénsalo para ti: la llave de nuestro corazón la tenemos nosotros del lado de adentro. ¿Cómo puedes hoy abrir esa puerta desde tu libertad para dejar que Dios —que lo único que quiere es tu bien— obre en tu vida? 🧉✨",
      siguiente: 1,
    },
  ],
  en: [
    {
      paso: 1,
      pregunta:
        "Let us start with something simple: the universe exists, possesses an intelligible order, and we can know it through reason and science. We also exist, capable of asking why there is something rather than nothing. Do you think the existence of the universe needs an explanation, or do you consider it a fact without further explanation?",
      siguiente: 2,
    },
    {
      paso: 2,
      pregunta:
        "Science studies how observable phenomena work, while philosophy asks about their foundations: why the universe exists and why beings capable of knowing the truth exist. Scientific research and faith do not compete, but help each other. Would you like us to explore how things do not explain themselves?",
      siguiente: 3,
    },
    {
      paso: 3,
      pregunta:
        "Multiple realities we know could have not existed or been different; they are contingent. If everything depended solely on another contingent reality, it would still be unexplained why anything exists at all. That is why reason asks if a necessary reality exists. Does it make sense to you to think there is a foundation that does not receive its existence from another?",
      siguiente: 4,
    },
    {
      paso: 4,
      pregunta:
        "The universe manifests order and intelligibility, and within us there is consciousness, freedom, and the capacity to recognize good. This allows us to see that an intelligent and personal cause offers a reasonable explanation for the origin of everything. Shall we take the final step to see how this connects with faith?",
      siguiente: 5,
    },
    {
      paso: 5,
      pregunta:
        "Reason leads us to the threshold: it recognizes a first cause, intelligent and foundation of being, whom we call God. But to know His intimacy —which is Trinity and has been revealed in Jesus Christ— we need His very revelation. Would you like to delve deeper into how Jesus illuminates this entire path?",
      siguiente: 6,
    },
    {
      paso: 6,
      pregunta:
        "Here the pinnacle of philosophy and the center of faith intersect: God is not just a distant First Cause, but in Jesus Christ He became history, flesh, and closeness. Jesus is the Word who walks alongside us. Reason reaches the door; Jesus is the one who opens it and lets us enter the Father's house. Stay in silence for a moment and think about it for yourself: the key to our heart is in our own hands on the inside. How can you open that door today from your freedom to let God —whose only desire is your good— work in your life? 🧉✨",
      siguiente: 1,
    },
  ],
  pt: [
    {
      paso: 1,
      pregunta:
        "Partamos de algo simples: o universo existe, possui uma ordem inteligível e nós podemos conhecê-lo por meio da razão e da ciência. Também existimos nós, capazes de nos perguntarmos por que há algo em vez de nada. Você acha que a existência do universo precisa de uma explicação, ou considera que é um fato sem explicação ulterior?",
      siguiente: 2,
    },
    {
      paso: 2,
      pregunta:
        "A ciência estuda como funcionam os fenômenos observáveis, enquanto a filosofia pergunta sobre seus fundamentos: por que o universo existe e por que existem seres capazes de conhecer a verdade. A investigação científica e a fé não compõem, mas se ajudam mutuamente. Queremos explorar como as coisas não se explicam sozinhas?",
      siguiente: 3,
    },
    {
      paso: 3,
      pregunta:
        "Múltiples realidades que conhecemos poderiam não ter existido ou ser diferentes; são contingentes. Se tudo dependesse unicamente de outra realidade contingente, continuaria sem se explicar por que algo existe. Por isso a razão se pergunta se existe uma realidade necessária. Faz sentido para você pensar que há um fundamento que não recebe de outro a sua existência?",
      siguiente: 4,
    },
    {
      paso: 4,
      pregunta:
        "O universo manifesta ordem e inteligibilidade, e em nós há consciência, liberdade e capacidade de reconhecer o bem. Isso nos permite ver que uma causa inteligente e pessoal oferece uma explicação razoável para a origem de tudo. Queremos dar o último passo para ver como isso se conecta com a fé?",
      siguiente: 5,
    },
    {
      paso: 5,
      pregunta:
        "A razão nos conduz até o umbral: reconhece uma causa primeira, inteligente e fundamento do ser, a quem chamamos Deus. Mas para conhecer a sua intimidade — que é Trindade e que se revelou em Jesus Cristo — precisamos da sua própria revelação. Gostaria de aprofundar em como Jesus ilumina todo esse caminho?",
      siguiente: 6,
    },
    {
      paso: 6,
      pregunta:
        "Aqui se cruzam o cume da filosofia e o centro da fé: Deus não é apenas uma Causa Primeira distante, mas em Jesus Cristo Ele se fez história, carne e proximidade. Jesus é o Verbo que se põe a caminhar conosco. A razão chega até a porta; Jesus é quem nos abre e nos faz entrar na casa do Pai. Fique um momento em silêncio e pense nisso para você: a chave do nosso coração está conosco do lado de dentro. Como você pode hoje abrir essa porta a partir de sua liberdade para deixar que Deus — cujo único desejo é o seu bem — obre em sua vida? 🧉✨",
      siguiente: 1,
    },
  ],
};

const textosUIRazon = {
  es: {
    siguiente: "Siguiente paso ➔",
    escuchar: "🔊 Escuchar",
    porAhoraNo: "Por ahora no",
    siQuiero: "¡Sí, vamos por eso! ➔",
    prefijo1: "<strong>El Camino de la Razón</strong><br><br>",
    prefijoResto: "Es una hermosa forma de verlo. Pensando en eso:<br><br>",
    prefijoDecision:
      "Es una hermosa forma de verlo. Entrando de lleno en el corazón de la fe:<br><br>",
    finalAlternativo:
      "Entendido. Hicimos un recorrido excelente por el camino de la razón. La puerta siempre queda abierta para cuando quieras seguir explorando. ¡Podemos charlar de lo que gustes! 🧉✨",
    finalPrincipal:
      "Excelente reflexión. Aquí concluye nuestro recorrido inicial por el Camino de la Razón. ¡Podemos seguir charlando de lo que gustes!",
    errorFin:
      'Hemos recorrido las estaciones principales. ¿Querés que volvamos a empezar escribiendo "razón" o preferís charlar sobre otro tema?',
  },
  en: {
    siguiente: "Next step ➔",
    escuchar: "🔊 Listen",
    porAhoraNo: "Not for now",
    siQuiero: "Yes, let's go for it! ➔",
    prefijo1: "<strong>The Path of Reason</strong><br><br>",
    prefijoResto:
      "That's a beautiful way to see it. Thinking about that:<br><br>",
    prefijoDecision:
      "That's a beautiful way to see it. Entering fully into the heart of faith:<br><br>",
    finalAlternativo:
      "Understood. We've had an excellent journey along the path of reason. The door remains open whenever you want to keep exploring. We can chat about whatever you like! 🧉✨",
    finalPrincipal:
      "Excellent reflection. This concludes our initial journey along the Path of Reason. We can keep chatting about whatever you like!",
    errorFin:
      'We have traveled the main stations. Would you like to start over by typing "reason" or chat about another topic?',
  },
  pt: {
    siguiente: "Próximo passo ➔",
    escuchar: "🔊 Ouvir",
    porAhoraNo: "Por enquanto não",
    siQuiero: "Sim, vamos nessa! ➔",
    prefijo1: "<strong>O Caminho da Razão</strong><br><br>",
    prefijoResto: "É uma bela maneira de ver isso. Pensando nisso:<br><br>",
    prefijoDecision:
      "É uma bela maneira de ver isso. Entrando de cheio no coração da fé:<br><br>",
    finalAlternativo:
      "Entendido. Fizemos um percurso excelente pelo caminho da razão. A porta fica sempre aberta para quando quiser continuar explorando. Podemos conversar sobre o que você quiser! 🧉✨",
    finalPrincipal:
      "Excelente reflexão. Aqui conclui nosso percurso inicial pelo Caminho da Razão. Podemos continuar conversando sobre o que você quiser!",
    errorFin:
      'Percorremos as principais estações. Quer recomeçar escrevendo "razão" ou prefere conversar sobre outro tema?',
  },
};

export let pasoActualRazon = 1;

export function manejarCaminoRazon(mensajeUsuario) {
  const texto = mensajeUsuario.toLowerCase().trim();

  const idiomaActual = localStorage.getItem("idiomaApp") || "es";
  const caminoRazonData =
    caminoRazonTraducciones[idiomaActual] || caminoRazonTraducciones.es;
  const ui = textosUIRazon[idiomaActual] || textosUIRazon.es;

  // Si arranca el recorrido desde cero
  if (
    texto.includes("razón") ||
    texto.includes("razon") ||
    texto.includes("reason") ||
    texto.includes("razão") ||
    texto.includes("orden") ||
    texto.includes("order")
  ) {
    pasoActualRazon = 1;
    window.pasoActualRazon = 1;
    const estacion = caminoRazonData[0];
    return `
      <div>${ui.prefijo1}${estacion.pregunta}</div>
      <div class="camino-razon-botones" style="margin-top: 15px; display: flex; gap: 8px; justify-content: flex-end; align-items: center; flex-wrap: wrap;">
        <button onclick="avanzarCaminoRazonAutomatico()" style="background: #2c3e50; color: white; border: none; padding: 8px 18px; border-radius: 20px; cursor: pointer; font-family: inherit; font-size: 0.9rem; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          ${ui.siguiente}
        </button>
      </div>
    `;
  }

  // Manejo de la decisión cuando estamos parados en el paso 5
  if (pasoActualRazon === 5) {
    pasoActualRazon = 1;
    window.pasoActualRazon = 1;

    if (
      texto.includes("si") ||
      texto.includes("sí") ||
      texto.includes("yes") ||
      texto.includes("sim") ||
      texto.includes("dale") ||
      texto.includes("quiero") ||
      texto.includes("profundizar")
    ) {
      const estacionJesús = caminoRazonData.find((e) => e.paso === 6);
      const textoLimpio = estacionJesús.pregunta
        .replace(/'/g, "\\'")
        .replace(/"/g, "&quot;");

      return `
        <div>${ui.prefijoDecision}${estacionJesús.pregunta}</div>
        <div class="camino-razon-botones" style="margin-top: 15px; display: flex; gap: 8px; justify-content: flex-end; align-items: center; flex-wrap: wrap;">
          <button onclick="leerTextoDirecto('${textoLimpio}')" style="background: #000; color: #fff; border: 1px solid #d4af37; padding: 6px 14px; border-radius: 20px; cursor: pointer; font-size: 12px; display: inline-flex; align-items: center; gap: 4px;">
            ${ui.escuchar}
          </button>
        </div>
      `;
    } else {
      return `
        <div>${ui.finalAlternativo}</div>
      `;
    }
  }

  const estacionActual = caminoRazonData.find(
    (e) => e.paso === pasoActualRazon,
  );

  if (!estacionActual) {
    pasoActualRazon = 1;
    window.pasoActualRazon = 1;
    return ui.errorFin;
  }

  pasoActualRazon = estacionActual.siguiente;
  window.pasoActualRazon = pasoActualRazon;

  const siguienteEstacion = caminoRazonData.find(
    (e) => e.paso === pasoActualRazon,
  );

  if (!siguienteEstacion) {
    pasoActualRazon = 1;
    window.pasoActualRazon = 1;
    return `<div>${ui.finalPrincipal}</div>`;
  }

  const textoLimpio = siguienteEstacion.pregunta
    .replace(/'/g, "\\'")
    .replace(/"/g, "&quot;");

  if (pasoActualRazon === 5) {
    return `
      <div>${ui.prefijoResto}${siguienteEstacion.pregunta}</div>
      <div class="camino-razon-botones" style="margin-top: 15px; display: flex; gap: 8px; justify-content: flex-end; align-items: center; flex-wrap: wrap;">
        <button onclick="leerTextoDirecto('${textoLimpio}')" style="background: #000; color: #fff; border: 1px solid #d4af37; padding: 6px 14px; border-radius: 20px; cursor: pointer; font-size: 12px; display: inline-flex; align-items: center; gap: 4px;">
          ${ui.escuchar}
        </button>
        <button onclick="responderCaminoRazonOpcion('por ahora no')" style="background: #7f8c8d; color: white; border: none; padding: 8px 16px; border-radius: 20px; cursor: pointer; font-family: inherit; font-size: 0.85rem;">
          ${ui.porAhoraNo}
        </button>
        <button onclick="responderCaminoRazonOpcion('sí, quiero profundizar')" style="background: #2c3e50; color: white; border: none; padding: 8px 16px; border-radius: 20px; cursor: pointer; font-family: inherit; font-size: 0.85rem; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          ${ui.siQuiero}
        </button>
      </div>
    `;
  }

  return `
    <div>${ui.prefijoResto}${siguienteEstacion.pregunta}</div>
    <div class="camino-razon-botones" style="margin-top: 15px; display: flex; gap: 8px; justify-content: flex-end; align-items: center; flex-wrap: wrap;">
      <button onclick="leerTextoDirecto('${textoLimpio}')" style="background: #000; color: #fff; border: 1px solid #d4af37; padding: 6px 14px; border-radius: 20px; cursor: pointer; font-size: 12px; display: inline-flex; align-items: center; gap: 4px;">
        ${ui.escuchar}
      </button>
      <button onclick="avanzarCaminoRazonAutomatico()" style="background: #2c3e50; color: white; border: none; padding: 8px 18px; border-radius: 20px; cursor: pointer; font-family: inherit; font-size: 0.9rem; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
        ${ui.siguiente}
      </button>
    </div>
  `;
}

function limpiarBotonesRazonAnteriores() {
  const botonesViejos = document.querySelectorAll(".camino-razon-botones");
  botonesViejos.forEach((el) => el.remove());
}

// Exposición global para callbacks onclick del HTML
window.manejarCaminoRazon = manejarCaminoRazon;
window.pasoActualRazon = pasoActualRazon;

window.avanzarCaminoRazonAutomatico = function () {
  limpiarBotonesRazonAnteriores();
  const siguienteTexto = manejarCaminoRazon("continuar_paso");
  const contenedorMensajes = document.getElementById("chat-mensajes");

  if (contenedorMensajes) {
    const nuevoMensaje = document.createElement("div");
    nuevoMensaje.className = "mensaje-asistente";
    nuevoMensaje.innerHTML = `<strong>Asistente:</strong><br><br>${siguienteTexto}`;
    contenedorMensajes.appendChild(nuevoMensaje);
    contenedorMensajes.scrollTop = contenedorMensajes.scrollHeight;
  }
};

window.responderCaminoRazonOpcion = function (opcionTexto) {
  limpiarBotonesRazonAnteriores();
  const contenedorMensajes = document.getElementById("chat-mensajes");
  if (contenedorMensajes) {
    contenedorMensajes.innerHTML += `<div class="mensaje-usuario">${opcionTexto}</div>`;
  }
  const respuesta = manejarCaminoRazon(opcionTexto);
  if (contenedorMensajes) {
    const nuevoMensaje = document.createElement("div");
    nuevoMensaje.className = "mensaje-asistente";
    nuevoMensaje.innerHTML = `<strong>Asistente:</strong><br><br>${respuesta}`;
    contenedorMensajes.appendChild(nuevoMensaje);
    contenedorMensajes.scrollTop = contenedorMensajes.scrollHeight;
  }
};
// ==========================================
// FUNCIONES AUXILIARES Y RENDERIZADO DE CATEQUESIS
// ==========================================

export function leerTextoDirecto(textoParaLeer) {
  if (!("speechSynthesis" in window)) {
    alert("Tu dispositivo no soporta la síntesis de voz.");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(textoParaLeer);
  utterance.lang = "es-ES";
  window.speechSynthesis.speak(utterance);
}

export function construirRespuestaCatequesis(item) {
  const idioma =
    window.idiomaActual || localStorage.getItem("idiomaApp") || "es";
  const datosIdioma = item[idioma] || item.es || item;

  const tituloPregunta =
    datosIdioma.pregunta_principal || datosIdioma.pregunta || "";
  let html = `<strong>${tituloPregunta}</strong><br><br>`;

  if (datosIdioma.puerta_de_entrada) {
    html += `🌱 <em>${datosIdioma.puerta_de_entrada}</em><br><br>`;
  }

  const textoRespuesta =
    datosIdioma.respuesta_breve || datosIdioma.respuesta || "";
  html += `${textoRespuesta}`;

  if (datosIdioma.paradoja) {
    html += `<br><br>✨ <strong>Para pensar:</strong> ${datosIdioma.paradoja}`;
  }

  if (datosIdioma.aclaracion) {
    html += `<br><br>📖 <em>Nota doctrinal:</em> ${datosIdioma.aclaracion}`;
  }

  if (datosIdioma.paso_concreto) {
    html += `<br><br>💡 <em>Paso concreto:</em> ${datosIdioma.paso_concreto}`;
  }

  if (datosIdioma.oracion) {
    html += `<br><br>🙏 <em>Oración:</em> «${datosIdioma.oracion}»`;
  }

  let referenciasExtras = [];
  if (
    datosIdioma.enseñanza_de_la_iglesia &&
    Array.isArray(datosIdioma.enseñanza_de_la_iglesia)
  ) {
    referenciasExtras.push(...datosIdioma.enseñanza_de_la_iglesia);
  }
  if (datosIdioma.catecismo && Array.isArray(datosIdioma.catecismo)) {
    referenciasExtras.push(...datosIdioma.catecismo);
  }
  if (
    datosIdioma.fundamento_biblico &&
    Array.isArray(datosIdioma.fundamento_biblico)
  ) {
    referenciasExtras.push(...datosIdioma.fundamento_biblico);
  }

  if (referenciasExtras.length > 0) {
    html += `<br><br><span style="font-size: 0.8rem; color: #7f8c8d;">📚 <em>Ref:</em> ${referenciasExtras.join(" | ")}</span>`;
  }

  return html;
}

// Exposición a window para event handlers dinámicos u onclick en HTML
window.leerTextoDirecto = leerTextoDirecto;
window.construirRespuestaCatequesis = construirRespuestaCatequesis;

window.enviarMensajeSugerido = function (textoPregunta) {
  const inputChat = document.getElementById("chat-input");
  if (inputChat) {
    inputChat.value = textoPregunta;
  }
  const btnEnviar =
    document.getElementById("chat-btn-enviar") ||
    document.getElementById("btn-enviar");
  if (btnEnviar) {
    btnEnviar.click();
  }
};
// ==========================================
// EL CAMINO DE LA TRINIDAD (Multilingüe: ES, EN, PT)
// ==========================================

const caminoTrinidadTraducciones = {
  es: [
    {
      paso: 1,
      pregunta:
        "Partamos de una verdad central de nuestra fe: Dios no es una soledad silenciosa, sino una comunión eterna de amor. La fe nos enseña que hay un solo Dios, pero en tres Personas distintas: el Padre, el Hijo y el Espíritu Santo. ¿Te parece que concebir a Dios como comunión de amor cambia la forma en que nos relacionamos con Él?",
      siguiente: 2,
    },
    {
      paso: 2,
      pregunta:
        "Las Personas divinas no se dividen la divinidad; cada una es plenamente Dios, pero relacionada con las otras desde la eternidad. El Padre engendra al Hijo, y el Espíritu Santo procede del Padre y del Hijo como de un solo principio. ¿Querés que sigamos explorando cómo se revela este misterio?",
      siguiente: 3,
    },
    {
      paso: 3,
      pregunta:
        "En el Nuevo Testamento vemos destellos hermosos de esto, como en el bautismo de Jesús en el Jordán: el Hijo se bautiza, el Padre habla desde el cielo y el Espíritu Santo baja en forma de paloma. Dios se nos muestra involucrado en nuestra historia. ¿Te hace sentido pensar que la vida trinitaria es el modelo supremo de todo amor y entrega?",
      siguiente: 4,
    },
    {
      paso: 4,
      pregunta:
        "El Catecismo nos recuerda que la Trinidad es el misterio central de la fe y de la vida cristiana, la fuente de todos los demás misterios. Esto significa que no es un acertijo para resolver con la cabeza, sino el misterio de la vida íntima de Dios al cual somos llamados por gracia. ¿Queremos dar el paso final para ver cómo llevar esto a nuestra vida diaria?",
      siguiente: 5,
    },
    {
      paso: 5,
      pregunta:
        "Llegamos al final del camino. La Trinidad no es solo una verdad para comprender: es el Dios que se nos revela como comunión de amor y nos llama a vivir en comunión con Él y con los demás. Al hacer la señal de la cruz, recordamos que somos del Padre, por el Hijo, en el Espíritu Santo. ¿Qué gesto concreto de escucha, perdón, servicio o reconciliación podés ofrecer hoy para que ese amor se haga visible en tu vida? Cuando lo decidas, hacé la señal de la cruz y pedile a Dios que te ayude a llevarlo a cabo.<br><br><em>«Que cada señal de la cruz te recuerde que el amor de Dios te precede y te envía a amar».</em> 🧉✨",
      siguiente: null,
    },
  ],
  en: [
    {
      paso: 1,
      pregunta:
        "Let us start from a central truth of our faith: God is not a silent solitude, but an eternal communion of love. Faith teaches us that there is one God, but in three distinct Persons: the Father, the Son, and the Holy Spirit. Do you think conceiving of God as a communion of love changes the way we relate to Him?",
      siguiente: 2,
    },
    {
      paso: 2,
      pregunta:
        "The divine Persons do not divide divinity; each is fully God, but related to the others from eternity. The Father begets the Son, and the Holy Spirit proceeds from the Father and the Son as from a single principle. Would you like us to keep exploring how this mystery is revealed?",
      siguiente: 3,
    },
    {
      paso: 3,
      pregunta:
        "In the New Testament we see beautiful glimpses of this, like at Jesus' baptism in the Jordan: the Son is baptized, the Father speaks from heaven, and the Holy Spirit descends in the form of a dove. God shows Himself involved in our history. Does it make sense to you to think that trinitarian life is the supreme model of all love and self-giving?",
      siguiente: 4,
    },
    {
      paso: 4,
      pregunta:
        "The Catechism reminds us that the Trinity is the central mystery of faith and Christian life, the source of all other mysteries. This means it is not a riddle to be solved with our heads, but the mystery of God's intimate life to which we are called by grace. Shall we take the final step to see how to bring this into our daily lives?",
      siguiente: 5,
    },
    {
      paso: 5,
      pregunta:
        "We have reached the end of the road. The Trinity is not just a truth to be understood: it is the God who reveals Himself to us as a communion of love and calls us to live in communion with Him and with others. When making the sign of the cross, we remember that we belong to the Father, through the Son, in the Holy Spirit. What concrete gesture of listening, forgiveness, service, or reconciliation can you offer today to make that love visible in your life? When you decide, make the sign of the cross and ask God to help you carry it out.<br><br><em>«May every sign of the cross remind you that God's love precedes you and sends you to love».</em> 🧉✨",
      siguiente: null,
    },
  ],
  pt: [
    {
      paso: 1,
      pregunta:
        "Partamos de uma verdade central da nossa fé: Deus não é uma solidão silenciosa, mas uma comunhão eterna de amor. A fé nos ensina que há um só Deus, mas em três Pessoas distintas: o Pai, o Filho e o Espírito Santo. Você acha que conceber a Deus como comunhão de amor muda a maneira como nos relacionamos com Ele?",
      siguiente: 2,
    },
    {
      paso: 2,
      pregunta:
        "As Pessoas divinas não dividem a divindade; cada uma é plenamente Deus, mas relacionada com as outras desde a eternidade. O Pai gera o Filho, e o Espírito Santo procede do Pai e do Filho como de um único princípio. Queremos continuar explorando como este mistério se revela?",
      siguiente: 3,
    },
    {
      paso: 3,
      pregunta:
        "No Novo Testamento vemos belos lampejos disso, como no batismo de Jesus no Jordão: o Filho é batizado, o Pai fala do céu e o Espírito Santo desce em forma de pomba. Deus se nos mostra envolvido em nossa história. Faz sentido para você pensar que a vida trinitária é o modelo supremo de todo amor e entrega?",
      siguiente: 4,
    },
    {
      paso: 4,
      pregunta:
        "O Catecismo nos lembra que a Trindade é o mistério central da fé e da vida cristã, a fonte de todos os outros mistérios. Isso significa que não é um enigma para resolver com a cabeça, mas o mistério da vida íntima de Deus para o qual somos chamados por graça. Queremos dar o passo final para ver como levar isso para a nossa vida diária?",
      siguiente: 5,
    },
    {
      paso: 5,
      pregunta:
        "Chegamos ao fim do caminho. A Trindade não é apenas uma verdade para compreender: é o Deus que se nos revela como comunhão de amor e nos chama a viver em comunhão com Ele e com os outros. Ao fazer o sinal da cruz, lembramos que somos do Pai, por o Filho, no Espírito Santo. Que gesto concreto de escuta, perdão, serviço ou reconcilição você pode oferecer hoje para que esse amor se faça visível em sua vida? Quando decidir, faça o sinal da cruz e peça a Deus que o ajude a realizá-lo.<br><br><em>«Que cada sinal da cruz lembre que o amor de Deus o precede e o envia a amar».</em> 🧉✨",
      siguiente: null,
    },
  ],
};

const textosUITrinidad = {
  es: {
    siguiente: "Siguiente paso ➔",
    escuchar: "🔊 Escuchar",
    finalMsg:
      'Hemos recorrido las estaciones principales de la Trinidad. ¿Querés que volvamos a empezar escribiendo "Trinidad" o preferís charlar sobre otro tema?',
    prefijo1: "<strong>El Camino de la Trinidad</strong><br><br>",
    prefijoResto: "Es una hermosa forma de verlo. Pensando en eso:<br><br>",
  },
  en: {
    siguiente: "Next step ➔",
    escuchar: "🔊 Listen",
    finalMsg:
      'We have traveled the main stations of the Trinity. Would you like to start over by typing "Trinity" or chat about another topic?',
    prefijo1: "<strong>The Path of the Trinity</strong><br><br>",
    prefijoResto:
      "That's a beautiful way to see it. Thinking about that:<br><br>",
  },
  pt: {
    siguiente: "Próximo passo ➔",
    escuchar: "🔊 Ouvir",
    finalMsg:
      'Percorremos as principais estações da Trindade. Quer recomeçar escrevendo "Trindade" ou prefere conversar sobre outro tema?',
    prefijo1: "<strong>O Caminho da Trindade</strong><br><br>",
    prefijoResto: "É uma bela maneira de ver isso. Pensando nisso:<br><br>",
  },
};

export let pasoActualTrinidad = 1;

export function manejarCaminoTrinidad(mensajeUsuario) {
  const texto = mensajeUsuario.toLowerCase().trim();

  const idiomaActual = localStorage.getItem("idiomaApp") || "es";
  const caminoTrinidadData =
    caminoTrinidadTraducciones[idiomaActual] || caminoTrinidadTraducciones.es;
  const ui = textosUITrinidad[idiomaActual] || textosUITrinidad.es;

  // Si arranca el recorrido desde cero
  if (
    texto.includes("trinidad") ||
    texto.includes("trity") ||
    texto.includes("trindade") ||
    texto.includes("trino") ||
    texto.includes("dios uno")
  ) {
    pasoActualTrinidad = 1;
    window.pasoActualTrinidad = 1;
  }

  // Buscamos la estación actual
  const estacionActual = caminoTrinidadData.find(
    (e) => e.paso === pasoActualTrinidad,
  );

  if (!estacionActual) {
    pasoActualTrinidad = 1;
    window.pasoActualTrinidad = 1;
    return ui.finalMsg;
  }

  // Preparamos el texto limpio para la locución por voz
  const textoLimpio = estacionActual.pregunta
    .replace(/'/g, "\\'")
    .replace(/"/g, "&quot;")
    .replace(/<br>/g, " ")
    .replace(/<em>|<\/em>/g, "");

  let botonesHtml = "";

  if (estacionActual.paso === 5) {
    // --- PASO 5 (FINAL) ---
    botonesHtml = `
      <div class="trinidad-botones-activos" style="margin-top: 15px; display: flex; gap: 8px; justify-content: flex-end; align-items: center; flex-wrap: wrap;">
        <button onclick="leerTextoDirecto('${textoLimpio}')" style="background: #000; color: #fff; border: 1px solid #d4af37; padding: 6px 14px; border-radius: 20px; cursor: pointer; font-size: 12px; display: inline-flex; align-items: center; gap: 4px;">
          ${ui.escuchar}
        </button>
      </div>
    `;
    pasoActualTrinidad = 1;
    window.pasoActualTrinidad = 1;
  } else if (estacionActual.paso === 1) {
    // --- PASO 1 ---
    botonesHtml = `
      <div class="trinidad-botones-activos" style="margin-top: 15px; display: flex; gap: 8px; justify-content: flex-end; align-items: center; flex-wrap: wrap;">
        <button onclick="avanzarCaminoTrinidadAutomatico()" style="background: #2c3e50; color: white; border: none; padding: 8px 18px; border-radius: 20px; cursor: pointer; font-family: inherit; font-size: 0.9rem; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          ${ui.siguiente}
        </button>
      </div>
    `;
    pasoActualTrinidad++;
    window.pasoActualTrinidad = pasoActualTrinidad;
  } else {
    // --- PASOS INTERMEDIOS (2 a 4) ---
    botonesHtml = `
      <div class="trinidad-botones-activos" style="margin-top: 15px; display: flex; gap: 8px; justify-content: flex-end; align-items: center; flex-wrap: wrap;">
        <button onclick="leerTextoDirecto('${textoLimpio}')" style="background: #000; color: #fff; border: 1px solid #d4af37; padding: 6px 14px; border-radius: 20px; cursor: pointer; font-size: 12px; display: inline-flex; align-items: center; gap: 4px;">
          ${ui.escuchar}
        </button>
        <button onclick="avanzarCaminoTrinidadAutomatico()" style="background: #2c3e50; color: white; border: none; padding: 8px 18px; border-radius: 20px; cursor: pointer; font-family: inherit; font-size: 0.9rem; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          ${ui.siguiente}
        </button>
      </div>
    `;
    pasoActualTrinidad++;
    window.pasoActualTrinidad = pasoActualTrinidad;
  }

  const prefijo = estacionActual.paso === 1 ? ui.prefijo1 : ui.prefijoResto;

  return `
    <div>${prefijo}${estacionActual.pregunta}</div>
    ${botonesHtml}
  `;
}

function limpiarBotonesTrinidadAnteriores() {
  const botonesViejos = document.querySelectorAll(".trinidad-botones-activos");
  botonesViejos.forEach((el) => el.remove());
}

// Exposición global para callbacks onclick dinámicos
window.manejarCaminoTrinidad = manejarCaminoTrinidad;
window.pasoActualTrinidad = pasoActualTrinidad;

window.avanzarCaminoTrinidadAutomatico = function () {
  limpiarBotonesTrinidadAnteriores();
  const siguienteTexto = manejarCaminoTrinidad("continuar_paso");
  const contenedorMensajes = document.getElementById("chat-mensajes");

  if (contenedorMensajes) {
    const nuevoMensaje = document.createElement("div");
    nuevoMensaje.className = "mensaje-asistente";
    nuevoMensaje.innerHTML = `<strong>Asistente:</strong><br><br>${siguienteTexto}`;
    contenedorMensajes.appendChild(nuevoMensaje);
    contenedorMensajes.scrollTop = contenedorMensajes.scrollHeight;
  }
};
// ==========================================
// EL CAMINO DEL ALMA (Multilingüe: ES, EN, PT)
// ==========================================

const caminoAlmaTraducciones = {
  es: [
    {
      paso: 1,
      pregunta:
        "Hay una idea extraña que a veces se nos mete sin que la notemos: que el cuerpo sería una especie de envase y que el verdadero «yo» estaría escondido adentro, como un pasajero en un tren. Pero la fe cristiana nos propone algo más sorprendente: <strong>no sos un alma que tiene un cuerpo; sos una persona, cuerpo y alma</strong>.<br><br>Tu risa, tus manos, tu voz, el cansancio que sentís y el abrazo que das no son accesorios de tu vida. También son parte de tu historia. Dios creó el cuerpo y lo llama bueno; por eso, no tenemos que despreciarlo, sino cuidarlo y emplearlo para el bien. ¿Qué cambiaría en tu manera de tratar tu cuerpo y el de los demás si recordaras que toda persona tiene una dignidad inmensa ante Dios?",
      siguiente: 2,
    },
    {
      paso: 2,
      pregunta:
        "El alma no es una pequeña persona escondida detrás de tus ojos, ni una chispa de Dios desprendida de Él. Es el principio espiritual por el que este cuerpo es un cuerpo humano vivo y por el que podemos conocer, elegir y amar. <strong>No sos dos seres pegados: sos una sola persona, con una vida corporal y espiritual profundamente unidas.</strong><br><br>Y aquí aparece uno de esos misterios que parecen sencillos hasta que uno se detiene a mirarlos: podemos tocar el mundo con las manos y, sin embargo, preguntarnos por la verdad, el bien, la belleza y Dios. No somos menos corporales por tener alma, ni menos espirituales por tener cuerpo. ¿Qué pregunta importante lleva hoy tu corazón más allá de lo inmediato?",
      siguiente: 3,
    },
    {
      paso: 3,
      pregunta:
        "Tu dignidad no depende de ser joven, fuerte, exitoso, independiente o admirado. No es un premio que se obtiene por portarse bien ni un trofeo que se pierde cuando uno fracasa. Cada ser humano es querido por Dios y tiene una profundidad que ninguna etiqueta puede abarcar. Al entrar en lo más íntimo de sí, la persona puede descubrir que Dios la conoce y la espera.<br><br>Eso cambia la manera de mirar al prójimo. El que está enfermo no es «solo una carga»; el anciano no es «alguien que ya no sirve»; el pobre no es «un problema»; el desconocido no es «uno más». Cada persona es alguien, nunca simplemente algo. ¿A quién podrías mirar hoy con más paciencia y reconocer con un gesto concreto su dignidad?",
      siguiente: 4,
    },
    {
      paso: 4,
      pregunta:
        "La muerte nos duele porque no es una ilusión ni una puerta giratoria por la que nada importante se pierde. Separa el cuerpo y el alma, y esa separación es una herida. La Iglesia enseña que el alma espiritual subsiste después de la muerte, pero ese estado no es la meta definitiva ni significa que el cuerpo fuera un envoltorio desechable. La esperanza cristiana es la resurrección: Dios quiere salvar a la persona entera.<br><br>Por eso nuestra esperanza no consiste en escapar de la creación, sino en que Dios la lleve a su plenitud. Cristo resucitado no dejó su cuerpo en la tumba: la fe espera también la resurrección de nuestros cuerpos. Cuando extrañamos a alguien que murió, no fingimos que la separación no duele; confiamos a esa persona a Dios y esperamos la vida nueva que Él promete. ¿Hay alguien por quien quieras dar gracias o por quien quieras rezar hoy?",
      siguiente: 5,
    },
    {
      paso: 5,
      pregunta:
        "Llegamos al final del camino, pero no al final del misterio. Sos una persona querida por Dios: una unidad de cuerpo y alma, con una historia concreta, llamada a una vida que la muerte no puede completar por sola. La esperanza cristiana no dice que el cuerpo no importa; dice que Dios no abandona lo que creó y que nos llama a la resurrección.<br><br>Entonces, ¿qué gesto concreto podés hacer hoy para honrar la dignidad de tu vida y la de alguien más? Tal vez descansar sin culpa, pedir ayuda, reconciliarte, acompañar a una persona sola o cuidar con ternura a alguien enfermo. Elegí uno, aunque sea pequeño, y hacelo por amor. Porque a veces el alma no necesita escapar del mundo: necesita aprender, con todo el cuerpo, a amar en él.",
      siguiente: null,
    },
  ],
  en: [
    {
      paso: 1,
      pregunta:
        "There is a strange idea that sometimes creeps into us without us noticing: that the body is a kind of container and the true 'I' is hidden inside, like a passenger on a train. But the Christian faith proposes something more surprising: <strong>you are not a soul that has a body; you are a person, body and soul</strong>.<br><br>Your laughter, your hands, your voice, the tiredness you feel, and the hug you give are not accessories of your life. They are also part of your history. God created the body and calls it good; therefore, we must not despise it, but care for it and use it for good. What would change in the way you treat your body and that of others if you remembered that every person has immense dignity before God?",
      siguiente: 2,
    },
    {
      paso: 2,
      pregunta:
        "The soul is not a little person hidden behind your eyes, nor a spark of God detached from Him. It is the spiritual principle by which this body is a living human body and through which we can know, choose, and love. <strong>You are not two beings glued together: you are a single person, with a bodily and spiritual life deeply united.</strong><br><br>And here appears one of those mysteries that seem simple until one stops to look at them: we can touch the world with our hands and yet ask ourselves about truth, good, beauty, and God. We are not less bodily for having a soul, nor less spiritual for having a body. What important question does your heart carry today beyond the immediate?",
      siguiente: 3,
    },
    {
      paso: 3,
      pregunta:
        "Your dignity does not depend on being young, strong, successful, independent, or admired. It is not a prize obtained by behaving well nor a trophy lost when one fails. Every human being is loved by God and has a depth that no label can encompass. By entering into the innermost part of oneself, a person can discover that God knows them and awaits them.<br><br>This changes the way we look at our neighbor. The sick person is not 'just a burden'; the elderly person is not 'someone who is no longer useful'; the poor person is not 'a problem'; the stranger is not 'just another one'. Every person is someone, never simply something. Who could you look at today with more patience and recognize with a concrete gesture their dignity?",
      siguiente: 4,
    },
    {
      paso: 4,
      pregunta:
        "Death hurts us because it is not an illusion or a revolving door through which nothing important is lost. It separates body and soul, and that separation is a wound. The Church teaches that the spiritual soul subsists after death, but that state is not the final goal nor does it mean the body was a disposable wrapper. Christian hope is the resurrection: God wants to save the whole person.<br><br>Therefore, our hope does not consist in escaping creation, but in God bringing it to its fullness. Risen Christ did not leave His body in the tomb: faith also awaits the resurrection of our bodies. When we miss someone who has died, we do not pretend that the separation does not hurt; we entrust that person to God and await the new life He promises. Is there someone you want to give thanks for or pray for today?",
      siguiente: 5,
    },
    {
      paso: 5,
      pregunta:
        "We have reached the end of the road, but not the end of the mystery. You are a person loved by God: a unity of body and soul, with a concrete history, called to a life that death cannot complete alone. Christian hope does not say that the body does not matter; it says that God does not abandon what He created and calls us to resurrection.<br><br>So, what concrete gesture can you make today to honor the dignity of your life and someone else's? Perhaps rest without guilt, ask for help, reconcile, accompany a lonely person, or tenderly care for someone who is sick. Choose one, even if it is small, and do it out of love. Because sometimes the soul does not need to escape the world: it needs to learn, with the whole body, to love in it.",
      siguiente: null,
    },
  ],
  pt: [
    {
      paso: 1,
      pregunta:
        "Há uma ideia estranha que às vezes se infiltra em nós sem que percebamos: que o corpo seria uma espécie de recipiente e que o verdadeiro 'eu' estaria escondido dentro, como um passageiro em um trem. Mas a fé cristã nos propõe algo mais surpreendente: <strong>você não é uma alma que tem um corpo; você é uma pessoa, corpo e alma</strong>.<br><br>Sua risada, suas mãos, sua voz, o cansaço que você sente e o abraço que você dá não são acessórios da sua vida. Eles também fazem parte da sua história. Deus criou o corpo e o chama de bom; portanto, não devemos desprezá-lo, mas cuidá-lo e usá-lo para o bem. O que mudaria na maneira como você trata o seu corpo e o dos outros se você lembrasse que toda pessoa tem uma dignidade imensa diante de Deus?",
      siguiente: 2,
    },
    {
      paso: 2,
      pregunta:
        "A alma não é uma pequena pessoa escondida atrás de seus olhos, nem uma faísca de Deus destacada dEle. É o princípio espiritual pelo qual este corpo é um corpo humano vivo e pelo qual podemos conhecer, escolher e amar. <strong>Você não é dois seres colados: você é uma única pessoa, com uma vida corporal e espiritual profundamente unidas.</strong><br><br>E aqui surge um daqueles mistérios que parecem simples até que alguém pare para olhar para eles: podemos tocar o mundo com as mãos e, no entanto, nos perguntar sobre a verdade, o bem, a beleza e Deus. Não somos menos corporais por termos alma, nem menos espirituais por termos corpo. Que pergunta importante o seu coração carrega hoje além do imediato?",
      siguiente: 3,
    },
    {
      paso: 3,
      pregunta:
        "Sua dignidade não depende de ser jovem, forte, bem-sucedido, independente ou admirado. Não é um prêmio obtido por se comportar bem nem um troféu perdido quando se fracassa. Cada ser humano é amado por Deus e tem uma profundidade que nenhum rótulo pode abranger. Ao entrar no mais íntimo de si, a pessoa pode descobrir que Deus a conhece e a espera.<br><br>Isso muda a maneira de olhar para o próximo. A pessoa doente não é 'apenas um fardo'; o idoso não é 'alguém que não serve mais'; o pobre não é ' um problema'; o desconhecido não é 'mais um'. Cada pessoa é alguém, nunca simplesmente algo. Quem você poderia olhar hoje com mais paciência e reconhecer com um gesto concreto a sua dignidade?",
      siguiente: 4,
    },
    {
      paso: 4,
      pregunta:
        "A morte nos dói porque não é uma ilusão nem uma porta giratória pela qual nada de importante é perdido. Ela separa o corpo e a alma, e essa separação é uma ferida. A Igreja ensina que a alma espiritual subsiste após a morte, mas esse estado não é a meta definitiva nem significa que o corpo fosse um invólucro descartável. A esperança cristã é a ressurreição: Deus quer salvar a pessoa inteira.<br><br>Por isso, nossa esperança não consiste em escapar da criação, mas em que Deus a leve à sua plenitude. Cristo ressuscitado não deixou seu corpo no túmulo: a fé também aguarda a ressurreição de nossos corpos. Quando sentimos falta de alguém que morreu, não fingimos que a separação não dói; confiamos essa pessoa a Deus e aguardamos a nova vida que Ele promete. Há alguém por quem você queira agradecer ou por quem queira rezar hoje?",
      siguiente: 5,
    },
    {
      paso: 5,
      pregunta:
        "Chegamos ao fim do caminho, mas não ao fim do mistério. Você é uma pessoa amada por Deus: uma unidade de corpo e alma, com uma história concreta, chamada a uma vida que a morte não pode completar sozinha. A esperança cristã não diz que o corpo não importa; diz que Deus não abandona o que criou e nos chama à ressurreição.<br><br>Então, que gesto concreto você pode fazer hoje para honrar a dignidade da sua vida e a de outra pessoa? Talvez descansar sem culpa, pedir ajuda, se reconciliar, acompanhar uma pessoa sozinha ou cuidar com ternura de alguém doente. Escolha um, mesmo que seja pequeno, e faça-o por amor. Porque às vezes a alma não precisa escapar do mundo: ela precisa aprender, com todo o corpo, a amar nele.",
      siguiente: null,
    },
  ],
};

const textosUIAlma = {
  es: {
    siguiente: "Siguiente paso ➔",
    escuchar: "🔊 Escuchar",
    finalMsg:
      "Hemos recorrido las estaciones principales del Camino del Alma. ¿Querés que volvamos a empezar?",
  },
  en: {
    siguiente: "Next step ➔",
    escuchar: "🔊 Listen",
    finalMsg:
      "We have traveled the main stations of the Path of the Soul. Would you like to start over?",
  },
  pt: {
    siguiente: "Próximo passo ➔",
    escuchar: "🔊 Ouvir",
    finalMsg:
      "Percorremos as principais estações do Caminho da Alma. Quer recomeçar?",
  },
};

export let pasoActualAlma = 1;

export function manejarCaminoAlma(mensajeUsuario) {
  const texto = mensajeUsuario.toLowerCase().trim();

  const idiomaActual = localStorage.getItem("idiomaApp") || "es";
  const caminoAlmaData =
    caminoAlmaTraducciones[idiomaActual] || caminoAlmaTraducciones.es;
  const ui = textosUIAlma[idiomaActual] || textosUIAlma.es;

  if (
    texto.includes("alma") ||
    texto.includes("cuerpo y alma") ||
    texto.includes("body and soul") ||
    texto.includes("soul") ||
    texto.includes("caminho da alma")
  ) {
    pasoActualAlma = 1;
    window.pasoActualAlma = 1;
  }

  const estacionActual = caminoAlmaData.find((e) => e.paso === pasoActualAlma);

  if (!estacionActual) {
    pasoActualAlma = 1;
    window.pasoActualAlma = 1;
    return ui.finalMsg;
  }

  const textoLimpio = estacionActual.pregunta
    .replace(/<[^>]*>?/gm, "")
    .replace(/'/g, "\\'")
    .replace(/"/g, "&quot;");

  let botonesHtml = "";

  if (estacionActual.paso === 1) {
    botonesHtml = `
      <div class="alma-botones-activos" style="margin-top: 15px; display: flex; gap: 8px; justify-content: flex-end; align-items: center; flex-wrap: wrap;">
        <button onclick="avanzarCaminoAlmaAutomatico()" style="background: #2c3e50; color: white; border: none; padding: 8px 18px; border-radius: 20px; cursor: pointer; font-family: inherit; font-size: 0.9rem; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          ${ui.siguiente}
        </button>
      </div>
    `;
    pasoActualAlma = estacionActual.siguiente;
    window.pasoActualAlma = pasoActualAlma;
  } else if (estacionActual.paso === 5) {
    botonesHtml = `
      <div class="alma-botones-activos" style="margin-top: 15px; display: flex; gap: 8px; justify-content: flex-end; align-items: center; flex-wrap: wrap;">
        <button onclick="leerTextoDirecto('${textoLimpio}')" style="background: #000; color: #fff; border: 1px solid #d4af37; padding: 6px 14px; border-radius: 20px; cursor: pointer; font-size: 12px; display: inline-flex; align-items: center; gap: 4px;">
          ${ui.escuchar}
        </button>
      </div>
    `;
    pasoActualAlma = 1;
    window.pasoActualAlma = 1;
  } else {
    botonesHtml = `
      <div class="alma-botones-activos" style="margin-top: 15px; display: flex; gap: 8px; justify-content: flex-end; align-items: center; flex-wrap: wrap;">
        <button onclick="leerTextoDirecto('${textoLimpio}')" style="background: #000; color: #fff; border: 1px solid #d4af37; padding: 6px 14px; border-radius: 20px; cursor: pointer; font-size: 12px; display: inline-flex; align-items: center; gap: 4px;">
          ${ui.escuchar}
        </button>
        <button onclick="avanzarCaminoAlmaAutomatico()" style="background: #2c3e50; color: white; border: none; padding: 8px 18px; border-radius: 20px; cursor: pointer; font-family: inherit; font-size: 0.9rem; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          ${ui.siguiente}
        </button>
      </div>
    `;
    pasoActualAlma = estacionActual.siguiente;
    window.pasoActualAlma = pasoActualAlma;
  }

  const prefijo =
    estacionActual.paso === 1
      ? "<strong>El Camino del Alma</strong><br><br>"
      : "";

  return `
    <div>${prefijo}${estacionActual.pregunta}</div>
    ${botonesHtml}
  `;
}

function limpiarBotonesAlmaAnteriores() {
  const botonesViejos = document.querySelectorAll(".alma-botones-activos");
  botonesViejos.forEach((el) => el.remove());
}

// Exposición global para callbacks HTML onclick
window.manejarCaminoAlma = manejarCaminoAlma;
window.pasoActualAlma = pasoActualAlma;

window.avanzarCaminoAlmaAutomatico = function () {
  limpiarBotonesAlmaAnteriores();
  const siguienteTexto = manejarCaminoAlma("continuar_paso");
  const contenedorMensajes = document.getElementById("chat-mensajes");

  if (contenedorMensajes) {
    const nuevoMensaje = document.createElement("div");
    nuevoMensaje.className = "mensaje-asistente";
    nuevoMensaje.innerHTML = `<strong>Asistente:</strong><br><br>${siguienteTexto}`;
    contenedorMensajes.appendChild(nuevoMensaje);
    contenedorMensajes.scrollTop = contenedorMensajes.scrollHeight;
  }
};
// ==========================================
// EL CAMINO DE LA PASCUA (Multilingüe: ES, EN, PT)
// ==========================================

const caminoPascuaTraducciones = {
  es: [
    {
      paso: 1,
      pregunta:
        "A veces miramos una cruz y pensamos que es el monumento definitivo al fracaso. Pero la gran sorpresa de la Pascua es exactamente al revés: es el trono desde donde Dios le gana la pulseada al mal. En la cruz, Cristo no vino a hacer teatro ni a sufrir por deporte; se entregó libremente por amor y cargó con nuestros pecados para reconciliarnos con el Padre. ¿Qué le decís en tu interior a un Dios que prefiere jugarse el pellejo antes que dejarnos sueltos en nuestra miseria?",
      siguiente: 2,
    },
    {
      paso: 2,
      pregunta:
        "El Viernes Santo nos deja con un silencio espeso, de esos donde parece que los malos ganaron la partida y la historia se cerró con llave. Pero la Iglesia nos enseña algo insólito: en ese tramo, Jesús descendió a los infiernos. No como un derrotado que cae al calabozo, sino como el Libertador que patea la puerta de adentro para ir a buscar a los justos que lo esperaban. ¡Hasta en la muerte misma se metió el Autor de la vida! ¿Cómo te impacta saber que ni el fondo del abismo queda fuera de su radio de acción?",
      siguiente: 3,
    },
    {
      paso: 3,
      pregunta:
        "El Sábado es el día del gran silencio. El mundo sigue girando como si nada, los discípulos están escondidos con llave y da la sensación de que Dios se tomó franco indefinido. Es el clásico día donde no pasa nada y, sin embargo, se juega todo. A veces transitamos nuestros propios sábados santos, esos callejones oscuros donde las respuestas no aparecen y la baraja parece venir cambiada. El Sábado Santo nos enseña el arte de esperar en la penumbra sin salir corriendo a inventar salvaciones truchas. ¿Cómo llevás tus propias esperas cuando la luz tarda en prenderse?",
      siguiente: 4,
    },
    {
      paso: 4,
      pregunta:
        "Y cuando ya nos estábamos acostumbrando a la penumbra, salta la sorpresa: el domingo. La piedra rodada, la tumba vacía y las risas incrédulas de los que creían que el cajón era el punto final. La Resurrección no es un cuento para dormir niños ni un consuelo psicológico, sino el hecho más sacudiénte de la historia que inaugura una creación nueva. Y atención a la paradoja: la esperanza cristiana no es la de un alma flotando en el éter, sino la de Dios rescatando a la persona entera, carne y hueso incluidos. ¿Qué peso de tus tristezas te gustaría dejar hoy bien atado frente al sepulcro vacío?",
      siguiente: 5,
    },
    {
      paso: 5,
      pregunta:
        "Llegamos al final del recorrido pascual, pero resulta que es el arranque de nuestra verdadera aventura. Resucitar con Cristo no es una cuestión de portarse bien para ganarse un premio, sino de dejarse invadir por su gracia. Es darnos cuenta de que el rencor y el egoísmo son modas viejas y aburridas, y que perdonar o servir es estrenar la vida nueva del cielo acá abajo. Cada gesto gratuito de amor es una prueba de que el Resucitado anda suelto por el barrio. ¿Qué gesto de vida nueva vas a regalar hoy para que se note que la muerte perdió?",
      siguiente: null,
    },
  ],
  en: [
    {
      paso: 1,
      pregunta:
        "Sometimes we look at a cross and think it is the ultimate monument to failure. But the great surprise of Easter is the exact opposite: it is the throne from which God wins the match against evil. On the cross, Christ did not come to put on a show or suffer for sport; He gave Himself freely out of love and bore our sins to reconcile us with the Father. What do you say in your heart to a God who prefers to risk His skin rather than leave us abandoned in our misery?",
      siguiente: 2,
    },
    {
      paso: 2,
      pregunta:
        "Good Friday leaves us with a thick silence, the kind where it seems the bad guys won and history was locked away. But the Church teaches us something extraordinary: in that stretch, Jesus descended into the depths. Not as a defeated one falling into a dungeon, but as the Liberator kicking the door open from the inside to go find the righteous who awaited Him. Even into death itself went the Author of life! How does it impact you to know that not even the bottom of the abyss is out of His reach?",
      siguiente: 3,
    },
    {
      paso: 3,
      pregunta:
        "Saturday is the day of great silence. The world keeps spinning as if nothing happened, the disciples are hiding behind locked doors, and it feels like God took an indefinite day off. It is the classic day where nothing happens and yet everything is at stake. Sometimes we walk through our own Holy Saturdays, those dark alleys where answers don't appear. Holy Saturday teaches us the art of waiting in the dim light without running off to invent fake salvations. How do you handle your own waits when the light takes time to turn on?",
      siguiente: 4,
    },
    {
      paso: 4,
      pregunta:
        "And just when we were getting used to the gloom, the surprise happens: Sunday. The rolled-away stone, the empty tomb, and the incredulous laughter of those who thought the grave was the end. The Resurrection is not a bedtime story or psychological comfort, but history's most earth-shaking event. And pay attention to the paradox: Christian hope is not a soul floating in the ether, but God rescuing the whole person, body and soul included. What weight of your sorrows would you like to leave well tied up in front of the empty tomb today?",
      siguiente: 5,
    },
    {
      paso: 5,
      pregunta:
        "We reach the end of the Easter journey, but it turns out to be the beginning of our true adventure. Rising with Christ is not about behaving to earn a prize, but letting ourselves be invaded by His grace. It's realizing that resentment and selfishness are old, boring fads, and that forgiving or serving is premiering the new life of heaven right down here. Every free gesture of love is proof that the Risen One is loose in the neighborhood. What gesture of new life will you give today to show that death lost?",
      siguiente: null,
    },
  ],
  pt: [
    {
      paso: 1,
      pregunta:
        "Às vezes olhamos para uma cruz e pensamos que é o monumento definitivo ao fracasso. Mas a grande surpresa da Páscoa é exatamente o oposto: é o trono de onde Deus vence o mal. Na cruz, Cristo não veio fazer teatro nem sofrer por esporte; entregou-se livremente por amor e carregou nossos pecados para nos reconciliar com o Pai. O que você diz em seu interior a um Deus que prefere arriscar a pele a nos deixar soltos em nossa miséria?",
      siguiente: 2,
    },
    {
      paso: 2,
      pregunta:
        "A Sexta-Feira Santa nos deixa com um silêncio denso, daqueles onde parece que os maus venceram e a história foi trancada a chave. Mas a Igreja nos ensina algo insólito: nesse trecho, Jesus desceu aos infernos. Não como um derrotado que cai no calabouço, mas como o Libertador que arromba a porta por dentro para ir buscar os justos que o esperavam. Até na própria morte entrou o Autor da vida! Como te impacta saber que nem o fundo do abismo fica fora de seu raio de acción?",
      siguiente: 3,
    },
    {
      paso: 3,
      pregunta:
        "O Sábado é o dia do grande silêncio. O mundo continua girando como se nada, os discípulos estão escondidos a chave e dá a sensação de que Deus tirou folga indefinida. É o clássico dia onde nada acontece e, no entanto, tudo está em jogo. Às vezes transitamos nossos próprios sábados santos, aqueles becos escuros onde as respostas não aparecem. O Sábado Santo nos ensina a arte de esperar na penumbra sem sair correndo para inventar salvações falsas. Como você lida com suas próprias esperas quando a luz demora a acender?",
      siguiente: 4,
    },
    {
      paso: 4,
      pregunta:
        "E quando já nos acostumávamos com a penumbra, salta a surpresa: o domingo. A pedra rolar, o túmulo vazio e las risadas incrédulas daqueles que achavam que o caixão era o ponto final. A Ressurreição não é uma historinha para dormir crianças nem um consolo psicológico, mas o fato mais abalador da história que inaugura uma nova criação. E atenção ao paradoxo: a esperança cristã não é a de uma alma flutuando no éter, mas a de Deus resgatando a pessoa inteira, corpo e alma incluídos. Que peso de suas tristezas você gostaria de deixar bem atado em frente ao sepulcro vazio hoje?",
      siguiente: 5,
    },
    {
      paso: 5,
      pregunta:
        "Chegamos ao fim do percurso pascal, mas resulta que é o início de nossa verdadeira aventura. Ressuscitar com Cristo não é uma questão de se portar bem para ganhar um prêmio, mas de se deixar invadir por sua graça. É perceber que o rancor e o egoísmo são modas velhas e chatas, e que perdoar ou servir é estrear a vida nova do céu aqui embaixo. Cada gesto gratuito de amor é prova de que o Ressuscitado anda solto pelo bairro. Que gesto de vida nova você vai presentear hoje para que se note que a morte perdeu?",
      siguiente: null,
    },
  ],
};

const textosUIPascua = {
  es: {
    siguiente: "Siguiente paso ➔",
    escuchar: "🔊 Escuchar",
    finalMsg:
      "Hemos recorrido las estaciones principales del Camino de la Pascua. ¿Querés que volvamos a empezar?",
  },
  en: {
    siguiente: "Next step ➔",
    escuchar: "🔊 Listen",
    finalMsg:
      "We have traveled the main stations of the Easter Journey. Would you like to start over?",
  },
  pt: {
    siguiente: "Próximo passo ➔",
    escuchar: "🔊 Ouvir",
    finalMsg:
      "Percorremos as principais estações do Caminho da Páscoa. Quer recomeçar?",
  },
};

export let pasoActualPascua = 1;

export function manejarCaminoPascua(mensajeUsuario) {
  const texto = mensajeUsuario.toLowerCase().trim();

  const idiomaActual = localStorage.getItem("idiomaApp") || "es";
  const caminoPascuaData =
    caminoPascuaTraducciones[idiomaActual] || caminoPascuaTraducciones.es;
  const ui = textosUIPascua[idiomaActual] || textosUIPascua.es;

  if (
    texto.includes("pascua") ||
    texto.includes("pascuas") ||
    texto.includes("easter") ||
    texto.includes("páscoa") ||
    texto.includes("resucitar") ||
    texto.includes("resurrection")
  ) {
    pasoActualPascua = 1;
    window.pasoActualPascua = 1;
  }

  const estacionActual = caminoPascuaData.find(
    (e) => e.paso === pasoActualPascua,
  );

  if (!estacionActual) {
    pasoActualPascua = 1;
    window.pasoActualPascua = 1;
    return ui.finalMsg;
  }

  const textoLimpio = estacionActual.pregunta
    .replace(/<[^>]*>?/gm, "")
    .replace(/'/g, "\\'")
    .replace(/"/g, "&quot;");

  let botonesHtml = "";

  if (estacionActual.paso === 1) {
    botonesHtml = `
      <div class="pascua-botones-activos" style="margin-top: 15px; display: flex; gap: 8px; justify-content: flex-end; align-items: center; flex-wrap: wrap;">
        <button onclick="avanzarCaminoPascuaAutomatico()" style="background: #2c3e50; color: white; border: none; padding: 8px 18px; border-radius: 20px; cursor: pointer; font-family: inherit; font-size: 0.9rem; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          ${ui.siguiente}
        </button>
      </div>
    `;
    pasoActualPascua = estacionActual.siguiente;
    window.pasoActualPascua = pasoActualPascua;
  } else if (estacionActual.paso === 5) {
    botonesHtml = `
      <div class="pascua-botones-activos" style="margin-top: 15px; display: flex; gap: 8px; justify-content: flex-end; align-items: center; flex-wrap: wrap;">
        <button onclick="leerTextoDirecto('${textoLimpio}')" style="background: #000; color: #fff; border: 1px solid #d4af37; padding: 6px 14px; border-radius: 20px; cursor: pointer; font-size: 12px; display: inline-flex; align-items: center; gap: 4px;">
          ${ui.escuchar}
        </button>
      </div>
    `;
    pasoActualPascua = 1;
    window.pasoActualPascua = 1;
  } else {
    botonesHtml = `
      <div class="pascua-botones-activos" style="margin-top: 15px; display: flex; gap: 8px; justify-content: flex-end; align-items: center; flex-wrap: wrap;">
        <button onclick="leerTextoDirecto('${textoLimpio}')" style="background: #000; color: #fff; border: 1px solid #d4af37; padding: 6px 14px; border-radius: 20px; cursor: pointer; font-size: 12px; display: inline-flex; align-items: center; gap: 4px;">
          ${ui.escuchar}
        </button>
        <button onclick="avanzarCaminoPascuaAutomatico()" style="background: #2c3e50; color: white; border: none; padding: 8px 18px; border-radius: 20px; cursor: pointer; font-family: inherit; font-size: 0.9rem; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          ${ui.siguiente}
        </button>
      </div>
    `;
    pasoActualPascua = estacionActual.siguiente;
    window.pasoActualPascua = pasoActualPascua;
  }

  const prefijo =
    estacionActual.paso === 1
      ? "<strong>El Camino de la Pascua</strong><br><br>"
      : "";

  return `
    <div>${prefijo}${estacionActual.pregunta}</div>
    ${botonesHtml}
  `;
}

function limpiarBotonesPascuaAnteriores() {
  const botonesViejos = document.querySelectorAll(".pascua-botones-activos");
  botonesViejos.forEach((el) => el.remove());
}

// Exposición global para callbacks HTML
window.manejarCaminoPascua = manejarCaminoPascua;
window.pasoActualPascua = pasoActualPascua;

window.avanzarCaminoPascuaAutomatico = function () {
  limpiarBotonesPascuaAnteriores();
  const siguienteTexto = manejarCaminoPascua("continuar_paso");
  const contenedorMensajes = document.getElementById("chat-mensajes");

  if (contenedorMensajes) {
    const nuevoMensaje = document.createElement("div");
    nuevoMensaje.className = "mensaje-asistente";
    nuevoMensaje.innerHTML = `<strong>Asistente:</strong><br><br>${siguienteTexto}`;
    contenedorMensajes.appendChild(nuevoMensaje);
    contenedorMensajes.scrollTop = contenedorMensajes.scrollHeight;
  }
};
// ==========================================
// EL CAMINO DE LA DOBLE NATURALEZA (Multilingüe: ES, EN, PT)
// ==========================================

const caminoDobleNaturalezaTraducciones = {
  es: [
    {
      paso: 1,
      pregunta:
        "Jesús no es solo un personaje del pasado ni un maestro de buenas ideas que quedó en la historia. En el centro de nuestra fe hay una persona viva, verdadera y plenamente Dios y verdadero hombre. ¿Qué significa para vos, hoy, en medio de tus días, decir que intentás seguir a Jesús?",
      siguiente: 2,
    },
    {
      paso: 2,
      pregunta:
        "A lo largo de los Evangelios vemos esa doble naturaleza: un Jesús que se cansa, llora y duerme como hombre, pero que también calma la tormenta, perdona los pecados y resucita como Dios. No vino a buscar a los sanos sino a los enfermos, mostrando un Dios hecho cercanía. ¿En qué momento de tu vida te costó más o te hizo más bien sentir esa cercanía?",
      siguiente: 3,
    },
    {
      paso: 3,
      pregunta:
        "Asumir nuestra humanidad implicó cargar con las cruces y dificultades de la historia; Él mismo cargó la suya y nos dijo que tomemos nuestra cruz de cada día. Pero la cruz con Él no es el final, sino el camino que atraviesa el dolor por amor hasta la vida nueva. ¿Hay alguna carga o situación difícil que hoy necesites poner en sus manos?",
      siguiente: 4,
    },
    {
      paso: 4,
      pregunta:
        "En la última cena, uniendo su divinidad y humanidad, nos dejó el mandamiento del amor y el regalo de su presencia en la Eucaristía, quedándose con nosotros bajo las especies de pan y vino. Nos pide que hagamos esto entregando nuestra vida por los demás. ¿Cómo podés hacer hoy de tu vida una entrega concreta por amor?",
      siguiente: 5,
    },
    {
      paso: 5,
      pregunta:
        "Llegamos al final del camino, pero el seguimiento continúa. Este Dios hecho hombre camina a tu lado, te conoce por tu nombre y te llama a vivir con esperanza. Tomate un momento para hablar con Él con tus propias palabras, confíale lo que llevás en el corazón y pedile la gracia de reconocerlo en cada hermano que te cruces hoy. 🧉✨",
      siguiente: null,
    },
  ],
  en: [
    {
      paso: 1,
      pregunta:
        "Jesus is not just a figure from the past or a teacher of good ideas left behind in history. At the center of our faith is a living person, true and fully God and true man. What does it mean for you today, in the middle of your days, to say that you try to follow Him?",
      siguiente: 2,
    },
    {
      paso: 2,
      pregunta:
        "Throughout the Gospels we see this double nature: a Jesus who tires, weeps, and sleeps as a man, but who also calms the storm, forgives sins, and rises as God. He came not for the healthy but for the sick, showing a God made close. At what moment in your life has it been hardest or done you the most good to feel that closeness?",
      siguiente: 3,
    },
    {
      paso: 3,
      pregunta:
        "Assuming our humanity meant carrying the crosses and difficulties of history; He Himself carried His cross and told us to take up our daily cross. But the cross with Him is not the end, but the path that passes through pain out of love to new life. Is there any burden or difficult situation today that you need to place in His hands?",
      siguiente: 4,
    },
    {
      paso: 4,
      pregunta:
        "At the Last Supper, uniting His divinity and humanity, He left us the commandment of love and the gift of His presence in the Eucharist, staying with us under the species of bread and wine. He asks us to do this by laying down our lives for others. How can you make your life today a concrete gift out of love?",
      siguiente: 5,
    },
    {
      paso: 5,
      pregunta:
        "We have reached the end of the road, but following Him continues. This God made man walks beside you, knows you by name, and calls you to live with hope. Take a moment to speak to Him in your own words, entrust to Him what you carry in your heart, and ask for the grace to recognize Him in every brother or sister you cross paths with today. 🧉✨",
      siguiente: null,
    },
  ],
  pt: [
    {
      paso: 1,
      pregunta:
        "Jesus não é apenas um personagem do passado nem um mestre de boas ideias que ficou na história. No centro de nossa fé há uma pessoa viva, verdadeira e plenamente Deus e verdadeiro homem. O que significa para você, hoje, no meio dos seus dias, dizer que tenta segui-lo?",
      siguiente: 2,
    },
    {
      paso: 2,
      pregunta:
        "Ao longo dos Evangelhos vemos essa dupla natureza: um Jesus que se cansa, chora e dorme como homem, mas que também acalma a tempestade, perdoa os pecados e ressuscita como Deus. Ele não veio chamar os justos, mas os pecadores, mostrando um Deus feito proximidade. Em que momento da sua vida foi mais difícil ou lhe fez mais bem sentir essa proximidade?",
      siguiente: 3,
    },
    {
      paso: 3,
      pregunta:
        "Assumir nossa humanidade implicou carregar as cruzes e dificuldades da história; Ele mesmo carregou a sua e nos disse para tomarmos nossa cruz de cada dia. Mas a cruz com Ele não é o fim, mas o caminho que atravessa a dor por amor até a vida nova. Há alguma carga ou situação difícil que hoje você precise colocar nas mãos dEle?",
      siguiente: 4,
    },
    {
      paso: 4,
      pregunta:
        "Na última ceia, unindo sua divindade e humanidade, Ele nos deixou o mandamento do amor e o presente de sua presença na Eucaristía, ficando conosco sob as espécies de pão e vinho. Ele nos pede que façamos isso entregando nossa vida pelos outros. Como você pode fazer hoje da sua vida uma entrega concreta por amor?",
      siguiente: 5,
    },
    {
      paso: 5,
      pregunta:
        "Chegamos ao fim do caminho, mas o seguimento continua. Este Deus feito homem caminha ao seu lado, conhece você pelo nome e o chama a viver com esperança. Tire um momento para falar com Ele com suas próprias palavras, confie-lhe o que você carrega no coração e peça a graça de reconhecê-lo em cada irmão que você encontrar hoje. 🧉✨",
      siguiente: null,
    },
  ],
};

const textosUIDobleNaturaleza = {
  es: {
    siguiente: "Siguiente paso ➔",
    escuchar: "🔊 Escuchar",
    finalMsg:
      'Hemos recorrido las estaciones principales del Camino de la Doble Naturaleza. ¿Querés que volvamos a empezar escribiendo "doble naturaleza" o preferís charlar sobre otro tema?',
    prefijo1: "<strong>El Camino de la Doble Naturaleza</strong><br><br>",
    prefijoResto: "Es una hermosa forma de verlo. Pensando en eso:<br><br>",
  },
  en: {
    siguiente: "Next step ➔",
    escuchar: "🔊 Listen",
    finalMsg:
      'We have traveled the main stations of the Path of the Double Nature. Would you like to start over by typing "double nature" or chat about another topic?',
    prefijo1: "<strong>The Path of the Double Nature</strong><br><br>",
    prefijoResto:
      "That's a beautiful way to see it. Thinking about that:<br><br>",
  },
  pt: {
    siguiente: "Próximo passo ➔",
    escuchar: "🔊 Ouvir",
    finalMsg:
      'Percorremos as principais estações do Caminho da Dupla Natureza. Quer recomeçar escrevendo "dupla natureza" ou prefere conversar sobre outro tema?',
    prefijo1: "<strong>O Caminho da Dupla Natureza</strong><br><br>",
    prefijoResto: "É uma bela maneira de ver isso. Pensando nisso:<br><br>",
  },
};

export let pasoActualDobleNaturaleza = 1;

export function manejarCaminoDobleNaturaleza(mensajeUsuario) {
  const texto = mensajeUsuario.toLowerCase().trim();

  const idiomaActual = localStorage.getItem("idiomaApp") || "es";
  const caminoData =
    caminoDobleNaturalezaTraducciones[idiomaActual] ||
    caminoDobleNaturalezaTraducciones.es;
  const ui =
    textosUIDobleNaturaleza[idiomaActual] || textosUIDobleNaturaleza.es;

  if (
    texto.includes("doble naturaleza") ||
    texto.includes("elohin") ||
    texto.includes("dupla natureza") ||
    texto.includes("verdadero dios y verdadero hombre") ||
    texto.includes("true god and true man") ||
    texto.includes("verdadeiro deus")
  ) {
    pasoActualDobleNaturaleza = 1;
    window.pasoActualDobleNaturaleza = 1;
  }

  const estacionActual = caminoData.find(
    (e) => e.paso === pasoActualDobleNaturaleza,
  );

  if (!estacionActual) {
    pasoActualDobleNaturaleza = 1;
    window.pasoActualDobleNaturaleza = 1;
    return ui.finalMsg;
  }

  const textoLimpio = estacionActual.pregunta
    .replace(/<[^>]*>?/gm, "")
    .replace(/'/g, "\\'")
    .replace(/"/g, "&quot;");

  let botonesHtml = "";

  if (estacionActual.paso === 5) {
    botonesHtml = `
      <div class="doble-nat-botones-activos" style="margin-top: 15px; display: flex; gap: 8px; justify-content: flex-end; align-items: center; flex-wrap: wrap;">
        <button onclick="leerTextoDirecto('${textoLimpio}')" style="background: #000; color: #fff; border: 1px solid #d4af37; padding: 6px 14px; border-radius: 20px; cursor: pointer; font-size: 12px; display: inline-flex; align-items: center; gap: 4px;">
          ${ui.escuchar}
        </button>
      </div>
    `;
    pasoActualDobleNaturaleza = 1;
    window.pasoActualDobleNaturaleza = 1;
  } else if (estacionActual.paso === 1) {
    botonesHtml = `
      <div class="doble-nat-botones-activos" style="margin-top: 15px; display: flex; gap: 8px; justify-content: flex-end; align-items: center; flex-wrap: wrap;">
        <button onclick="avanzarCaminoDobleNaturalezaAutomatico()" style="background: #2c3e50; color: white; border: none; padding: 8px 18px; border-radius: 20px; cursor: pointer; font-family: inherit; font-size: 0.9rem; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          ${ui.siguiente}
        </button>
      </div>
    `;
    pasoActualDobleNaturaleza++;
    window.pasoActualDobleNaturaleza = pasoActualDobleNaturaleza;
  } else {
    botonesHtml = `
      <div class="doble-nat-botones-activos" style="margin-top: 15px; display: flex; gap: 8px; justify-content: flex-end; align-items: center; flex-wrap: wrap;">
        <button onclick="leerTextoDirecto('${textoLimpio}')" style="background: #000; color: #fff; border: 1px solid #d4af37; padding: 6px 14px; border-radius: 20px; cursor: pointer; font-size: 12px; display: inline-flex; align-items: center; gap: 4px;">
          ${ui.escuchar}
        </button>
        <button onclick="avanzarCaminoDobleNaturalezaAutomatico()" style="background: #2c3e50; color: white; border: none; padding: 8px 18px; border-radius: 20px; cursor: pointer; font-family: inherit; font-size: 0.9rem; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          ${ui.siguiente}
        </button>
      </div>
    `;
    pasoActualDobleNaturaleza++;
    window.pasoActualDobleNaturaleza = pasoActualDobleNaturaleza;
  }

  const prefijo = estacionActual.paso === 1 ? ui.prefijo1 : ui.prefijoResto;

  return `
    <div>${prefijo}${estacionActual.pregunta}</div>
    ${botonesHtml}
  `;
}

function limpiarBotonesDobleNaturalezaAnteriores() {
  const botonesViejos = document.querySelectorAll(".doble-nat-botones-activos");
  botonesViejos.forEach((el) => el.remove());
}

// Exposición global para callbacks onclick dinámicos
window.manejarCaminoDobleNaturaleza = manejarCaminoDobleNaturaleza;
window.pasoActualDobleNaturaleza = pasoActualDobleNaturaleza;

window.avanzarCaminoDobleNaturalezaAutomatico = function () {
  limpiarBotonesDobleNaturalezaAnteriores();
  const siguienteTexto = manejarCaminoDobleNaturaleza("continuar_paso");
  const contenedorMensajes = document.getElementById("chat-mensajes");

  if (contenedorMensajes) {
    const nuevoMensaje = document.createElement("div");
    nuevoMensaje.className = "mensaje-asistente";
    nuevoMensaje.innerHTML = `<strong>Asistente:</strong><br><br>${siguienteTexto}`;
    contenedorMensajes.appendChild(nuevoMensaje);
    contenedorMensajes.scrollTop = contenedorMensajes.scrollHeight;
  }
};
