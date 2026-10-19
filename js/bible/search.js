// js/bible/search.js
// Buscador único multidioma: citas + texto (ES / EN / PT)

import { state } from "../core/state.js";
import { limpiarTexto, palabrasANumeros, escaparHTML } from "../core/utils.js";

/* ========== MAPA DE TRADUCCIÓN PLATENSE (EN -> ES) ========== */
const MAPA_LIBROS_PLATENSE = {
  acts: "Hechos",
  "additional psalm": "Salmo Adicional",
  amos: "Amós",
  baruch: "Baruc",
  colossians: "Colosenses",
  daniel: "Daniel",
  deuteronomy: "Deuteronomio",
  ecclesiastes: "Eclesiastés",
  ephesians: "Efesios",
  esther: "Ester",
  exodus: "Éxodo",
  ezekiel: "Ezequiel",
  ezra: "Esdras",
  galatians: "Gálatas",
  genesis: "Génesis",
  habakkuk: "Habacuc",
  haggai: "Hageo",
  hebrews: "Hebreos",
  hosea: "Oseas",
  "i chronicles": "1 Crónicas",
  "i corinthians": "1 Corintios",
  "i esdras": "1 Esdras",
  "i john": "1 Juan",
  "i kings": "1 Reyes",
  "i maccabees": "1 Macabeos",
  "i peter": "1 Pedro",
  "i samuel": "1 Samuel",
  "i thessalonians": "1 Tesalonicenses",
  "i timothy": "1 Timoteo",
  "ii chronicles": "2 Crónicas",
  "ii corinthians": "2 Corintios",
  "ii esdras": "2 Esdras",
  "ii john": "2 Juan",
  "ii kings": "2 Reyes",
  "ii maccabees": "2 Macabeos",
  "ii peter": "2 Pedro",
  "ii samuel": "2 Samuel",
  "ii thessalonians": "2 Tesalonicenses",
  "ii timothy": "2 Timoteo",
  "iii john": "3 Juan",
  isaiah: "Isaías",
  james: "Santiago",
  jeremiah: "Jeremías",
  job: "Job",
  joel: "Joel",
  john: "Juan",
  jonah: "Jonás",
  joshua: "Josué",
  jude: "Judas",
  judges: "Jueces",
  judith: "Judit",
  lamentations: "Lamentaciones",
  laodiceans: "Laodicenses",
  leviticus: "Levítico",
  luke: "Lucas",
  malachi: "Malaquías",
  mark: "Marcos",
  matthew: "Mateo",
  micah: "Miqueas",
  nahum: "Nahúm",
  nehemiah: "Nehemías",
  numbers: "Números",
  obadiah: "Abdías",
  philemon: "Filemón",
  philippians: "Filipenses",
  "prayer of manasses": "Oración de Manasés",
  proverbs: "Proverbios",
  psalms: "Salmos",
  "revelation of john": "Apocalipsis",
  romans: "Romanos",
  ruth: "Rut",
  sirach: "Eclesiástico",
  "song of solomon": "Cantar de los Cantares",
  titus: "Tito",
  tobit: "Tobías",
  wisdom: "Sabiduría",
  zechariah: "Zacarías",
  zephaniah: "Sofonías",
};

/* ========== CONFIGURACIÓN POR IDIOMA CORREGIDA ========== */
function obtenerConfiguracionIdioma() {
  // 1. Prioridad Máxima: Estado global de la aplicación
  const langState =
    state.idiomaActual || state.idioma || state.lang || state.language;

  // 2. Segunda Prioridad: Claves de localStorage
  const langGuardado =
    localStorage.getItem("idioma") ||
    localStorage.getItem("lang") ||
    localStorage.getItem("palabraViva_idioma") ||
    localStorage.getItem("i18nextLng");

  // 3. Tercera Prioridad: Atributo lang del HTML
  const langHTML = document.documentElement.lang;

  // 4. Última opción: Elemento selector del DOM
  const selectIdioma =
    document.querySelector("select[id*='idioma']") ||
    document.querySelector("select[id*='lang']");
  const langDOM = selectIdioma?.value;

  // Idioma final
  const lang = (
    langState ||
    langGuardado ||
    langHTML ||
    langDOM ||
    "es"
  ).toLowerCase();

  console.log(`🌐 Idioma detectado en el motor de búsqueda: "${lang}"`);

  // Portugués
  if (lang.includes("pt") || lang === "pt") {
    return { archivo: "data/bibliaAveMaria.json", idioma: "pt" };
  }

  // Inglés
  if (lang.includes("en") || lang === "en") {
    return { archivo: "data/bibleweb.json", idioma: "en" };
  }

  // Español (por defecto)
  return { archivo: "data/SpaPlatense.json", idioma: "es" };
}

/* ========== MAPA DE LIBROS (ES / EN / PT + alias) ========== */
const LIBROS_ALIAS = {
  genesis: ["genesis", "gênesis", "génesis", "gen"],
  exodo: ["exodo", "êxodo", "éxodo", "exodus", "ex"],
  levitico: ["levitico", "levítico", "leviticus", "lev"],
  numeros: ["numeros", "números", "numbers", "num"],
  deuteronomio: ["deuteronomio", "deuteronômio", "deuteronomy", "deut"],
  josue: ["josue", "josué", "joshua", "jos"],
  jueces: ["jueces", "juízes", "judges", "jue"],
  rut: ["rut", "rute", "ruth"],
  "1 samuel": ["1 samuel", "1samuel", "i samuel", "1 sm"],
  "2 samuel": ["2 samuel", "2samuel", "ii samuel", "2 sm"],
  "1 reyes": [
    "1 reyes",
    "1reyes",
    "1 reis",
    "1 kings",
    "i reyes",
    "1 re",
    "1kings",
  ],
  "2 reyes": [
    "2 reyes",
    "2reyes",
    "2 reis",
    "2 kings",
    "ii reyes",
    "2 re",
    "2kings",
  ],
  "1 cronicas": [
    "1 cronicas",
    "1crónicas",
    "1 chronicles",
    "1 cr",
    "1chronicles",
  ],
  "2 cronicas": [
    "2 cronicas",
    "2crónicas",
    "2 chronicles",
    "2 cr",
    "2chronicles",
  ],
  esdras: ["esdras", "ezra", "esd"],
  nehemias: ["nehemias", "nehemías", "neemias", "nehemiah", "neh"],
  ester: ["ester", "esther", "est"],
  job: ["job", "jó"],
  salmos: ["salmos", "salmo", "psalms", "psalm", "sl"],
  proverbios: ["proverbios", "provérbios", "proverbs", "prov"],
  eclesiastes: ["eclesiastes", "eclesiastés", "ecclesiastes", "ecl"],
  cantares: [
    "cantares",
    "canticos",
    "cânticos",
    "song of solomon",
    "songs",
    "cant",
    "song of songs",
  ],
  isaias: ["isaias", "isaías", "isaiah", "is", "misaias"],
  jeremias: ["jeremias", "jeremías", "jeremiah", "jer"],
  lamentaciones: ["lamentaciones", "lamentações", "lamentations", "lam"],
  ezequiel: ["ezequiel", "ezekiel", "ez"],
  daniel: ["daniel", "dan"],
  oseas: ["oseas", "oséias", "hosea", "os"],
  joel: ["joel"],
  amos: ["amos", "amós"],
  abdias: ["abdias", "abdías", "obadiah", "abd"],
  jonas: ["jonas", "jonás", "jonah"],
  miqueas: ["miqueas", "miquéias", "micah", "miq"],
  nahum: ["nahum", "naum"],
  habacuc: ["habacuc", "habakkuk", "hab"],
  sofonias: ["sofonias", "sofonías", "zephaniah", "sof"],
  hageo: ["hageo", "ageu", "haggai", "hag"],
  zacarias: ["zacarias", "zacarías", "zechariah", "zac"],
  malaquias: ["malaquias", "malaquías", "malachi", "mal"],
  mateo: [
    "mateo",
    "mateus",
    "são mateus",
    "sao mateus",
    "matthew",
    "mt",
    "mat",
  ],
  marcos: ["marcos", "são marcos", "sao marcos", "mark", "mc", "mk"],
  lucas: ["lucas", "são lucas", "sao lucas", "luke", "lc", "lk"],
  juan: ["juan", "joão", "joao", "são joão", "sao joao", "john", "jn"],
  hechos: ["hechos", "atos", "acts", "hch"],
  romanos: ["romanos", "romans", "rm", "rom"],
  "1 corintios": [
    "1 corintios",
    "1 coríntios",
    "1 corinthians",
    "1 co",
    "i corintios",
    "1corinthians",
  ],
  "2 corintios": [
    "2 corintios",
    "2 coríntios",
    "2 corinthians",
    "2 co",
    "ii corintios",
    "2corinthians",
  ],
  galatas: ["galatas", "gálatas", "galatians", "gl", "gal"],
  efesios: ["efesios", "efésios", "ephesians", "ef"],
  filipenses: ["filipenses", "philippians", "flp", "fil"],
  colosenses: ["colosenses", "colossenses", "colossians", "col"],
  "1 tesalonicenses": [
    "1 tesalonicenses",
    "1 tessalonicenses",
    "1 thessalonians",
    "1 ts",
  ],
  "2 tesalonicenses": [
    "2 tesalonicenses",
    "2 tessalonicenses",
    "2 thessalonians",
    "2 ts",
  ],
  "1 timoteo": ["1 timoteo", "1 timothy", "1 tm"],
  "2 timoteo": ["2 timoteo", "2 timothy", "2 tm"],
  tito: ["tito", "titus", "tt"],
  filemon: ["filemon", "filemón", "philemon", "flm"],
  hebreos: ["hebreos", "hebreus", "hebrews", "heb"],
  santiago: ["santiago", "tiago", "james", "stg", "sant"],
  "1 pedro": ["1 pedro", "1 peter", "1 pe"],
  "2 pedro": ["2 pedro", "2 peter", "2 pe"],
  "1 juan": ["1 juan", "1 joão", "1 joao", "1 john", "1 jn"],
  "2 juan": ["2 juan", "2 joão", "2 joao", "2 john", "2 jn"],
  "3 juan": ["3 juan", "3 joão", "3 joao", "3 john", "3 jn"],
  judas: ["judas", "jude", "jd"],
  apocalipsis: [
    "apocalipsis",
    "apocalipse",
    "revelation",
    "ap",
    "apoc",
    "revelacion",
    "revelation of john",
  ],
};

/**
 * Dado un nombre de libro escrito por el usuario, devuelve la clave canónica
 */
function resolverLibro(nombreUsuario) {
  const limpio = limpiarTexto(nombreUsuario).replace(/\s+/g, " ").trim();
  if (!limpio) return null;

  // 0. Caso crítico de nombres cortos para evitar que "joao" o "joão" caigan en "job"
  if (limpio === "job" || limpio === "jó") return "job";
  if (limpio === "joao" || limpio === "joão" || limpio === "jn") return "juan";

  // 1. Match exacto
  for (const [canonico, aliases] of Object.entries(LIBROS_ALIAS)) {
    for (const alias of aliases) {
      if (limpio === alias) return canonico;
    }
  }

  // 2. Match por prefijo ordenado de mayor a menor longitud
  const todasEntradas = [];
  for (const [canonico, aliases] of Object.entries(LIBROS_ALIAS)) {
    for (const alias of aliases) {
      todasEntradas.push({ alias, canonico });
    }
  }
  todasEntradas.sort((a, b) => b.alias.length - a.alias.length);

  for (const item of todasEntradas) {
    if (
      limpio === item.alias ||
      limpio.startsWith(item.alias + " ") ||
      (item.alias.length > 3 && item.alias.startsWith(limpio))
    ) {
      return item.canonico;
    }
  }

  return null;
}

/**
 * Comprueba si el nombre del libro del JSON coincide con la clave canónica
 */
/**
 * Comprueba si el nombre del libro del JSON coincide con la clave canónica
 */
/**
 * Comprueba si el nombre del libro del JSON coincide con la clave canónica
 */
function coincideLibroJSON(nombreJSON, claveCanonica) {
  if (!nombreJSON || !claveCanonica) return false;
  const limpio = limpiarTexto(nombreJSON);

  // 1. "Revelation of John" NUNCA debe coincidir con la búsqueda de "Juan"
  if (
    claveCanonica === "juan" &&
    (limpio.includes("revelation") || limpio.includes("apocalip"))
  ) {
    return false;
  }

  // 2. Si buscamos "Apocalipsis", aseguramos que reconozca "Revelation of John"
  if (claveCanonica === "apocalipsis") {
    return (
      limpio.includes("revelation") ||
      limpio.includes("apocalip") ||
      limpio === "ap"
    );
  }

  // 3. Para el resto de los libros
  const aliases = LIBROS_ALIAS[claveCanonica] || [claveCanonica];
  return aliases.some(
    (a) => limpio === a || limpio.includes(a) || a.includes(limpio),
  );
}
/* ========== NORMALIZAR LAS 3 ESTRUCTURAS ========== */
function extraerVersiculosDeJSON(datos) {
  const lista = [];

  // Portugués: antigoTestamento / novoTestamento
  if (datos.antigoTestamento || datos.novoTestamento) {
    const libros = [
      ...(datos.antigoTestamento || []),
      ...(datos.novoTestamento || []),
    ];
    libros.forEach((b) => {
      const bookName = b.nome || b.name || "";
      (b.capitulos || []).forEach((c) => {
        const chapNum = c.capitulo || 1;
        (c.versiculos || []).forEach((v) => {
          lista.push({
            book_name: bookName,
            chapter: Number(chapNum),
            verse: Number(v.versiculo || 1),
            text: v.texto || "",
          });
        });
      });
    });
    return lista;
  }

  // Español / Inglés: books -> chapters -> verses
  if (datos.books && Array.isArray(datos.books)) {
    datos.books.forEach((b) => {
      const bookName = b.name || b.book || "";
      (b.chapters || []).forEach((c) => {
        const chapNum = c.chapter || 1;
        (c.verses || []).forEach((v) => {
          lista.push({
            book_name: bookName,
            chapter: Number(v.chapter || chapNum),
            verse: Number(v.verse || 1),
            text: v.text || "",
          });
        });
      });
    });
    return lista;
  }

  // Fallback: formato plano { verses: [...] }
  if (datos.verses && Array.isArray(datos.verses)) {
    datos.verses.forEach((v) => {
      lista.push({
        book_name: v.book_name || v.book || "",
        chapter: Number(v.chapter || 1),
        verse: Number(v.verse || 1),
        text: v.text || "",
      });
    });
  }

  return lista;
}

/* ========== PARSEAR CITA ========== */
function parsearCita(inputOriginal) {
  let texto = palabrasANumeros(inputOriginal);
  texto = texto
    .replace(/capitulo|capítulo|cap\.?|chapter/gi, " ")
    .replace(/versiculos?|versículos?|vers\.?|v\.?|verse/gi, " ")
    .replace(/\bal\b|\ba\b|\bhasta\b|\bto\b/gi, "-")
    .replace(/[,;]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const regex =
    /^([1-3]?\s*[a-záéíóúñüãõç]+(?:\s+[a-záéíóúñüãõç]+)?)\s+(\d{1,3})(?:\s*[:\s-]\s*(\d{1,3})(?:\s*-\s*(\d{1,3}))?)?$/i;

  const match = limpiarTexto(texto).match(regex);
  if (!match) return null;

  const libroClave = resolverLibro(match[1]);
  if (!libroClave) return null;

  const capitulo = parseInt(match[2], 10);
  const versoDesde = match[3] ? parseInt(match[3], 10) : null;
  const versoHasta = match[4] ? parseInt(match[4], 10) : versoDesde;

  return {
    libroClave,
    capitulo,
    versoDesde,
    versoHasta,
    esSoloLibro: false,
  };
}

function detectarSoloLibro(inputOriginal) {
  const limpio = limpiarTexto(inputOriginal).trim();
  if (!limpio || limpio.split(/\s+/).length > 3) return null;
  return resolverLibro(limpio);
}

/* ========== BÚSQUEDA PRINCIPAL ========== */
export async function ejecutarBusqueda() {
  state.resultadosBusqueda = [];
  window.resultadosBusquedaActuales = [];

  const inputEl = document.getElementById("input-busqueda");
  const contenedorResultados = document.getElementById("resultados-busqueda");
  if (!inputEl || !contenedorResultados) return;

  const inputOriginal = inputEl.value.trim();
  if (!inputOriginal) {
    contenedorResultados.innerHTML = `<p class="placeholder-text">Escribí algo para buscar / Type something to search...</p>`;
    return;
  }

  contenedorResultados.innerHTML = `<p class="placeholder-text">Buscando en las Escrituras...</p>`;

  try {
    const config = obtenerConfiguracionIdioma();

    // Cargar JSON correspondiente si cambió el idioma o no está cargado
    if (!state.bibliaData || state.rutaBibliaCargada !== config.archivo) {
      console.log(
        `📥 Cambiando de versión bíblica... Cargando: ${config.archivo}`,
      );
      const respuesta = await fetch(config.archivo);
      if (!respuesta.ok) throw new Error("No se pudo cargar " + config.archivo);

      state.bibliaData = await respuesta.json();
      state.rutaBibliaCargada = config.archivo;
      console.log(`✅ Biblia cargada con éxito: ${config.archivo}`);
    }

    const listaVersiculos = extraerVersiculosDeJSON(state.bibliaData);
    let encontrados = [];

    const cita = parsearCita(inputOriginal);
    const soloLibro = !cita ? detectarSoloLibro(inputOriginal) : null;

    if (cita) {
      listaVersiculos.forEach((item) => {
        if (!coincideLibroJSON(item.book_name, cita.libroClave)) return;
        if (item.chapter !== cita.capitulo) return;

        if (cita.versoDesde == null) {
          encontrados.push(item);
        } else if (
          item.verse >= cita.versoDesde &&
          item.verse <= (cita.versoHasta || cita.versoDesde)
        ) {
          encontrados.push(item);
        }
      });
    } else if (soloLibro) {
      listaVersiculos.forEach((item) => {
        if (coincideLibroJSON(item.book_name, soloLibro)) {
          encontrados.push(item);
        }
      });
    } else {
      const termino = limpiarTexto(inputOriginal);
      const palabras = termino.split(/\s+/).filter((p) => p.length > 2);

      listaVersiculos.forEach((item) => {
        const textoLimpio = limpiarTexto(item.text || "");

        if (textoLimpio.includes(termino)) {
          encontrados.push(item);
          return;
        }

        if (palabras.length >= 2) {
          const coincidencias = palabras.filter((p) =>
            textoLimpio.includes(p),
          ).length;
          const umbral = Math.ceil(palabras.length * 0.8);
          if (coincidencias >= umbral) {
            encontrados.push(item);
          }
        }
      });
    }

    // Formatear resultados traduciendo encabezados según el idioma activo
    encontrados = encontrados.map((item) => {
      let nombreLibroFinal = item.book_name;

      // Si la versión activa es Español (Platense), se traduce del nombre en inglés
      if (config.idioma === "es") {
        nombreLibroFinal =
          MAPA_LIBROS_PLATENSE[limpiarTexto(item.book_name)] || item.book_name;
      }

      return {
        referencia: `${nombreLibroFinal} ${item.chapter}:${item.verse}`,
        texto: item.text,
        book_name: nombreLibroFinal,
        chapter: item.chapter,
        verse: item.verse,
      };
    });

    state.resultadosBusqueda = encontrados;
    window.resultadosBusquedaActuales = encontrados;
    renderizarResultados(encontrados, inputOriginal, contenedorResultados);
  } catch (error) {
    console.error("Error en la búsqueda:", error);
    contenedorResultados.innerHTML = `<p class="placeholder-text" style="color:#e34234;">Ocurrió un error al realizar la búsqueda.</p>`;
  }
}

/* ========== RENDER CON PAGINACIÓN ========== */
function renderizarResultados(encontrados, inputOriginal, contenedor) {
  if (encontrados.length === 0) {
    contenedor.innerHTML = `
      <div style="text-align:center; padding:10px;">
        <p style="color:#d4af37; font-weight:bold; margin-bottom:5px;">Sin resultados / No results</p>
        <p class="placeholder-text">No se encontraron pasajes para "${escaparHTML(inputOriginal)}".</p>
      </div>`;
    return;
  }

  let paginaActual = 1;
  const porPagina = 20;
  const totalPaginas = Math.ceil(encontrados.length / porPagina);

  function renderizar() {
    const inicio = (paginaActual - 1) * porPagina;
    const lote = encontrados.slice(inicio, inicio + porPagina);

    let html = lote
      .map(
        (item, i) => `
      <div class="search-result-item"
           onclick="abrirResultadoPorIndice(${inicio + i})"
           style="margin-bottom:15px; border-bottom:1px solid rgba(212,175,55,0.2); padding-bottom:10px; cursor:pointer;">
        <strong style="color:var(--gold); display:block; margin-bottom:5px;">${escaparHTML(item.referencia)}</strong>
        <p style="color:#e0e0e0; font-size:0.95rem; line-height:1.4;">"${escaparHTML(item.texto)}"</p>
      </div>`,
      )
      .join("");

    if (totalPaginas > 1) {
      html += `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:25px; padding:15px 0; border-top:1px solid var(--gold);">
          <button id="btn-ant-busqueda"
            style="background:rgba(212,175,55,0.1); border:1px solid var(--gold); color:#fff; padding:8px 14px; border-radius:6px; cursor:pointer;"
            ${paginaActual === 1 ? "disabled style='opacity:0.4;cursor:default;'" : ""}>⬅ Anterior</button>
          <span style="color:var(--gold); font-size:0.85rem; text-align:center;">
            Pág. ${paginaActual} / ${totalPaginas}<br>
            <small style="color:#aaa;">(${encontrados.length} encontrados)</small>
          </span>
          <button id="btn-sig-busqueda"
            style="background:rgba(212,175,55,0.1); border:1px solid var(--gold); color:#fff; padding:8px 14px; border-radius:6px; cursor:pointer;"
            ${paginaActual === totalPaginas ? "disabled style='opacity:0.4;cursor:default;'" : ""}>Siguiente ➡</button>
        </div>`;
    }

    contenedor.innerHTML = html;

    document
      .getElementById("btn-ant-busqueda")
      ?.addEventListener("click", () => {
        if (paginaActual > 1) {
          paginaActual--;
          renderizar();
          contenedor.scrollIntoView({ behavior: "smooth" });
        }
      });
    document
      .getElementById("btn-sig-busqueda")
      ?.addEventListener("click", () => {
        if (paginaActual < totalPaginas) {
          paginaActual++;
          renderizar();
          contenedor.scrollIntoView({ behavior: "smooth" });
        }
      });
  }

  renderizar();
}

/* ========== ABRIR RESULTADO ========== */
export function abrirResultadoPorIndice(indiceGlobal) {
  const resultados =
    window.resultadosBusquedaActuales || state.resultadosBusqueda || [];
  const item = resultados[indiceGlobal];
  if (!item) return;

  const modalTexto = document.getElementById("texto-versiculo");
  const modalVentana = document.getElementById("modal-versiculo");

  if (modalTexto) {
    modalTexto.innerHTML = `<strong style="color: var(--gold);">${escaparHTML(item.referencia)}</strong><br><br>"${escaparHTML(item.texto)}"`;
  }
  if (modalVentana) {
    modalVentana.style.setProperty("display", "flex", "important");
  }
}

window.abrirResultadoPorIndice = abrirResultadoPorIndice;

/* ========== INICIALIZAR LISTENERS ========== */
export function initSearch() {
  const btn = document.getElementById("btn-ejecutar-busqueda");
  const input = document.getElementById("input-busqueda");

  if (btn) {
    btn.addEventListener("click", ejecutarBusqueda);
  }

  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        ejecutarBusqueda();
      }
    });
  }

  console.log(
    "Módulo de búsqueda multilingüe cargado exitosamente (ES / EN / PT)",
  );
}

/* ========== EXPORTS REQUERIDOS POR MAIN.JS ========== */
export function cerrarCajita() {
  const modalVentana = document.getElementById("modal-versiculo");
  if (modalVentana) {
    modalVentana.style.display = "none";
  }
}

export function cerrarModalHerramientas() {
  const modal = document.getElementById("modal-herramientas");
  if (modal) {
    modal.style.display = "none";
  }
}

/* ========== LIMPIAR BÚSQUEDA AL CAMBIAR DE SECCIÓN O IDIOMA ========== */
export function limpiarBuscador() {
  const inputEl = document.getElementById("input-busqueda");
  if (inputEl) inputEl.value = "";

  const contenedorResultados = document.getElementById("resultados-busqueda");
  if (contenedorResultados) {
    contenedorResultados.innerHTML = `<p class="placeholder-text">Escribí algo para buscar / Type something to search...</p>`;
  }

  state.resultadosBusqueda = [];
  window.resultadosBusquedaActuales = [];

  state.rutaBibliaCargada = null;

  console.log(
    "🧹 Buscador reiniciado: preparado para evaluar el idioma activo.",
  );
}
