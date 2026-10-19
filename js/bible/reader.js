// js/bible/reader.js
// Módulo de lectura y navegación por Libros y Capítulos de la Biblia

import { listaLibrosAntiguo, listaLibrosNuevo } from "./canon.js";

// Canon completo unificado para mapear la posición de los libros (73 libros)
const CANON_COMPLETO = [...listaLibrosAntiguo, ...listaLibrosNuevo];

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
      return { ruta: "data/bibliaAveMaria.json", idioma: "pt" };
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

  // Si ya tenemos los versos cargados en memoria para el mismo idioma, devolvemos directo
  if (cacheBiblia.idioma === info.idioma && cacheBiblia.versos) {
    return cacheBiblia.versos;
  }

  const respuesta = await fetch(info.ruta);
  const jsonRaw = await respuesta.json();
  const versosNormalizados = normalizarConCanonOficial(jsonRaw, info.idioma);

  // Almacenamos en memoria
  cacheBiblia.idioma = info.idioma;
  cacheBiblia.versos = versosNormalizados;

  return versosNormalizados;
}

/**
 * Normaliza los JSONs asignando los nombres exactos de canon.js
 * de acuerdo a la estructura de cada archivo.
 */
/**
 * Normaliza los JSONs asignando los nombres exactos de canon.js
 * de acuerdo a la estructura de cada archivo.
 */
function normalizarConCanonOficial(jsonRaw, idioma) {
  const versosPlanos = [];

  // 1. ESPAÑOL e INGLÉS (Estructura estándar de libros -> chapters -> verses)
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
  }
  // 2. PORTUGUÉS (Bíblia Ave Maria - bibliaAveMaria.json)
  else if (idioma === "pt") {
    const libros = [
      ...(jsonRaw.antigoTestamento || []),
      ...(jsonRaw.novoTestamento || []),
    ];
    libros.forEach((libro, idx) => {
      const nombreOficial = CANON_COMPLETO[idx] || libro.nome;
      (libro.capitulos || []).forEach((cap) => {
        (cap.versiculos || []).forEach((v) => {
          versosPlanos.push({
            book_name: nombreOficial,
            chapter: cap.capitulo,
            verse: v.versiculo,
            text: v.texto,
          });
        });
      });
    });
  }

  return versosPlanos;
}
// Devuelve el nombre traducido del libro según el idioma actual
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

        // Muestra el nombre traducido según el idioma
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

        // Muestra el nombre traducido según el idioma
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
    if (btnAudio)
      btnAudio.innerHTML = '<i class="fas fa-volume-up"></i> Escuchar';
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

  if (typeof window.aplicarSubrayadosCapitulo === "function") {
    window.aplicarSubrayadosCapitulo(nombreLibro, numCapitulo);
  }

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
