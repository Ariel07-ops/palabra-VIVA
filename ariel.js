// 1. CAPTURAR LAS PANTALLAS
const screenSplash = document.getElementById("screen-splash");
const screenMain = document.getElementById("screen-main");
const screenBibleDetail = document.getElementById("screen-bible-detail");
const screenPathDetail = document.getElementById("screen-path-detail");
const screenOptimo = document.getElementById("screen-optimo");
const screenBendecido = document.getElementById("screen-bendecido");
const screenCansado = document.getElementById("screen-cansado");
const screenEmaus = document.getElementById("screen-emaus");
// const screenEmausContent = document.getElementById("screen-emaus-content");
const screenPromesa = document.getElementById("screen-promesa");
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
const btnBendecido = document.querySelector(
  '[onclick="redirigir (bendecido)"]',
);
const btnCansado = document.querySelector('[onclick="redirigir (cansado)"]');

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
    screenBendecido,
    screenEmaus,
    screenPromesa,
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
  } else if (estado === "bendecido") {
    changeScreen(screenBendecido);
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
      columns.forEach((c) => c.classList.remove("expanded-full")); // Cerramos cualquier otra tarjeta abierta
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

// --- BOTONES VOLVER DE LAS PANTALLAS DE ESTADO ---
const btnBackOptimo = document.querySelector("#screen-optimo .btn-back-path");
const btnBackCansado = document.querySelector("#screen-cansado .btn-back-path");
const btnBackBendecido = document.querySelector(
  "#screen-bendecido .btn-back-path",
);

if (btnBackOptimo) {
  btnBackOptimo.addEventListener("click", () => {
    changeScreen(screenPathDetail);
  });
}

if (btnBackCansado) {
  btnBackCansado.addEventListener("click", () => {
    changeScreen(screenPathDetail);
  });
}

if (btnBackBendecido) {
  btnBackBendecido.addEventListener("click", () => {
    changeScreen(screenPathDetail);
  });
}
const btnBackEmaus = document.querySelector("#screen-emaus .btn-back-path");
if (btnBackEmaus) {
  btnBackEmaus.addEventListener("click", () => {
    changeScreen(screenPathDetail);
  });
}
// Función para mostrar el contenido de cada huella del Camino de Emaús
function abrirPasoEmaus(numeroPaso) {
  const contenedorContenido = document.getElementById("contenido-paso-emaus");
  const tituloPaso = document.getElementById("titulo-paso");
  const textoBiblico = document.getElementById("texto-biblico-paso");
  const reflexionPaso = document.getElementById("reflexion-paso");

  // Mostramos el panel si estaba oculto
  contenedorContenido.classList.remove("hidden");

  // Contenido teológico y bíblico según la huella (respetando la regla de oro: texto puro + reflexión)
  if (numeroPaso === 1) {
    tituloPaso.innerText = "1. El inicio en lo oculto (La Encarnación)";
    textoBiblico.innerText =
      "«Y el Verbo se hizo carne, y habitó entre nosotros...» (Jn 1:14)";
    reflexionPaso.innerText =
      "Todo gran camino comienza en el silencio y lo oculto, como Jesús en el seno de María. En lo cotidiano más pequeño Dios ya está obrando.";
  } else if (numeroPaso === 2) {
    tituloPaso.innerText = "2. El caminar diario (Las enseñanzas)";
    textoBiblico.innerText =
      "«¿No ardía nuestro corazón en nosotros mientras nos hablaba en el camino...?» (Lc 24:32)";
    reflexionPaso.innerText =
      "Caminar con Jesús es dejar que Su Palabra ordene nuestros pasos. A veces caminamos ciegos por las preocupaciones, pero Él va a nuestro lado.";
  } else if (numeroPaso === 3) {
    tituloPaso.innerText = "3. La fracción del pan (El Sacramento)";
    textoBiblico.innerText =
      "«Y los ojos de ellos se abrieron, y le reconocieron...» (Lc 24:31)";
    reflexionPaso.innerText =
      "El punto de inflexión. Es en la Eucaristía y en el dar y compartir fraterno donde cae el velo y se revela la presencia viva del Señor.";
  } else if (numeroPaso === 4) {
    tituloPaso.innerText = "4. Hacia el Infinito (La misión sin fin)";
    textoBiblico.innerText =
      "«Y levantándose en la misma hora, volvieron a Jerusalén...» (Lc 24:33)";
    reflexionPaso.innerText =
      "El encuentro con el Resucitado no nos encierra; nos proyecta hacia la eternidad y hacia el hermano. Cada paso terrenal es ya un eco del Cielo.";
  }

  // Hacemos un pequeño scroll automático hacia el contenido para que el usuario lo vea cómodo
  contenedorContenido.scrollIntoView({ behavior: "smooth" });
}
// Función para mostrar el contenido de cada peldaño de la Escalera de la Promesa
function abrirPeldaño(numero) {
  const contenedor = document.getElementById("contenido-peldaño");
  const titulo = document.getElementById("titulo-peldaño");
  const texto = document.getElementById("texto-peldaño");

  contenedor.classList.remove("hidden");

  if (numero === 1) {
    titulo.innerText = "1. El Principio Eterno (Génesis)";
    texto.innerText =
      "«En el principio ya era el Verbo, y el Verbo estaba con Dios, y el Verbo era Dios.» La creación entera nace de este diseño de amor eterno entre el Padre y el Hijo.";
  } else if (numero === 2) {
    titulo.innerText = "2. La Sombra y el Pan Oculto (Melquisedec)";
    texto.innerText =
      "En el Antiguo Testamento, el rey Melquisedec ofrece pan y vino a Abraham (Génesis 14), anticipando de forma misteriosa el sacerdocio eterno de Cristo y la Eucaristía.";
  } else if (numero === 3) {
    titulo.innerText = "3. La Voz de los Profetas (Isaías)";
    texto.innerText =
      "Las profecías anuncian al Emmanuel ('Dios con nosotros') y al siervo que cargará con nuestras culpas, preparando el corazón de Israel para la llegada del Salvador.";
  } else if (numero === 4) {
    titulo.innerText = "4. El Sí que abre el Cielo (La Anunciación)";
    texto.innerText =
      "El arcángel Gabriel y la respuesta humilde de María en Nazaret. El Verbo empieza a latir en lo oculto de su seno, asumiendo nuestra carne frágil.";
  } else if (numero === 5) {
    titulo.innerText = "5. La Luz en la Intemperie (El Pesebre)";
    texto.innerText =
      "Dios se hace niño y nace en la pobreza de Belén. La grandeza infinita se esconde en la absoluta pequeñez para que nadie tenga miedo de acercarse.";
  } else if (numero === 6) {
    titulo.innerText = "6. Las Huellas del Maestro (Vida Pública)";
    texto.innerText =
      "Los caminos de Galilea, las parábolas, los milagros y la enseñanza profunda que sacude el corazón humano y revela el rostro misericordioso del Padre.";
  } else if (numero === 7) {
    titulo.innerText = "7. La Victoria sobre la Muerte (Pascua)";
    texto.innerText =
      "La cruz como el trono de la entrega total por amor, seguida por el sepulcro vacío. La muerte ha sido vencida y la vida se abre paso para siempre.";
  } else if (numero === 8) {
    titulo.innerText = "8. La Promesa Cumplida (Pentecostés)";
    texto.innerText =
      "Jesús asciende al Padre y desciende el fuego del Espíritu Santo sobre la Iglesia naciente, sellando la morada de Dios dentro del corazón del creyente.";
  }
}
contenedor.scrollIntoView({ behavior: "smooth" });
// funcion para cerrar panel de la escalera de la promesa
function cerrarPeldaño() {
  const contenedor = document.getElementById("contenido-peldaño");
  contenedor.classList.add("hidden");
}
