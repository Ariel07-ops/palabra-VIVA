// 1. CAPTURAR LAS PANTALLAS
const screenSplash = document.getElementById("screen-splash");
const screenMain = document.getElementById("screen-main");
const screenBibleDetail = document.getElementById("screen-bible-detail");
const screenPathDetail = document.getElementById("screen-path-detail");
const screenOptimo = document.getElementById("screen-optimo");
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

// 2. CAPTURAR BOTONES INTERACTIVOS (Sin el btnEnter que ya no existe)
const btnGotoBible = document.getElementById("btn-goto-bible");
const btnGotoPath = document.getElementById("btn-goto-path");
const btnBackBible = document.querySelector(".btn-back");
const btnMenu = document.getElementById("btn-menu");
const menuLateral = document.getElementById("menu-lateral");
const textParagraph = document.querySelector(".interact-paragraph");
const studyCard = document.getElementById("study-card");
const panelHandle = document.querySelector(".panel-handle");

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
  if (estado === "optimo") {
    changeScreen(screenOptimo);
  } else if (estado === "bendecido") {
    changeScreen(screenBendecido);
  } else if (estado === "cansado") {
    changeScreen(screenCansado);
  } else if (estado === "feliz") {
    changeScreen(screenFeliz);
  } else if (estado === "triste") {
    changeScreen(screenTriste);
  } else if (estado === "ansioso") {
    changeScreen(screenAnsioso);
  } else if (estado === "temeroso") {
    changeScreen(screenTemeroso);
  } else if (estado === "preocupado") {
    changeScreen(screenPreocupado);
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
// --- INTERACTIVIDAD DEL PANEL INFERIOR (Abanico en dos niveles) ---
if (textParagraph) {
  textParagraph.addEventListener("click", () => {
    if (studyCard) studyCard.classList.toggle("hidden");
  });
}

if (panelHandle) {
  panelHandle.addEventListener("click", () => {
    if (studyCard) studyCard.classList.toggle("hidden");
  });
}

const columns = document.querySelectorAll(".fan-column");

columns.forEach((col) => {
  col.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-close-extended")) return;

    if (!studyCard.classList.contains("hidden")) {
      columns.forEach((c) => c.classList.remove("expanded-full"));
      col.classList.add("expanded-full");
    }
  });

  const btnClose = col.querySelector(".btn-close-extended");
  btnClose.addEventListener("click", (e) => {
    e.stopPropagation();
    col.classList.remove("expanded-full");
  });
});

// --- BOTONES VOLVER DE LAS PANTALLAS DE ESTADO ---
const btnBackOptimo = document.querySelector("#screen-optimo .btn-back-path");
const btnBackCansado = document.querySelector("#screen-cansado .btn-back-path");
const btnBackBendecido = document.querySelector(
  "#screen-bendecido .btn-back-path",
);
const btnBackFeliz = document.querySelector("#screen-feliz .btn-back-path");
const btnBackTriste = document.querySelector("#screen-triste .btn-back-path");
const btnBackAnsioso = document.querySelector("#screen-ansioso .btn-back-path");
const btnBackTemeroso = document.querySelector(
  "#screen-temeroso .btn-back-path",
);
const btnBackPreocupado = document.querySelector(
  "#screen-preocupado .btn-back-path",
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
if (btnBackFeliz) {
  btnBackFeliz.addEventListener("click", () => {
    changeScreen(screenPathDetail);
  });
}
if (btnBackTriste) {
  btnBackTriste.addEventListener("click", () => {
    changeScreen(screenPathDetail);
  });
}
if (btnBackAnsioso) {
  btnBackAnsioso.addEventListener("click", () => {
    changeScreen(screenPathDetail);
  });
}
if (btnBackTemeroso) {
  btnBackTemeroso.addEventListener("click", () => {
    changeScreen(screenPathDetail);
  });
}
if (btnBackPreocupado) {
  btnBackPreocupado.addEventListener("click", () => {
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

  contenedorContenido.classList.remove("hidden");

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

  contenedor.scrollIntoView({ behavior: "smooth" });
}

// funcion para cerrar panel de la escalera de la promesa
function cerrarPeldaño() {
  const contenedor = document.getElementById("contenido-peldaño");
  contenedor.classList.add("hidden");
}

// --- TRANSICIÓN AUTOMÁTICA DEL SPLASH ---
setTimeout(() => {
  const splash = document.getElementById("screen-splash");
  const mainScreen = document.getElementById("screen-main");

  if (splash) {
    splash.style.transition = "opacity 0.8s ease";
    splash.style.opacity = "0";

    setTimeout(() => {
      splash.style.display = "none";
      if (mainScreen) {
        mainScreen.classList.add("active");
      }
    }, 800);
  }
}, 4500); // 4.5 segundos exactos

console.log(
  "Script ariel.js cargado y listo para usar funciones de Biblia y Pantallas.",
);
// Activador automático para el botón de cambio de tema
document.addEventListener("DOMContentLoaded", () => {
  const btnTheme = document.getElementById("btn-theme");
  if (btnTheme) {
    btnTheme.addEventListener("click", () => {
      document.body.classList.toggle("light-mode");
    });
  }
});
// Función para cargar y distribuir los datos del JSON en la app
async function inicializarBibliaDinamica() {
  try {
    const respuesta = await fetch("biblia.json");
    const datos = await respuesta.json();

    // 1. Inyectar versículo principal en la pantalla de detalle de la Biblia
    const textoVersiculo = document.getElementById("texto-versiculo-dinamico");
    const etiquetaVersion = document.getElementById(
      "etiqueta-version-dinamica",
    );

    if (textoVersiculo && datos.testamentos && datos.testamentos.nuevo) {
      const juanCap1 = datos.testamentos.nuevo.find((lib) => lib.id === "jn");
      if (juanCap1 && juanCap1.capitulos["1"]["14"]) {
        textoVersiculo.innerHTML = `<span class="drop-cap">Y</span> ${juanCap1.capitulos["1"]["14"]}`;
        etiquetaVersion.textContent = `${datos.version} - Juan 1:14`;
      }
    }

    // 2. Inyectar dinámicamente los textos de los estados litúrgicos desde el JSON
    if (datos.estados_liturgicos) {
      for (const [estado, info] of Object.entries(datos.estados_liturgicos)) {
        const elementoCita = document.getElementById(`cita-${estado}`);
        if (elementoCita) {
          elementoCita.innerHTML = `<strong>${info.cita}:</strong> ${info.texto}`;
        }
      }
    }

    console.log("Biblia y estados cargados correctamente desde el JSON.");
  } catch (error) {
    console.error("No se pudo cargar el archivo biblia.json:", error);
  }
}
if (btnMenu && menuLateral) {
  btnMenu.addEventListener("click", () => {
    menuLateral.classList.toggle("active");
  });
}
// Cerrar el menú si se hace clic fuera de él
document.addEventListener("click", (event) => {
  const menuLateral = document.getElementById("menu-lateral");
  const btnMenu = document.getElementById("btn-menu");

  // Si el menú está abierto, y el click NO fue ni en el menú ni en el botón de abrir...
  if (
    menuLateral.classList.contains("active") &&
    !menuLateral.contains(event.target) &&
    !btnMenu.contains(event.target)
  ) {
    menuLateral.classList.remove("active");
  }
});
// Conectamos y damos función directamente abajo de todo
document.getElementById("link-inicio")?.addEventListener("click", (e) => {
  e.preventDefault();
  changeScreen(screenMain);
  menuLateral.classList.remove("active"); // <--- Cierra el menú
});

document.getElementById("link-biblia")?.addEventListener("click", (e) => {
  e.preventDefault();
  changeScreen(screenBibleDetail);
  menuLateral.classList.remove("active"); // <--- Cierra el menú
});

document.getElementById("link-buscar")?.addEventListener("click", (e) => {
  e.preventDefault();
  changeScreen(screenBuscar);
  menuLateral.classList.remove("active"); // <--- Cierra el menú
});

document.getElementById("link-idioma")?.addEventListener("click", (e) => {
  e.preventDefault();
  alert("Próximamente: Selector de idioma.");
  menuLateral.classList.remove("active");
});

document.getElementById("link-sugerir")?.addEventListener("click", (e) => {
  e.preventDefault();
  alert("Próximamente: Sugerir enlaces.");
  menuLateral.classList.remove("active");
});

// --- BÚSQUEDA INTELIGENTE Y TOLERANTE A TILDES / MAYÚSCULAS ---
document
  .getElementById("btn-ejecutar-busqueda")
  ?.addEventListener("click", async () => {
    const inputOriginal = document
      .getElementById("input-busqueda")
      .value.trim();
    const contenedorResultados = document.getElementById("resultados-busqueda");

    if (!inputOriginal) {
      contenedorResultados.innerHTML = `<p class="placeholder-text">Por favor, escribí algo para buscar.</p>`;
      return;
    }

    // Función auxiliar para "limpiar" texto: quita tildes/diacríticos y pasa a minúsculas
    const limpiarTexto = (str) =>
      str
        .toLowerCase()
        .replace(/[áäàâã]/g, "a")
        .replace(/[éëèê]/g, "e")
        .replace(/[íïìî]/g, "i")
        .replace(/[óöòôõ]/g, "o")
        .replace(/[úüùû]/g, "u")
        .replace(/ñ/g, "n");
    const terminoBusqueda = limpiarTexto(inputOriginal);

    contenedorResultados.innerHTML = `<p class="placeholder-text">Buscando en las Escrituras...</p>`;

    try {
      const respuesta = await fetch("biblia.json");
      const datos = await respuesta.json();
      let encontrados = [];

      // 1. Buscamos en el arreglo "verses" de la BLP
      if (datos.verses && Array.isArray(datos.verses)) {
        datos.verses.forEach((item) => {
          const textoLimpio = limpiarTexto(item.text || "");
          const libroLimpio = limpiarTexto(item.book_name || "");

          if (
            textoLimpio.includes(terminoBusqueda) ||
            libroLimpio.includes(terminoBusqueda)
          ) {
            encontrados.push({
              referencia: `${item.book_name} ${item.chapter}:${item.verse} (${datos.metadata?.translation || "Biblia"})`,
              texto: item.text,
            });
          }
        });
      }

      // 2. Buscamos también en los estados litúrgicos
      if (datos.estados_liturgicos) {
        Object.entries(datos.estados_liturgicos).forEach(([estado, info]) => {
          const textoEstado = limpiarTexto(info.texto || "");
          const citaEstado = limpiarTexto(info.cita || "");
          const nombreEstado = limpiarTexto(estado);

          if (
            textoEstado.includes(terminoBusqueda) ||
            citaEstado.includes(terminoBusqueda) ||
            nombreEstado.includes(terminoBusqueda)
          ) {
            encontrados.push({
              referencia: `Camino de Emaús (${estado.toUpperCase()}): ${info.cita}`,
              texto: info.texto,
            });
          }
        });
      }

      // 3. Renderizamos resultados
      if (encontrados.length > 0) {
        const resultadosLimitados = encontrados.slice(0, 100);
        contenedorResultados.innerHTML = resultadosLimitados
          .map(
            (item) => `
        <div class="search-result-item" style="margin-bottom: 15px; border-bottom: 1px solid rgba(212,175,55,0.2); padding-bottom: 10px;">
          <strong style="color: var(--gold); display: block; margin-bottom: 5px;">${item.referencia}</strong>
          <p style="color: #e0e0e0; font-size: 0.95rem; line-height: 1.4;">"${item.texto}"</p>
        </div>
      `,
          )
          .join("");

        if (encontrados.length > 100) {
          contenedorResultados.innerHTML += `<p style="text-align: center; color: var(--gold); font-size: 0.85rem; margin-top: 10px;">Mostrando los primeros 100 resultados de ${encontrados.length} encontrados.</p>`;
        }
      } else {
        contenedorResultados.innerHTML = `
        <div style="text-align: center; padding: 10px;">
          <p style="color: #d4af37; font-weight: bold; margin-bottom: 5px;">Sin resultados</p>
          <p class="placeholder-text">No se encontraron pasajes con el término "${inputOriginal}".</p>
        </div>`;
      }
    } catch (error) {
      console.error("Error en la búsqueda:", error);
      contenedorResultados.innerHTML = `<p class="placeholder-text" style="color: #e34234;">Ocurrió un error al realizar la búsqueda.</p>`;
    }
  });
// --- NUEVAS FUNCIONES DE NAVEGACIÓN PARA LA PANTALLA 3A ---
function abrirAntiguoTestamento() {
  console.log("Abriendo la pantalla de libros del Antiguo Testamento...");
  // Acá vamos a conectar la pantalla dedicada del Antiguo Testamento
}

function abrirNuevoTestamento() {
  console.log("Abriendo la pantalla de libros del Nuevo Testamento...");
  // Acá vamos a conectar la pantalla dedicada del Nuevo Testamento
}
// --- DATOS Y FUNCIONES PARA EL ANTIGUO TESTAMENTO ---
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

function abrirAntiguoTestamento() {
  // 1. Cambiamos a la pantalla del Antiguo Testamento
  changeScreen(screenAntiguo);

  // 2. Cargamos los libros si el contenedor está vacío
  const contenedor = document.getElementById("lista-libros-antiguo");
  if (contenedor.innerHTML.trim() === "") {
    listaLibrosAntiguo.forEach((libro) => {
      const btn = document.createElement("div");
      // Le damos un diseño en grilla tipo tarjetas
      btn.style.cssText =
        "border: 1px solid var(--gold); border-radius: 8px; padding: 15px; text-align: center; cursor: pointer; background: rgba(255,255,255,0.05); color: #fff; font-size: 0.9rem; transition: transform 0.2s;";
      btn.innerText = libro;

      // Qué pasa al hacer clic en un libro
      btn.addEventListener("click", () => {
        console.log("Elegiste el libro:", libro);
        // Acá luego abriremos la pantalla de capítulos
      });

      contenedor.appendChild(btn);
    });
  }
}
async function abrirAntiguoTestamento() {
  changeScreen(screenAntiguo);

  const contenedor = document.getElementById("lista-libros-antiguo");
  if (contenedor.innerHTML.trim() === "") {
    try {
      const respuesta = await fetch("biblia.json");
      const datos = await respuesta.json();

      listaLibrosAntiguo.forEach((nombreLibro) => {
        const btn = document.createElement("div");
        btn.style.cssText =
          "border: 1px solid var(--gold); border-radius: 8px; padding: 15px; text-align: center; cursor: pointer; background: rgba(255,255,255,0.05); color: #fff; font-size: 0.9rem; transition: transform 0.2s;";
        btn.innerText = nombreLibro;

        btn.addEventListener("click", () => {
          cargarCapitulosLibro(nombreLibro, datos.verses);
        });

        contenedor.appendChild(btn);
      });
    } catch (error) {
      console.error(
        "Error al cargar los libros del Antiguo Testamento:",
        error,
      );
    }
  }
}

// Función para mostrar los capítulos y leer el libro elegido
function cargarCapitulosLibro(nombreLibro, versesArray) {
  changeScreen(screenCapitulos);

  const tituloLibro = document.getElementById("titulo-libro-seleccionado");
  const gridCapitulos = document.getElementById("grid-capitulos");
  const areaVersiculos = document.getElementById("texto-versiculos-area");

  tituloLibro.textContent = nombreLibro;
  gridCapitulos.innerHTML = "";
  areaVersiculos.innerHTML = `<em style="color: var(--gold);">Elegí un capítulo arriba para comenzar la lectura.</em>`;

  // Filtramos los versículos que pertenecen a este libro
  const versosLibro = versesArray.filter((v) => v.book_name === nombreLibro);

  // Averiguamos cuáles son los capítulos disponibles de forma única y ordenada
  const capitulosSet = new Set(versosLibro.map((v) => v.chapter));
  const capitulosOrdenados = Array.from(capitulosSet).sort((a, b) => a - b);

  // Creamos un botoncito por cada capítulo
  capitulosOrdenados.forEach((numCap) => {
    const btnCap = document.createElement("button");
    btnCap.className = "btn-capitulo";
    btnCap.style.cssText =
      "background: rgba(212,175,55,0.1); border: 1px solid var(--gold); color: #fff; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-weight: bold;";
    btnCap.textContent = numCap;

    btnCap.addEventListener("click", () => {
      renderizarVersiculosCapitulo(nombreLibro, numCap, versosLibro);
    });

    gridCapitulos.appendChild(btnCap);
  });
}
// Función para volcar los versículos en la nueva pantalla dedicada a la lectura
function renderizarVersiculosCapitulo(nombreLibro, numCapitulo, versosLibro) {
  // 1. Cambiamos a la pantalla de lectura dedicada
  changeScreen(screenLectura);

  const tituloLectura = document.getElementById("titulo-lectura-completa");
  const areaLectura = document.getElementById("texto-lectura-final");

  // Título claro arriba
  tituloLectura.textContent = `${nombreLibro} - Cap. ${numCapitulo}`;

  // Filtramos y ordenamos los versículos
  const versosFiltrados = versosLibro.filter((v) => v.chapter === numCapitulo);
  versosFiltrados.sort((a, b) => a.verse - b.verse);

  let htmlVersos = `<div style="max-width: 600px; margin: 0 auto; padding-bottom: 40px;">`;
  versosFiltrados.forEach((v) => {
    htmlVersos += `<p style="margin-bottom: 14px;"><sup style="color: var(--gold); font-weight: bold; margin-right: 8px; font-size: 0.85rem;">${v.verse}</sup>${v.text}</p>`;
  });
  htmlVersos += `</div>`;

  areaLectura.innerHTML = htmlVersos;

  // Subimos el scroll arriba de todo en la nueva pantalla
  const mainArea = screenLectura.querySelector(".content-area");
  if (mainArea) mainArea.scrollTop = 0;
}
