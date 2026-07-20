// 1. CAPTURAR LAS PANTALLAS
const screenSplash = document.getElementById("screen-splash");
const screenMain = document.getElementById("screen-main");
const screenBibleDetail = document.getElementById("screen-bible-detail");
const screenPathDetail = document.getElementById("screen-path-detail");
const screenOptimo = document.getElementById("screen-optimo");
const screenAgradecido = document.getElementById("screen-agradecido");
const screenCansado = document.getElementById("screen-cansado");

// 2. CAPTURAR BOTONES INTERACTIVOS
const btnEnter = document.querySelector(".btn-enter");
const btnGotoBible = document.getElementById("btn-goto-bible");
const btnGotoPath = document.getElementById("btn-goto-path");
const btnBackBible = document.querySelector(".btn-back");

const textParagraph = document.querySelector(".interact-paragraph");
const studyCard = document.getElementById("study-card");
const panelHandle = document.querySelector(".panel-handle");
// 2. CAPTURAR BOTONES INTERACTIVOS Emaus
const btnOptimo = document.querySelector('[onclick="redirigir (optimo)"]');
const btnAgradecido = document.querySelector(
  '[onclick="redirigir (agradecido)"]',
);
const btnCansado = document.querySelector('[onclick="redirigir (cansado)"]');
// --- BOTONES DE VOLVER GENERALES ---
const botonesVolver = document.querySelectorAll(".btn-back-path");
botonesVolver.forEach((boton) => {
  boton.addEventListener("click", () => {
    changeScreen(screenMain);
  });
});

// --- FUNCIÓN AUXILIAR PARA CAMBIAR DE PANTALLA ---
function changeScreen(screenToShow) {
  // Ocultamos todas las pantallas sacándoles la clase 'active'
  [
    screenSplash,
    screenMain,
    screenBibleDetail,
    screenPathDetail,
    screenOptimo,
    screenCansado,
  ].forEach((screen) => {
    if (screen) {
      screen.classList.remove("active");
    }
  });
  // Mostramos solo la pantalla elegida agregándole 'active'
  screenToShow.classList.add("active");
}
// --- FUNCIÓN PARA REDIRIGIR SEGÚN EL ESTADO ---
function redirigir(estado) {
  // Aquí el programa decide a qué pantalla ir según lo que se tocó
  if (estado === "optimo") {
    changeScreen(screenOptimo);
  } else if (estado === "agradecido") {
    changeScreen(screenAgradecido);
  } else if (estado === "cansado") {
    changeScreen(screenCansado);
  }
}
// 3. ASIGNAR LOS CLICS A CADA BOTÓN (Navegación)

// De Bienvenida a la Pantalla Partida
btnEnter.addEventListener("click", () => {
  changeScreen(screenMain);
});
// --- ACTIVAR BOTONES DE ESTADO DE ÁNIMO ---
const moodButtons = document.querySelectorAll(".badge"); // Asegurate que tus botones tengan la clase 'badge'

moodButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // 1. Quitamos la clase 'active' de todos los botones para "limpiar" la selección
    moodButtons.forEach((btn) => btn.classList.remove("active"));

    // 2. Le ponemos 'active' solo al botón que acabamos de tocar
    button.classList.add("active");
  });
});
// De Pantalla Partida a Detalle de la Biblia (Bloque Superior)
btnGotoBible.addEventListener("click", () => {
  changeScreen(screenBibleDetail);
});

// De Pantalla Partida a Detalle del Camino (Bloque Inferior)
btnGotoPath.addEventListener("click", () => {
  changeScreen(screenPathDetail);
});

// Botón Volver de la Biblia a la Pantalla Partida
btnBackBible.addEventListener("click", () => {
  changeScreen(screenMain);
});

// --- INTERACTIVIDAD DEL PANEL INFERIOR (Abanico en dos niveles) ---

// Nivel 1: Abrir el panel base al tocar el versículo o la barrita
textParagraph.addEventListener("click", () => {
  studyCard.classList.toggle("hidden");
});

panelHandle.addEventListener("click", () => {
  studyCard.classList.toggle("hidden");
});

// Nivel 2: Tocar una tarjeta para abrirla en grande dejando espacio arriba
const columns = document.querySelectorAll(".fan-column");

columns.forEach((col) => {
  // Al tocar la minitarjeta
  col.addEventListener("click", (e) => {
    // Si hacemos clic en el botón de cerrar, que no ejecute la apertura
    if (e.target.classList.contains("btn-close-extended")) return;

    // Si el panel de abajo está visible, expandimos esta tarjeta
    if (!studyCard.classList.contains("hidden")) {
      col.classList.add("expanded-full");
    }
  });

  // Al tocar el botón interno "✕ Cerrar"
  const btnClose = col.querySelector(".btn-close-extended");
  btnClose.addEventListener("click", (e) => {
    e.stopPropagation(); // Evita conflictos de clics
    col.classList.remove("expanded-full");
  });
});

// --- BOTÓN VOLVER UNIVERSAL (Delegación de eventos) ---
document.addEventListener("click", (e) => {
  // Busca si el clic se hizo en un botón "volver" o dentro de él
  if (e.target.closest(".btn-back-path")) {
    changeScreen(screenMain);
  }
});
