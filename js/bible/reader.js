// js/bible/reader.js
// Módulo de lectura y navegación por Libros y Capítulos de la Biblia (Aislado y protegido)

import { listaLibrosAntiguo, listaLibrosNuevo } from "./canon.js";
import {
  guardarResaltadoPersonal,
  aplicarResaltadosPersonales,
} from "./boxes.js";
import { resetAudioState } from "../core/voz.js";

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

function obtenerInfoBibliaActual() {
  const idioma = localStorage.getItem("pv_idioma") || "es";
  switch (idioma) {
    case "pt":
      return { ruta: "data/biblia_pt_completa.json", idioma: "pt" };
    case "en":
      return { ruta: "data/bibleweb.json", idioma: "en" };
    case "es":
    default:
      return { ruta: "data/SpaPlatense.json", idioma: "es" };
  }
}

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

function normalizarConCanonOficial(jsonRaw, idioma) {
  const versosPlanos = [];

  if (idioma === "es" || idioma === "en" || idioma === "pt") {
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

  return versosPlanos;
}

function obtenerNombreVisible(nombreLibroEsp) {
  const idioma = localStorage.getItem("pv_idioma") || "es";
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

// ==========================================
// RENDERIZADO DE VERSÍCULOS + ESTADO PARA AUDIO
// ==========================================
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

    // Apuntando exclusivamente al botón único de la Biblia
    const btnAudio = document.getElementById("bible-audio-trigger");
    if (btnAudio)
      btnAudio.innerHTML = '<i class="fas fa-volume-up"></i> Escuchar';
  }

  if (typeof changeScreen === "function" && screenLectura) {
    changeScreen(screenLectura);
  }

  // Guardar estado actual para el módulo de audio y controles MediaSession
  window.pvAudioEstado = window.pvAudioEstado || {};
  window.pvAudioEstado.libro = nombreLibro;
  window.pvAudioEstado.capitulo = numCapitulo;
  window.pvAudioEstado.versosLibro = versosLibro;

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

  // Toggle de Modo Continuo + Barra de Navegación de Capítulos
  htmlVersos += `
    <div style="max-width: 600px; margin: 20px auto 10px auto; padding: 0 10px; display: flex; justify-content: center;">
      <label class="toggle-continuo" style="display: flex; align-items: center; gap: 8px; color: #ccc; font-size: 0.85rem; cursor: pointer; background: rgba(212, 175, 55, 0.05); border: 1px dashed rgba(212, 175, 55, 0.3); padding: 8px 12px; border-radius: 8px; width: 100%; justify-content: center;">
        <input type="checkbox" id="chk-modo-continuo" style="accent-color: var(--gold); cursor: pointer;">
        <span>Continuar audio del siguiente capítulo automáticamente</span>
      </label>
    </div>

    <div style="max-width: 600px; margin: 20px auto 50px auto; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(212,175,55,0.3); padding-top: 20px;">
      <button id="btn-cap-anterior" style="background: rgba(212,175,55,0.1); border: 1px solid var(--gold); color: #fff; padding: 10px 16px; border-radius: 6px; cursor: pointer; font-size: 0.9rem; ${!capAnterior ? "opacity: 0.3; pointer-events: none;" : ""}">⬅ Anterior</button>
      <span style="color: var(--gold); font-size: 0.85rem;">Capítulo ${numCapitulo}</span>
      <button id="btn-cap-siguiente" style="background: rgba(212,175,55,0.1); border: 1px solid var(--gold); color: #fff; padding: 10px 16px; border-radius: 6px; cursor: pointer; font-size: 0.9rem; ${!capSiguiente ? "opacity: 0.3; pointer-events: none;" : ""}">Siguiente ➡</button>
    </div>
  `;

  if (typeof resetAudioState === "function") {
    resetAudioState();
  }
  if (areaLectura) areaLectura.innerHTML = htmlVersos;

  // Sincronizar estado del checkbox del Modo Continuo
  const chkContinuo = document.getElementById("chk-modo-continuo");
  if (chkContinuo) {
    const activo = localStorage.getItem("pv_modo_continuo") === "true";
    chkContinuo.checked = activo;
    if (window.pvAudioEstado) {
      window.pvAudioEstado.autoContinuar = activo;
    }

    chkContinuo.onchange = () => {
      localStorage.setItem(
        "pv_modo_continuo",
        chkContinuo.checked ? "true" : "false",
      );
      if (window.pvAudioEstado) {
        window.pvAudioEstado.autoContinuar = chkContinuo.checked;
      }
    };
  }

  // 1. Aplica subrayados de la capa de estudio
  // 1. Aplica subrayados de la capa de estudio y luego el tooltip
  if (typeof window.aplicarSubrayadosCapitulo === "function") {
    Promise.resolve(window.aplicarSubrayadosCapitulo(nombreLibro, numCapitulo))
      .then(() => {
        setTimeout(() => {
          console.log("Entró al setTimeout del tooltip", {
            tieneFn: typeof window.actualizarTooltipSubrayados,
            visto: localStorage.getItem("pv_tooltip_versiculos_visto"),
            versiculos: document.querySelectorAll(".linea-versiculo").length,
          });
          if (typeof window.actualizarTooltipSubrayados === "function") {
            window.actualizarTooltipSubrayados(true);
          }
        }, 400);
      })
      .catch((err) => console.warn("Error al aplicar subrayados:", err));
  }
  // 2. Inicializa los eventos de la paleta del Fibrón
  initFibronEvents();

  // 3. Conecta el clic en cada versículo para resaltar
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

// ==========================================
// NAVEGACIÓN PROTEGIDA (CON CANDADO DE PANTALLA)
// ==========================================
window.irAlSiguienteCapitulo = function (autoReproducir = false) {
  // CANDADO: Si no estamos en la pantalla de lectura, abortar inmediatamente
  const pantallaActiva = document.querySelector(".screen.active");
  if (!pantallaActiva || pantallaActiva.id !== "screen-lectura") {
    return;
  }

  const estado = window.pvAudioEstado || {};
  if (!estado.libro || !estado.versosLibro) return;

  const caps = [...new Set(estado.versosLibro.map((v) => v.chapter))].sort(
    (a, b) => a - b,
  );
  const idx = caps.indexOf(Number(estado.capitulo));
  if (idx === -1 || idx >= caps.length - 1) {
    console.log("No hay más capítulos en este libro");
    return;
  }

  const siguiente = caps[idx + 1];
  renderizarVersiculosCapitulo(estado.libro, siguiente, estado.versosLibro);

  if (autoReproducir) {
    setTimeout(() => {
      if (typeof window.ejecutarLecturaVoz === "function") {
        window.ejecutarLecturaVoz();
      }
    }, 700);
  }
};

window.irAlCapituloAnterior = function (autoReproducir = false) {
  // CANDADO: Si no estamos en la pantalla de lectura, abortar inmediatamente
  const pantallaActiva = document.querySelector(".screen.active");
  if (!pantallaActiva || pantallaActiva.id !== "screen-lectura") {
    return;
  }

  const estado = window.pvAudioEstado || {};
  if (!estado.libro || !estado.versosLibro) return;

  const caps = [...new Set(estado.versosLibro.map((v) => v.chapter))].sort(
    (a, b) => a - b,
  );
  const idx = caps.indexOf(Number(estado.capitulo));
  if (idx <= 0) return;

  const anterior = caps[idx - 1];
  renderizarVersiculosCapitulo(estado.libro, anterior, estado.versosLibro);

  if (autoReproducir) {
    setTimeout(() => {
      if (typeof window.ejecutarLecturaVoz === "function") {
        window.ejecutarLecturaVoz();
      }
    }, 700);
  }
};

/**
 * Inicializa los eventos del botón de Fibrón y su paleta flotante
 */
export function initFibronEvents() {
  const btnToggle = document.getElementById("btn-toggle-fibron");
  const paleta = document.getElementById("paleta-fibron");
  const botonesColor = document.querySelectorAll(".btn-color-fibron");

  if (!btnToggle || !paleta) return;

  btnToggle.onclick = (e) => {
    e.stopPropagation();
    const estaOculta =
      paleta.style.display === "none" || paleta.style.display === "";
    paleta.style.display = estaOculta ? "flex" : "none";
  };

  botonesColor.forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const colorElegido = btn.getAttribute("data-color");

      botonesColor.forEach((b) => {
        b.style.boxShadow = "none";
        b.style.transform = "scale(1)";
        if (b.getAttribute("data-color") === "borrar") {
          b.style.backgroundColor = "#333";
          b.style.color = "#ff5555";
        }
      });

      if (window.colorFibronActivo === colorElegido) {
        window.colorFibronActivo = null;
        btnToggle.style.border = "1px solid var(--gold)";
      } else {
        window.colorFibronActivo = colorElegido;
        btnToggle.style.border = "2px solid #fff";

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
 * Genera y muestra automáticamente el Índice de Contenido Exegético en la Guía
 */
export async function inicializarIndiceExegeticoEnGuia() {
  const contenedor = document.getElementById("lista-indice-dinamico");
  if (!contenedor) return;

  contenedor.innerHTML = "<em>Cargando índice exegético...</em>";

  try {
    const respuesta = await fetch("data/contenido.json");
    const datosJson = await respuesta.json();
    const idioma = localStorage.getItem("pv_idioma") || "es";

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

    llavesLibros.sort((a, b) => {
      let nombreA = a.charAt(0).toUpperCase() + a.slice(1);
      let nombreB = b.charAt(0).toUpperCase() + b.slice(1);

      let idxA = CANON_COMPLETO.indexOf(nombreA);
      let idxB = CANON_COMPLETO.indexOf(nombreB);

      if (idxA === -1) idxA = 999;
      if (idxB === -1) idxB = 999;
      return idxA - idxB;
    });

    let htmlIndice = `<ul style="list-style: none; padding-left: 0; margin: 0;">`;

    llavesLibros.forEach((keyLibro) => {
      const datosLibro = librosContenido[keyLibro];
      const capitulosObj = datosLibro.capitulos || {};
      const numerosCapitulos = Object.keys(capitulosObj)
        .map(Number)
        .sort((a, b) => a - b);

      if (numerosCapitulos.length === 0) return;

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

    contenedor.querySelectorAll(".enlace-capitulo-indice").forEach((link) => {
      link.addEventListener("click", async (e) => {
        e.preventDefault();
        const libro = link.getAttribute("data-libro");
        const cap = parseInt(link.getAttribute("data-capitulo"));

        const todosLosVersos = await obtenerVersosNormalizados();
        const versosLibro = todosLosVersos.filter((v) => v.book_name === libro);

        renderizarVersiculosCapitulo(libro, cap, versosLibro);
      });
    });
  } catch (error) {
    console.error("Error al generar el índice exegético:", error);
    contenedor.innerHTML =
      "<p style='color: #ff5555;'><em>Error al cargar el índice.</em></p>";
  }
}

document
  .getElementById("acordeon-indice-exegetico")
  ?.addEventListener("toggle", function () {
    if (this.open) {
      if (typeof inicializarIndiceExegeticoEnGuia === "function") {
        inicializarIndiceExegeticoEnGuia();
      }
    }
  });

export async function poblarReferenciasAcordeon() {
  const contenedor = document.getElementById("lista-referencias-acordeon");
  if (!contenedor) return;

  try {
    const res = await fetch("data/referencias-cruzadas.json");
    if (!res.ok) throw new Error("No se pudo cargar el archivo");
    const lista = await res.json();

    if (!Array.isArray(lista) || lista.length === 0) {
      contenedor.innerHTML =
        '<p style="color: #888; margin: 0;">No hay referencias cargadas todavía.</p>';
      return;
    }

    const lang =
      window.idiomaActual ||
      localStorage.getItem("pv_idioma") ||
      localStorage.getItem("pv_idioma") ||
      "es";

    let html = '<ul style="list-style: none; padding: 0; margin: 0;">';

    lista.forEach((ref) => {
      const textoOrigen = `${ref.desde.libro.toUpperCase()} ${ref.desde.capitulo},${ref.desde.versiculo}`;
      const textoDestino =
        ref.hacia.citaTexto ||
        `${ref.hacia.libro.toUpperCase()} ${ref.hacia.capitulo},${ref.hacia.versiculo}`;

      const datosIdioma = ref[lang] || ref.es || ref;
      const explicacionTexto = datosIdioma.explicacion || "";

      html += `
        <li style="margin-bottom: 10px; border-bottom: 1px solid rgba(212,175,55,0.1); padding-bottom: 8px;">
          <a href="#" class="enlace-referencia-item" 
             data-libro="${ref.desde.libro}" 
             data-capitulo="${ref.desde.capitulo}" 
             style="color: var(--gold); text-decoration: none; display: block; cursor: pointer;">
             🔗 <strong>${textoOrigen}</strong> ➔ ${textoDestino}
          </a>
          <span style="font-size: 0.85rem; color: #ccc; display: block; margin-top: 4px; line-height: 1.3;">${explicacionTexto}</span>
        </li>
      `;
    });

    html += "</ul>";
    contenedor.innerHTML = html;

    contenedor.querySelectorAll(".enlace-referencia-item").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        const libro = el.getAttribute("data-libro");
        const capitulo = Number(el.getAttribute("data-capitulo"));

        if (
          typeof renderizarVersiculosCapitulo === "function" &&
          typeof versosLibro !== "undefined"
        ) {
          renderizarVersiculosCapitulo(libro, capitulo, versosLibro);
        }
      });
    });
  } catch (error) {
    console.error("Error al cargar las referencias:", error);
    contenedor.innerHTML =
      '<p style="color: #ff6b6b; margin: 0;">Error al cargar las referencias.</p>';
  }
}

export async function cargarGlosario() {
  const contenedor = document.getElementById("glosario-container");
  if (!contenedor) return;

  try {
    const respuesta = await fetch("data/glosario.json");
    if (!respuesta.ok) throw new Error("Error al cargar el glosario.json");

    const glosarioData = await respuesta.json();
    contenedor.innerHTML = "";

    if (!Array.isArray(glosarioData) || glosarioData.length === 0) {
      contenedor.innerHTML =
        "<p class='glosario-error'>No hay términos cargados.</p>";
      return;
    }

    const lang =
      window.idiomaActual ||
      localStorage.getItem("pv_idioma") ||
      localStorage.getItem("pv_idioma") ||
      "es";

    const terminosOrdenados = [...glosarioData].sort((a, b) => {
      const objA = a[lang] || a.es || {};
      const objB = b[lang] || b.es || {};
      const tituloA = objA.titulo || a.termino || "";
      const tituloB = objB.titulo || b.termino || "";
      return tituloA.localeCompare(tituloB, lang, { sensitivity: "base" });
    });

    terminosOrdenados.forEach((item) => {
      const datos = item[lang] || item.es || {};
      const titulo = datos.titulo || item.termino || "";
      const definicion = datos.definicion || "";

      const card = document.createElement("div");
      card.className = "glosario-item";
      card.innerHTML = `
        <h4 class="glosario-termino">${titulo}</h4>
        <p class="glosario-definicion">${definicion}</p>
      `;
      contenedor.appendChild(card);
    });
  } catch (error) {
    console.error("Error cargando el glosario:", error);
    contenedor.innerHTML =
      "<p class='glosario-error'>No se pudieron cargar los términos.</p>";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  poblarReferenciasAcordeon();
  cargarGlosario();
});

export function desactivarModoFibron() {
  window.colorFibronActivo = null;

  const btnToggle = document.getElementById("btn-toggle-fibron");
  if (btnToggle) {
    btnToggle.style.border = "1px solid var(--gold)";
  }

  const paleta = document.getElementById("paleta-fibron");
  if (paleta) {
    paleta.style.display = "none";
  }

  const botonesColor = document.querySelectorAll(".btn-color-fibron");
  botonesColor.forEach((b) => {
    b.style.boxShadow = "none";
    b.style.transform = "scale(1)";
    if (b.getAttribute("data-color") === "borrar") {
      b.style.backgroundColor = "#333";
      b.style.color = "#ff5555";
    }
  });
}
let cacheIntroduccionesLibros = null;

function normalizarClaveLibro(texto = "") {
  const clave = texto
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");

  const mapaAClave = {
    // Español
    genesis: "genesis",
    exodo: "exodo",
    levitico: "levitico",
    numeros: "numeros",
    deuteronomio: "deuteronomio",
    josue: "josue",
    jueces: "jueces",
    rut: "rut",
    "1 samuel": "1 samuel",
    "2 samuel": "2 samuel",
    "1 reyes": "1 reyes",
    "2 reyes": "2 reyes",
    "1 cronicas": "1 cronicas",
    "2 cronicas": "2 cronicas",
    esdras: "esdras",
    nehemias: "nehemias",
    tobias: "tobias",
    judit: "judit",
    ester: "ester",
    "1 macabeos": "1 macabeos",
    "2 macabeos": "2 macabeos",
    job: "job",
    salmos: "salmos",
    proverbios: "proverbios",
    eclesiastes: "eclesiastes",
    "cantar de los cantares": "cantar de los cantares",
    sabiduria: "sabiduria",
    eclesiastico: "eclesiastico",
    isaias: "isaias",
    jeremias: "jeremias",
    lamentaciones: "lamentaciones",
    baruc: "baruc",
    ezequiel: "ezequiel",
    daniel: "daniel",
    oseas: "oseas",
    joel: "joel",
    amos: "amos",
    abdias: "abdias",
    jonas: "jonas",
    miqueas: "miqueas",
    nahum: "nahum",
    habacuc: "habacuc",
    sofonias: "sofonias",
    ageo: "ageo",
    zacarias: "zacarias",
    malaquias: "malaquias",
    mateo: "mateo",
    marcos: "marcos",
    lucas: "lucas",
    juan: "juan",
    hechos: "hechos",
    "hechos de los apostoles": "hechos",
    romanos: "romanos",
    "1 corintios": "1 corintios",
    "2 corintios": "2 corintios",
    galatas: "galatas",
    efesios: "efesios",
    filipenses: "filipenses",
    colosenses: "colosenses",
    "1 tesalonicenses": "1 tesalonicenses",
    "2 tesalonicenses": "2 tesalonicenses",
    "1 timoteo": "1 timoteo",
    "2 timoteo": "2 timoteo",
    tito: "tito",
    filemon: "filemon",
    hebreos: "hebreos",
    santiago: "santiago",
    "1 pedro": "1 pedro",
    "2 pedro": "2 pedro",
    "1 juan": "1 juan",
    "2 juan": "2 juan",
    "3 juan": "3 juan",
    judas: "judas",
    apocalipsis: "apocalipsis",

    // Inglés
    exodus: "exodo",
    leviticus: "levitico",
    numbers: "numeros",
    deuteronomy: "deuteronomio",
    joshua: "josue",
    judges: "jueces",
    ruth: "rut",
    "1 kings": "1 reyes",
    "2 kings": "2 reyes",
    "1 chronicles": "1 cronicas",
    "2 chronicles": "2 cronicas",
    "2 kings / 2 chronicles": "2 cronicas",
    ezra: "esdras",
    nehemiah: "nehemias",
    tobit: "tobias",
    judith: "judit",
    esther: "ester",
    "1 maccabees": "1 macabeos",
    "2 maccabees": "2 macabeos",
    psalms: "salmos",
    proverbs: "proverbios",
    ecclesiastes: "eclesiastes",
    "song of solomon": "cantar de los cantares",
    "song of songs": "cantar de los cantares",
    wisdom: "sabiduria",
    sirach: "eclesiastico",
    ecclesiasticus: "eclesiastico",
    isaiah: "isaias",
    jeremiah: "jeremias",
    lamentations: "lamentaciones",
    baruch: "baruc",
    ezekiel: "ezequiel",
    hosea: "oseas",
    obadiah: "abdias",
    jonah: "jonas",
    micah: "miqueas",
    habakkuk: "habacuc",
    zephaniah: "sofonias",
    haggai: "ageo",
    zechariah: "zacarias",
    malachi: "malaquias",
    matthew: "mateo",
    mark: "marcos",
    luke: "lucas",
    john: "juan",
    acts: "hechos",
    "acts of the apostles": "hechos",
    romans: "romanos",
    "1 corinthians": "1 corintios",
    "2 corinthians": "2 corintios",
    galatians: "galatas",
    ephesians: "efesios",
    philippians: "filipenses",
    colossians: "colosenses",
    "1 thessalonians": "1 tesalonicenses",
    "2 thessalonians": "2 tesalonicenses",
    "1 timothy": "1 timoteo",
    "2 timothy": "2 timoteo",
    titus: "tito",
    philemon: "filemon",
    hebrews: "hebreos",
    james: "santiago",
    "1 peter": "1 pedro",
    "2 peter": "2 pedro",
    "1 john": "1 juan",
    "2 john": "2 juan",
    "3 john": "3 juan",
    jude: "judas",
    revelation: "apocalipsis",

    // Portugués
    juizes: "jueces",
    rute: "rut",
    "1 reis": "1 reyes",
    "2 reis": "2 reyes",
    neemias: "nehemias",
    judite: "judit",
    "1 macabeus": "1 macabeos",
    "2 macabeus": "2 macabeos",
    jo: "job",
    proverbios: "proverbios",
    "cantico dos canticos": "cantar de los cantares",
    sabedoria: "sabiduria",
    lamentacoes: "lamentaciones",
    oseias: "oseas",
    obadias: "abdias",
    miqueias: "miqueas",
    naum: "nahum",
    habacuque: "habacuc",
    ageu: "ageo",
    joao: "juan",
    atos: "hechos",
    "atos dos apostolos": "hechos",
    "1 tessalonicenses": "1 tesalonicenses",
    "2 tessalonicenses": "2 tesalonicenses",
    filemom: "filemon",
    hebreus: "hebreos",
    tiago: "santiago",
    "1 joao": "1 juan",
    "2 joao": "2 juan",
    "3 joao": "3 juan",
    apocalipse: "apocalipsis",
  };

  return mapaAClave[clave] || clave;
}

function obtenerIdiomaActual() {
  const candidatos = [
    window.idiomaActual,
    window.idioma,
    window.LANG,
    localStorage.getItem("idioma"),
    localStorage.getItem("lang"),
    localStorage.getItem("pv_idioma"),
    document.documentElement.lang,
  ];

  for (const cand of candidatos) {
    if (!cand) continue;
    const lim = String(cand).toLowerCase().slice(0, 2);
    if (["es", "en", "pt"].includes(lim)) {
      return lim;
    }
  }
  return "es";
}

function resolverTextoIdioma(campo, idioma = "es") {
  if (!campo) return "";
  if (typeof campo === "string") return campo;
  if (typeof campo === "object") {
    return campo[idioma] || campo.es || campo.en || campo.pt || "";
  }
  return String(campo);
}

async function cargarIntroduccionesLibros() {
  if (cacheIntroduccionesLibros) {
    return cacheIntroduccionesLibros;
  }

  try {
    const respuesta = await fetch("./data/introduccion_libro.json", {
      cache: "no-cache",
    });
    if (!respuesta.ok) {
      throw new Error(
        `No se pudo cargar ./data/introduccion_libro.json (${respuesta.status})`,
      );
    }
    cacheIntroduccionesLibros = await respuesta.json();
    return cacheIntroduccionesLibros;
  } catch (error) {
    console.error("Error cargando introducciones de libros:", error);
    return {};
  }
}

function pintarModalIntroduccion(info, nombreRespaldo) {
  const modal = document.getElementById("modal-introduccion-libro");
  if (!modal) return;

  const idioma = obtenerIdiomaActual();
  const nombreFallback = nombreRespaldo || "Este libro";

  const respaldoPorIdioma = {
    es: {
      categoria: "Introducción bíblica",
      introduccion:
        "Panorama inicial del libro para ubicar su contexto, su tono y el sentido general de su lectura.",
      resumen:
        "Vista general del contexto, el tipo de escrito y el eje central de este libro antes de elegir un capítulo.",
      clave:
        "Fijate en el propósito del texto, su contexto y qué tema o enseñanza se repite a lo largo de sus capítulos.",
    },
    en: {
      categoria: "Biblical Introduction",
      introduccion:
        "Initial overview of the book to situate its context, tone, and general sense of reading.",
      resumen:
        "General view of the context, literary genre, and core focus of this book before choosing a chapter.",
      clave:
        "Pay attention to the purpose of the text, its context and the recurring themes or teachings across its chapters.",
    },
    pt: {
      categoria: "Introdução bíblica",
      introduccion:
        "Panorama inicial do livro para situar seu contexto, seu tom e o sentido geral da leitura.",
      resumen:
        "Visão geral do contexto, do gênero do escrito e do eixo central deste livro antes de escolher um capítulo.",
      clave:
        "Observe o propósito do texto, seu contexto e os temas ou ensinamentos que se repetem ao longo dos capítulos.",
    },
  };

  const def = respaldoPorIdioma[idioma] || respaldoPorIdioma.es;

  const datos = info || {
    nombre: nombreFallback,
    categoria: def.categoria,
    introduccion_corta: "",
    introduccion: def.introduccion,
    resumen: def.resumen,
    clave: def.clave,
  };

  const titulosClavePorIdioma = {
    es: "Clave de lectura:",
    en: "Reading key:",
    pt: "Chave de leitura:",
  };

  const claveTituloEl = document.getElementById("intro-libro-clave-titulo");
  if (claveTituloEl) {
    claveTituloEl.textContent =
      titulosClavePorIdioma[idioma] || titulosClavePorIdioma.es;
  }

  const asignarCampo = (id, valor) => {
    const el = document.getElementById(id);
    if (!el) return;
    const textoExtraido = resolverTextoIdioma(valor, idioma);
    const texto = String(textoExtraido || "").trim();
    el.textContent = texto;
    el.style.display = texto ? "" : "none";
  };

  asignarCampo("intro-libro-categoria", datos.categoria);
  asignarCampo("intro-libro-titulo", datos.nombre || nombreFallback);
  asignarCampo("intro-libro-corta", datos.introduccion_corta);
  asignarCampo("intro-libro-introduccion", datos.introduccion);
  asignarCampo("intro-libro-resumen", datos.resumen);
  asignarCampo("intro-libro-clave", datos.clave);

  // Si en el HTML el modal está anidado dentro de otro contenedor, lo llevamos a <body>
  if (modal.parentElement !== document.body) {
    document.body.appendChild(modal);
  }

  modal.classList.remove("oculto");
  modal.classList.add("activo");
  modal.style.setProperty("display", "flex", "important");
  modal.style.setProperty("z-index", "99999", "important");

  // Siempre arranca arriba de todo al abrir
  modal.scrollTop = 0;
  const cuerpoModal = modal.querySelector(".pv-modal-body");
  if (cuerpoModal) {
    cuerpoModal.scrollTop = 0;
  }
}

async function abrirIntroduccionLibro() {
  const tituloEl = document.getElementById("titulo-libro-seleccionado");
  const nombreLibro = tituloEl ? tituloEl.textContent.trim() : "";
  const clave = normalizarClaveLibro(nombreLibro);

  const mapaLibros = await cargarIntroduccionesLibros();
  const infoLibro = clave && mapaLibros ? mapaLibros[clave] || null : null;

  pintarModalIntroduccion(infoLibro, nombreLibro);
}

function cerrarIntroduccionLibro() {
  const modal = document.getElementById("modal-introduccion-libro");
  if (modal) {
    modal.classList.remove("activo");
    modal.classList.add("oculto");
    modal.style.setProperty("display", "none", "important");
  }
}

window.cerrarIntroduccionLibro = cerrarIntroduccionLibro;

document.addEventListener("DOMContentLoaded", () => {
  const btnAbrir = document.getElementById("btn-introduccion-libro");
  const btnCerrar = document.getElementById("btn-cerrar-intro-libro");
  const modal = document.getElementById("modal-introduccion-libro");

  if (btnAbrir) {
    btnAbrir.addEventListener("click", abrirIntroduccionLibro);
  }

  if (btnCerrar) {
    btnCerrar.addEventListener("click", cerrarIntroduccionLibro);
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        cerrarIntroduccionLibro();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      cerrarIntroduccionLibro();
    }
  });
});
