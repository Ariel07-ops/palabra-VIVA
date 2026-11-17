// js/core/ui.js
// Módulo para la interfaz, cambio de pantallas, menú lateral, temas y navegaciones especiales

let tamanoActual = 18;
let origenBitacora = "screen-main"; // Estado global para recordar de dónde se abrió la bitácora

// --- FUNCIÓN AUXILIAR PARA CAMBIAR DE PANTALLA ---
export function changeScreen(screenToShow) {
  // Si le pasan un string (ID), busca el elemento en el DOM
  if (typeof screenToShow === "string") {
    screenToShow = document.getElementById(screenToShow);
  }

  // Si el elemento no existe o es undefined, cancela en silencio sin tirar error
  if (!screenToShow) return;

  // Frenar audio de speechSynthesis si cambia de pantalla
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    if (typeof window.estaReproduciendo !== "undefined")
      window.estaReproduciendo = false;
    if (typeof window.estaPausado !== "undefined") window.estaPausado = false;
    const btnAudio = document.getElementById("bible-audio-trigger");
    if (btnAudio) btnAudio.innerHTML = '<i class="fas fa-volume-up"></i>';
    document
      .querySelectorAll(".expanded-full")
      .forEach((el) => el.classList.remove("expanded-full"));
    const studyCard = document.getElementById("study-card");
    if (studyCard) studyCard.classList.add("hidden");
  }

  const screens = [
    "screen-splash",
    "screen-main",
    "screen-bible-detail",
    "screen-path-detail",
    "screen-agradecido",
    "screen-en-paz",
    "screen-cansado",
    "screen-bendecido",
    "screen-preocupado",
    "screen-ansioso",
    "screen-temeroso",
    "screen-feliz",
    "screen-triste",
    "screen-emaus",
    "screen-promesa",
    "screen-buscar",
    "screen-antiguo",
    "screen-capitulos",
    "screen-lectura",
    "screen-nuevo",
    "screen-peldaño-detalle",
    "screen-emaus-detalle",
    "screen-idioma",
    "screen-sugerir",
    "screen-acerca",
    "screen-asistente",
    "screen-cuaderno", // <-- Registrada oficialmente la libreta de estudio
  ];

  screens.forEach((id) => {
    const scr = document.getElementById(id);
    if (scr) scr.classList.remove("active");
  });

  screenToShow.classList.add("active");

  const screenMain = document.getElementById("screen-main");
  const screenSplash = document.getElementById("screen-splash");

  if (screenToShow === screenMain) {
    history.replaceState({ screenId: "main" }, "", "");
  } else if (screenToShow && screenToShow !== screenSplash) {
    const screenId = screenToShow.id || "detalle";
    history.pushState({ screenId: screenId }, "", "");
  }
}

// --- FUNCIÓN PARA REDIRIGIR SEGÚN EL ESTADO DE ÁNIMO ---
export function redirigir(estado) {
  const estadosMap = {
    agradecido: document.getElementById("screen-agradecido"),
    bendecido: document.getElementById("screen-bendecido"),
    cansado: document.getElementById("screen-cansado"),
    feliz: document.getElementById("screen-feliz"),
    triste: document.getElementById("screen-triste"),
    ansioso: document.getElementById("screen-ansioso"),
    temeroso: document.getElementById("screen-temeroso"),
    preocupado: document.getElementById("screen-preocupado"),
    "en-paz": document.getElementById("screen-en-paz"),
  };

  if (estadosMap[estado]) {
    if (typeof window.cargarEstadoAnimo === "function") {
      window.cargarEstadoAnimo(estado);
    }
    changeScreen(estadosMap[estado]);
  }
}

// --- VISTAS DE DETALLE: EMAÚS Y PROMESA ---
export async function abrirPasoEmaus(numero) {
  try {
    const idioma =
      window.idiomaActual || localStorage.getItem("pv_idioma") || "es";

    const respuesta = await fetch("data/camino.json");
    const datosJson = await respuesta.json();
    const datos = datosJson.pasos.find((p) => p.id === parseInt(numero));

    if (!datos) return;

    const tituloEl = document.getElementById("titulo-emaus-detalle");
    if (tituloEl) {
      tituloEl.innerHTML =
        datos.titulo && datos.titulo[idioma]
          ? datos.titulo[idioma]
          : datos.titulo || "";
    }

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

    const contenedorTexto = document.getElementById("texto-emaus-detalle");
    if (contenedorTexto) {
      contenedorTexto.innerHTML = `
        <p>${textoPaso}</p>
        <p style="margin-top: 15px;"><strong>Caminar:</strong> ${caminarPaso}</p>
        <p style="margin-top: 15px; font-style: italic;"><strong>Reflexión:</strong> ${reflexionPaso}</p>
        ${datos.imagen ? `<img src="${datos.imagen}" alt="${tituloAlt}">` : ""}
      `;
    }

    const screenEmausDetalle = document.getElementById("screen-emaus-detalle");
    if (screenEmausDetalle) changeScreen(screenEmausDetalle);
  } catch (error) {
    console.error("Error al cargar datos de Emaús:", error);
  }
}

export async function abrirPeldaño(numero) {
  try {
    const idioma =
      window.idiomaActual || localStorage.getItem("pv_idioma") || "es";

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

    const tituloEl = document.getElementById("titulo-peldaño-detalle");
    if (tituloEl) tituloEl.innerHTML = tituloPeldaño;

    const textoEl = document.getElementById("texto-peldaño-detalle");
    if (textoEl) {
      textoEl.innerHTML = `
        ${datos.imagen ? `<img src="${datos.imagen}" alt="${tituloPeldaño}">` : ""}
        <p><strong>Introducción:</strong> ${introPeldaño}</p>
        <p style="margin-top: 15px;"><em>${citaPeldaño}</em></p>
        <p style="margin-top: 15px;">${desarrolloPeldaño}</p>
        <p style="margin-top: 15px;"><strong>Voz de la Iglesia:</strong> ${vozIglesia}</p>
        <p style="margin-top: 15px;"><strong>Aplicación:</strong> ${aplicacionEx}</p>
        <p style="margin-top: 15px; font-style: italic;"><strong>Oración:</strong> ${oracionBreve}</p>
      `;
    }

    const screenPeldañoDetalle = document.getElementById(
      "screen-peldaño-detalle",
    );
    if (screenPeldañoDetalle) changeScreen(screenPeldañoDetalle);
  } catch (error) {
    console.error("Error al abrir el peldaño:", error);
  }
}

export function sincronizarBotonTema() {
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

export function actualizarIndicadorVisual() {
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

  const indicadorModal = document.getElementById("indicador-tamano");
  if (indicadorModal) {
    indicadorModal.innerText = tamanoActual + "px";
  }
}

export function cambiarTamanio(delta) {
  const areaLectura = document.getElementById("texto-lectura-final");
  if (!areaLectura) return;

  tamanoActual = Math.max(14, Math.min(30, tamanoActual + delta));

  areaLectura.style.fontSize = tamanoActual + "px";
  localStorage.setItem("tamanoLetra", tamanoActual);

  actualizarIndicadorVisual();
}

// ==========================================
// SPLASH SCREEN - VERSIÓN LIMPIA Y ROBUSTA
// ==========================================
export function comenzarExperiencia() {
  const splash = document.getElementById("screen-splash");
  const main = document.getElementById("screen-main");
  const audio = document.getElementById("musica-inicio");

  // Si no existen los elementos, salimos sin error
  if (!splash || !main) return;

  // Intentamos reproducir el audio de forma suave
  if (audio) {
    audio.volume = 0.15; // volumen bajo
    audio.play().catch(() => {
      // Si el navegador bloquea el autoplay, no pasa nada
      console.log("Audio de splash bloqueado por el navegador");
    });
  }

  // Tiempo total que se muestra el splash (en milisegundos)
  const TIEMPO_SPLASH = 4200;

  setTimeout(() => {
    // Hacemos el fade out
    splash.style.transition = "opacity 0.9s ease";
    splash.style.opacity = "0";

    // Después del fade, escondemos el splash y mostramos la pantalla principal
    setTimeout(() => {
      splash.style.display = "none";
      splash.classList.remove("active");

      main.style.display = "block";
      main.classList.add("active");

      // Paramos y reiniciamos el audio
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    }, 900); // tiempo del fade
  }, TIEMPO_SPLASH);
}
// --- FUNCIONES DEL MODAL DE HERRAMIENTAS Y LIBRETA ---
export function mostrarSeccionModal(seccion) {
  const menuPrincipal = document.getElementById("menu-herramientas-principal");
  const seccionTamano = document.getElementById("seccion-tamano");
  const seccionEstudio = document.getElementById("seccion-estudio");

  if (menuPrincipal) menuPrincipal.style.display = "none";
  if (seccionTamano) seccionTamano.style.display = "none";
  if (seccionEstudio) seccionEstudio.style.display = "none";

  if (seccion === "principal" && menuPrincipal) {
    menuPrincipal.style.display = "block";
  } else if (seccion === "tamano" && seccionTamano) {
    seccionTamano.style.display = "block";
  } else if (seccion === "estudio" && seccionEstudio) {
    seccionEstudio.style.display = "block";
  }
}

export function cerrarModalHerramientas() {
  const modal = document.getElementById("modal-herramientas");
  if (modal) {
    modal.style.display = "none";
  }
  mostrarSeccionModal("principal");
}

export function mostrarPortadaCuaderno() {
  const nombreGuardado =
    localStorage.getItem("pv_nombre") || localStorage.getItem("pv_nombre");
  const saludoElem = document.getElementById("cuaderno-saludo-usuario");
  if (saludoElem) {
    if (nombreGuardado && nombreGuardado.trim() !== "") {
      saludoElem.innerText = `¡Hola, ${nombreGuardado.trim()}! Este es tu espacio de reflexión.`;
    } else {
      saludoElem.innerText = "¡Bienvenido/a a tu espacio de reflexión!";
    }
  }
}

// --- CONTROL DE ORIGEN Y RETORNO INTELIGENTE DE BITÁCORA ---
// Abrir la bitácora guardando explícitamente el origen
export function abrirLibretaEstudio(origen = "main") {
  // Guardamos el origen en una variable o directamente en el dataset de la pantalla
  const screenCuaderno = document.getElementById("screen-cuaderno");
  if (screenCuaderno) {
    screenCuaderno.dataset.origen = origen; // Guarda 'lectura' o 'main'
    changeScreen(screenCuaderno);
    mostrarPortadaCuaderno();
  }
}

// Volver exactamente al lugar de donde vino
export function volverDesdeCuaderno() {
  const screenCuaderno = document.getElementById("screen-cuaderno");
  const origen = screenCuaderno ? screenCuaderno.dataset.origen : "main";

  if (origen === "lectura") {
    changeScreen("screen-lectura");
  } else {
    changeScreen("screen-main");
  }
}
export function initUI() {
  // 1. Aplicar tamaño guardado
  const guardado = localStorage.getItem("tamanoLetra");
  if (guardado) {
    tamanoActual = parseInt(guardado, 10);
    const areaLectura = document.getElementById("texto-lectura-final");
    if (areaLectura) areaLectura.style.fontSize = tamanoActual + "px";
  }
  actualizarIndicadorVisual();

  // 2. Transición automática del Splash Screen
  const screenSplash = document.getElementById("screen-splash");
  const screenMain = document.getElementById("screen-main");
  if (screenSplash) {
    setTimeout(() => {
      screenSplash.style.transition = "opacity 0.8s ease";
      screenSplash.style.opacity = "0";
      setTimeout(() => {
        screenSplash.style.display = "none";
        if (screenMain) screenMain.classList.add("active");
      }, 800);
    }, 4500);
  }

  // 3. Cambio de tema (Claro / Oscuro / Sepia)
  const btnTheme = document.getElementById("btn-theme");
  if (btnTheme) {
    sincronizarBotonTema();
    btnTheme.addEventListener("click", () => {
      const body = document.body;
      const docEl = document.documentElement;

      if (
        !body.classList.contains("light-mode") &&
        !body.classList.contains("modo-sepia")
      ) {
        body.classList.add("modo-sepia");
        docEl.classList.add("modo-sepia");
      } else if (body.classList.contains("modo-sepia")) {
        body.classList.remove("modo-sepia");
        docEl.classList.remove("modo-sepia");
        body.classList.add("light-mode");
      } else {
        body.classList.remove("light-mode");
      }
      sincronizarBotonTema();
    });
  }

  // 4. Menú lateral y navegaciones
  const btnMenu = document.getElementById("btn-menu");
  const menuLateral = document.getElementById("menu-lateral");

  if (btnMenu && menuLateral) {
    btnMenu.addEventListener("click", () => {
      menuLateral.classList.toggle("active");
    });
  }

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

  // Enlaces de navegación rápida del menú
  const linkIds = [
    { id: "link-inicio", target: "screen-main" },
    { id: "link-biblia", target: "screen-bible-detail" },
    { id: "link-buscar", target: "screen-buscar" },
    { id: "link-idioma", target: "screen-idioma" },
    { id: "link-sugerir", target: "screen-sugerir" },
    { id: "link-acerca", target: "screen-acerca" },
  ];

  linkIds.forEach(({ id, target }) => {
    const link = document.getElementById(id);
    if (link) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetScreen = document.getElementById(target);
        if (targetScreen) changeScreen(targetScreen);
        menuLateral?.classList.remove("active");
      });
    }
  });

  const linkHerramientas = document.getElementById("link-herramientas");
  if (linkHerramientas) {
    linkHerramientas.addEventListener("click", (e) => {
      e.preventDefault();
      // Garantizar que siempre abra mostrando las 2 opciones principales
      mostrarSeccionModal("principal");
      const modal = document.getElementById("modal-herramientas");
      if (modal) modal.style.display = "flex";
      menuLateral?.classList.remove("active");
    });
  }

  // Botones de retorno
  document
    .getElementById("btn-volver-idioma")
    ?.addEventListener("click", () => changeScreen(screenMain));
  document
    .getElementById("btn-volver-sugerir")
    ?.addEventListener("click", () => changeScreen(screenMain));
  document
    .getElementById("btn-volver-acerca")
    ?.addEventListener("click", () => changeScreen(screenMain));

  // Botones de la Home y Navegación Bíblica
  const btnGotoBible = document.getElementById("btn-goto-bible");
  const btnGotoPath = document.getElementById("btn-goto-path");
  const btnBackBible = document.querySelector(".btn-back");

  if (btnGotoBible)
    btnGotoBible.addEventListener("click", () =>
      changeScreen("screen-bible-detail"),
    );
  if (btnGotoPath)
    btnGotoPath.addEventListener("click", () =>
      changeScreen("screen-path-detail"),
    );
  if (btnBackBible)
    btnBackBible.addEventListener("click", () => changeScreen("screen-main"));
  const btnAsistenteHome = document.getElementById("btn-asistente-home");
  const screenAsistente = document.getElementById("screen-asistente");

  if (btnAsistenteHome && screenAsistente) {
    btnAsistenteHome.addEventListener("click", () => {
      document
        .querySelectorAll(".screen")
        .forEach((s) => s.classList.remove("active"));
      screenAsistente.classList.add("active");
      menuLateral?.classList.remove("active");
    });
  }

  // Botones volver de estados de ánimo y detalles
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
    if (btn)
      btn.addEventListener("click", () => changeScreen("screen-path-detail"));
  });

  const btnBackEmaus = document.querySelector("#screen-emaus .btn-back-path");
  if (btnBackEmaus)
    btnBackEmaus.addEventListener("click", () =>
      changeScreen("screen-path-detail"),
    );

  const btnBackEmausDetalle = document.querySelector(
    "#screen-emaus-detalle .btn-back-path",
  );
  if (btnBackEmausDetalle) {
    btnBackEmausDetalle.addEventListener("click", () => {
      const screenEmaus = document.getElementById("screen-emaus");
      if (screenEmaus) changeScreen(screenEmaus);
    });
  }

  const btnBackPeldañoDetalle = document.querySelector(
    "#screen-peldaño-detalle .btn-back-path",
  );
  if (btnBackPeldañoDetalle) {
    btnBackPeldañoDetalle.addEventListener("click", () => {
      const screenPromesa = document.getElementById("screen-promesa");
      if (screenPromesa) changeScreen(screenPromesa);
    });
  }

  // Manejo de Historial y Botón Atrás del Navegador
  if (window.history && window.history.replaceState) {
    history.replaceState({ vista: "main" }, "", "");
  }

  window.addEventListener("popstate", (event) => {
    const studyCard = document.getElementById("study-card");
    if (studyCard && studyCard.classList.contains("expanded")) {
      studyCard.classList.remove("expanded");
      studyCard.style.transform = "";
      return;
    }

    const estado = event.state;
    if (!estado || !estado.screenId || estado.screenId === "main") {
      if (screenMain) changeScreen(screenMain);
      return;
    }

    const pantalla = document.getElementById(estado.screenId);
    if (pantalla) {
      document
        .querySelectorAll(".screen")
        .forEach((s) => s.classList.remove("active"));
      pantalla.classList.add("active");
    } else if (screenMain) {
      changeScreen(screenMain);
    }
  });
}

// --- FUNCIONES DE NAVEGACIÓN DIRECTA PARA EL HTML ---
export function screenMain() {
  const el = document.getElementById("screen-main");
  if (el) changeScreen(el);
}

export function screenBibleDetail() {
  const el = document.getElementById("screen-bible-detail");
  if (el) changeScreen(el);
}

export function screenPathDetail() {
  const el = document.getElementById("screen-path-detail");
  if (el) changeScreen(el);
}

export function screenEmaus() {
  const el = document.getElementById("screen-emaus");
  if (el) changeScreen(el);
}

export function screenPromesa() {
  const el = document.getElementById("screen-promesa");
  if (el) changeScreen(el);
}

export function screenCapitulos() {
  const el = document.getElementById("screen-capitulos");
  if (el) changeScreen(el);
}

export function screenBuscar() {
  const el = document.getElementById("screen-buscar");
  if (el) changeScreen(el);
}

export function screenLectura() {
  const el = document.getElementById("screen-lectura");
  if (el) changeScreen(el);
}
// --- CONTROL DE LA BARRA LATERAL DERECHA DE LA BITÁCORA ---
export function toggleMenuBitacora() {
  const panel = document.getElementById("panel-lateral-bitacora");
  const overlay = document.getElementById("overlay-bitacora");

  if (!panel || !overlay) return;

  if (panel.style.right === "0px") {
    panel.style.right = "-320px";
    overlay.style.display = "none";
  } else {
    panel.style.right = "0px";
    overlay.style.display = "block";
    cargarIndiceNotas(); // Carga las notas al desplegar la cortina
  }
}

// Cambiar entre pestañas dentro del panel lateral (Notas / Guía / Glosario)
export function verPestanaBitacora(nombre) {
  const secNotas = document.getElementById("sec-bitacora-notas");
  const secGuia = document.getElementById("sec-bitacora-guia");
  const secGlosario = document.getElementById("sec-bitacora-glosario");

  if (secNotas) secNotas.style.display = nombre === "notas" ? "flex" : "none";
  if (secGuia) secGuia.style.display = nombre === "guia" ? "block" : "none";
  if (secGlosario)
    secGlosario.style.display = nombre === "glosario" ? "block" : "none";

  const contenedorTabs = document.querySelector(
    "#panel-lateral-bitacora > div:nth-child(2)",
  );
  if (secNotas) {
    secNotas.style.display = nombre === "notas" ? "flex" : "none";
    if (nombre === "notas") {
      cargarIndiceNotas();
    }
  }
  if (contenedorTabs) {
    const botones = contenedorTabs.querySelectorAll("button");
    const pestanasMap = ["notas", "guia", "glosario"];

    botones.forEach((btn, index) => {
      if (pestanasMap[index] === nombre) {
        btn.style.background = "rgba(212, 175, 55, 0.25)";
        btn.style.borderColor = "var(--gold, #d4af37)";
        btn.style.color = "#fff";
        btn.style.fontWeight = "bold";
      } else {
        btn.style.background = "transparent";
        btn.style.borderColor = "rgba(255, 255, 255, 0.3)";
        btn.style.color = "#aaa";
        btn.style.fontWeight = "normal";
      }
    });
  }
}

// --- SISTEMA DE NOTAS CON ID ÚNICO Y RESPALDO JSON ---

function generarIdNota() {
  return (
    "nota_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7)
  );
}

// Crear una nota nueva limpia
export function crearNuevaNota() {
  const inputTitulo = document.getElementById("titulo-nota-actual");
  const txtArea = document.getElementById("texto-libreta-amplia");
  const estado = document.getElementById("estado-guardado-libreta");

  if (inputTitulo) {
    inputTitulo.value = "Nueva Nota " + new Date().toLocaleDateString("es-AR");
    inputTitulo.dataset.notaId = ""; // Se generará el ID único al guardar por primera vez
  }
  if (txtArea) txtArea.value = "";
  if (estado) estado.innerText = "Nota nueva creada";

  if (typeof toggleMenuBitacora === "function") toggleMenuBitacora();
}

// Cargar una nota existente en el editor usando su ID único
export function cargarNotaEnEditor(nota) {
  const inputTitulo = document.getElementById("titulo-nota-actual");
  const txtArea = document.getElementById("texto-libreta-amplia");
  const estado = document.getElementById("estado-guardado-libreta");

  if (inputTitulo) {
    inputTitulo.value = nota.titulo || "";
    inputTitulo.dataset.notaId = nota.id || "";
  }
  if (txtArea) txtArea.value = nota.contenido || "";
  if (estado) estado.innerText = "Nota cargada";
}

// Guardar la nota actual en localStorage con ID único (evita sobrescribir notas con igual título)
export function guardarNotaManual() {
  const inputTitulo = document.getElementById("titulo-nota-actual");
  const txtArea = document.getElementById("texto-libreta-amplia");
  const estado = document.getElementById("estado-guardado-libreta");

  const titulo = inputTitulo ? inputTitulo.value.trim() : "Sin título";
  const contenido = txtArea ? txtArea.value : "";

  let idActual = inputTitulo?.dataset?.notaId || null;
  let notas = JSON.parse(localStorage.getItem("palabra_viva_notas") || "[]");

  if (!idActual) {
    idActual = generarIdNota();
    if (inputTitulo) inputTitulo.dataset.notaId = idActual;
  }

  const notaData = {
    id: idActual,
    titulo: titulo || "Sin título",
    contenido: contenido,
    fecha: new Date().toLocaleString("es-AR"),
    fechaISO: new Date().toISOString(),
  };

  const index = notas.findIndex((n) => n.id === idActual);

  if (index >= 0) {
    notas[index] = notaData; // Actualiza la existente
  } else {
    notas.push(notaData); // Agrega nueva
  }

  localStorage.setItem("palabra_viva_notas", JSON.stringify(notas));
  if (estado) estado.innerText = "✓ Guardado exitosamente";

  if (typeof cargarIndiceNotas === "function") cargarIndiceNotas();
}

// Exportar todas las notas a un archivo JSON profesional con metadatos
export function exportarTodasLasNotas() {
  const notas = JSON.parse(localStorage.getItem("palabra_viva_notas") || "[]");

  if (notas.length === 0) {
    alert("No hay notas para exportar.");
    return;
  }

  const respaldo = {
    app: "Palabra Viva",
    version: "1.0",
    fechaExportacion: new Date().toISOString(),
    cantidad: notas.length,
    notas: notas,
  };

  const blob = new Blob([JSON.stringify(respaldo, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `PalabraViva-Notas-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Importar notas desde un archivo JSON (Fusión inteligente por ID)
export function importarNotasDesdeJSON(event) {
  const archivo = event.target.files[0];
  if (!archivo) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);
      let notasImportadas = Array.isArray(data) ? data : data.notas;

      if (!Array.isArray(notasImportadas)) {
        alert("El archivo no tiene el formato correcto de notas.");
        return;
      }

      let notasLocales = JSON.parse(
        localStorage.getItem("palabra_viva_notas") || "[]",
      );
      let agregadas = 0;
      let actualizadas = 0;

      notasImportadas.forEach((notaImp) => {
        if (!notaImp.id) {
          notaImp.id = generarIdNota(); // Asigna ID si el archivo importado es viejo
        }

        const index = notasLocales.findIndex((n) => n.id === notaImp.id);

        if (index >= 0) {
          notasLocales[index] = notaImp;
          actualizadas++;
        } else {
          notasLocales.push(notaImp); // Conviven aunque tengan el mismo título (ej: Dios y Dios)
          agregadas++;
        }
      });

      localStorage.setItem("palabra_viva_notas", JSON.stringify(notasLocales));

      if (typeof cargarIndiceNotas === "function") {
        cargarIndiceNotas();
      }

      alert(
        `Importación finalizada.\n\nNotas nuevas: ${agregadas}\nNotas actualizadas: ${actualizadas}`,
      );
    } catch (error) {
      console.error("Error al importar notas:", error);
      alert("Hubo un error al leer el archivo.");
    }
  };

  reader.readAsText(archivo);
  event.target.value = ""; // Limpia el input para permitir reimportar el mismo archivo si hace falta
}

// Cargar el listado/índice de notas en la barra lateral con opción de eliminar
export function cargarIndiceNotas() {
  const listaContenedor = document.getElementById("lista-notas-indice");
  if (!listaContenedor) return;

  const notas = JSON.parse(localStorage.getItem("palabra_viva_notas") || "[]");
  listaContenedor.innerHTML = "";

  if (notas.length === 0) {
    const langActual = localStorage.getItem("pv_idioma") || "es";
    const msjSinNotas = {
      es: "No hay notas guardadas aún.",
      en: "No saved notes yet.",
      pt: "Nenhuma nota salva ainda.",
    };

    listaContenedor.innerHTML = `
      <p style='color: #888; font-size: 0.8rem; font-style: italic;'>
        ${msjSinNotas[langActual] || msjSinNotas.es}
      </p>
    `;
    return;
  }

  // Ordenar de más reciente a más antigua
  notas.sort((a, b) => new Date(b.fechaISO || 0) - new Date(a.fechaISO || 0));

  notas.forEach((nota) => {
    const item = document.createElement("div");
    item.style.cssText =
      "background: rgba(255,255,255,0.05); border: 1px solid rgba(212,175,55,0.3); padding: 8px 10px; border-radius: 5px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;";

    item.innerHTML = `
      <div style="flex: 1; overflow: hidden; padding-right: 8px;">
        <div style="color: var(--gold, #d4af37); font-weight: bold; font-size: 0.85rem; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">📄 ${nota.titulo || "Sin título"}</div>
        <div style="color: #aaa; font-size: 0.7rem;">${nota.fecha || ""}</div>
      </div>
      <button onclick="event.stopPropagation(); eliminarNota('${nota.id}')" title="Eliminar nota" style="background: transparent; border: none; color: #ff5555; cursor: pointer; font-size: 1rem; padding: 4px;">
        🗑️
      </button>
    `;

    // Al hacer clic, carga la nota exacta por su ID único
    item.onclick = () => {
      cargarNotaEnEditor(nota);
      if (typeof toggleMenuBitacora === "function") toggleMenuBitacora();
    };

    listaContenedor.appendChild(item);
  });
}

// Función para eliminar una nota usando su ID único
export function eliminarNota(idNota) {
  let notas = JSON.parse(localStorage.getItem("palabra_viva_notas") || "[]");
  const notaABorrar = notas.find((n) => n.id === idNota);

  if (!notaABorrar) return;

  if (
    confirm(`¿Estás seguro de que querés eliminar "${notaABorrar.titulo}"?`)
  ) {
    notas = notas.filter((n) => n.id !== idNota);
    localStorage.setItem("palabra_viva_notas", JSON.stringify(notas));

    // Si la nota borrada era la que estaba abierta en el editor, limpiamos
    const inputTitulo = document.getElementById("titulo-nota-actual");
    if (inputTitulo && inputTitulo.dataset.notaId === idNota) {
      inputTitulo.value = "Mi Nota de Hoy";
      inputTitulo.dataset.notaId = "";
      const txtArea = document.getElementById("texto-libreta-amplia");
      if (txtArea) txtArea.value = "";
      const estado = document.getElementById("estado-guardado-libreta");
      if (estado) estado.innerText = "Nota eliminada";
    }

    cargarIndiceNotas();
  }
}

// Exposición global (Puentes con el HTML)
window.toggleMenuBitacora = toggleMenuBitacora;
window.verPestanaBitacora = verPestanaBitacora;
window.crearNuevaNota = crearNuevaNota;
window.guardarNotaManual = guardarNotaManual;
window.exportarTodasLasNotas = exportarTodasLasNotas;
window.importarNotasDesdeJSON = importarNotasDesdeJSON;
window.cargarIndiceNotas = cargarIndiceNotas;
window.cargarNotaEnEditor = cargarNotaEnEditor;
window.eliminarNota = eliminarNota;

// --- RESTO DE EXPOSICIONES GLOBALES ---
window.changeScreen = changeScreen;
window.redirigir = redirigir;
window.abrirPasoEmaus = abrirPasoEmaus;
window.abrirPeldaño = abrirPeldaño;
window.screenEmaus = document.getElementById("screen-emaus");
window.screenPromesa = document.getElementById("screen-promesa");
window.mostrarSeccionModal = mostrarSeccionModal;
window.cerrarModalHerramientas = cerrarModalHerramientas;
window.abrirLibretaEstudio = abrirLibretaEstudio;
window.mostrarPortadaCuaderno = mostrarPortadaCuaderno;
window.cambiarTamanio = cambiarTamanio;
window.volverDesdeCuaderno = volverDesdeCuaderno;
window.screenAntiguo = document.getElementById("screen-antiguo");
