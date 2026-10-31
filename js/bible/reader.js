// js/bible/reader.js
// Módulo de lectura y navegación por Libros y Capítulos de la Biblia

import { listaLibrosAntiguo, listaLibrosNuevo } from "./canon.js";
import {
  guardarResaltadoPersonal,
  aplicarResaltadosPersonales,
} from "./boxes.js";

// Variable global para controlar qué color del Fibrón está activo (null = desactivado)
window.colorFibronActivo = null;

// Canon completo unificado para mapear la posición de los libros (73 libros)
const CANON_COMPLETO = [...listaLibrosAntiguo, ...listaLibrosNuevo];

// Diccionario de abreviaturas para mapear la Bíblia Livre (66 libros) directamente por clave
const MAPEO_ABBREV_CANON = {
  Gn: "Génesis",
  Ex: "Éxodo",
  Lv: "Levítico",
  Nm: "Números",
  Dt: "Deuteronomio",
  Jos: "Josué",
  Jz: "Jueces",
  Rt: "Rut",
  "1Sm": "1 Samuel",
  "2Sm": "2 Samuel",
  "1Rs": "1 Reyes",
  "2Rs": "2 Reyes",
  "1Cr": "1 Crónicas",
  "2Cr": "2 Crónicas",
  Ed: "Esdras",
  Ne: "Nehemías",
  Et: "Ester",
  Jó: "Job",
  Sl: "Salmos",
  Pv: "Proverbios",
  Ec: "Eclesiastés",
  Ct: "Cantar de los Cantares",
  Is: "Isaías",
  Jr: "Jeremías",
  Lm: "Lamentaciones",
  Ez: "Ezequiel",
  Dn: "Daniel",
  Os: "Oseas",
  Jl: "Joel",
  Am: "Amós",
  Ob: "Abdías",
  Jd: "Jonás",
  Mq: "Miqueas",
  Na: "Nahún",
  Hab: "Habacuc",
  Zf: "Sofonías",
  Ag: "Ageo",
  Zc: "Zacarías",
  Ml: "Malaquías",
  Mt: "Mateo",
  Mc: "Marcos",
  Lc: "Lucas",
  Jo: "Juan",
  At: "Hechos",
  Rm: "Romanos",
  "1Co": "1 Corintios",
  "2Co": "2 Corintios",
  Gl: "Gálatas",
  Ef: "Efesios",
  Fp: "Filipenses",
  Cl: "Colosenses",
  "1Ts": "1 Tesalonicenses",
  "2Ts": "2 Tesalonicenses",
  "1Tm": "1 Timoteo",
  "2Tm": "2 Timoteo",
  Tt: "Tito",
  Fm: "Filemón",
  Hb: "Hebreos",
  Tg: "Santiago",
  "1Pe": "1 Pedro",
  "2Pe": "2 Pedro",
  "1Jo": "1 Juan",
  "2Jo": "2 Juan",
  "3Jo": "3 Juan",
  Jd: "Judas",
  Ap: "Apocalipsis",
};

// Diccionario de traducción para la interfaz de libros
const LIBROS_TRADUCIDOS = {
  en: {
    Génesis: "Genesis",
    Éxodo: "Exodus",
    Levítico: "Leviticus",
    Números: "Numbers",
    Deuteronomio: "Deuteronomy",
    Josué: "Joshua",
    Jueces: "Judges",
    Rut: "Ruth",
    "1 Samuel": "1 Samuel",
    "2 Samuel": "2 Samuel",
    "1 Reyes": "1 Kings",
    "2 Reyes": "2 Kings",
    "1 Crónicas": "1 Chronicles",
    "2 Crónicas": "2 Chronicles",
    Esdras: "Ezra",
    Nehemías: "Nehemiah",
    Tobías: "Tobit",
    Judit: "Judith",
    Ester: "Esther",
    "1 Macabeos": "1 Maccabees",
    "2 Macabeos": "2 Maccabees",
    Job: "Job",
    Salmos: "Psalms",
    Proverbios: "Proverbs",
    Eclesiastés: "Ecclesiastes",
    "Cantar de los Cantares": "Song of Solomon",
    Sabiduría: "Wisdom",
    Eclesiástico: "Sirach",
    Isaías: "Isaiah",
    Jeremías: "Jeremiah",
    Lamentaciones: "Lamentations",
    Baruc: "Baruch",
    Ezequiel: "Ezekiel",
    Daniel: "Daniel",
    Oseas: "Hosea",
    Joel: "Joel",
    Amós: "Amos",
    Abdías: "Obadiah",
    Jonás: "Jonah",
    Miqueas: "Micah",
    Nahún: "Nahum",
    Habacuc: "Habakkuk",
    Sofonías: "Zephaniah",
    Ageo: "Haggai",
    Zacarías: "Zechariah",
    Malaquías: "Malachi",
    Mateo: "Matthew",
    Marcos: "Mark",
    Lucas: "Luke",
    Juan: "John",
    Hechos: "Acts",
    Romanos: "Romans",
    "1 Corintios": "1 Corinthians",
    "2 Corintios": "2 Corinthians",
    Gálatas: "Galatians",
    Efesios: "Ephesians",
    Filipenses: "Philippians",
    Colosenses: "Colossians",
    "1 Tesalonicenses": "1 Thessalonians",
    "2 Tesalonicenses": "2 Thessalonians",
    "1 Timoteo": "1 Timothy",
    "2 Timoteo": "2 Timothy",
    Tito: "Titus",
    Filemón: "Philemon",
    Hebreos: "Hebrews",
    Santiago: "James",
    "1 Pedro": "1 Peter",
    "2 Pedro": "2 Peter",
    "1 Juan": "1 John",
    "2 Juan": "2 John",
    "3 Juan": "3 John",
    Judas: "Jude",
    Apocalipsis: "Revelation",
  },
  pt: {
    Génesis: "Gênesis",
    Éxodo: "Êxodo",
    Levítico: "Levítico",
    Números: "Números",
    Deuteronomio: "Deuteranômio",
    Josué: "Josué",
    Jueces: "Juízes",
    Rut: "Rute",
    "1 Samuel": "1 Samuel",
    "2 Samuel": "2 Samuel",
    "1 Reyes": "1 Reis",
    "2 Reyes": "2 Reis",
    "1 Crónicas": "1 Crônicas",
    "2 Crónicas": "2 Crônicas",
    Esdras: "Esdras",
    Nehemías: "Neemias",
    Tobías: "Tobias",
    Judit: "Judite",
    Ester: "Ester",
    "1 Macabeos": "1 Macabeus",
    "2 Macabeos": "2 Macabeus",
    Job: "Jó",
    Salmos: "Salmos",
    Proverbios: "Provérbios",
    Eclesiastés: "Eclesiastes",
    "Cantar de los Cantares": "Cântico dos Cânticos",
    Sabiduría: "Sabedoria",
    Eclesiástico: "Eclesiástico",
    Isaías: "Isaías",
    Jeremías: "Jeremias",
    Lamentaciones: "Lamentações",
    Baruc: "Baruc",
    Ezequiel: "Ezequiel",
    Daniel: "Daniel",
    Oseas: "Oséias",
    Joel: "Joel",
    Amós: "Amós",
    Abdías: "Obadias",
    Jonás: "Jonas",
    Miqueas: "Miquéias",
    Nahún: "Naum",
    Habacuc: "Habacuc",
    Sofonías: "Sofonias",
    Ageo: "Ageu",
    Zacarías: "Zacarias",
    Malaquías: "Malaquias",
    Mateo: "Mateus",
    Marcos: "Marcos",
    Lucas: "Lucas",
    Juan: "João",
    Hechos: "Atos",
    Romanos: "Romanos",
    "1 Corintios": "1 Coríntios",
    "2 Corintios": "2 Coríntios",
    Gálatas: "Gálatas",
    Efesios: "Efésios",
    Filipenses: "Filipenses",
    Colosenses: "Colossenses",
    "1 Tesalonicenses": "1 Tessalonicenses",
    "2 Tesalonicenses": "2 Tessalonicenses",
    "1 Timoteo": "1 Timóteo",
    "2 Timoteo": "2 Timóteo",
    Tito: "Tito",
    Filemón: "Filemom",
    Hebreos: "Hebreus",
    Santiago: "Tiago",
    "1 Pedro": "1 Pedro",
    "2 Pedro": "2 Pedro",
    "1 Juan": "1 João",
    "2 Juan": "2 João",
    "3 Juan": "3 João",
    Judas: "Judas",
    Apocalipsis: "Apocalipse",
  },
};

// Caché para evitar descargas/normalizaciones repetidas
let cacheBiblia = {
  idioma: null,
  versos: null,
};

// Función para determinar la ruta del JSON según el idioma activo
function obtenerInfoBibliaActual() {
  const idioma = localStorage.getItem("palabra_viva_idioma") || "es";
  switch (idioma) {
    case "pt":
      return { ruta: "data/bibliaPt.json", idioma: "pt" };
    case "en":
      return { ruta: "data/bibleweb.json", idioma: "en" };
    case "es":
    default:
      return { ruta: "data/SpaPlatense.json", idioma: "es" };
  }
}

/**
 * Obtiene o descarga los versículos normalizados reutilizando el caché en memoria.
 */
async function obtenerVersosNormalizados() {
  const info = obtenerInfoBibliaActual();

  if (cacheBiblia.idioma === info.idioma && cacheBiblia.versos) {
    return cacheBiblia.versos;
  }

  const respuesta = await fetch(info.ruta);
  const jsonRaw = await respuesta.json();
  const versosNormalizados = normalizarConCanonOficial(jsonRaw, info.idioma);

  cacheBiblia.idioma = info.idioma;
  cacheBiblia.versos = versosNormalizados;

  return versosNormalizados;
}

/**
 * Normaliza los JSONs asignando los nombres exactos de canon.js
 */
function normalizarConCanonOficial(jsonRaw, idioma) {
  const versosPlanos = [];

  if (idioma === "es" || idioma === "en") {
    const libros = jsonRaw.books || (Array.isArray(jsonRaw) ? jsonRaw : []);
    libros.forEach((libro, idx) => {
      const nombreOficial = CANON_COMPLETO[idx] || libro.name;
      (libro.chapters || []).forEach((cap) => {
        (cap.verses || []).forEach((v) => {
          versosPlanos.push({
            book_name: nombreOficial,
            chapter: cap.chapter,
            verse: v.verse,
            text: v.text,
          });
        });
      });
    });
  } else if (idioma === "pt") {
    const libros = Array.isArray(jsonRaw) ? jsonRaw : [];
    libros.forEach((libro) => {
      const nombreOficial = MAPEO_ABBREV_CANON[libro.abbrev] || libro.name;

      (libro.chapters || []).forEach((capArray, idxCap) => {
        const numCapitulo = idxCap + 1;
        (capArray || []).forEach((textoVerso, idxVer) => {
          const numVersiculo = idxVer + 1;
          versosPlanos.push({
            book_name: nombreOficial,
            chapter: numCapitulo,
            verse: numVersiculo,
            text: textoVerso,
          });
        });
      });
    });
  }

  return versosPlanos;
}

function obtenerNombreVisible(nombreLibroEsp) {
  const idioma = localStorage.getItem("palabra_viva_idioma") || "es";
  if (LIBROS_TRADUCIDOS[idioma] && LIBROS_TRADUCIDOS[idioma][nombreLibroEsp]) {
    return LIBROS_TRADUCIDOS[idioma][nombreLibroEsp];
  }
  return nombreLibroEsp;
}

export async function abrirAntiguoTestamento() {
  const changeScreen = window.changeScreen;
  const screenAntiguo =
    window.screenAntiguo || document.getElementById("screen-antiguo");

  if (typeof changeScreen === "function" && screenAntiguo) {
    changeScreen(screenAntiguo);
  }

  const contenedor = document.getElementById("lista-libros-antiguo");
  if (contenedor) {
    contenedor.innerHTML = "";
    try {
      const todosLosVersos = await obtenerVersosNormalizados();

      listaLibrosAntiguo.forEach((nombreLibro) => {
        const btn = document.createElement("div");
        btn.style.cssText =
          "border: 1px solid var(--gold); border-radius: 8px; padding: 15px; text-align: center; cursor: pointer; background: rgba(255,255,255,0.05); color: #fff; font-size: 0.9rem;";

        btn.innerText = obtenerNombreVisible(nombreLibro);

        btn.addEventListener("click", () =>
          cargarCapitulosLibro(nombreLibro, todosLosVersos, screenAntiguo),
        );
        contenedor.appendChild(btn);
      });
    } catch (error) {
      console.error("Error al cargar AT:", error);
    }
  }
}

export async function abrirNuevoTestamento() {
  const changeScreen = window.changeScreen;
  const screenNuevo =
    window.screenNuevo || document.getElementById("screen-nuevo");

  if (typeof changeScreen === "function" && screenNuevo) {
    changeScreen(screenNuevo);
  }

  const contenedor = document.getElementById("lista-libros-nuevo");
  if (contenedor) {
    contenedor.innerHTML = "";
    try {
      const todosLosVersos = await obtenerVersosNormalizados();

      listaLibrosNuevo.forEach((nombreLibro) => {
        const btn = document.createElement("div");
        btn.style.cssText =
          "border: 1px solid var(--gold); border-radius: 8px; padding: 15px; text-align: center; cursor: pointer; background: rgba(255,255,255,0.05); color: #fff; font-size: 0.9rem;";

        btn.innerText = obtenerNombreVisible(nombreLibro);

        btn.addEventListener("click", () =>
          cargarCapitulosLibro(nombreLibro, todosLosVersos, screenNuevo),
        );
        contenedor.appendChild(btn);
      });
    } catch (error) {
      console.error("Error al cargar NT:", error);
    }
  }
}

export function cargarCapitulosLibro(nombreLibro, versesArray, pantallaOrigen) {
  const changeScreen = window.changeScreen;
  const screenCapitulos =
    window.screenCapitulos || document.getElementById("screen-capitulos");

  const btnVolverCapitulos = document.querySelector(
    "#screen-capitulos .btn-back",
  );
  if (btnVolverCapitulos && typeof changeScreen === "function") {
    btnVolverCapitulos.onclick = () => changeScreen(pantallaOrigen);
  }

  if (typeof changeScreen === "function" && screenCapitulos) {
    changeScreen(screenCapitulos);
  }

  const tituloLibro = document.getElementById("titulo-libro-seleccionado");
  const gridCapitulos = document.getElementById("grid-capitulos");
  const areaVersiculos = document.getElementById("texto-versiculos-area");

  if (tituloLibro) tituloLibro.textContent = obtenerNombreVisible(nombreLibro);
  if (gridCapitulos) gridCapitulos.innerHTML = "";
  if (areaVersiculos) areaVersiculos.innerHTML = "";

  const versosLibro = versesArray.filter((v) => v.book_name === nombreLibro);
  const capitulosSet = new Set(versosLibro.map((v) => v.chapter));
  const capitulosOrdenados = Array.from(capitulosSet).sort((a, b) => a - b);

  capitulosOrdenados.forEach((numCap) => {
    const btnCap = document.createElement("button");
    btnCap.className = "btn-capitulo";
    btnCap.style.cssText =
      "background: rgba(212,175,55,0.1); border: 1px solid var(--gold); color: #fff; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-weight: bold;";
    btnCap.textContent = numCap;
    btnCap.addEventListener("click", () =>
      renderizarVersiculosCapitulo(nombreLibro, numCap, versosLibro),
    );
    if (gridCapitulos) gridCapitulos.appendChild(btnCap);
  });
}

export function renderizarVersiculosCapitulo(
  nombreLibro,
  numCapitulo,
  versosLibro,
) {
  const changeScreen = window.changeScreen;
  const screenLectura =
    window.screenLectura || document.getElementById("screen-lectura");

  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    if (typeof window.textoCompletoActual !== "undefined")
      window.textoCompletoActual = "";
    if (typeof window.estaReproduciendo !== "undefined")
      window.estaReproduciendo = false;
    if (typeof window.estaPausado !== "undefined") window.estaPausado = false;
    const btnAudio = document.getElementById("btn-hablar-lectura");
    if (btnAudio) btnAudio.innerHTML = '<i class="fas fa-volume-up"></i>';
  }

  if (typeof changeScreen === "function" && screenLectura) {
    changeScreen(screenLectura);
  }

  const tituloLectura = document.getElementById("titulo-lectura-completa");
  const areaLectura = document.getElementById("texto-lectura-final");

  if (tituloLectura)
    tituloLectura.textContent = `${obtenerNombreVisible(nombreLibro)} - Cap. ${numCapitulo}`;

  const capitulosSet = new Set(
    versosLibro
      .filter((v) => v.book_name === nombreLibro)
      .map((v) => v.chapter),
  );
  const capitulosOrdenados = Array.from(capitulosSet).sort((a, b) => a - b);

  const indiceCapActual = capitulosOrdenados.indexOf(numCapitulo);
  const capAnterior =
    indiceCapActual > 0 ? capitulosOrdenados[indiceCapActual - 1] : null;
  const capSiguiente =
    indiceCapActual < capitulosOrdenados.length - 1
      ? capitulosOrdenados[indiceCapActual + 1]
      : null;

  const versosFiltrados = versosLibro.filter(
    (v) => v.book_name === nombreLibro && v.chapter === numCapitulo,
  );
  versosFiltrados.sort((a, b) => a.verse - b.verse);

  let htmlVersos = `<div style="max-width: 600px; margin: 0 auto; padding-bottom: 20px;">`;
  versosFiltrados.forEach((v) => {
    htmlVersos += `<p class="linea-versiculo" data-versiculo="${v.verse}" style="margin-bottom: 14px;"><sup style="color: var(--gold); font-weight: bold; margin-right: 8px; font-size: 0.85rem;">${v.verse}</sup>${v.text}</p>`;
  });
  htmlVersos += `</div>`;

  htmlVersos += `
    <div style="max-width: 600px; margin: 30px auto 50px auto; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(212,175,55,0.3); padding-top: 20px;">
      <button id="btn-cap-anterior" style="background: rgba(212,175,55,0.1); border: 1px solid var(--gold); color: #fff; padding: 10px 16px; border-radius: 6px; cursor: pointer; font-size: 0.9rem; ${!capAnterior ? "opacity: 0.3; pointer-events: none;" : ""}">⬅ Anterior</button>
      <span style="color: var(--gold); font-size: 0.85rem;">Capítulo ${numCapitulo}</span>
      <button id="btn-cap-siguiente" style="background: rgba(212,175,55,0.1); border: 1px solid var(--gold); color: #fff; padding: 10px 16px; border-radius: 6px; cursor: pointer; font-size: 0.9rem; ${!capSiguiente ? "opacity: 0.3; pointer-events: none;" : ""}">Siguiente ➡</button>
    </div>
  `;

  if (areaLectura) areaLectura.innerHTML = htmlVersos;

  // 1. Aplica subrayados de la capa de estudio (las cajas)
  if (typeof window.aplicarSubrayadosCapitulo === "function") {
    window.aplicarSubrayadosCapitulo(nombreLibro, numCapitulo);
  }

  // 2. Inicializa los eventos de la paleta del Fibrón si no estaban
  initFibronEvents();

  // 3. Conecta el clic en cada versículo para resaltar con el Fibrón
  conectarEventosLecturaFibron(nombreLibro, numCapitulo);

  if (capAnterior) {
    document
      .getElementById("btn-cap-anterior")
      ?.addEventListener("click", () => {
        renderizarVersiculosCapitulo(nombreLibro, capAnterior, versosLibro);
      });
  }

  if (capSiguiente) {
    document
      .getElementById("btn-cap-siguiente")
      ?.addEventListener("click", () => {
        renderizarVersiculosCapitulo(nombreLibro, capSiguiente, versosLibro);
      });
  }
}

/**
 /**
 * Inicializa los eventos del botón de Fibrón y su paleta flotante
 */
export function initFibronEvents() {
  const btnToggle = document.getElementById("btn-toggle-fibron");
  const paleta = document.getElementById("paleta-fibron");
  const botonesColor = document.querySelectorAll(".btn-color-fibron");

  if (!btnToggle || !paleta) return;

  // Abrir / Cerrar paleta
  btnToggle.onclick = (e) => {
    e.stopPropagation();
    const estaOculta =
      paleta.style.display === "none" || paleta.style.display === "";
    paleta.style.display = estaOculta ? "flex" : "none";
  };

  // Elegir color de la paleta
  botonesColor.forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const colorElegido = btn.getAttribute("data-color");

      // 1. Limpiamos el brillo y estilos de todos los botones de la paleta primero
      botonesColor.forEach((b) => {
        b.style.boxShadow = "none";
        b.style.transform = "scale(1)";
        if (b.getAttribute("data-color") === "borrar") {
          b.style.backgroundColor = "#333";
          b.style.color = "#ff5555";
        }
      });

      if (window.colorFibronActivo === colorElegido) {
        // Se desactiva (toggle)
        window.colorFibronActivo = null;
        btnToggle.style.border = "1px solid var(--gold)";
      } else {
        // Se activa el nuevo color o la gomita
        window.colorFibronActivo = colorElegido;
        btnToggle.style.border = "2px solid #fff";

        // 2. Aplicamos el efecto visual según sea la gomita o un color
        if (colorElegido === "borrar") {
          btn.style.backgroundColor = "#ff5555";
          btn.style.color = "#1a1a1a";
          btn.style.transform = "scale(1.2)";
          btn.style.boxShadow = "0 0 10px #ff5555";
        } else {
          btn.style.boxShadow = "0 0 10px #ffffff, 0 0 6px #f1c40f";
          btn.style.transform = "scale(1.2)";
        }
      }

      paleta.style.display = "none";
    };
  });

  // Cerrar paleta si se toca fuera
  document.addEventListener("click", () => {
    if (paleta) paleta.style.display = "none";
  });
}
/**
 * Conecta el clic en cada versículo cuando el modo Fibrón está activo
 */
export function conectarEventosLecturaFibron(nombreLibro, numeroCapitulo) {
  const lineasVersiculos = document.querySelectorAll("[data-versiculo]");

  lineasVersiculos.forEach((elVerso) => {
    elVerso.addEventListener("click", () => {
      if (window.colorFibronActivo) {
        const numVerso = elVerso.getAttribute("data-versiculo");
        const textoLimpio = elVerso.textContent.replace(/^\d+/, "").trim();

        guardarResaltadoPersonal(
          nombreLibro,
          numeroCapitulo,
          numVerso,
          textoLimpio,
          window.colorFibronActivo,
        );

        aplicarResaltadosPersonales(nombreLibro, numeroCapitulo);
      }
    });
  });
}
/**
 /**
 * Genera y muestra automáticamente el Índice de Contenido Exegético en la Guía,
 * leyendo exclusivamente desde contenido.json para mostrar solo lo que tiene cajitas reales.
 */
export async function inicializarIndiceExegeticoEnGuia() {
  const contenedor = document.getElementById("lista-indice-dinamico");
  if (!contenedor) return;

  contenedor.innerHTML = "<em>Cargando índice exegético...</em>";

  try {
    // 1. Cargamos el archivo de contenido exegético
    const respuesta = await fetch("data/contenido.json");
    const datosJson = await respuesta.json();

    const idioma = localStorage.getItem("palabra_viva_idioma") || "es";

    // Validamos que exista la estructura para el idioma actual
    if (
      !datosJson.idiomas ||
      !datosJson.idiomas[idioma] ||
      !datosJson.idiomas[idioma].libros
    ) {
      contenedor.innerHTML =
        "<p style='color: #aaa;'><em>No se encontró contenido exegético disponible.</em></p>";
      return;
    }

    const librosContenido = datosJson.idiomas[idioma].libros;
    const llavesLibros = Object.keys(librosContenido);

    if (llavesLibros.length === 0) {
      contenedor.innerHTML =
        "<p style='color: #aaa;'><em>No hay contenido cargado aún.</em></p>";
      return;
    }

    // 2. Ordenamos los libros según el CANON_COMPLETO oficial
    llavesLibros.sort((a, b) => {
      // Normalizamos las claves para buscar el índice exacto en el canon
      let nombreA = a.charAt(0).toUpperCase() + a.slice(1);
      let nombreB = b.charAt(0).toUpperCase() + b.slice(1);

      let idxA = CANON_COMPLETO.indexOf(nombreA);
      let idxB = CANON_COMPLETO.indexOf(nombreB);

      if (idxA === -1) idxA = 999;
      if (idxB === -1) idxB = 999;
      return idxA - idxB;
    });

    // 3. Construimos la lista visual adaptada al acordeón
    let htmlIndice = `<ul style="list-style: none; padding-left: 0; margin: 0;">`;

    llavesLibros.forEach((keyLibro) => {
      const datosLibro = librosContenido[keyLibro];
      const capitulosObj = datosLibro.capitulos || {};
      const numerosCapitulos = Object.keys(capitulosObj)
        .map(Number)
        .sort((a, b) => a - b);

      if (numerosCapitulos.length === 0) return;

      // Nombre oficial capitalizado para mostrar
      const nombreLibroEsp =
        keyLibro.charAt(0).toUpperCase() + keyLibro.slice(1);
      const nombreVisible = obtenerNombreVisible(nombreLibroEsp);

      htmlIndice += `
        <li style="margin-bottom: 10px; color: var(--gold, #d4af37); font-weight: bold;">
          📖 ${nombreVisible}
          <ul style="list-style: none; padding-left: 15px; margin-top: 4px;">
      `;

      numerosCapitulos.forEach((numCap) => {
        htmlIndice += `
          <li style="margin-bottom: 2px;">
            <a href="#" class="enlace-capitulo-indice" data-libro="${nombreLibroEsp}" data-capitulo="${numCap}" style="color: #ccc; text-decoration: none; font-weight: normal; font-size: 0.9rem;">
              Capítulo ${numCap}
            </a>
          </li>
        `;
      });

      htmlIndice += `</ul></li>`;
    });

    htmlIndice += `</ul>`;
    contenedor.innerHTML = htmlIndice;

    // 4. Agregamos los eventos de clic para que al tocar un capítulo salte directo a la lectura
    contenedor.querySelectorAll(".enlace-capitulo-indice").forEach((link) => {
      link.addEventListener("click", async (e) => {
        e.preventDefault();
        const libro = link.getAttribute("data-libro");
        const cap = parseInt(link.getAttribute("data-capitulo"));

        // Obtenemos los versos de la Biblia activa para poder renderizar la lectura
        const todosLosVersos = await obtenerVersosNormalizados();
        const versosLibro = todosLosVersos.filter((v) => v.book_name === libro);

        renderizarVersiculosCapitulo(libro, cap, versosLibro);
      });
    });
  } catch (error) {
    console.error(
      "Error al generar el índice exegético desde contenido.json:",
      error,
    );
    contenedor.innerHTML =
      "<p style='color: #ff5555;'><em>Error al cargar el índice.</em></p>";
  }
}
// Escucha cuando el usuario abre el acordeón del índice por primera vez
// Disparador elegante para cargar el índice exegético al abrir el acordeón por primera vez
document
  .getElementById("acordeon-indice-exegetico")
  ?.addEventListener("toggle", function () {
    if (this.open) {
      if (typeof inicializarIndiceExegeticoEnGuia === "function") {
        inicializarIndiceExegeticoEnGuia();
      } else {
        console.error(
          "La función inicializarIndiceExegeticoEnGuia no está definida.",
        );
      }
    }
  });
async function poblarReferenciasAcordeon() {
  const contenedor = document.getElementById("lista-referencias-acordeon");
  if (!contenedor) return;

  try {
    const res = await fetch("data/referencias-cruzadas.json");
    if (!res.ok) throw new Error("No se pudo cargar el archivo");
    const lista = await res.json();

    if (lista.length === 0) {
      contenedor.innerHTML =
        '<p style="color: #888; margin: 0;">No hay referencias cargadas todavía.</p>';
      return;
    }

    let html = '<ul style="list-style: none; padding: 0; margin: 0;">';

    lista.forEach((ref) => {
      // Formateamos un texto claro para la lista (ej: "Marcos 1,2 ➔ Isaías 40,3")
      const textoOrigen = `${ref.desde.libro.toUpperCase()} ${ref.desde.capitulo},${ref.desde.versiculo}`;
      const textoDestino =
        ref.hacia.citaTexto ||
        `${ref.hacia.libro.toUpperCase()} ${ref.hacia.capitulo},${ref.hacia.versiculo}`;

      html += `
                <li style="margin-bottom: 10px; border-bottom: 1px solid rgba(212,175,55,0.1); padding-bottom: 8px;">
                  <a href="#" class="enlace-referencia-item" 
                     data-libro="${ref.desde.libro}" 
                     data-capitulo="${ref.desde.capitulo}" 
                     style="color: var(--gold); text-decoration: none; display: block; cursor: pointer;">
                     🔗 <strong>${textoOrigen}</strong> ➔ ${textoDestino}
                  </a>
                  <span style="font-size: 0.85rem; color: #ccc; display: block; margin-top: 4px; line-height: 1.3;">${ref.explicacion}</span>
                </li>
            `;
    });

    html += "</ul>";
    contenedor.innerHTML = html;
    // Agregamos el evento de clic a cada elemento de la lista para que salte al pasaje
    contenedor.querySelectorAll(".enlace-referencia-item").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        const libro = el.getAttribute("data-libro");
        const capitulo = Number(el.getAttribute("data-capitulo"));

        // Llamamos a tu función existente para renderizar el capítulo en el lector principal
        if (
          typeof renderizarVersiculosCapitulo === "function" &&
          typeof versosLibro !== "undefined"
        ) {
          renderizarVersiculosCapitulo(libro, capitulo, versosLibro);
        } else {
          console.warn(
            "Faltan datos o la función de renderizado global para saltar al capítulo.",
          );
        }
      });
    });
  } catch (error) {
    console.error("Error al cargar las referencias en el acordeón:", error);
    contenedor.innerHTML =
      '<p style="color: #ff6b6b; margin: 0;">Error al cargar las referencias.</p>';
  }
}

// Ejecutamos esta función al iniciar la app o cuando cargue la página
document.addEventListener("DOMContentLoaded", () => {
  poblarReferenciasAcordeon();
});
// glosario.js
async function cargarGlosario() {
  const contenedor = document.getElementById("glosario-container");
  if (!contenedor) return;

  try {
    const respuesta = await fetch("data/glosario.json");
    if (!respuesta.ok) throw new Error("Error al cargar el archivo JSON");

    const glosarioData = await respuesta.json();

    // Limpiamos el texto/cartel previo
    contenedor.innerHTML = "";

    // Ordenamos alfabéticamente por término
    const terminosOrdenados = [...glosarioData].sort((a, b) =>
      a.termino.localeCompare(b.termino, "es", { sensitivity: "base" }),
    );

    // Inyectamos las tarjetas de términos
    terminosOrdenados.forEach((item) => {
      const card = document.createElement("div");
      card.className = "glosario-item";
      card.innerHTML = `
        <h4 class="glosario-termino">${item.termino}</h4>
        <p class="glosario-definicion">${item.definicion}</p>
      `;
      contenedor.appendChild(card);
    });
  } catch (error) {
    console.error("Error cargando el glosario:", error);
    contenedor.innerHTML =
      "<p class='glosario-error'>No se pudieron cargar los términos.</p>";
  }
}

document.addEventListener("DOMContentLoaded", cargarGlosario);
