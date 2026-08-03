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
const screenNuevo = document.getElementById("screen-nuevo");
const screenPeldañoDetalle = document.getElementById("screen-peldaño-detalle");
// 2. CAPTURAR BOTONES INTERACTIVOS (Sin el btnEnter que ya no existe)
const btnGotoBible = document.getElementById("btn-goto-bible");
const btnGotoPath = document.getElementById("btn-goto-path");
const btnBackBible = document.querySelector(".btn-back");
const btnMenu = document.getElementById("btn-menu");
const menuLateral = document.getElementById("menu-lateral");
const textParagraph = document.querySelector(".interact-paragraph");
const studyCard = document.getElementById("study-card");
const panelHandle = document.querySelector(".panel-handle");
const screenEmausDetalle = document.getElementById("screen-emaus-detalle");

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
    screenNuevo,
    screenPeldañoDetalle,
    screenEmausDetalle,
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

// Función para cerrar panel de la escalera de la promesa
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
}, 4500);

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

document.addEventListener("click", (event) => {
  const menuLateral = document.getElementById("menu-lateral");
  const btnMenu = document.getElementById("btn-menu");

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

document.getElementById("link-inicio")?.addEventListener("click", (e) => {
  e.preventDefault();
  changeScreen(screenMain);
  menuLateral.classList.remove("active");
});

document.getElementById("link-biblia")?.addEventListener("click", (e) => {
  e.preventDefault();
  changeScreen(screenBibleDetail);
  menuLateral.classList.remove("active");
});

document.getElementById("link-buscar")?.addEventListener("click", (e) => {
  e.preventDefault();
  changeScreen(screenBuscar);
  menuLateral.classList.remove("active");
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

// --- BÚSQUEDA INTELIGENTE CON PAGINACIÓN INTEGRADA ---
document
  .getElementById("btn-ejecutar-busqueda")
  ?.addEventListener("click", async () => {
    const inputOriginal = document
      .getElementById("input-busqueda")
      .value.trim();
    const contenedorResultados = document.getElementById("resultados-busqueda");
    // --- PERMITIR BUSCAR CON LA TECLA ENTER DESDE LA COMPUTADORA ---
    const inputBusqueda = document.getElementById("input-busqueda");
    if (inputBusqueda) {
      inputBusqueda.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault(); // Evita comportamientos por defecto del formulario si los hubiera
          const btnBuscar = document.getElementById("btn-ejecutar-busqueda");
          if (btnBuscar) {
            btnBuscar.click(); // Simula el clic en el botón de búsqueda
          }
        }
      });
    }
    if (!inputOriginal) {
      contenedorResultados.innerHTML = `<p class="placeholder-text">Por favor, escribí algo para buscar.</p>`;
      return;
    }

    const limpiarTexto = (str) =>
      str
        .toLowerCase()
        .replace(/[áäàâã]/g, "a")
        .replace(/[éëèê]/g, "e")
        .replace(/[íïìî]/g, "i")
        .replace(/[óöòôõ]/g, "o")
        .replace(/[úüùû]/g, "u")
        .replace(/ñ/g, "n");

    // Dividimos la búsqueda en palabras individuales, descartando palabras muy cortas (como "de", "el", "a") para afinar la puntería
    const palabrasBusqueda = limpiarTexto(inputOriginal)
      .split(/\s+/)
      .filter((p) => p.length > 2);

    // Si el usuario escribió puras palabras cortas, usamos el texto completo limpio
    const terminoBusqueda = limpiarTexto(inputOriginal);

    contenedorResultados.innerHTML = `<p class="placeholder-text">Buscando en las Escrituras...</p>`;

    try {
      const respuesta = await fetch("biblia.json");
      const datos = await respuesta.json();
      let encontrados = [];

      if (datos.verses && Array.isArray(datos.verses)) {
        datos.verses.forEach((item) => {
          const textoLimpio = limpiarTexto(item.text || "");
          const libroLimpio = limpiarTexto(item.book_name || "");

          // Verificamos si contiene la frase completa O si contiene las palabras clave principales
          const coincideFraseCompleta =
            textoLimpio.includes(terminoBusqueda) ||
            libroLimpio.includes(terminoBusqueda);

          // Coincidencia inteligente: si al menos la mitad de las palabras clave están en el versículo
          const palabrasCoincidentes = palabrasBusqueda.filter((palabra) =>
            textoLimpio.includes(palabra),
          );
          const coincidePalabrasClave =
            palabrasBusqueda.length > 0 &&
            palabrasCoincidentes.length >= Math.min(palabrasBusqueda.length, 3);

          if (coincideFraseCompleta || coincidePalabrasClave) {
            encontrados.push({
              referencia: `${item.book_name} ${item.chapter}:${item.verse} (${datos.metadata?.translation || "Biblia"})`,
              texto: item.text,
            });
          }
        });
      }
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

      if (encontrados.length > 0) {
        let paginaBusquedaActual = 1;
        const porPagina = 20; // 20 resultados por página para que naveges cómodo
        const totalPaginasBusqueda = Math.ceil(encontrados.length / porPagina);

        function renderizarBloqueBusqueda() {
          const inicio = (paginaBusquedaActual - 1) * porPagina;
          const fin = paginaBusquedaActual * porPagina;
          const loteActual = encontrados.slice(inicio, fin);

          let htmlContenido = loteActual
            .map(
              (item) => `
          <div class="search-result-item" style="margin-bottom: 15px; border-bottom: 1px solid rgba(212,175,55,0.2); padding-bottom: 10px;">
            <strong style="color: var(--gold); display: block; margin-bottom: 5px;">${item.referencia}</strong>
            <p style="color: #e0e0e0; font-size: 0.95rem; line-height: 1.4;">"${item.texto}"</p>
          </div>
        `,
            )
            .join("");

          if (totalPaginasBusqueda > 1) {
            htmlContenido += `
            <div class="paginador-busqueda-interno" style="display: flex; justify-content: space-between; align-items: center; margin-top: 25px; padding: 15px 0; border-top: 1px solid var(--gold);">
              <button id="btn-ant-busqueda" style="background: rgba(212,175,55,0.1); border: 1px solid var(--gold); color: #fff; padding: 8px 14px; border-radius: 6px; cursor: pointer;" ${paginaBusquedaActual === 1 ? 'disabled style="opacity: 0.4; cursor: default;"' : ""}>⬅ Anterior</button>
              <span style="color: var(--gold); font-size: 0.85rem; text-align: center;">Pág. ${paginaBusquedaActual} / ${totalPaginasBusqueda}<br><small style="color:#aaa;">(${encontrados.length} encontrados)</small></span>
              <button id="btn-sig-busqueda" style="background: rgba(212,175,55,0.1); border: 1px solid var(--gold); color: #fff; padding: 8px 14px; border-radius: 6px; cursor: pointer;" ${paginaBusquedaActual === totalPaginasBusqueda ? 'disabled style="opacity: 0.4; cursor: default;"' : ""}>Siguiente ➡</button>
            </div>
          `;
          }

          contenedorResultados.innerHTML = htmlContenido;

          if (totalPaginasBusqueda > 1) {
            document
              .getElementById("btn-ant-busqueda")
              ?.addEventListener("click", () => {
                if (paginaBusquedaActual > 1) {
                  paginaBusquedaActual--;
                  renderizarBloqueBusqueda();
                  contenedorResultados.scrollIntoView({ behavior: "smooth" });
                }
              });

            document
              .getElementById("btn-sig-busqueda")
              ?.addEventListener("click", () => {
                if (paginaBusquedaActual < totalPaginasBusqueda) {
                  paginaBusquedaActual++;
                  renderizarBloqueBusqueda();
                  contenedorResultados.scrollIntoView({ behavior: "smooth" });
                }
              });
          }
        }

        renderizarBloqueBusqueda();
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

async function abrirAntiguoTestamento() {
  changeScreen(screenAntiguo);

  const contenedor = document.getElementById("lista-libros-antiguo");
  if (contenedor && contenedor.innerHTML.trim() === "") {
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

// Función para mostrar los capítulos y leer el libro elegido (Antiguo)
function cargarCapitulosLibro(nombreLibro, versesArray) {
  const btnVolverCapitulos = document.querySelector(
    "#screen-capitulos .btn-back",
  );
  if (btnVolverCapitulos) {
    btnVolverCapitulos.onclick = () => changeScreen(screenAntiguo);
  }

  changeScreen(screenCapitulos);

  const tituloLibro = document.getElementById("titulo-libro-seleccionado");
  const gridCapitulos = document.getElementById("grid-capitulos");
  const areaVersiculos = document.getElementById("texto-versiculos-area");

  tituloLibro.textContent = nombreLibro;
  gridCapitulos.innerHTML = "";
  areaVersiculos.innerHTML = `<em style="color: var(--gold);">Elegí un capítulo arriba para comenzar la lectura.</em>`;

  const versosLibro = versesArray.filter((v) => v.book_name === nombreLibro);
  const capitulosSet = new Set(versosLibro.map((v) => v.chapter));
  const capitulosOrdenados = Array.from(capitulosSet).sort((a, b) => a - b);

  capitulosOrdenados.forEach((numCap) => {
    const btnCap = document.createElement("button");
    btnCap.className = "btn-capitulo";
    btnCap.style.cssText =
      "background: rgba(212,175,55,0.1); border: 1px solid var(--gold); color: #fff; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-weight: bold;";
    btnCap.textContent = numCap;

    btnCap.addEventListener("click", () => {
      const btnVolverLectura = document.querySelector(
        "#screen-lectura .btn-back",
      );
      if (btnVolverLectura) {
        btnVolverLectura.onclick = () => changeScreen(screenCapitulos);
      }
      renderizarVersiculosCapitulo(nombreLibro, numCap, versosLibro);
    });

    gridCapitulos.appendChild(btnCap);
  });
}

// --- DATOS Y FUNCIONES PARA EL NUEVO TESTAMENTO ---
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

async function abrirNuevoTestamento() {
  changeScreen(screenNuevo);

  const contenedor = document.getElementById("lista-libros-nuevo");
  if (contenedor && contenedor.innerHTML.trim() === "") {
    try {
      const respuesta = await fetch("biblia.json");
      const datos = await respuesta.json();

      listaLibrosNuevo.forEach((nombreLibro) => {
        const btn = document.createElement("div");
        btn.style.cssText =
          "border: 1px solid var(--gold); border-radius: 8px; padding: 15px; text-align: center; cursor: pointer; background: rgba(255,255,255,0.05); color: #fff; font-size: 0.9rem; transition: transform 0.2s;";
        btn.innerText = nombreLibro;

        btn.addEventListener("click", () => {
          cargarCapitulosLibroNuevo(nombreLibro, datos.verses);
        });

        contenedor.appendChild(btn);
      });
    } catch (error) {
      console.error("Error al cargar los libros del Nuevo Testamento:", error);
    }
  }
}

// Función específica para los capítulos del Nuevo Testamento
function cargarCapitulosLibroNuevo(nombreLibro, versesArray) {
  const btnVolverCapitulos = document.querySelector(
    "#screen-capitulos .btn-back",
  );
  if (btnVolverCapitulos) {
    btnVolverCapitulos.onclick = () => changeScreen(screenNuevo);
  }

  changeScreen(screenCapitulos);

  const tituloLibro = document.getElementById("titulo-libro-seleccionado");
  const gridCapitulos = document.getElementById("grid-capitulos");
  const areaVersiculos = document.getElementById("texto-versiculos-area");

  tituloLibro.textContent = nombreLibro;
  gridCapitulos.innerHTML = "";
  areaVersiculos.innerHTML = `<em style="color: var(--gold);">Elegí un capítulo arriba para comenzar la lectura.</em>`;

  const versosLibro = versesArray.filter((v) => v.book_name === nombreLibro);
  const capitulosSet = new Set(versosLibro.map((v) => v.chapter));
  const capitulosOrdenados = Array.from(capitulosSet).sort((a, b) => a - b);

  capitulosOrdenados.forEach((numCap) => {
    const btnCap = document.createElement("button");
    btnCap.className = "btn-capitulo";
    btnCap.style.cssText =
      "background: rgba(212,175,55,0.1); border: 1px solid var(--gold); color: #fff; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-weight: bold;";
    btnCap.textContent = numCap;

    btnCap.addEventListener("click", () => {
      const btnVolverLectura = document.querySelector(
        "#screen-lectura .btn-back",
      );
      if (btnVolverLectura) {
        btnVolverLectura.onclick = () => changeScreen(screenCapitulos);
      }
      renderizarVersiculosCapitulo(nombreLibro, numCap, versosLibro);
    });

    gridCapitulos.appendChild(btnCap);
  });
}
// --- FUNCIÓN GENERAL PARA RENDERIZAR VERSÍCULOS CON NAVEGACIÓN DE CAPÍTULOS ---
function renderizarVersiculosCapitulo(nombreLibro, numCapitulo, versosLibro) {
  changeScreen(screenLectura);

  const tituloLectura = document.getElementById("titulo-lectura-completa");
  const areaLectura = document.getElementById("texto-lectura-final");

  tituloLectura.textContent = `${nombreLibro} - Cap. ${numCapitulo}`;

  // Obtenemos todos los capítulos disponibles de este libro ordenados numéricamente
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
    htmlVersos += `<p style="margin-bottom: 14px;"><sup style="color: var(--gold); font-weight: bold; margin-right: 8px; font-size: 0.85rem;">${v.verse}</sup>${v.text}</p>`;
  });
  htmlVersos += `</div>`;

  // Agregamos la botonera de Anterior / Siguiente al pie de la lectura
  htmlVersos += `
    <div style="max-width: 600px; margin: 30px auto 50px auto; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(212,175,55,0.3); padding-top: 20px;">
      <button id="btn-cap-anterior" style="background: rgba(212,175,55,0.1); border: 1px solid var(--gold); color: #fff; padding: 10px 16px; border-radius: 6px; cursor: pointer; font-size: 0.9rem; ${!capAnterior ? "opacity: 0.3; pointer-events: none;" : ""}">
        ⬅ Capítulo Anterior
      </button>
      <span style="color: var(--gold); font-size: 0.85rem; display: flex; align-items: center; text-align: center;">Capítulo ${numCapitulo}</span>
      <button id="btn-cap-siguiente" style="background: rgba(212,175,55,0.1); border: 1px solid var(--gold); color: #fff; padding: 10px 16px; border-radius: 6px; cursor: pointer; font-size: 0.9rem; ${!capSiguiente ? "opacity: 0.3; pointer-events: none;" : ""}">
        Capítulo Siguiente ➡
      </button>
    </div>
  `;

  if (areaLectura) areaLectura.innerHTML = htmlVersos;

  // Reactivamos los eventos de los botones de capítulos
  if (capAnterior) {
    document
      .getElementById("btn-cap-anterior")
      ?.addEventListener("click", () => {
        renderizarVersiculosCapitulo(nombreLibro, capAnterior, versosLibro);
        const mainArea = screenLectura.querySelector(".content-area") || window;
        if (mainArea.scrollTo)
          mainArea.scrollTo({ top: 0, behavior: "smooth" });
      });
  }

  if (capSiguiente) {
    document
      .getElementById("btn-cap-siguiente")
      ?.addEventListener("click", () => {
        renderizarVersiculosCapitulo(nombreLibro, capSiguiente, versosLibro);
        const mainArea = screenLectura.querySelector(".content-area") || window;
        if (mainArea.scrollTo)
          mainArea.scrollTo({ top: 0, behavior: "smooth" });
      });
  }

  const mainArea = screenLectura.querySelector(".content-area");
  if (mainArea) mainArea.scrollTop = 0;
}
function abrirPeldaño(numero) {
  // Definición de los textos, títulos e imágenes para cada peldaño
  const peldañosData = {
    1: {
      titulo: "1. El Principio Eterno (Génesis)",
      imagen: "", // Acá podés poner la ruta de tu imagen más adelante, ej: "img/genesis.jpg"
      texto:
        "Desde el principio, antes de la fundación del mundo, el Verbo ya existía en Dios. En el relato de la creación del Génesis contemplamos el designio amoroso del Padre, donde el hombre es creado a imagen y semejanza...",
    },
    2: {
      titulo: "2. La Sombra y el Pan Oculto (Melquisedec)",
      imagen: "",
      texto:
        "La figura misteriosa de Melquisedec, rey de Salem y sacerdote del Dios Altísimo, ofrece pan y vino prefigurando el sacrificio eucarístico perfecto que Cristo instituirá en la Última Cena...",
    },
    3: {
      titulo: "3. La Voz de los Profetas (Isaías)",
      imagen: "",
      texto:
        "A través de los siglos, la voz de los profetas mantuvo encendida la esperanza del pueblo. Isaías anticipa de manera luminosa al Servidor Doliente y al Emmanuel, Dios con nosotros...",
    },
    4: {
      titulo: "4. El Fiat que abre el Cielo (La Anunciación)",
      imagen: "",
      texto:
        "El 'Sí' humilde y total de la Virgen María desata el nudo de la desobediencia antigua. En su seno virginal, el Verbo se hace carne y habita entre nosotros.",
    },
    5: {
      titulo: "5. La Luz en la Intemperie (El Pesebre)",
      imagen: "",
      texto:
        "En la humildad de Belén, la luz bruelve en las tinieblas. Dios se hace frágil y pequeño para que ningún ser humano tenga miedo de acercarse a su Creador.",
    },
    6: {
      titulo: "6. Las Huellas del Maestro (Vida Pública)",
      imagen: "",
      texto:
        "Durante su vida pública, Jesús recorre los caminos de Galilea y Judea enseñando con autoridad, sanando a los enfermos y revelando el rostro misericordioso del Padre.",
    },
    7: {
      titulo: "7. La Victoria sobre la Muerte (Pascua)",
      imagen: "",
      texto:
        "A través de la Cruz y la gloriosa Resurrección, Cristo vence al pecado y a la muerte. El sepulcro vacío es la prueba definitiva de que la vida eterna nos ha sido abierta.",
    },
    8: {
      titulo: "8. La Promesa Cumplida (Pentecostés)",
      imagen: "",
      texto:
        "Con la efusión del Espíritu Santo sobre la Iglesia naciente, la promesa se consuma. Los Apóstoles salen a anunciar la Buena Nueva con valentía, guiados por el Paráclito hasta los confines de la tierra.",
    },
  };

  const datos = peldañosData[numero];
  if (!datos) return;

  // Inyectar el título
  document.getElementById("titulo-peldaño-detalle").innerText = datos.titulo;

  // Inyectar la imagen (si la hay) o limpiar el espacio
  const contenedorImg = document.getElementById("contenedor-imagen-peldaño");
  if (datos.imagen) {
    contenedorImg.innerHTML = `<img src="${datos.imagen}" alt="${datos.titulo}" style="max-width: 100%; height: auto; border-radius: 12px; border: 2px solid var(--gold);">`;
  } else {
    contenedorImg.innerHTML = ""; // Por ahora queda vacío hasta que sumemos las imágenes
  }

  // Inyectar el texto teológico/histórico
  document.getElementById("texto-peldaño-detalle").innerHTML = datos.texto;

  // Cambiar a la pantalla dedicada usando tu función existente (asegurate de pasarle el elemento o la variable de la pantalla según cómo lo manejes)
  const pantallaDetalle = document.getElementById("screen-peldaño-detalle");
  if (typeof changeScreen === "function") {
    changeScreen(pantallaDetalle);
  }
}
function abrirPasoEmaus(numero) {
  const pasosEmausData = {
    1: {
      titulo: "1. El inicio en lo oculto",
      imagen: "",
      texto:
        "Los discípulos caminan hacia Emaús con el rostro sombrío y el corazón cargado de desilusión. Jesús mismo se acerca y camina con ellos, pero sus ojos estaban retenidos para que no le reconocieran. Así camina muchas veces el Señor a nuestro lado en medio de nuestras tristezas cotidianas.",
    },
    2: {
      titulo: "2. El caminar diario",
      imagen: "",
      texto:
        "Mientras van de camino, Él les explica las Escrituras comenzando por Moisés y todos los profetas. El calor de su palabra va encendiendo lentamente el fuego en sus corazones cansados, enseñándonos que la oración y la lectura meditada de la Palabra son el sustento del peregrino.",
    },
    3: {
      titulo: "3. La fracción del pan",
      imagen: "",
      texto:
        "Al llegar a la aldea, lo imitan a quedarse y, sentado a la mesa, toma el pan, pronuncia la bendición, lo parte y se lo da. En este gesto supremo se abren sus ojos y lo reconocen. Es el misterio de la Eucaristía, centro y cumbre de nuestra vida cristiana.",
    },
    4: {
      titulo: "4. Hacia la Plenitud",
      imagen: "",
      texto:
        "Recobrada la luz y la esperanza, se levantan al instante y regresan a Jerusalén para anunciar la Buena Nueva a los hermanos: '¡El Señor ha resucitado verdaderamente!'. El camino que comenzó en la tristeza culmina en el testimonio y en la alegría desbordante del Resucitado.",
    },
  };

  const datos = pasosEmausData[numero];
  if (!datos) return;

  document.getElementById("titulo-emaus-detalle").innerText = datos.titulo;

  const contenedorImg = document.getElementById("contenedor-imagen-emaus");
  if (datos.imagen) {
    contenedorImg.innerHTML = `<img src="${datos.imagen}" alt="${datos.titulo}" style="max-width: 100%; height: auto; border-radius: 12px; border: 2px solid var(--gold);">`;
  } else {
    contenedorImg.innerHTML = "";
  }

  document.getElementById("texto-emaus-detalle").innerHTML = datos.texto;

  changeScreen(screenEmausDetalle);
}
