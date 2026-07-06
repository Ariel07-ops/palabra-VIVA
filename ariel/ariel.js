document.addEventListener("DOMContentLoaded", () => {
  // 1. CAPTURAR LAS PANTALLAS
  const screenSplash = document.getElementById("screen-splash");
  const screenMain = document.getElementById("screen-main");
  const screenBibleDetail = document.getElementById("screen-bible-detail");
  const screenPathDetail = document.getElementById("screen-path-detail");

  // 2. CAPTURAR BOTONES INTERACTIVOS
  const btnEnter = document.querySelector(".btn-enter");
  const btnGotoBible = document.getElementById("btn-goto-bible");
  const btnGotoPath = document.getElementById("btn-goto-path");
  const btnBackBible = document.querySelector(".btn-back");
  const btnBackPath = document.querySelector(".btn-back-path");

  const textParagraph = document.querySelector(".interact-paragraph");
  const studyCard = document.getElementById("study-card");
  const panelHandle = document.querySelector(".panel-handle");

  // --- FUNCIÓN AUXILIAR PARA CAMBIAR DE PANTALLA ---
  function changeScreen(screenToShow) {
    // Ocultamos todas las pantallas sacándoles la clase 'active'
    [screenSplash, screenMain, screenBibleDetail, screenPathDetail].forEach(
      (screen) => {
        screen.classList.remove("active");
      },
    );
    // Mostramos solo la pantalla elegida agregándole 'active'
    screenToShow.classList.add("active");
  }

  // 3. ASIGNAR LOS CLICS A CADA BOTÓN (Navegación)

  // De Bienvenida a la Pantalla Partida
  btnEnter.addEventListener("click", () => {
    changeScreen(screenMain);
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

  // Botón Volver del Camino a la Pantalla Partida
  btnBackPath.addEventListener("click", () => {
    changeScreen(screenMain);
  });
  // 3. ASIGNAR LOS CLICS A CADA BOTÓN (Navegación)

  // Cuando tocás el botón de "Entrar", mostramos la pantalla Principal
  btnEnter.addEventListener("click", () => {
    changeScreen(screenMain);
  });

  // Cuando tocás el botón de "Ir a la Biblia", mostramos el detalle de la Biblia
  btnGotoBible.addEventListener("click", () => {
    changeScreen(screenBibleDetail);
  });

  // Cuando tocás el botón de "Ir al Camino", mostramos el detalle del camino
  btnGotoPath.addEventListener("click", () => {
    changeScreen(screenPathDetail);
  });
  // --- ACTIVAR BOTONES DE ESTADO DE ÁNIMO ---
  const moodButtons = document.querySelectorAll(".badge");

  moodButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // 1. Quitamos la clase 'active' de todos los botones
      moodButtons.forEach((btn) => btn.classList.remove("active"));

      // 2. Le ponemos 'active' solo al que acabamos de tocar
      button.classList.add("active");

      console.log("Elegiste: " + button.innerText);
    });
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
});
