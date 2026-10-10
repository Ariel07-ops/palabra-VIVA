// 1. CAPTURAR LAS PANTALLAS
const screenSplash = document.getElementById("screen-splash");
const screenMain = document.getElementById("screen-main");
const screenBibleDetail = document.getElementById("screen-bible-detail");
const screenPathDetail = document.getElementById("screen-path-detail");
const screenAgradecido = document.getElementById("screen-agradecido");
const screenBendecido = document.getElementById("screen-bendecido");
const screenPromesa = document.getElementById("screen-promesa");
const screenPreocupado = document.getElementById("screen-preocupado");
const screenAnsioso = document.getElementById("screen-ansioso");
const screenTemeroso = document.getElementById("screen-temeroso");
const screenFeliz = document.getElementById("screen-feliz");
const screenTriste = document.getElementById("screen-triste");
const screenCansado = document.getElementById("screen-cansado");
const screenEmaus = document.getElementById("screen-emaus");
const screenBuscar = document.getElementById("screen-buscar");
const screenAntiguo = document.getElementById("screen-antiguo");
const screenCapitulos = document.getElementById("screen-capitulos");
const screenLectura = document.getElementById("screen-lectura");
const screenNuevo = document.getElementById("screen-nuevo");
const screenIdioma = document.getElementById("screen-idioma");
const screenSugerir = document.getElementById("screen-sugerir");
const screenPeldañoDetalle = document.getElementById("screen-peldaño-detalle");
const screenEmausDetalle = document.getElementById("screen-emaus-detalle");
const screenAcerca = document.getElementById("screen-acerca");
const screenEnpaz = document.getElementById("screen-en-paz");
const screenAsistente = document.getElementById("screen-asistente");

// 2. CAPTURAR BOTONES INTERACTIVOS
const btnGotoBible = document.getElementById("btn-goto-bible");
const btnAsistenteHome = document.getElementById("btn-asistente-home");
const btnGotoPath = document.getElementById("btn-goto-path");
const btnBackBible = document.querySelector(".btn-back");
const btnMenu = document.getElementById("btn-menu");
const menuLateral = document.getElementById("menu-lateral");
const textParagraph = document.querySelector(".interact-paragraph");
const studyCard = document.getElementById("study-card");
const panelHandle = document.querySelector(".panel-handle");

const linkAsistente = document.getElementById("link-asistente");
const btnMic = document.getElementById("btnMic");
const inputChat = document.getElementById("chat-input");
// --- VARIABLE GLOBAL PARA EL BUSCADOR ---
let resultadosBusquedaActuales = [];
// Variable global para guardar la Biblia en la memoria RAM
let bibliaData = null;
let categoriaActiva = null; // Memoria de corto plazo para la catequesis

// Función para cargar el archivo JSON al iniciar
async function inicializarBiblia() {
  try {
    const respuesta = await fetch("./data/biblia.json");
    bibliaData = await respuesta.json();
    console.log("Biblia cargada correctamente en memoria 📖");
  } catch (error) {
    console.error("Error al cargar el archivo biblia.json:", error);
  }
}
function escaparHTML(texto) {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

document.addEventListener("DOMContentLoaded", () => {
  // El resto de tu código de inicialización y eventos del chat...
});
inicializarBiblia();

// --- FUNCIÓN AUXILIAR PARA CAMBIAR DE PANTALLA ---
// --- FUNCIÓN AUXILIAR PARA CAMBIAR DE PANTALLA ---
function changeScreen(screenToShow) {
  // --- FRENAR AUDIO SIEMPRE QUE CAMBIAMOS DE PANTALLA ---
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    if (typeof estaReproduciendo !== "undefined") estaReproduciendo = false;
    if (typeof estaPausado !== "undefined") estaPausado = false;
    const btnAudio = document.getElementById("btn-hablar-lectura");
    if (btnAudio)
      btnAudio.innerHTML = '<i class="fas fa-volume-up"></i> Escuchar';
    document
      .querySelectorAll(".expanded-full")
      .forEach((el) => el.classList.remove("expanded-full"));
    const studyCard = document.getElementById("study-card");
    if (studyCard) studyCard.classList.add("hidden");
  }

  [
    screenSplash,
    screenMain,
    screenBibleDetail,
    screenPathDetail,
    screenAgradecido,
    screenEnpaz,
    screenCansado,
    screenBendecido,
    screenPreocupado,
    screenAnsioso,
    screenTemeroso,
    screenFeliz,
    screenTriste,
    screenEmaus,
    screenPromesa,
    screenBuscar,
    screenAntiguo,
    screenCapitulos,
    screenLectura,
    screenNuevo,
    screenPeldañoDetalle,
    screenEmausDetalle,
    screenIdioma,
    screenSugerir,
    screenAcerca,
    screenAsistente,
  ].forEach((screen) => {
    if (screen) {
      screen.classList.remove("active");
    }
  });

  if (screenToShow) {
    screenToShow.classList.add("active");

    // --- GESTIÓN DE HISTORIAL PARA EL BOTÓN "ATRÁS" ---
    if (screenToShow === screenMain) {
      history.replaceState({ screenId: "main" }, "", "");
    } else if (screenToShow && screenToShow !== screenSplash) {
      const screenId = screenToShow.id || "detalle";
      history.pushState({ screenId: screenId }, "", "");
    }
  }
}

// --- FUNCIÓN PARA REDIRIGIR SEGÚN EL ESTADO ---
function redirigir(estado) {
  const estadosMap = {
    agradecido: screenAgradecido,
    bendecido: screenBendecido,
    cansado: screenCansado,
    feliz: screenFeliz,
    triste: screenTriste,
    ansioso: screenAnsioso,
    temeroso: screenTemeroso,
    preocupado: screenPreocupado,
    "en-paz": screenEnpaz,
  };

  if (estadosMap[estado]) {
    cargarEstadoAnimo(estado);
    changeScreen(estadosMap[estado]);
  }
}

// --- ACTIVAR BOTONES DE ESTADO DE ÁNIMO ---
const moodButtons = document.querySelectorAll(".btn-emaus");
moodButtons.forEach((button) => {
  button.addEventListener("click", () => {
    moodButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
  });
});

if (btnGotoBible)
  btnGotoBible.addEventListener("click", () => changeScreen(screenBibleDetail));
if (btnGotoPath)
  btnGotoPath.addEventListener("click", () => changeScreen(screenPathDetail));
if (btnBackBible)
  btnBackBible.addEventListener("click", () => changeScreen(screenMain));

// --- BOTONES VOLVER DE LAS PANTALLAS DE ESTADO ---
[
  "agradecido",
  "cansado",
  "bendecido",
  "feliz",
  "triste",
  "ansioso",
  "temeroso",
  "preocupado",
  "en-paz",
].forEach((est) => {
  const btn = document.querySelector(`#screen-${est} .btn-back-path`);
  if (btn) btn.addEventListener("click", () => changeScreen(screenPathDetail));
});

const btnBackEmaus = document.querySelector("#screen-emaus .btn-back-path");
if (btnBackEmaus)
  btnBackEmaus.addEventListener("click", () => changeScreen(screenPathDetail));

// --- BOTONES VOLVER DE LAS PANTALLAS DE DETALLE NUEVAS ---
const btnBackEmausDetalle = document.querySelector(
  "#screen-emaus-detalle .btn-back-path",
);
if (btnBackEmausDetalle)
  btnBackEmausDetalle.addEventListener("click", () =>
    changeScreen(screenEmaus),
  );

const btnBackPeldañoDetalle = document.querySelector(
  "#screen-peldaño-detalle .btn-back-path",
);
if (btnBackPeldañoDetalle)
  btnBackPeldañoDetalle.addEventListener("click", () =>
    changeScreen(screenPromesa),
  );

// --- FUNCIONES DE DETALLE PARA EMAÚS Y PROMESA (CON SOPORTE MULTILINGÜE) ---
async function abrirPasoEmaus(numero) {
  try {
    const idioma =
      window.idiomaActual || localStorage.getItem("idiomaApp") || "es";

    const respuesta = await fetch("data/camino.json");
    const datosJson = await respuesta.json();
    const datos = datosJson.pasos.find((p) => p.id === parseInt(numero));

    if (!datos) return;

    // Título con soporte de idioma
    document.getElementById("titulo-emaus-detalle").innerHTML =
      datos.titulo && datos.titulo[idioma]
        ? datos.titulo[idioma]
        : datos.titulo || "";

    const textoPaso =
      datos.texto && datos.texto[idioma]
        ? datos.texto[idioma]
        : datos.texto || "";
    const caminarPaso =
      datos.caminar && datos.caminar[idioma]
        ? datos.caminar[idioma]
        : datos.caminar || "";
    const reflexionPaso =
      datos.reflexion && datos.reflexion[idioma]
        ? datos.reflexion[idioma]
        : datos.reflexion || "";
    const tituloAlt =
      datos.titulo && datos.titulo[idioma] ? datos.titulo[idioma] : "";

    // Armamos el contenido con los textos traducidos
    document.getElementById("texto-emaus-detalle").innerHTML = `
            <p>${textoPaso}</p>
            <p style="margin-top: 15px;"><strong>Caminar:</strong> ${caminarPaso}</p>
            <p style="margin-top: 15px; font-style: italic;"><strong>Reflexión:</strong> ${reflexionPaso}</p>
            
            ${datos.imagen ? `<img src="${datos.imagen}" alt="${tituloAlt}" >` : ""}
        `;

    changeScreen(screenEmausDetalle);
  } catch (error) {
    console.error("Error al cargar datos:", error);
  }
}

async function abrirPeldaño(numero) {
  try {
    const idioma =
      window.idiomaActual || localStorage.getItem("idiomaApp") || "es";

    const respuesta = await fetch("data/promesa.json");
    const datosJson = await respuesta.json();
    const datos = datosJson.find((p) => p.id === parseInt(numero));

    if (!datos) return;

    const tituloPeldaño =
      datos.titulo && datos.titulo[idioma]
        ? datos.titulo[idioma]
        : datos.titulo || "";
    const introPeldaño =
      datos.introduccion && datos.introduccion[idioma]
        ? datos.introduccion[idioma]
        : datos.introduccion || "";
    const citaPeldaño =
      datos.cita_biblica && datos.cita_biblica[idioma]
        ? datos.cita_biblica[idioma]
        : datos.cita_biblica || "";

    // Campo de desarrollo dinámico adaptado a idioma
    const campoDesarrolloObj =
      datos.verbo_eterno ||
      datos.la_promesa_del_emmanuel ||
      datos.el_fiat_de_maria ||
      datos.el_misterio_de_la_kenosis ||
      datos.las_obras_y_las_palabras ||
      datos.el_sacrificio_y_la_eucaristia ||
      datos.el_soplo_que_congrega ||
      null;
    const desarrolloPeldaño =
      campoDesarrolloObj && campoDesarrolloObj[idioma]
        ? campoDesarrolloObj[idioma]
        : "";

    const vozIglesia =
      datos.voz_de_la_iglesia && datos.voz_de_la_iglesia[idioma]
        ? datos.voz_de_la_iglesia[idioma]
        : "";
    const aplicacionEx =
      datos.aplicacion_existencial && datos.aplicacion_existencial[idioma]
        ? datos.aplicacion_existencial[idioma]
        : "";
    const oracionBreve =
      datos.oracion_breve && datos.oracion_breve[idioma]
        ? datos.oracion_breve[idioma]
        : "";

    // 1. Título
    document.getElementById("titulo-peldaño-detalle").innerHTML = tituloPeldaño;

    // 2. Contenido completo con textos traducidos
    document.getElementById("texto-peldaño-detalle").innerHTML = `
      ${datos.imagen ? `<img src="${datos.imagen}" alt="${tituloPeldaño}" >` : ""}
      
      <p><strong>Introducción:</strong> ${introPeldaño}</p>
      <p style="margin-top: 15px;"><em>${citaPeldaño}</em></p>
      
      <p style="margin-top: 15px;">${desarrolloPeldaño}</p>
      
      <p style="margin-top: 15px;"><strong>Voz de la Iglesia:</strong> ${vozIglesia}</p>
      <p style="margin-top: 15px;"><strong>Aplicación:</strong> ${aplicacionEx}</p>
      <p style="margin-top: 15px; font-style: italic;"><strong>Oración:</strong> ${oracionBreve}</p>
    `;

    changeScreen(screenPeldañoDetalle);
  } catch (error) {
    console.error("Error al abrir el peldaño:", error);
  }
} // --- TRANSICIÓN AUTOMÁTICA DEL SPLASH ---
setTimeout(() => {
  if (screenSplash) {
    screenSplash.style.transition = "opacity 0.8s ease";
    screenSplash.style.opacity = "0";
    setTimeout(() => {
      screenSplash.style.display = "none";
      if (screenMain) screenMain.classList.add("active");
    }, 800);
  }
}, 4500);
// 🔀 Función exclusiva para generar chinchetas aleatorias para el comodín
function obtenerChinchetasRandom(baseDatos, cantidad = 2) {
  const itemsFiltrados = baseDatos.filter(
    (item) => item.id !== "comodin-asistente-001",
  );
  const mezclados = [...itemsFiltrados];

  for (let i = mezclados.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [mezclados[i], mezclados[j]] = [mezclados[j], mezclados[i]];
  }

  return mezclados.slice(0, cantidad);
}

// --- FUNCIÓN DE SINCRONIZACIÓN (Colocar afuera o al inicio del archivo) ---
function sincronizarBotonTema() {
  const btnTheme = document.getElementById("btn-theme");
  if (!btnTheme) return;

  const body = document.body;

  if (body.classList.contains("modo-sepia")) {
    btnTheme.innerHTML = "🟤";
  } else if (body.classList.contains("light-mode")) {
    btnTheme.innerHTML = "☀️";
  } else {
    btnTheme.innerHTML = "🌓";
  }
}

// --- INICIALIZACIÓN GENERAL DE LA APP ---
document.addEventListener("DOMContentLoaded", () => {
  // 1. Cambio de Tema Unificado (Claro / Oscuro / Sepia)
  const btnTheme = document.getElementById("btn-theme");
  if (btnTheme) {
    // Sincronizar el ícono inicial según el estado actual al cargar
    sincronizarBotonTema();

    btnTheme.addEventListener("click", () => {
      const body = document.body;
      const docEl = document.documentElement;

      if (
        !body.classList.contains("light-mode") &&
        !body.classList.contains("modo-sepia")
      ) {
        // De Oscuro pasa a Sepia
        body.classList.add("modo-sepia");
        docEl.classList.add("modo-sepia");
      } else if (body.classList.contains("modo-sepia")) {
        // De Sepia pasa a Claro
        body.classList.remove("modo-sepia");
        docEl.classList.remove("modo-sepia");
        body.classList.add("light-mode");
      } else {
        // De Claro pasa a Oscuro
        body.classList.remove("light-mode");
      }

      sincronizarBotonTema();
    });
  }
});
// Referencias comunes del menú lateral

// 2. Comportamiento del Menú Lateral
if (btnMenu && menuLateral) {
  btnMenu.addEventListener("click", () => {
    menuLateral.classList.toggle("active");
  });
}

// Cerrar menú al hacer clic fuera
document.addEventListener("click", (event) => {
  if (
    menuLateral &&
    btnMenu &&
    menuLateral.classList.contains("active") &&
    !menuLateral.contains(event.target) &&
    !btnMenu.contains(event.target)
  ) {
    menuLateral.classList.remove("active");
  }
});

// 3. Enlaces del Menú Lateral
document.getElementById("link-inicio")?.addEventListener("click", (e) => {
  e.preventDefault();
  changeScreen(screenMain);
  menuLateral?.classList.remove("active");
});

document.getElementById("link-biblia")?.addEventListener("click", (e) => {
  e.preventDefault();
  changeScreen(screenBibleDetail);
  menuLateral?.classList.remove("active");
});

document.getElementById("link-buscar")?.addEventListener("click", (e) => {
  e.preventDefault();
  changeScreen(screenBuscar);
  menuLateral?.classList.remove("active");
});

document.getElementById("link-idioma")?.addEventListener("click", (e) => {
  e.preventDefault();
  changeScreen(screenIdioma);
  menuLateral?.classList.remove("active");
});

document.getElementById("link-sugerir")?.addEventListener("click", (e) => {
  e.preventDefault();
  changeScreen(screenSugerir);
  menuLateral?.classList.remove("active");
});
document.getElementById("link-acerca").addEventListener("click", (e) => {
  e.preventDefault();
  changeScreen(screenAcerca);
  menuLateral?.classList.remove("active");
});

// Versión segura que no se rompe si el elemento no existe todavía
const linkHerramientas = document.getElementById("link-herramientas");
if (linkHerramientas) {
  linkHerramientas.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("¡Hice clic en el botón de herramientas!");
    const modal = document.getElementById("modal-herramientas");
    if (modal) {
      console.log("Modal encontrado:", modal);
      modal.style.display = "flex";
    }
    menuLateral?.classList.remove("active");
  });
}

document.getElementById("link-herramientas").addEventListener("click", (e) => {
  e.preventDefault();
  console.log("¡Hice clic en el botón de herramientas!"); // Agregá esta línea
  const modal = document.getElementById("modal-herramientas");
  if (modal) {
    console.log("Modal encontrado:", modal); // Y esta otra
    modal.style.display = "flex";
  }
});
// 5. Botones de Retorno (Volver)
document
  .getElementById("btn-volver-idioma")
  ?.addEventListener("click", () => changeScreen(screenMain));
document
  .getElementById("btn-volver-sugerir")
  ?.addEventListener("click", () => changeScreen(screenMain));

const btnVolverAcerca = document.getElementById("btn-volver-acerca");
if (btnVolverAcerca) {
  btnVolverAcerca.addEventListener("click", () => changeScreen(screenMain));
}

// --- BÚSQUEDA INTELIGENTE CON ENTER Y PAGINACIÓN ---
document
  .getElementById("btn-ejecutar-busqueda")
  .addEventListener("click", async () => {
    // ========== LIMPIAR MEMORIA CADA VEZ ==========
    window.resultadosBusquedaActuales = [];

    const inputOriginal = document
      .getElementById("input-busqueda")
      .value.trim();
    const contenedorResultados = document.getElementById("resultados-busqueda");

    if (!inputOriginal) {
      contenedorResultados.innerHTML = `<p class="placeholder-text">Escribí algo para buscar...</p>`;
      return;
    }

    // ========== UTILIDADES ==========
    const limpiarTexto = (str) =>
      str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ñ/g, "n");

    const palabrasANumeros = (texto) => {
      const mapa = {
        cero: 0,
        uno: 1,
        una: 1,
        dos: 2,
        tres: 3,
        cuatro: 4,
        cinco: 5,
        seis: 6,
        siete: 7,
        ocho: 8,
        nueve: 9,
        diez: 10,
        once: 11,
        doce: 12,
        trece: 13,
        catorce: 14,
        quince: 15,
        dieciseis: 16,
        diecisiete: 17,
        dieciocho: 18,
        diecinueve: 19,
        veinte: 20,
        veintiuno: 21,
        veintidos: 22,
        veintitres: 23,
        veinticuatro: 24,
        veinticinco: 25,
        veintiseis: 26,
        veintisiete: 27,
        veintiocho: 28,
        veintinueve: 29,
        treinta: 30,
        cuarenta: 40,
        cincuenta: 50,
        sesenta: 60,
        setenta: 70,
        ochenta: 80,
        noventa: 90,
        cien: 100,
        ciento: 100,
      };

      let t = " " + limpiarTexto(texto) + " ";
      t = t.replace(
        /\b(treinta|cuarenta|cincuenta|sesenta|setenta|ochenta|noventa)\s+y\s+(uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve)\b/g,
        (m, dec, uni) => " " + (mapa[dec] + mapa[uni]) + " ",
      );
      Object.keys(mapa).forEach((p) => {
        t = t.replace(new RegExp(`\\b${p}\\b`, "g"), " " + mapa[p] + " ");
      });
      return t.replace(/\s+/g, " ").trim();
    };

    // Lista oficial de libros (sin tildes)
    const LIBROS = [
      "genesis",
      "exodo",
      "levitico",
      "numeros",
      "deuteronomio",
      "josue",
      "jueces",
      "rut",
      "1 samuel",
      "2 samuel",
      "1 reyes",
      "2 reyes",
      "1 cronicas",
      "2 cronicas",
      "esdras",
      "nehemias",
      "ester",
      "job",
      "salmos",
      "proverbios",
      "eclesiastes",
      "cantares",
      "isaias",
      "jeremias",
      "lamentaciones",
      "ezequiel",
      "daniel",
      "oseas",
      "joel",
      "amos",
      "abdias",
      "jonas",
      "miqueas",
      "nahum",
      "habacuc",
      "sofonias",
      "hageo",
      "zacarias",
      "malaquias",
      "mateo",
      "marcos",
      "lucas",
      "juan",
      "hechos",
      "romanos",
      "1 corintios",
      "2 corintios",
      "galatas",
      "efesios",
      "filipenses",
      "colosenses",
      "1 tesalonicenses",
      "2 tesalonicenses",
      "1 timoteo",
      "2 timoteo",
      "tito",
      "filemon",
      "hebreos",
      "santiago",
      "1 pedro",
      "2 pedro",
      "1 juan",
      "2 juan",
      "3 juan",
      "judas",
      "apocalipsis",
    ];

    // Correcciones de voz / tipeo frecuentes
    const correcciones = {
      misaias: "isaias",
      isaias: "isaias",
      isaías: "isaias",
      lamentaciones: "lamentaciones",
      lamentacion: "lamentaciones",
      mateo: "mateo",
      matheo: "mateo",
      juan: "juan",
      "san juan": "juan",
      salmo: "salmos",
      salmos: "salmos",
      apocalipsis: "apocalipsis",
      revelacion: "apocalipsis",
    };

    let inputParaCita = palabrasANumeros(inputOriginal);
    inputParaCita = inputParaCita
      .replace(/capitulo|cap\.?/g, " ")
      .replace(/versiculos?|vers\.?|v\.?/g, " ")
      .replace(/\bal\b|\ba\b|\bhasta\b/g, "-")
      .replace(/[,;]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const inputLimpio = limpiarTexto(inputOriginal);
    const terminoBusqueda = inputLimpio;
    const palabrasBusqueda = terminoBusqueda
      .split(/\s+/)
      .filter((p) => p.length > 2);

    contenedorResultados.innerHTML = `<p class="placeholder-text">Buscando en las Escrituras...</p>`;

    try {
      const respuesta = await fetch("data/biblia.json");
      const datos = await respuesta.json();
      let encontrados = []; // ← SIEMPRE empieza vacío

      if (datos.verses && Array.isArray(datos.verses)) {
        // ========== 1. DETECTAR SI ES LIBRO / CITA ==========
        let libroDetectado = null;
        let capituloBuscado = null;
        let versoDesde = null;
        let versoHasta = null;
        let esSoloLibro = false;

        // Intentar detectar: Libro + capítulo + versículo(s)
        const regexCita =
          /^([1-3]?\s*[a-zÁÉÍÓÚáéíóúñü]+(?:\s+[a-zÁÉÍÓÚáéíóúñü]+)?)\s+(\d{1,3})(?:\s*[:\s-]\s*(\d{1,3})(?:\s*-\s*(\d{1,3}))?)?$/i;
        const match = inputParaCita.match(regexCita);

        if (match) {
          let posible = limpiarTexto(match[1].replace(/\s+/g, " ").trim());
          if (correcciones[posible]) posible = correcciones[posible];

          libroDetectado = LIBROS.find(
            (l) =>
              l === posible || l.startsWith(posible) || posible.startsWith(l),
          );

          if (libroDetectado) {
            capituloBuscado = parseInt(match[2], 10);
            if (match[3]) {
              versoDesde = parseInt(match[3], 10);
              versoHasta = match[4] ? parseInt(match[4], 10) : versoDesde;
            }
          }
        }

        // Si no es cita completa, ver si es solo el nombre del libro
        if (!libroDetectado) {
          let posible = inputLimpio;
          if (correcciones[posible]) posible = correcciones[posible];

          // Solo aceptamos si es prácticamente el nombre del libro
          libroDetectado = LIBROS.find(
            (l) =>
              l === posible ||
              (posible.length >= 4 &&
                (l.startsWith(posible) || posible.startsWith(l))),
          );

          if (libroDetectado) {
            esSoloLibro = true;
          }
        }

        // ========== 2. BUSCAR ==========
        datos.verses.forEach((item) => {
          const libroItem = limpiarTexto(item.book_name || "");
          const textoLimpio = limpiarTexto(item.text || "");

          if (libroDetectado) {
            // Solo buscamos DENTRO del libro detectado
            const coincideLibro =
              libroItem === libroDetectado ||
              libroItem.startsWith(libroDetectado) ||
              libroDetectado.startsWith(libroItem);

            if (coincideLibro) {
              if (esSoloLibro) {
                // Todo el libro
                encontrados.push({
                  referencia: `${item.book_name} ${item.chapter}:${item.verse} (${datos.metadata?.translation || "Biblia"})`,
                  texto: item.text,
                });
              } else if (item.chapter === capituloBuscado) {
                if (versoDesde == null) {
                  // Todo el capítulo
                  encontrados.push({
                    referencia: `${item.book_name} ${item.chapter}:${item.verse} (${datos.metadata?.translation || "Biblia"})`,
                    texto: item.text,
                  });
                } else if (
                  item.verse >= versoDesde &&
                  item.verse <= (versoHasta || versoDesde)
                ) {
                  // Rango de versículos
                  encontrados.push({
                    referencia: `${item.book_name} ${item.chapter}:${item.verse} (${datos.metadata?.translation || "Biblia"})`,
                    texto: item.text,
                  });
                }
              }
            }
          } else {
            // ========== BÚSQUEDA POR TEXTO (más estricta) ==========
            // Preferimos frase completa
            if (textoLimpio.includes(terminoBusqueda)) {
              encontrados.push({
                referencia: `${item.book_name} ${item.chapter}:${item.verse} (${datos.metadata?.translation || "Biblia"})`,
                texto: item.text,
              });
            }
            // Si no hay frase completa, exigimos que coincidan casi todas las palabras
            else if (palabrasBusqueda.length >= 2) {
              const coincidencias = palabrasBusqueda.filter((p) =>
                textoLimpio.includes(p),
              ).length;
              const umbral = Math.ceil(palabrasBusqueda.length * 0.8); // 80% de las palabras
              if (coincidencias >= umbral) {
                encontrados.push({
                  referencia: `${item.book_name} ${item.chapter}:${item.verse} (${datos.metadata?.translation || "Biblia"})`,
                  texto: item.text,
                });
              }
            }
          }
        });
      }

      // ========== 3. MOSTRAR RESULTADOS ==========
      if (encontrados.length > 0) {
        let paginaActual = 1;
        const porPagina = 20;
        const totalPaginas = Math.ceil(encontrados.length / porPagina);

        function renderizar() {
          const inicio = (paginaActual - 1) * porPagina;
          const lote = encontrados.slice(inicio, inicio + porPagina);
          window.resultadosBusquedaActuales = encontrados;

          let html = lote
            .map(
              (item, i) => `
            <div class="search-result-item" onclick="abrirResultadoPorIndice(${inicio + i})"
                 style="margin-bottom:15px; border-bottom:1px solid rgba(212,175,55,0.2); padding-bottom:10px; cursor:pointer;">
              <strong style="color:var(--gold); display:block; margin-bottom:5px;">${item.referencia}</strong>
              <p style="color:#e0e0e0; font-size:0.95rem; line-height:1.4;">"${item.texto}"</p>
            </div>
          `,
            )
            .join("");

          if (totalPaginas > 1) {
            html += `
              <div style="display:flex; justify-content:space-between; align-items:center; margin-top:25px; padding:15px 0; border-top:1px solid var(--gold);">
                <button id="btn-ant-busqueda" style="background:rgba(212,175,55,0.1); border:1px solid var(--gold); color:#fff; padding:8px 14px; border-radius:6px; cursor:pointer;"
                  ${paginaActual === 1 ? "disabled style='opacity:0.4;cursor:default;'" : ""}>⬅ Anterior</button>
                <span style="color:var(--gold); font-size:0.85rem; text-align:center;">
                  Pág. ${paginaActual} / ${totalPaginas}<br>
                  <small style="color:#aaa;">(${encontrados.length} encontrados)</small>
                </span>
                <button id="btn-sig-busqueda" style="background:rgba(212,175,55,0.1); border:1px solid var(--gold); color:#fff; padding:8px 14px; border-radius:6px; cursor:pointer;"
                  ${paginaActual === totalPaginas ? "disabled style='opacity:0.4;cursor:default;'" : ""}>Siguiente ➡</button>
              </div>`;
          }

          contenedorResultados.innerHTML = html;

          document
            .getElementById("btn-ant-busqueda")
            ?.addEventListener("click", () => {
              if (paginaActual > 1) {
                paginaActual--;
                renderizar();
                contenedorResultados.scrollIntoView({ behavior: "smooth" });
              }
            });
          document
            .getElementById("btn-sig-busqueda")
            ?.addEventListener("click", () => {
              if (paginaActual < totalPaginas) {
                paginaActual++;
                renderizar();
                contenedorResultados.scrollIntoView({ behavior: "smooth" });
              }
            });
        }

        renderizar();
      } else {
        contenedorResultados.innerHTML = `
          <div style="text-align:center; padding:10px;">
            <p style="color:#d4af37; font-weight:bold; margin-bottom:5px;">Sin resultados</p>
            <p class="placeholder-text">No se encontraron pasajes con el término "${inputOriginal}".</p>
          </div>`;
      }
    } catch (error) {
      console.error("Error en la búsqueda:", error);
      contenedorResultados.innerHTML = `<p class="placeholder-text" style="color:#e34234;">Ocurrió un error al realizar la búsqueda.</p>`;
    }
  });
// --- ANTIGUO Y NUEVO TESTAMENTO (LISTAS Y CAPÍTULOS) ---
const listaLibrosAntiguo = [
  "Génesis",
  "Éxodo",
  "Levítico",
  "Números",
  "Deuteronomio",
  "Josué",
  "Jueces",
  "Rut",
  "1 Samuel",
  "2 Samuel",
  "1 Reyes",
  "2 Reyes",
  "1 Crónicas",
  "2 Crónicas",
  "Esdras",
  "Nehemías",
  "Tobías",
  "Judit",
  "Ester",
  "1 Macabeos",
  "2 Macabeos",
  "Job",
  "Salmos",
  "Proverbios",
  "Eclesiastés",
  "Cantar de los Cantares",
  "Sabiduría",
  "Eclesiástico",
  "Isaías",
  "Jeremías",
  "Lamentaciones",
  "Baruc",
  "Ezequiel",
  "Daniel",
  "Oseas",
  "Joel",
  "Amós",
  "Abdías",
  "Jonás",
  "Miqueas",
  "Nahúm",
  "Habacuc",
  "Sofonías",
  "Hageo",
  "Zacarías",
  "Malaquías",
];

const listaLibrosNuevo = [
  "Mateo",
  "Marcos",
  "Lucas",
  "Juan",
  "Hechos",
  "Romanos",
  "1 Corintios",
  "2 Corintios",
  "Gálatas",
  "Efesios",
  "Filipenses",
  "Colosenses",
  "1 Tesalonicenses",
  "2 Tesalonicenses",
  "1 Timoteo",
  "2 Timoteo",
  "Tito",
  "Filemón",
  "Hebreos",
  "Santiago",
  "1 Pedro",
  "2 Pedro",
  "1 Juan",
  "2 Juan",
  "3 Juan",
  "Judas",
  "Apocalipsis",
];

async function abrirAntiguoTestamento() {
  changeScreen(screenAntiguo);
  const contenedor = document.getElementById("lista-libros-antiguo");
  if (contenedor && contenedor.innerHTML.trim() === "") {
    try {
      const respuesta = await fetch("data/biblia.json");
      const datos = await respuesta.json();
      listaLibrosAntiguo.forEach((nombreLibro) => {
        const btn = document.createElement("div");
        btn.style.cssText =
          "border: 1px solid var(--gold); border-radius: 8px; padding: 15px; text-align: center; cursor: pointer; background: rgba(255,255,255,0.05); color: #fff; font-size: 0.9rem;";
        btn.innerText = nombreLibro;
        btn.addEventListener("click", () =>
          cargarCapitulosLibro(nombreLibro, datos.verses, screenAntiguo),
        );
        contenedor.appendChild(btn);
      });
    } catch (error) {
      console.error("Error al cargar AT:", error);
    }
  }
}

async function abrirNuevoTestamento() {
  changeScreen(screenNuevo);
  const contenedor = document.getElementById("lista-libros-nuevo");
  if (contenedor && contenedor.innerHTML.trim() === "") {
    try {
      const respuesta = await fetch("data/biblia.json");
      const datos = await respuesta.json();
      listaLibrosNuevo.forEach((nombreLibro) => {
        const btn = document.createElement("div");
        btn.style.cssText =
          "border: 1px solid var(--gold); border-radius: 8px; padding: 15px; text-align: center; cursor: pointer; background: rgba(255,255,255,0.05); color: #fff; font-size: 0.9rem;";
        btn.innerText = nombreLibro;
        btn.addEventListener("click", () =>
          cargarCapitulosLibro(nombreLibro, datos.verses, screenNuevo),
        );
        contenedor.appendChild(btn);
      });
    } catch (error) {
      console.error("Error al cargar NT:", error);
    }
  }
}

function cargarCapitulosLibro(nombreLibro, versesArray, pantallaOrigen) {
  const btnVolverCapitulos = document.querySelector(
    "#screen-capitulos .btn-back",
  );
  if (btnVolverCapitulos)
    btnVolverCapitulos.onclick = () => changeScreen(pantallaOrigen);

  changeScreen(screenCapitulos);

  const tituloLibro = document.getElementById("titulo-libro-seleccionado");
  const gridCapitulos = document.getElementById("grid-capitulos");
  const areaVersiculos = document.getElementById("texto-versiculos-area");

  tituloLibro.textContent = nombreLibro;
  gridCapitulos.innerHTML = "";
  areaVersiculos.innerHTML = "";

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
    gridCapitulos.appendChild(btnCap);
  });
}

function renderizarVersiculosCapitulo(nombreLibro, numCapitulo, versosLibro) {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    textoCompletoActual = "";
    estaReproduciendo = false;
    estaPausado = false;
    const btnAudio = document.getElementById("btn-hablar-lectura");
    if (btnAudio)
      btnAudio.innerHTML = '<i class="fas fa-volume-up"></i> Escuchar';
  }
  changeScreen(screenLectura);

  const tituloLectura = document.getElementById("titulo-lectura-completa");
  const areaLectura = document.getElementById("texto-lectura-final");

  tituloLectura.textContent = `${nombreLibro} - Cap. ${numCapitulo}`;

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

  aplicarSubrayadosCapitulo(nombreLibro, numCapitulo);

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

let utteranceActual = null;
let textoCompletoActual = "";
let estaReproduciendo = false;
let estaPausado = false;

// ==========================================
// 1. CONFIGURACIÓN Y HELPER MULTILINGÜE
// ==========================================
const CONFIG_IDIOMAS_VOZ = {
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

function obtenerVozPorIdioma(idiomaCodigo) {
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
function ejecutarLecturaVoz() {
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

  // 3. SEPARAR EL CAPÍTULO EN FRASES (Busca cierres de punto, exclamación o pregunta)
  // Esto fragmenta el texto en oraciones livianas para que Android jamás se ahoque
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

    // Función recursiva que encadena las oraciones una detrás de otra
    function reproducirSiguienteFrase() {
      // Si el usuario tocó "Detener" o llegamos al final del capítulo
      if (!estaReproduciendo || indiceFrase >= frases.length) {
        estaReproduciendo = false;
        window.speechSynthesis.cancel();
        if (btnAudio) {
          btnAudio.innerHTML = '<i class="fas fa-volume-up"></i> Escuchar';
        }
        return;
      }

      const textoFrase = frases[indiceFrase].trim();

      // Saltar frases vacías si las hubiera
      if (!textoFrase) {
        indiceFrase++;
        reproducirSiguienteFrase();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(textoFrase);
      if (vozSeleccionada) utterance.voice = vozSeleccionada;
      utterance.lang = configIdioma.lang;

      // --- CONFIGURACIÓN REFLEXIVA / PAUSADA ---
      utterance.rate = 0.82; // Cadencia lenta para meditar
      utterance.pitch = 0.95; // Tono cálido

      // Evento: Al terminar la frase actual, arranca la siguiente en el acto
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

    // Disparar la primera oración
    reproducirSiguienteFrase();
  }, 150);
}
// --- INTERACTIVIDAD DEL PANEL INFERIOR ---

const fanColumns = document.querySelectorAll(".fan-column");

// --- 1. GESTO DE DESLIZAMIENTO (SWIPE-DOWN) EN EL PANEL HANDLE ---
// --- 1. GESTO DE DESLIZAMIENTO Y RESETEO LIMPIO ---

// Función auxiliar para limpiar y dejar todo listo para la próxima apertura
function cerrarPanelPorCompleto() {
  if (!studyCard) return;

  // Ocultamos la tarjeta
  studyCard.classList.add("hidden");
  studyCard.style.transform = "";

  // Reseteamos todas las columnas expandidas para que no queden "trabas" en memoria
  fanColumns.forEach((c) => c.classList.remove("expanded-full"));

  if (typeof window.restaurarLecturaNormal === "function") {
    window.restaurarLecturaNormal();
  }
}

// Control limpio y directo en el tirador neón para cerrar el panel sin fallas
if (panelHandle && studyCard) {
  panelHandle.addEventListener("click", () => {
    studyCard.style.transition = "transform 0.2s ease-in";
    studyCard.style.transform = "translateY(100%)";

    setTimeout(() => {
      if (typeof cerrarPanelPorCompleto === "function") {
        cerrarPanelPorCompleto();
      }
    }, 200);
  });
}

// --- 2. INTERACTIVIDAD DE LAS COLUMNAS Y ACORDEÓN ---
fanColumns.forEach((col) => {
  col.addEventListener("click", (e) => {
    if (!col.classList.contains("has-content")) {
      return;
    }
    if (e.target.classList.contains("btn-close-extended")) return;

    // Alterna o expande la columna limpia
    const yaEstabaAbierta = col.classList.contains("expanded-full");
    fanColumns.forEach((c) => c.classList.remove("expanded-full"));

    if (!yaEstabaAbierta) {
      col.classList.add("expanded-full");
    }
  });

  const btnClose = col.querySelector(".btn-close-extended");
  if (btnClose) {
    btnClose.addEventListener("click", (e) => {
      e.stopPropagation();
      col.classList.remove("expanded-full");
    });
  }
});
// --- 2. INTERACTIVIDAD DE LAS COLUMNAS Y BOTONES DE CIERRE ---
fanColumns.forEach((col) => {
  col.addEventListener("click", (e) => {
    if (!col.classList.contains("has-content")) {
      return;
    }
    if (e.target.classList.contains("btn-close-extended")) return;

    fanColumns.forEach((c) => c.classList.remove("expanded-full"));
    col.classList.add("expanded-full");
  });

  const btnClose = col.querySelector(".btn-close-extended");
  if (btnClose) {
    btnClose.addEventListener("click", (e) => {
      e.stopPropagation();
      col.classList.remove("expanded-full");
    });
  }
});

async function aplicarSubrayadosCapitulo(nombreLibro, numeroCapitulo) {
  try {
    let respuesta = await fetch("data/contenido.json");
    let datos = await respuesta.json();

    let keyLibro = nombreLibro.toLowerCase().trim();

    if (
      !datos.libros ||
      !datos.libros[keyLibro] ||
      !datos.libros[keyLibro].capitulos[numeroCapitulo]
    ) {
      return;
    }

    let capituloData = datos.libros[keyLibro].capitulos[numeroCapitulo];

    const mapaColoresHex = {
      filologia: "#9b59b6",
      historico: "#ecf0f1",
      apologetica: "#e74c3c",
      sucesion: "#f1c40f",
    };

    // Función auxiliar para restaurar todo a su estado normal (ideal para cuando cierran la cajita)
    window.restaurarLecturaNormal = function () {
      document.querySelectorAll("[data-versiculo]").forEach((el) => {
        if (el.style.borderBottom && el.style.borderBottom !== "none") {
          // Vuelve a la línea fina sutil original
          el.style.borderBottom = "3px solid rgba(150, 150, 150, 0.3)";
        }
        // EL TEXTO NUNCA SE APAGA: Mantenemos la opacidad siempre al 100%
        el.style.opacity = "1";
        el.style.backgroundColor = "transparent";
        el.style.padding = "0px";
      });

      // Ocultamos la cajita de estudio
      const studyCard = document.getElementById("study-card");
      if (studyCard) {
        studyCard.classList.add("hidden");
      }

      // Limpiamos las columnas del panel lateral
      const fanColumns = document.querySelectorAll(".fan-column");
      fanColumns.forEach((col) => {
        col.classList.remove("expanded-full");
        col.classList.remove("has-content");
        let textoExt = col.querySelector(".extended-text");
        if (textoExt) textoExt.innerHTML = "";
      });
    };

    // Limpieza inicial al cambiar de capítulo
    document.querySelectorAll("[data-versiculo]").forEach((el) => {
      el.style.borderBottom = "none";
      el.style.opacity = "1";
      el.style.cursor = "default";
      el.title = "";
      el.onclick = null;
    });

    for (let numVersiculo in capituloData.versiculos) {
      let v = capituloData.versiculos[numVersiculo];
      let elementoVersiculo = document.querySelector(
        `[data-versiculo="${numVersiculo}"]`,
      );

      if (elementoVersiculo) {
        let cats = v.categorias;
        let activas = Object.keys(cats).filter((key) => cats[key] === true);

        if (activas.length > 0) {
          elementoVersiculo.style.borderBottom =
            "3px solid rgba(184, 139, 139, 0.3)";
          elementoVersiculo.style.cursor = "pointer";
          elementoVersiculo.title =
            "Tocá para ver el estudio de este versículo";

          let colorPrincipal = "#d4af37";
          if (activas.length === 1) {
            colorPrincipal = mapaColoresHex[activas[0]] || "#d4af37";
          }

          // Evento al hacer clic en el versículo
          elementoVersiculo.onclick = () => {
            document.querySelectorAll("[data-versiculo]").forEach((el) => {
              if (el.style.borderBottom && el.style.borderBottom !== "none") {
                // Línea más sutil para los no seleccionados, PERO OPACIDAD EN 1 (texto intacto)
                el.style.borderBottom = "1px solid rgba(150, 150, 150, 0.15)";
              }
              el.style.opacity = "1"; // <--- CLAVE: El texto nunca se apaga
              el.style.backgroundColor = "transparent";
              el.style.padding = "0px";
            });

            // Resaltamos el elegido con línea gruesa
            elementoVersiculo.style.borderBottom = `3px solid ${colorPrincipal}`;
            elementoVersiculo.style.opacity = "1";

            const studyCard = document.getElementById("study-card");
            if (studyCard) {
              studyCard.classList.remove("hidden");
            }

            const fanColumns = document.querySelectorAll(".fan-column");
            fanColumns.forEach((col) => {
              col.classList.remove("expanded-full");
              col.classList.remove("has-content");
              let textoExt = col.querySelector(".extended-text");
              if (textoExt) textoExt.innerHTML = "";
            });

            const mapaColumnas = {
              filologia: 0,
              sucesion: 1,
              historico: 2,
              apologetica: 3,
            };

            let textosVersiculo = v.textos || {};

            activas.forEach((catKey) => {
              let indexColumna = mapaColumnas[catKey];
              if (indexColumna !== undefined && fanColumns[indexColumna]) {
                fanColumns[indexColumna].classList.add("has-content");

                let textoExt =
                  fanColumns[indexColumna].querySelector(".extended-text");
                if (textoExt && textosVersiculo[catKey]) {
                  textoExt.innerHTML = textosVersiculo[catKey];
                }
              }
            });
          };
        }
      }
    }
  } catch (error) {
    console.error("Error al procesar los subrayados:", error);
  }
}

// --- INYECTOR MAESTRO DE ESTADOS (Multiidioma) ---
// --- INYECTOR MAESTRO DE ESTADOS (Con depuración) ---
async function cargarEstadoAnimo(nombreEstado) {
  try {
    const idioma =
      window.idiomaActual || localStorage.getItem("idiomaApp") || "es";
    console.log("=== INICIO CARGA ESTADO ===", nombreEstado, "Idioma:", idioma);

    const respuesta = await fetch("data/estados.json");
    const data = await respuesta.json();
    let estadosArray = data.estados[nombreEstado];

    if (!estadosArray || estadosArray.length === 0) {
      console.warn("⚠️ No se encontró el array para el estado:", nombreEstado);
      return;
    }

    const hoy = new Date().toISOString().split("T")[0];
    let progreso = JSON.parse(
      localStorage.getItem(`progreso_${nombreEstado}`),
    ) || { dia: 0, fecha: "" };

    if (progreso.fecha !== hoy) {
      progreso.dia = (progreso.dia + 1) % estadosArray.length;
      progreso.fecha = hoy;
      localStorage.setItem(
        `progreso_${nombreEstado}`,
        JSON.stringify(progreso),
      );
    }

    const datosEstado = estadosArray[progreso.dia];
    console.log("📄 Datos del día obtenidos del JSON:", datosEstado);

    // Mapeo con tus pantallas globales
    const estadosMap = {
      agradecido: screenAgradecido,
      bendecido: screenBendecido,
      cansado: screenCansado,
      feliz: screenFeliz,
      triste: screenTriste,
      ansioso: screenAnsioso,
      temeroso: screenTemeroso,
      preocupado: screenPreocupado,
      "en-paz": screenEnpaz,
    };

    const pantalla = estadosMap[nombreEstado];
    console.log("🖥️ Pantalla mapeada:", pantalla);
    if (!pantalla) {
      console.warn(
        "⚠️ No se encontró la variable de pantalla para:",
        nombreEstado,
      );
      return;
    }

    // 1. Título y Acogida
    const elTitulo = pantalla.querySelector(".titulo-estado");
    if (elTitulo) {
      elTitulo.textContent =
        nombreEstado.charAt(0).toUpperCase() + nombreEstado.slice(1);
    }

    const elAcogida = pantalla.querySelector(".acogida-estado");
    if (elAcogida && datosEstado.acogida) {
      const textoAcogida =
        typeof datosEstado.acogida === "object"
          ? datosEstado.acogida[idioma] || datosEstado.acogida.es
          : datosEstado.acogida;
      elAcogida.textContent = textoAcogida || "";
      console.log("✅ Acogida inyectada:", textoAcogida);
    }

    // 2. Evangelio (Referencia, Texto, Meditación)
    const elRef = pantalla.querySelector(".evangelio-referencia");
    if (elRef && datosEstado.evangelio) {
      elRef.textContent = datosEstado.evangelio.referencia || "";
    }

    const elTxt = pantalla.querySelector(".evangelio-texto");
    if (elTxt && datosEstado.evangelio) {
      const txtEv =
        typeof datosEstado.evangelio.texto === "object"
          ? datosEstado.evangelio.texto[idioma] ||
            datosEstado.evangelio.texto.es
          : datosEstado.evangelio.texto;
      elTxt.textContent = txtEv || "";
      console.log("✅ Texto evangelio inyectado:", txtEv);
    }

    const elMed = pantalla.querySelector(".evangelio-meditacion");
    if (elMed && datosEstado.evangelio) {
      const medEv =
        typeof datosEstado.evangelio.meditacion === "object"
          ? datosEstado.evangelio.meditacion[idioma] ||
            datosEstado.evangelio.meditacion.es
          : datosEstado.evangelio.meditacion;
      elMed.textContent = medEv || "";
    }

    // 3. Oración
    const elOracion = pantalla.querySelector(".oracion-texto");
    if (elOracion && datosEstado.oracion) {
      const txtOr =
        typeof datosEstado.oracion === "object"
          ? datosEstado.oracion[idioma] || datosEstado.oracion.es
          : datosEstado.oracion;
      elOracion.textContent = txtOr || "";
      console.log("✅ Oración inyectada:", txtOr);
    }

    // 4. Santo / Compañero de camino
    const elSanto = pantalla.querySelector(".santo-nombre");
    if (elSanto && datosEstado.companero_de_camino) {
      elSanto.textContent = datosEstado.companero_de_camino.santo || "";
    }

    const elRec = pantalla.querySelector(".santo-recomendacion");
    if (elRec && datosEstado.companero_de_camino) {
      const recSanto =
        typeof datosEstado.companero_de_camino.recomendacion === "object"
          ? datosEstado.companero_de_camino.recomendacion[idioma] ||
            datosEstado.companero_de_camino.recomendacion.es
          : datosEstado.companero_de_camino.recomendacion;
      elRec.textContent = recSanto || "";
    }

    // 5. Paso de hoy
    const elPaso = pantalla.querySelector(".paso-hoy-texto");
    if (elPaso && datosEstado.paso_de_hoy) {
      const txtPaso =
        typeof datosEstado.paso_de_hoy === "object"
          ? datosEstado.paso_de_hoy[idioma] || datosEstado.paso_de_hoy.es
          : datosEstado.paso_de_hoy;
      elPaso.textContent = txtPaso || "";
    }

    console.log("=== FIN INYECCIÓN EXITOSA ===");
  } catch (error) {
    console.error("❌ Error general en cargarEstadoAnimo:", error);
  }
}
// funcion idiomas
function cambiarIdioma(lang) {
  const elementosTraducibles = document.querySelectorAll(
    "[data-es][data-en][data-pt]",
  );

  elementosTraducibles.forEach((el) => {
    if (lang === "en") {
      el.innerText = el.getAttribute("data-en");
    } else if (lang === "pt") {
      el.innerText = el.getAttribute("data-pt");
    } else {
      el.innerText = el.getAttribute("data-es");
    }
  });

  const botonesIdioma = document.querySelectorAll("#screen-idioma button");
  botonesIdioma.forEach((btn) => btn.classList.remove("active"));

  // --- TRADUCCIÓN DEL PLACEHOLDER DE BÚSQUEDA ---
  const inputBusqueda = document.getElementById("input-busqueda");
  if (inputBusqueda) {
    const placeholderTraducido = inputBusqueda.getAttribute(
      `data-${lang}-placeholder`,
    );
    if (placeholderTraducido) {
      inputBusqueda.placeholder = placeholderTraducido;
    }
  }

  // --- PERSISTENCIA EN LOCALSTORAGE Y CONTROL DE VOZ ---
  localStorage.setItem("idiomaApp", lang);
  window.idiomaActual = lang;

  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    if (typeof estaReproduciendo !== "undefined") estaReproduciendo = false;
  }

  console.log("Idioma guardado en localStorage:", lang);
}
// --- FUNCIONES FINALES DE APERTURA DESDE EL BUSCADOR ---
function cerrarCajita() {
  const modalVentana = document.getElementById("modal-versiculo");
  if (modalVentana) {
    modalVentana.style.display = "none";
  }
}

function abrirResultadoPorIndice(indiceGlobal) {
  console.log("Índice recibido:", indiceGlobal);
  console.log("Array actual:", resultadosBusquedaActuales);

  const item = resultadosBusquedaActuales[indiceGlobal];
  if (!item) {
    console.warn("¡O atención! No se encontró ningún item en ese índice.");
    return;
  }

  console.log("Item encontrado:", item);

  const modalTexto = document.getElementById("texto-versiculo");
  const modalVentana = document.getElementById("modal-versiculo");

  if (modalTexto) {
    modalTexto.innerHTML = `<strong style="color: var(--gold);">${item.referencia}</strong><br><br>"${item.texto}"`;
  } else {
    console.error("¡Che! No encuentro el div #texto-versiculo en el HTML.");
  }

  // En lugar de style.display, probamos con className

  if (modalVentana) {
    modalVentana.style.setProperty("display", "flex", "important");
    console.log("¡Forzando apertura de modal!");
  } else {
    console.error("¡No encuentro el elemento #modal-versiculo!");
  }
}

// --- FUNCIÓN PARA CERRAR EL MODAL DE HERRAMIENTAS ---
function cerrarModalHerramientas() {
  const modal = document.getElementById("modal-herramientas");
  if (modal) {
    modal.style.display = "none";
  }
}

// --- MANEJO DE TAMAÑO DE FUENTE ---
let tamanoActual = 18;

function actualizarIndicadorVisual() {
  // 1. Actualizamos el indicador de la barra (si existe)
  const indicadorFijo = document.getElementById("indicador-estatus-letra");
  const textoEstado = document.getElementById("texto-estado");
  const valorEstado = document.getElementById("valor-estado");

  if (indicadorFijo) {
    if (tamanoActual === 18) {
      indicadorFijo.style.display = "none";
    } else {
      indicadorFijo.style.display = "inline-block";
      if (textoEstado) textoEstado.innerText = tamanoActual > 18 ? "A+" : "A-";
      if (valorEstado) valorEstado.innerText = tamanoActual + "px";
    }
  }

  // 2. Actualizamos el número del modal
  const indicadorModal = document.getElementById("indicador-tamano");
  if (indicadorModal) {
    indicadorModal.innerText = tamanoActual + "px";
  }
}

function cambiarTamanio(delta) {
  const areaLectura = document.getElementById("texto-lectura-final");
  if (!areaLectura) return;

  // Mantiene límites seguros entre 14px y 30px
  tamanoActual = Math.max(14, Math.min(30, tamanoActual + delta));

  areaLectura.style.fontSize = tamanoActual + "px";
  localStorage.setItem("tamanoLetra", tamanoActual);

  actualizarIndicadorVisual();
}
// --- CARGA E INICIALIZACIÓN SEGURA DE ESTILOS Y TAMAÑO ---
window.addEventListener("DOMContentLoaded", () => {
  // Aplicar tamaño guardado
  const guardado = localStorage.getItem("tamanoLetra");
  if (guardado) {
    tamanoActual = parseInt(guardado, 10);
    const areaLectura = document.getElementById("texto-lectura-final");
    if (areaLectura) areaLectura.style.fontSize = tamanoActual + "px";
  }
  actualizarIndicadorVisual();

  // Aplicar estilos a botones de navegación de forma segura tras cargar el DOM
  document.querySelectorAll("#btn-goto-bible, #btn-goto-path").forEach((el) => {
    el.style.setProperty("background-color", "#f4ebd0", "important");
    el.style.setProperty("color", "#4b3621", "important");
  });
});
function comenzarExperiencia() {
  const audio = document.getElementById("musica-inicio");
  const splash = document.getElementById("screen-splash");
  const main = document.getElementById("screen-main");

  // BAJAMOS A 0.02 (Es casi nada, apenas un hilo de sonido)
  audio.volume = 0.02;

  audio.play().catch(() => {});

  setTimeout(() => {
    const fadeOut = setInterval(() => {
      // Bajamos mucho más rápido para que desaparezca pronto
      if (audio.volume > 0.005) {
        audio.volume -= 0.005;
      } else {
        clearInterval(fadeOut);
        audio.pause();
        audio.currentTime = 0;
        splash.style.display = "none";
        main.style.display = "block";
      }
    }, 50);
  }, 2500);
}
// 📂 ==========================================
// PALABRA VIVA - NÚCLEO JAVASCRIPT PRINCIPAL (BLINDADO)
// ==========================================

let esperandoConfirmacionMic = false;
let preguntasExploradasEnSesion = new Set();
let esperandoNombre = false;

function escaparHTML(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

// 🌐 Helper universal de idioma para el chatbot
function obtenerTextoIdioma(itemTexto) {
  if (!itemTexto) return "";
  const idioma =
    window.idiomaActual || localStorage.getItem("idiomaApp") || "es";

  let textoObtenido = "";
  if (typeof itemTexto === "object") {
    textoObtenido = itemTexto[idioma] || itemTexto.es || "";
  } else {
    textoObtenido = itemTexto;
  }

  // --- Inyección automática de nombre ---
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

// 🧹 Normalización más robusta
function normalizarTexto(texto) {
  if (!texto) return "";
  return texto
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita acentos
    .replace(/[¿?¡!,.;:()[\]{}"'`´]/g, " ") // puntuación → espacio
    .replace(/\s+/g, " ")
    .trim();
}

// ✂️ Extrae palabras válidas (más estricto)
function obtenerPalabras(texto) {
  return normalizarTexto(texto)
    .split(" ")
    .filter((palabra) => palabra.length > 2 && !palabrasIgnoradas.has(palabra));
}
// --- BUSCADOR GENÉRICO DINÁMICO 100% JSON ---
// --- BUSCADOR GENÉRICO CON PUNTUACIÓN (mucho más preciso) ---
function buscarEnSeccionJson(texto, seccion) {
  if (!seccion) return null;

  let mejorNodo = null;
  let maxPuntos = 0;

  const calcularPuntos = (nodo) => {
    const keywords = nodo.keywords || nodo.palabras_clave;
    if (!keywords || !Array.isArray(keywords)) return 0;

    let puntos = 0;

    keywords.forEach((kw) => {
      // Soporta tanto string simple como objeto {palabra, peso}
      const palabra = typeof kw === "object" ? kw.palabra || kw.texto : kw;
      const pesoExtra = typeof kw === "object" ? kw.peso || 0 : 0;

      const kwLimpia = normalizarTexto(palabra);
      if (!kwLimpia || kwLimpia.length < 3) return;

      // Coincidencia exacta de toda la frase
      if (texto === kwLimpia) {
        puntos += 120 + pesoExtra;
      }
      // Palabra completa (con bordes)
      else if (
        texto.includes(` ${kwLimpia} `) ||
        texto.startsWith(kwLimpia + " ") ||
        texto.endsWith(" " + kwLimpia)
      ) {
        puntos += 45 + pesoExtra;
      }
      // Contiene la keyword
      else if (texto.includes(kwLimpia)) {
        puntos += 18 + pesoExtra;
      }
    });

    return puntos;
  };

  // Recorrer la sección (objeto o array)
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

  // Umbral mínimo: evita respuestas muy débiles
  if (!mejorNodo || maxPuntos < 30) return null;

  // Devolver la respuesta en el idioma correcto
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
// --- SÍNTESIS DE VOZ ---
function hacerHablarAlRobot(texto) {
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

document.addEventListener("DOMContentLoaded", () => {
  const inputChat = document.getElementById("chat-input");
  const btnEnviar = document.getElementById("chat-btn-enviar");
  const contenedorMensajes = document.getElementById("chat-mensajes");
  const linkAsistente = document.getElementById("link-asistente");
  const menuLateral = document.getElementById("menu-lateral");

  if (linkAsistente) {
    linkAsistente.addEventListener("click", (e) => {
      e.preventDefault();
      if (
        typeof changeScreen === "function" &&
        typeof screenAsistente !== "undefined"
      ) {
        changeScreen(screenAsistente);
      }
      menuLateral?.classList.remove("active");
    });
  }

  inputChat?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Evita comportamientos por defecto del navegador
      btnEnviar?.click(); // Simula el click del botón

      // 💻 Forzamos el foco de vuelta al input en PC si no es dispositivo móvil
      const esMovil =
        /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
        window.innerWidth <= 768;
      if (!esMovil) {
        setTimeout(() => {
          inputChat.focus();
        }, 10);
      }
    }
  });
  const nombreGuardado = localStorage.getItem("nombrePalabraViva");

  // --- CARGA INICIAL Y CACHÉ DEL JSON MAESTRO ---
  (async () => {
    try {
      const resRespuestas = await fetch("data/respuestas_asistente.json");
      window.datosAsistenteGlobal = await resRespuestas.json();
    } catch (e) {
      console.warn("No se pudo precargar el JSON inicial:", e);
      window.datosAsistenteGlobal = {};
    }

    if (contenedorMensajes) {
      let saludoInicialHTML = "";
      const datosLocales = window.datosAsistenteGlobal || {};
      const sistemasNombres = datosLocales.sistema_nombres || {};

      if (nombreGuardado) {
        const textoSaludado =
          obtenerTextoIdioma(sistemasNombres.saludado) ||
          `¡Qué alegría encontrarte de nuevo, ${nombreGuardado}! ¿De qué te gustaría que hablemos hoy sobre nossa fe 🕊️?`;
        saludoInicialHTML = `<div class="mensaje-asistente"><strong>Asistente:</strong> ${textoSaludado}</div>`;
      } else {
        const textoPedir =
          obtenerTextoIdioma(sistemasNombres.pedir_nombre) ||
          `¡Hola ✨! ¡Qué alegría darte la bienvenida a Palabra Viva! Para empezar, ¿cuál es tu nombre de pila?`;
        saludoInicialHTML = `<div class="mensaje-asistente"><strong>Asistente:</strong> ${textoPedir}</div>`;
        esperandoNombre = true;
      }
      contenedorMensajes.innerHTML += saludoInicialHTML;
      contenedorMensajes.scrollTop = contenedorMensajes.scrollHeight;
    }
  })();

  // --- PROCESAMIENTO PRINCIPAL DEL CHAT (MOTOR HÍBRIDO CON PRIORIDAD SOCIAL) ---
  btnEnviar?.addEventListener("click", async () => {
    const textoUsuarioCrudo = inputChat.value.trim();

    if (textoUsuarioCrudo !== "") {
      // 📱 Comprobación inteligente según el dispositivo
      const esMovil =
        /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
        window.innerWidth <= 768;

      if (esMovil) {
        inputChat.blur(); // En celu: baja el teclado virtual para ver bien la respuesta
      } else {
        // En PC: usamos un setTimeout mínimo para ganarle de mano al navegador y que devuelva el foco
        setTimeout(() => {
          inputChat.focus();
        }, 50);
      }

      const textoUsuario = escaparHTML(textoUsuarioCrudo);
      let textoLimpio = normalizarTexto(textoUsuarioCrudo);
      let palabrasUsuario = obtenerPalabras(textoUsuarioCrudo);

      contenedorMensajes.innerHTML += `<div class="mensaje-usuario">${textoUsuario}</div>`;
      inputChat.value = "";
      contenedorMensajes.scrollTop = contenedorMensajes.scrollHeight;

      let respuestaAsistente = "";

      try {
        const datosMaestros = window.datosAsistenteGlobal || {};
        if (esperandoNombre) {
          const palabrasScias = [
            "hola",
            "soy",
            "me",
            "llamo",
            "mi",
            "nombre",
            "es",
            "el",
            "un",
          ];
          const tokens = textoUsuarioCrudo
            .split(" ")
            .filter(
              (t) => !palabrasScias.includes(t.toLowerCase()) && t.length > 1,
            );
          const nombreIngresado = tokens[0]
            ? tokens[0].charAt(0).toUpperCase() +
              tokens[0].slice(1).toLowerCase()
            : textoUsuarioCrudo.split(" ")[0];

          if (nombreIngresado.length > 2) {
            localStorage.setItem("nombrePalabraViva", nombreIngresado);
            esperandoNombre = false;
            const respConNombre =
              datosMaestros.sistema_nombres?.saludo_con_nombre;
            const textoConNombre =
              obtenerTextoIdioma(respConNombre) ||
              `¡Mucho gusto, ${nombreIngresado} 🌟! Ya guardé tu nombre. ¿De qué charlamos hoy?`;
            respuestaAsistente = textoConNombre.replace(
              /\$\{nombreIngresado\}/g,
              nombreIngresado,
            );
          } else {
            const respPedir = datosMaestros.sistema_nombres?.pedir_nombre;
            respuestaAsistente =
              obtenerTextoIdioma(respPedir) ||
              "Contame, ¿cuál es tu primer nombre así nos conocemos mejor?💬";
          }
        } else {
          let procesadoConExito = false;

          // --- 1. ACCIONES ESPECIALES (Borrar nombre) ---
          if (
            textoLimpio.includes("borrar mi nombre") ||
            textoLimpio.includes("olvidar mi nombre")
          ) {
            localStorage.removeItem("nombrePalabraViva");
            esperandoNombre = true;
            respuestaAsistente =
              "Listo, borré el nombre que tenía guardado. ¿Cómo querés que te llame ahora?";
            procesadoConExito = true;
          }

          // --- 2. SALUDOS, IDENTIDAD, PREGUNTAS FRECUENTES Y RESPUESTAS GENERALES (MÁXIMA PRIORIDAD SOCIAL) ---
          if (!procesadoConExito) {
            let respuestaEncontrada = buscarEnSeccionJson(textoLimpio, {
              saludos: datosMaestros.saludos,
            });
            if (!respuestaEncontrada) {
              respuestaEncontrada = buscarEnSeccionJson(textoLimpio, {
                como_estas: datosMaestros.como_estas,
              });
            }
            if (!respuestaEncontrada) {
              respuestaEncontrada = buscarEnSeccionJson(
                textoLimpio,
                datosMaestros.identidad_asistente,
              );
            }
            if (!respuestaEncontrada) {
              respuestaEncontrada = buscarEnSeccionJson(textoLimpio, {
                despedidas: datosMaestros.despedidas,
              });
            }
            if (!respuestaEncontrada) {
              respuestaEncontrada = buscarEnSeccionJson(textoLimpio, {
                agradecimientos: datosMaestros.agradecimientos,
              });
            }
            if (!respuestaEncontrada) {
              respuestaEncontrada = buscarEnSeccionJson(
                textoLimpio,
                datosMaestros.respuestas_pastorales,
              );
            }
            if (!respuestaEncontrada) {
              respuestaEncontrada = buscarEnSeccionJson(
                textoLimpio,
                datosMaestros.guia_uso,
              );
            }
            if (!respuestaEncontrada && datosMaestros.preguntas_frecuentes) {
              const mapPreguntasFrecuentes = {};
              datosMaestros.preguntas_frecuentes.forEach((item, index) => {
                mapPreguntasFrecuentes[`faq_${index}`] = item;
              });
              respuestaEncontrada = buscarEnSeccionJson(
                textoLimpio,
                mapPreguntasFrecuentes,
              );
            }

            if (respuestaEncontrada) {
              respuestaAsistente = respuestaEncontrada;
              procesadoConExito = true;
            }
          }

          // --- 3. PUENTES DE CAMINOS INTERACTIVOS (Antes de la catequesis general) ---
          if (!procesadoConExito) {
            if (
              textoLimpio.includes("razon") ||
              textoLimpio.includes("razón") ||
              (typeof pasoActualRazon !== "undefined" && pasoActualRazon > 1)
            ) {
              respuestaAsistente = manejarCaminoRazon(textoUsuarioCrudo);
              procesadoConExito = true;
            } else if (
              textoLimpio.includes("trinidad") ||
              (typeof pasoActualTrinidad !== "undefined" &&
                pasoActualTrinidad > 1)
            ) {
              respuestaAsistente = manejarCaminoTrinidad(textoUsuarioCrudo);
              procesadoConExito = true;
            } else if (
              textoLimpio.includes("pesaj") ||
              (typeof pasoActualPascua !== "undefined" && pasoActualPascua > 1)
            ) {
              respuestaAsistente = manejarCaminoPascua(textoUsuarioCrudo);
              procesadoConExito = true;
            } else if (
              textoLimpio.includes("elohin") ||
              textoLimpio.includes("doble naturaleza") ||
              (typeof pasoActualDobleNaturaleza !== "undefined" &&
                pasoActualDobleNaturaleza > 1)
            ) {
              respuestaAsistente =
                manejarCaminoDobleNaturaleza(textoUsuarioCrudo);
              procesadoConExito = true;
            } else if (
              textoLimpio.includes("alma") ||
              textoLimpio.includes("cuerpo y alma") ||
              (typeof pasoActualAlma !== "undefined" && pasoActualAlma > 1)
            ) {
              respuestaAsistente = manejarCaminoAlma(textoUsuarioCrudo);
              procesadoConExito = true;
            }
          }

          // --- 4. MOTOR DE CATEQUESIS FLEXIBLE (Se ejecuta solo si no es charla social ni camino interactivo) ---
          if (!procesadoConExito) {
            try {
              const baseDatosCatequesis = datosMaestros.catequesis || [];
              let mejorMatchCat = null;
              let maxPuntosCat = 0;
              let categoriaActivaLocal = null;

              baseDatosCatequesis.forEach((item) => {
                let puntos = 0;
                const itemIdLimpio = item.id ? normalizarTexto(item.id) : "";

                // Exacto en id
                if (itemIdLimpio && textoLimpio === itemIdLimpio) {
                  puntos += 300;
                }

                const idiomaActual =
                  window.idiomaActual ||
                  localStorage.getItem("idiomaApp") ||
                  "es";
                const datosItemIdioma = item[idiomaActual] || item.es || item;

                const textoPreguntaItem =
                  datosItemIdioma.pregunta_principal ||
                  datosItemIdioma.pregunta ||
                  item.pregunta_principal ||
                  item.pregunta ||
                  "";
                const preguntaItem = normalizarTexto(textoPreguntaItem);

                // Exacto en pregunta
                if (preguntaItem && textoLimpio === preguntaItem) {
                  puntos += 220;
                } else if (preguntaItem && textoLimpio.includes(preguntaItem)) {
                  puntos += 60;
                }

                // Keywords con más peso y detección de palabra completa
                if (item.keywords && Array.isArray(item.keywords)) {
                  item.keywords.forEach((kw) => {
                    const keywordLimpia = normalizarTexto(
                      typeof kw === "object" ? kw.palabra || kw.texto : kw,
                    );
                    const pesoExtra = typeof kw === "object" ? kw.peso || 0 : 0;

                    if (keywordLimpia.length < 3) return;

                    if (textoLimpio === keywordLimpia) {
                      puntos += 80 + pesoExtra;
                    } else if (
                      textoLimpio.includes(` ${keywordLimpia} `) ||
                      textoLimpio.startsWith(keywordLimpia + " ") ||
                      textoLimpio.endsWith(" " + keywordLimpia)
                    ) {
                      puntos += 35 + pesoExtra;
                    } else if (textoLimpio.includes(keywordLimpia)) {
                      puntos += 15 + pesoExtra;
                    }
                  });
                }

                // Palabras sueltas del usuario que aparecen en la pregunta (controlado a 4 puntos)
                palabrasUsuario.forEach((palabra) => {
                  if (palabra.length > 3 && preguntaItem.includes(palabra)) {
                    puntos += 4;
                  }
                });

                if (puntos > maxPuntosCat) {
                  maxPuntosCat = puntos;
                  mejorMatchCat = item;
                  categoriaActivaLocal = item.categoria || item.modulo || null;
                }
              });

              // 🔀 Comprobamos si el puntaje superó el umbral mínimo (30) o si necesitamos el comodín
              if (!mejorMatchCat || maxPuntosCat < 30) {
                // 1. Buscamos TODOS los comodines disponibles que empiecen con "comodin-asistente"
                const todosLosComodines = baseDatosCatequesis.filter(
                  (item) => item.id && item.id.startsWith("comodin-asistente"),
                );

                // 2. Elegimos uno al azar de esos comodines
                const comodinItem =
                  todosLosComodines.length > 0
                    ? todosLosComodines[
                        Math.floor(Math.random() * todosLosComodines.length)
                      ]
                    : null;

                if (comodinItem) {
                  const idiomaActual =
                    window.idiomaActual ||
                    localStorage.getItem("idiomaApp") ||
                    "es";
                  const datosComodinIdioma =
                    comodinItem[idiomaActual] || comodinItem.es || comodinItem;

                  const textoPrincipal =
                    datosComodinIdioma.pregunta_principal || "";
                  const respuestaBreve =
                    datosComodinIdioma.respuesta_breve || "";
                  const pasoConcreto = datosComodinIdioma.paso_concreto || "";

                  let respuestaConstruida = `<strong>${textoPrincipal}</strong><br><br>${respuestaBreve}<br><br>📌 ${pasoConcreto}`;

                  // 🎲 Seleccionamos 3 opciones aleatorias de toda la base de datos (excluyendo todos los comodines)
                  const itemsDisponibles = baseDatosCatequesis.filter(
                    (item) =>
                      !item.id || !item.id.startsWith("comodin-asistente"),
                  );
                  const relacionadosRandom = [...itemsDisponibles]
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 3);

                  if (relacionadosRandom.length > 0) {
                    const textoExplorar =
                      idiomaActual === "en"
                        ? "🧭 <strong>Keep exploring here?</strong><br>"
                        : idiomaActual === "pt"
                          ? "🧭 <strong>Continuar explorando por aqui?</strong><br>"
                          : "🧭 <strong>¿Seguimos explorando por acá?</strong><br>";

                    respuestaConstruida += `<br><br>${textoExplorar}`;
                    respuestaConstruida += `<div class="camino-botones-activos" style="margin-top: 10px; display: flex; flex-direction: column; gap: 6px;">`;

                    relacionadosRandom.forEach((rel) => {
                      const datosRelIdioma = rel[idiomaActual] || rel.es || rel;
                      const textoPregRel =
                        datosRelIdioma.pregunta_principal ||
                        datosRelIdioma.pregunta ||
                        "";
                      const preguntaLimpia = textoPregRel
                        .replace(/'/g, "\\'")
                        .replace(/"/g, "&quot;");

                      respuestaConstruida += `
<button onclick="enviarMensajeSugerido('${preguntaLimpia}')" style="background: #2c3e50; color: white; border: none; padding: 8px 14px; border-radius: 15px; cursor: pointer; text-align: left; font-family: inherit; font-size: 0.85rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
  📌 ${textoPregRel}
</button>
`;
                    });
                    respuestaConstruida += `</div>`;
                  }

                  respuestaAsistente = respuestaConstruida;
                  procesadoConExito = true;
                }
              }
              // 📌 Si SÍ superó el umbral, ejecutamos la respuesta con sus relacionados
              else if (mejorMatchCat && maxPuntosCat >= 30) {
                if (mejorMatchCat.id) {
                  preguntasExploradasEnSesion.add(mejorMatchCat.id);
                }

                let respuestaConstruida =
                  construirRespuestaCatequesis(mejorMatchCat);

                const relacionados = baseDatosCatequesis
                  .filter(
                    (item) =>
                      (item.categoria === categoriaActivaLocal ||
                        item.modulo === categoriaActivaLocal) &&
                      item.id !== mejorMatchCat.id &&
                      !preguntasExploradasEnSesion.has(item.id),
                  )
                  .sort(() => 0.5 - Math.random())
                  .slice(0, 2);

                if (relacionados.length > 0) {
                  const idiomaActual =
                    window.idiomaActual ||
                    localStorage.getItem("idiomaApp") ||
                    "es";
                  const textoExplorar =
                    idiomaActual === "en"
                      ? "🧭 <strong>Keep exploring here?</strong><br>"
                      : idiomaActual === "pt"
                        ? "🧭 <strong>Continuar explorando por aqui?</strong><br>"
                        : "🧭 <strong>¿Seguimos explorando por acá?</strong><br>";

                  respuestaConstruida += `<br><br>${textoExplorar}`;
                  respuestaConstruida += `<div class="camino-botones-activos" style="margin-top: 10px; display: flex; flex-direction: column; gap: 6px;">`;

                  relacionados.forEach((rel) => {
                    const datosRelIdioma = rel[idiomaActual] || rel.es || rel;
                    const textoPregRel =
                      datosRelIdioma.pregunta_principal ||
                      datosRelIdioma.pregunta ||
                      "";
                    const preguntaLimpia = textoPregRel
                      .replace(/'/g, "\\'")
                      .replace(/"/g, "&quot;");

                    respuestaConstruida += `
                      <button onclick="enviarMensajeSugerido('${preguntaLimpia}')" style="background: #2c3e50; color: white; border: none; padding: 8px 14px; border-radius: 15px; cursor: pointer; text-align: left; font-family: inherit; font-size: 0.85rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                        📌 ${textoPregRel}
                      </button>
                    `;
                  });
                  respuestaConstruida += `</div>`;
                }

                respuestaAsistente = respuestaConstruida;
                procesadoConExito = true;
              }
            } catch (errCat) {
              console.error("Error en motor de catequesis unificado:", errCat);
            }
          }

          // --- 5. COMODÍN HUMANO FINAL ---
          if (!procesadoConExito) {
            const comodinesHumanos = [
              "Qué tema ese. A veces nos pasa como con los átomos o con el viento: no los vemos con nuestros ojos, pero sabemos que están ahí. Contame un poco más de lo que estás pensando.",
              "Lo que decís me deja pensando. Este es un espacio para explorar la fe, la Palabra y nuestras dudas de todos los días. ¿Querés que busquemos algo sobre nuestra fe o charlemos sobre otro tema?",
              "¡Es para pensarlo! Acá podés venir con cualquier duda, desde historias de la Biblia hasta un ratito de oración. Contame un poco más hacia dónde te gustaría llevar la charla 🧉.",
              "Interesante lo que planteás. A veces las respuestas no vienen en un manual exacto, pero las vamos descubriendo al andar. ¿Querés que veamos algo de catequesis o preferís que charlemos tranquilos?",
            ];
            respuestaAsistente =
              comodinesHumanos[
                Math.floor(Math.random() * comodinesHumanos.length)
              ];
          }
        }
      } catch (error) {
        console.error("Error general procesando el JSON unificado:", error);
        respuestaAsistente =
          "Se me trabó un segundo la idea, pero acá sigo con vos. ¿Qué me decías?";
      }

      // Renderizado seguro en pantalla
      const textoCrudo =
        typeof respuestaAsistente === "string"
          ? respuestaAsistente
          : respuestaAsistente?.toString() || "";
      const textoParaVoz = textoCrudo
        .replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .trim();

      const botonesViejos =
        contenedorMensajes.querySelectorAll(".btn-voz-robot");
      botonesViejos.forEach((btn) => btn.remove());

      const divAsistente = document.createElement("div");
      divAsistente.className = "mensaje-asistente";

      const idiomaApp =
        window.idiomaActual || localStorage.getItem("idiomaApp") || "es";
      const textoBotonEscuchar =
        idiomaApp === "en"
          ? "🔊 Listen"
          : idiomaApp === "pt"
            ? "🔊 Ouvir"
            : "🔊 Escuchar";

      divAsistente.innerHTML = `<strong>Asistente:</strong><br>${textoCrudo}<br><button class="btn-voz-robot" style="margin-top:8px; background:#000; color:#D4AF37; border:1px solid #D4AF37; border-radius:20px; padding:6px 12px; cursor:pointer; font-size:12px;">${textoBotonEscuchar}</button>`;
      contenedorMensajes.appendChild(divAsistente);

      divAsistente
        .querySelector(".btn-voz-robot")
        .addEventListener("click", () => {
          hacerHablarAlRobot(textoParaVoz);
        });

      contenedorMensajes.scrollTop = contenedorMensajes.scrollHeight;
    }
  });
  // --- HISTORIAL Y BOTÓN ATRÁS ---
  history.replaceState({ vista: "main" }, "", "");

  window.addEventListener("popstate", (event) => {
    if (studyCard && studyCard.classList.contains("expanded")) {
      studyCard.classList.remove("expanded");
      studyCard.style.transform = "";
      return;
    }

    const estado = event.state;

    if (!estado || !estado.screenId || estado.screenId === "main") {
      changeScreen(screenMain);
      return;
    }

    const pantalla = document.getElementById(estado.screenId);

    if (pantalla) {
      document.querySelectorAll(".screen").forEach(function (s) {
        s.classList.remove("active");
      });
      pantalla.classList.add("active");
    } else {
      changeScreen(screenMain);
    }
  });
});
// ==========================================
// EL CAMINO DE LA RAZÓN (Con bifurcación interactiva)
// ==========================================

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
        "Múltiplas realidades que conhecemos poderiam não ter existido ou ser diferentes; são contingentes. Se tudo dependesse unicamente de outra realidade contingente, continuaria sem se explicar por que algo existe. Por isso a razão se pergunta se existe uma realidade necessária. Faz sentido para você pensar que há um fundamento que não recebe de outro a sua existência?",
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

let pasoActualRazon = 1;

function manejarCaminoRazon(mensajeUsuario) {
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
    pasoActualRazon = 1; // Reseteamos el tren

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
    return ui.errorFin;
  }

  pasoActualRazon = estacionActual.siguiente;
  const siguienteEstacion = caminoRazonData.find(
    (e) => e.paso === pasoActualRazon,
  );

  if (!siguienteEstacion) {
    pasoActualRazon = 1;
    return `<div>${ui.finalPrincipal}</div>`;
  }

  const textoLimpio = siguienteEstacion.pregunta
    .replace(/'/g, "\\'")
    .replace(/"/g, "&quot;");

  // Si el siguiente paso es el 5 (la gran pregunta de bifurcación)
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

  // Estaciones estándar (2 a 4)
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

function leerTextoDirecto(textoParaLeer) {
  if (!("speechSynthesis" in window)) {
    alert("Tu dispositivo no soporta la síntesis de voz.");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(textoParaLeer);
  utterance.lang = "es-ES";
  window.speechSynthesis.speak(utterance);
}
// Vinculamos el clic del isologo superior con la pantalla del asistente
// Vinculamos el clic del isologo superior con la pantalla del asistente
if (btnAsistenteHome && screenAsistente) {
  btnAsistenteHome.addEventListener("click", () => {
    // 1. Ocultamos todas las pantallas activas
    document.querySelectorAll(".screen").forEach((screen) => {
      screen.classList.remove("active");
    });

    // 2. Activamos la pantalla del asistente (usando tu constante global)
    screenAsistente.classList.add("active");

    // 3. Por si el menú lateral estaba abierto, lo cerramos
    const menuLateral = document.getElementById("menu-lateral");
    if (menuLateral) {
      menuLateral.classList.remove("active"); // o la clase que uses
    }
  });
}
document.addEventListener("DOMContentLoaded", () => {
  const idiomaGuardado = localStorage.getItem("idiomaApp") || "es";
  cambiarIdioma(idiomaGuardado);
});
window.enviarMensajeSugerido = function (textoPregunta) {
  const inputChat = document.getElementById("chat-input"); // O como se llame tu variable del input
  if (inputChat) {
    inputChat.value = textoPregunta;
  }
  // Simulamos el clic en el botón enviar para que procese la pregunta automáticamente
  const btnEnviar = document.getElementById("btn-enviar"); // O como se llame tu botón
  if (btnEnviar) {
    btnEnviar.click();
  }
};
// --- FUNCIÓN HELPER: Renderizado de fichas de catequesis enriquecidas ---
function construirRespuestaCatequesis(item) {
  // Detectamos el idioma actual de la app (es, en, pt)
  const idioma =
    window.idiomaActual || localStorage.getItem("idiomaApp") || "es";

  // Extraemos el sub-objeto correspondiente al idioma (si no existe, usa el español por defecto)
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
// ==========================================
// EL CAMINO DE LA TRINIDAD (Multilingüe: ES, EN, PT)
// ==========================================

const caminoTrinidadTraducciones = {
  es: [
    {
      paso: 1,
      pregunta:
        "Partamos de una verdad central de nossa fe: Dios no es una soledad silenciosa, sino una comunión eterna de amor. La fe nos enseña que hay un solo Dios, pero en tres Personas distintas: el Padre, el Hijo y el Espíritu Santo. ¿Te parece que concebir a Dios como comunión de amor cambia la forma en que nos relacionamos con Él?",
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
        "Chegamos ao fim do caminho. A Trindade não é apenas uma verdade para compreender: é o Deus que se nos revela como comunhão de amor e nos chama a viver em comunhão com Ele e com os outros. Ao fazer o sinal da cruz, lembramos que somos do Pai, por o Filho, no Espírito Santo. Que gesto concreto de escuta, perdão, serviço ou reconciliação você pode oferecer hoje para que esse amor se faça visível em sua vida? Quando decidir, faça o sinal da cruz e peça a Deus que o ajude a realizá-lo.<br><br><em>«Que cada sinal da cruz lembre que o amor de Deus o precede e o envia a amar».</em> 🧉✨",
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

let pasoActualTrinidad = 1;

function manejarCaminoTrinidad(mensajeUsuario) {
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
  }

  // Buscamos la estación actual
  const estacionActual = caminoTrinidadData.find(
    (e) => e.paso === pasoActualTrinidad,
  );

  if (!estacionActual) {
    pasoActualTrinidad = 1;
    return ui.finalMsg;
  }

  // Preparamos el texto limpio por si necesita el botón de audio propio
  const textoLimpio = estacionActual.pregunta
    .replace(/'/g, "\\'")
    .replace(/"/g, "&quot;")
    .replace(/<br>/g, " ")
    .replace(/<em>|<\/em>/g, "");

  let botonesHtml = "";

  if (estacionActual.paso === 5) {
    // --- PASO 5 (FINAL): Lleva su propio botón de escuchar, sin botón siguiente ---
    botonesHtml = `
      <div class="trinidad-botones-activos" style="margin-top: 15px; display: flex; gap: 8px; justify-content: flex-end; align-items: center; flex-wrap: wrap;">
        <button onclick="leerTextoDirecto('${textoLimpio}')" style="background: #000; color: #fff; border: 1px solid #d4af37; padding: 6px 14px; border-radius: 20px; cursor: pointer; font-size: 12px; display: inline-flex; align-items: center; gap: 4px;">
          ${ui.escuchar}
        </button>
      </div>
    `;
    pasoActualTrinidad = 1; // Reseteamos para el próximo ciclo
  } else if (estacionActual.paso === 1) {
    // --- PASO 1: Solo botón siguiente ---
    botonesHtml = `
      <div class="trinidad-botones-activos" style="margin-top: 15px; display: flex; gap: 8px; justify-content: flex-end; align-items: center; flex-wrap: wrap;">
        <button onclick="avanzarCaminoTrinidadAutomatico()" style="background: #2c3e50; color: white; border: none; padding: 8px 18px; border-radius: 20px; cursor: pointer; font-family: inherit; font-size: 0.9rem; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          ${ui.siguiente}
        </button>
      </div>
    `;
    pasoActualTrinidad++; // Incrementamos ordenadamente
  } else {
    // --- PASOS INTERMEDIOS (2 a 4): Escuchar + Siguiente ---
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
    pasoActualTrinidad++; // Incrementamos ordenadamente
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
// --- DICCIONARIO MULTILINGÜE DEL CAMINO DEL ALMA ---
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
        "Sua dignidade não depende de ser jovem, forte, bem-sucedido, independente ou admirado. Não é um prêmio obtido por se comportar bem nem um troféu perdido quando se fracassa. Cada ser humano é amado por Deus e tem uma profundidade que nenhum rótulo pode abranger. Ao entrar no mais íntimo de si, a pessoa pode descobrir que Deus a conhece e a espera.<br><br>Isso muda a maneira de olhar para o próximo. A pessoa doente não é 'apenas um fardo'; o idoso não é 'alguém que não serve mais'; o pobre não é 'um problema'; o desconhecido não é 'mais um'. Cada pessoa é alguém, nunca simplesmente algo. Quem você poderia olhar hoje com mais paciência e reconhecer com um gesto concreto a sua dignidade?",
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

let pasoActualAlma = 1;

function manejarCaminoAlma(mensajeUsuario) {
  const texto = mensajeUsuario.toLowerCase().trim();

  // Detectamos el idioma actual de la app ("es", "en", "pt")
  const idiomaActual = localStorage.getItem("idiomaApp") || "es";
  const caminoAlmaData =
    caminoAlmaTraducciones[idiomaActual] || caminoAlmaTraducciones.es;
  const ui = textosUIAlma[idiomaActual] || textosUIAlma.es;

  // Si arranca el recorrido desde cero
  if (
    texto.includes("alma") ||
    texto.includes("cuerpo y alma") ||
    texto.includes("body and soul") ||
    texto.includes("soul") ||
    texto.includes("caminho da alma")
  ) {
    pasoActualAlma = 1;
  }

  // Buscamos la estación actual
  const estacionActual = caminoAlmaData.find((e) => e.paso === pasoActualAlma);

  if (!estacionActual) {
    pasoActualAlma = 1;
    return ui.finalMsg;
  }

  // Preparamos el texto limpio para el lector de voz
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
  } else if (estacionActual.paso === 5) {
    botonesHtml = `
      <div class="alma-botones-activos" style="margin-top: 15px; display: flex; gap: 8px; justify-content: flex-end; align-items: center; flex-wrap: wrap;">
        <button onclick="leerTextoDirecto('${textoLimpio}')" style="background: #000; color: #fff; border: 1px solid #d4af37; padding: 6px 14px; border-radius: 20px; cursor: pointer; font-size: 12px; display: inline-flex; align-items: center; gap: 4px;">
          ${ui.escuchar}
        </button>
      </div>
    `;
    pasoActualAlma = 1;
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
// EL CAMINO DE LA PASCUA
// ==========================================

// 1. Array con las estaciones del Camino de la Pascua
// ==========================================
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

let pasoActualPascua = 1;

function manejarCaminoPascua(mensajeUsuario) {
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
  }

  const estacionActual = caminoPascuaData.find(
    (e) => e.paso === pasoActualPascua,
  );

  if (!estacionActual) {
    pasoActualPascua = 1;
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
  } else if (estacionActual.paso === 5) {
    botonesHtml = `
      <div class="pascua-botones-activos" style="margin-top: 15px; display: flex; gap: 8px; justify-content: flex-end; align-items: center; flex-wrap: wrap;">
        <button onclick="leerTextoDirecto('${textoLimpio}')" style="background: #000; color: #fff; border: 1px solid #d4af37; padding: 6px 14px; border-radius: 20px; cursor: pointer; font-size: 12px; display: inline-flex; align-items: center; gap: 4px;">
          ${ui.escuchar}
        </button>
      </div>
    `;
    pasoActualPascua = 1;
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
// ==========================================
// EL CAMINO DE JESÚS (Multilingüe: ES, EN, PT)
// ==========================================

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

let pasoActualDobleNaturaleza = 1;

function manejarCaminoDobleNaturaleza(mensajeUsuario) {
  const texto = mensajeUsuario.toLowerCase().trim();

  const idiomaActual = localStorage.getItem("idiomaApp") || "es";
  const caminoData =
    caminoDobleNaturalezaTraducciones[idiomaActual] ||
    caminoDobleNaturalezaTraducciones.es;
  const ui =
    textosUIDobleNaturaleza[idiomaActual] || textosUIDobleNaturaleza.es;

  // Si arranca el recorrido desde cero con palabras clave ultra específicas
  if (
    texto.includes("doble naturaleza") ||
    texto.includes("elohin") ||
    texto.includes("dupla natureza") ||
    texto.includes("verdadero dios y verdadero hombre") ||
    texto.includes("true god and true man") ||
    texto.includes("verdadeiro deus")
  ) {
    pasoActualDobleNaturaleza = 1;
  }

  // Buscamos la estación actual
  const estacionActual = caminoData.find(
    (e) => e.paso === pasoActualDobleNaturaleza,
  );

  if (!estacionActual) {
    pasoActualDobleNaturaleza = 1;
    return ui.finalMsg;
  }

  // Preparamos el texto limpio para el lector de voz
  const textoLimpio = estacionActual.pregunta
    .replace(/<[^>]*>?/gm, "")
    .replace(/'/g, "\\'")
    .replace(/"/g, "&quot;");

  let botonesHtml = "";

  if (estacionActual.paso === 5) {
    // --- PASO 5 (FINAL) ---
    botonesHtml = `
      <div class="doble-nat-botones-activos" style="margin-top: 15px; display: flex; gap: 8px; justify-content: flex-end; align-items: center; flex-wrap: wrap;">
        <button onclick="leerTextoDirecto('${textoLimpio}')" style="background: #000; color: #fff; border: 1px solid #d4af37; padding: 6px 14px; border-radius: 20px; cursor: pointer; font-size: 12px; display: inline-flex; align-items: center; gap: 4px;">
          ${ui.escuchar}
        </button>
      </div>
    `;
    pasoActualDobleNaturaleza = 1; // Reseteamos para el próximo ciclo
  } else if (estacionActual.paso === 1) {
    // --- PASO 1 ---
    botonesHtml = `
      <div class="doble-nat-botones-activos" style="margin-top: 15px; display: flex; gap: 8px; justify-content: flex-end; align-items: center; flex-wrap: wrap;">
        <button onclick="avanzarCaminoDobleNaturalezaAutomatico()" style="background: #2c3e50; color: white; border: none; padding: 8px 18px; border-radius: 20px; cursor: pointer; font-family: inherit; font-size: 0.9rem; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          ${ui.siguiente}
        </button>
      </div>
    `;
    pasoActualDobleNaturaleza++;
  } else {
    // --- PASOS INTERMEDIOS (2 a 4) ---
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
// ==========================================
// CONTROL DEL MICRÓFONO (Reconocimiento de Voz)
// ==========================================

// Verificamos si el navegador soporta la API de voz
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (btnMic) {
  if (!SpeechRecognition) {
    // Si el navegador no soporta la API, dejamos el botón opaco / inactivo
    btnMic.style.opacity = "0.4";
    btnMic.title =
      "El reconocimiento de voz no está soportado en este navegador.";
  } else {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    // 1. Cuando el usuario hace clic en el micrófono
    // Al hacer clic en el botón del micrófono:
    btnMic.addEventListener("click", () => {
      // 1. ¡Frenamos cualquier voz del asistente que esté sonando!
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }

      // 2. Verificamos conexión a internet
      if (!navigator.onLine) {
        console.warn("Sin conexión a internet para usar la voz.");
        return;
      }

      try {
        let langCode = "es-AR";
        if (typeof idiomaActual !== "undefined") {
          if (idiomaActual === "en") langCode = "en-US";
          else if (idiomaActual === "pt") langCode = "pt-BR";
        }
        recognition.lang = langCode;

        recognition.start();
      } catch (e) {
        console.log(
          "El micrófono ya estaba activo o hubo un error al iniciar:",
          e,
        );
      }
    });

    // 2. Cuando empieza a escuchar (activamos el efecto "lucecita encendida / titilando")
    recognition.onstart = () => {
      btnMic.classList.add("mic-escuchando"); // Clase CSS para el brillo o titilado
    };

    // 3. Cuando el usuario habla y el sistema captura el texto
    recognition.onresult = (event) => {
      const textoCapturado = event.results[0][0].transcript;
      console.log("Texto por voz:", textoCapturado);

      // Buscamos el input del chat para volcarle lo que dijo el usuario
      const inputChat = document.getElementById("chat-input");
      if (inputChat) {
        inputChat.value = textoCapturado;
        // Opcional: si querés que envíe automáticamente, podés disparar la función de enviar
      }
    };

    // 4. Blindaje contra errores (para que NUNCA se quede colgado en rojo)
    recognition.onerror = (event) => {
      console.warn("Error en reconocimiento de voz:", event.error);
      apagarMicrifono();
    };

    // 5. Cuando termina la escucha por cualquier motivo
    recognition.onend = () => {
      apagarMicrifono();
    };

    function apagarMicrifono() {
      btnMic.classList.remove("mic-escuchando"); // Apaga la luz / titilado y vuelve al estado normal
    }
  }
}
// --- FUNCIÓN AUXILIAR PARA MANTENER EL FOCO EN PC ---
function devolverFocoPC() {
  const esMovil =
    /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    window.innerWidth <= 768;

  if (!esMovil) {
    // Si estamos en PC, esperamos un mini respiro del DOM y devolvemos el cursor al input
    setTimeout(() => {
      const inputChat = document.getElementById("chat-input");
      if (inputChat) {
        inputChat.focus();
      }
    }, 50);
  }
}
