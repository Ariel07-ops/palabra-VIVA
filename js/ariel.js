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
const btnGotoPath = document.getElementById("btn-goto-path");
const btnBackBible = document.querySelector(".btn-back");
const btnMenu = document.getElementById("btn-menu");
const menuLateral = document.getElementById("menu-lateral");
const textParagraph = document.querySelector(".interact-paragraph");
const studyCard = document.getElementById("study-card");
const panelHandle = document.querySelector(".panel-handle");
const btnVolverAcerca = document.getElementById("btn-volver-acerca");
const linkAsistente = document.getElementById("link-asistente");
const btnMic = document.getElementById("btnMic");

// --- VARIABLE GLOBAL PARA EL BUSCADOR ---
let resultadosBusquedaActuales = [];

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

// --- FUNCIONES DE DETALLE PARA EMAÚS Y PROMESA ---
async function abrirPasoEmaus(numero) {
  try {
    const respuesta = await fetch("data/camino.json");
    const datosJson = await respuesta.json();
    const datos = datosJson.pasos.find((p) => p.id === parseInt(numero));

    if (!datos) return;

    // Inyectamos cada cosa en su lugar correspondiente en los pasos de Inicia tu recorrido
    document.getElementById("titulo-emaus-detalle").innerHTML = datos.titulo;
    document.getElementById("texto-emaus-detalle").innerHTML = datos.texto;
    document.getElementById("caminar-emaus-detalle").innerHTML =
      "Caminar: " + datos.caminar;
    document.getElementById("reflexion-emaus-detalle").innerHTML =
      "Reflexión: " + datos.reflexion;

    changeScreen(screenEmausDetalle);
  } catch (error) {
    console.error("Error al cargar datos:", error);
  }
}

function abrirPeldaño(numero) {
  const peldañosData = {
    1: {
      titulo: "1. El Principio Eterno (Génesis)",
      texto:
        "Desde el principio, antes de la fundación del mundo, el Verbo ya existía en Dios. En el relato de la creación del Génesis contemplamos el designio amoroso del Padre, donde el hombre es creado a imagen y semejanza...",
    },
    2: {
      titulo: "2. La Sombra y el Pan Oculto (Melquisedec)",
      texto:
        "La figura misteriosa de Melquisedec, rey de Salem y sacerdote del Dios Altísimo, ofrece pan y vino prefigurando el sacrificio eucarístico perfecto que Cristo instituirá en la Última Cena...",
    },
    3: {
      titulo: "3. La Voz de los Profetas (Isaías)",
      texto:
        "A través de los siglos, la voz de los profetas mantuvo encendida la esperanza del pueblo. Isaías anticipa de manera luminosa al Servidor Doliente y al Emmanuel, Dios con nosotros...",
    },
    4: {
      titulo: "4. El Fiat que abre el Cielo (La Anunciación)",
      texto:
        "El 'Sí' humilde y total de la Virgen María desata el nudo de la desobediencia antigua. En su seno virginal, el Verbo se hace carne y habita entre nosotros.",
    },
    5: {
      titulo: "5. La Luz en la Intemperie (El Pesebre)",
      texto:
        "En la humildad de Belén, la luz brota en las tinieblas. Dios se hace frágil y pequeño para que ningún ser humano tenga miedo de acercarse a su Creador.",
    },
    6: {
      titulo: "6. Las Huellas del Maestro (Vida Pública)",
      texto:
        "Durante su vida pública, Jesús recorre los caminos de Galilea y Judea enseñando con autoridad, sanando a los enfermos y revelando el rostro misericordioso del Padre.",
    },
    7: {
      titulo: "7. La Victoria sobre la Muerte (Pascua)",
      texto:
        "A través de la Cruz y la gloriosa Resurrección, Cristo vence al pecado y a la muerte. El sepulcro vacío es la prueba definitiva de que la vida eterna nos ha sido abierta.",
    },
    8: {
      titulo: "8. La Promesa Cumplida (Pentecostés)",
      texto:
        "Con la efusión del Espíritu Santo sobre la Iglesia naciente, la promesa se consuma. Los Apóstoles salen a anunciar la Buena Nueva con valentía, guiados por el Paráclito hasta los confines de la tierra.",
    },
  };

  const datos = peldañosData[numero];
  if (!datos) return;

  document.getElementById("titulo-peldaño-detalle").innerText = datos.titulo;
  document.getElementById("texto-peldaño-detalle").innerHTML = datos.texto;
  changeScreen(screenPeldañoDetalle);
}

// --- TRANSICIÓN AUTOMÁTICA DEL SPLASH ---
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

// --- INICIALIZACIÓN GENERAL DE LA APP ---
document.addEventListener("DOMContentLoaded", () => {
  // 1. Cambio de Tema (Luminoso / Oscuro)
  // 1. Cambio de Tema (Luminoso / Oscuro)
  const btnTheme = document.getElementById("btn-theme");
  if (btnTheme) {
    btnTheme.addEventListener("click", () => {
      // --- LIMPIEZA DE SEPIA AL TOCAR EL BOTÓN DE ARRIBA ---
      document.body.classList.remove("modo-sepia");
      document.documentElement.classList.remove("modo-sepia");

      const indicador = document.getElementById("indicador-sepia");
      if (indicador) {
        indicador.style.display = "none";
      }
      // ----------------------------------------------------

      // Tu código original que cambia el modo normal/claro
      document.body.classList.toggle("light-mode");
    });
  }

  // Referencias comunes del menú lateral
  const btnMenu = document.getElementById("btn-menu");
  const menuLateral = document.getElementById("menu-lateral");

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

  document
    .getElementById("link-herramientas")
    .addEventListener("click", (e) => {
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
});
// --- BÚSQUEDA INTELIGENTE CON ENTER Y PAGINACIÓN ---
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

    const limpiarTexto = (str) =>
      str
        .toLowerCase()
        .replace(/[áäàâã]/g, "a")
        .replace(/[éëèê]/g, "e")
        .replace(/[íïìî]/g, "i")
        .replace(/[óöòôõ]/g, "o")
        .replace(/[úüùû]/g, "u")
        .replace(/ñ/g, "n");

    const palabrasBusqueda = limpiarTexto(inputOriginal)
      .split(/\s+/)
      .filter((p) => p.length > 2);
    const terminoBusqueda = limpiarTexto(inputOriginal);

    contenedorResultados.innerHTML = `<p class="placeholder-text">Buscando en las Escrituras...</p>`;

    try {
      const respuesta = await fetch("data/biblia.json");
      const datos = await respuesta.json();
      let encontrados = [];

      if (datos.verses && Array.isArray(datos.verses)) {
        const inputLimpio = limpiarTexto(inputOriginal);

        // Detectamos si es una cita con versículo (ej: 1:1) o un capítulo entero (ej: Mateo 1)
        const esCitaConVersiculo = /\d+[:\s]\d+/.test(inputOriginal);

        datos.verses.forEach((item) => {
          const textoLimpio = limpiarTexto(item.text || "");
          const libroLimpioItem = limpiarTexto(item.book_name || "");

          // Verificamos si el input menciona este libro
          const coincideLibro = inputLimpio.includes(libroLimpioItem);
          const esCapituloEntero = coincideLibro && /\d+$/.test(inputLimpio);

          if (esCitaConVersiculo) {
            // Lógica para Versículo Específico (ej: Juan 3:16)
            const coincideCapitulo = inputLimpio.includes(
              item.chapter.toString(),
            );
            const coincideVersiculo = inputLimpio.includes(
              item.verse.toString(),
            );

            if (coincideLibro && coincideCapitulo && coincideVersiculo) {
              encontrados.push({
                referencia: `${item.book_name} ${item.chapter}:${item.verse} (${datos.metadata?.translation || "Biblia"})`,
                texto: item.text,
              });
            }
          } else if (esCapituloEntero) {
            // Lógica para Capítulo Entero (ej: Mateo 1)
            const numeroCapituloBuscado = inputLimpio.replace(/\D/g, "");

            if (item.chapter.toString() === numeroCapituloBuscado) {
              encontrados.push({
                referencia: `${item.book_name} ${item.chapter}:${item.verse} (${datos.metadata?.translation || "Biblia"})`,
                texto: item.text,
              });
            }
          } else {
            // Lógica original para Búsqueda por Palabras
            const coincideFraseCompleta =
              textoLimpio.includes(terminoBusqueda) ||
              libroLimpioItem.includes(terminoBusqueda);
            const palabrasCoincidentes = palabrasBusqueda.filter((palabra) =>
              textoLimpio.includes(palabra),
            );
            const coincidePalabrasClave =
              palabrasBusqueda.length > 0 &&
              palabrasCoincidentes.length >=
                Math.min(palabrasBusqueda.length, 3);

            if (coincideFraseCompleta || coincidePalabrasClave) {
              encontrados.push({
                referencia: `${item.book_name} ${item.chapter}:${item.verse} (${datos.metadata?.translation || "Biblia"})`,
                texto: item.text,
              });
            }
          }
        });
      }

      if (encontrados.length > 0) {
        let paginaBusquedaActual = 1;
        const porPagina = 20;
        const totalPaginasBusqueda = Math.ceil(encontrados.length / porPagina);

        function renderizarBloqueBusqueda() {
          const inicio = (paginaBusquedaActual - 1) * porPagina;
          const fin = paginaBusquedaActual * porPagina;
          const loteActual = encontrados.slice(inicio, fin);

          // Guardamos los resultados globales para usarlos al hacer clic
          resultadosBusquedaActuales = encontrados;

          let htmlContenido = loteActual
            .map(
              (item, index) => `
        <div class="search-result-item" onclick='abrirResultadoPorIndice(${(paginaBusquedaActual - 1) * porPagina + index})' style="margin-bottom: 15px; border-bottom: 1px solid rgba(212,175,55,0.2); padding-bottom: 10px; cursor: pointer;">
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

// aca esta el motor de audio
function ejecutarLecturaVoz() {
  if (!("speechSynthesis" in window)) {
    alert("Tu dispositivo no soporta la síntesis de voz.");
    return;
  }

  const btnAudio = document.getElementById("btn-hablar-lectura");
  const areaLecturaFinal = document.getElementById("texto-lectura-final");

  if (!areaLecturaFinal) return;

  if (estaReproduciendo) {
    window.speechSynthesis.cancel();
    estaReproduciendo = false;
    if (btnAudio)
      btnAudio.innerHTML = '<i class="fas fa-volume-up"></i> Escuchar';
    return;
  }

  // 1. Hacemos el clon y barremos con elementos que puedan ensuciar
  const clone = areaLecturaFinal.cloneNode(true);
  clone.querySelectorAll("sup").forEach((sup) => sup.remove());
  clone.querySelectorAll("h1, h2, h3").forEach((el) => el.remove());
  clone
    .querySelectorAll(".filologia, .caja-filologica, ins, u")
    .forEach((el) => {
      el.remove();
    });

  // 2. Limpieza de fuerza bruta: solo dejamos letras, números y puntuación básica
  let textoLimpio = clone.innerText
    .replace(/[^\w\sáéíóúÁÉÍÓÚüÜñÑ.,!?;]/g, "") // Borra cualquier carácter extraño invisible
    .replace(/\n/g, " ") // Reemplazar saltos de línea por espacios
    .replace(/\s+/g, " ") // Normalizar espacios múltiples
    .trim();

  // 3. Seguridad por si el capítulo es demasiado largo para el buffer del celu
  if (textoLimpio.length > 4000) {
    console.log("Capítulo muy largo, recortando por seguridad...");
    textoLimpio = textoLimpio.substring(0, 4000);
  }

  if (!textoLimpio) {
    console.log("El texto quedó vacío después de la limpieza.");
    return;
  }

  // 4. Forzar reseteo total y despertar el motor de voz de Android
  window.speechSynthesis.cancel();

  const despertar = new SpeechSynthesisUtterance("");
  window.speechSynthesis.speak(despertar);
  window.speechSynthesis.cancel();

  // 5. Discurso real con retraso de seguridad
  setTimeout(() => {
    utteranceActual = new SpeechSynthesisUtterance(textoLimpio);
    utteranceActual.lang = "es-ES";
    utteranceActual.rate = 0.95;

    utteranceActual.onstart = () => {
      console.log("La síntesis empezó a hablar");
    };

    utteranceActual.onend = () => {
      estaReproduciendo = false;
      if (btnAudio)
        btnAudio.innerHTML = '<i class="fas fa-volume-up"></i> Escuchar';
    };

    utteranceActual.onerror = (e) => {
      console.error("Error nativo de voz en celu:", e);
      estaReproduciendo = false;
      if (btnAudio)
        btnAudio.innerHTML = '<i class="fas fa-volume-up"></i> Escuchar';
    };

    estaReproduciendo = true;
    if (btnAudio) btnAudio.innerHTML = '<i class="fas fa-stop"></i> Detener';

    window.speechSynthesis.speak(utteranceActual);
  }, 300);
}

// --- INTERACTIVIDAD DEL PANEL INFERIOR ---
const fanColumns = document.querySelectorAll(".fan-column");

if (panelHandle) {
  panelHandle.addEventListener("click", () => {
    if (studyCard) {
      studyCard.classList.add("hidden");
      if (typeof window.restaurarLecturaNormal === "function") {
        window.restaurarLecturaNormal();
      }
    }
  });
}

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
          el.style.borderBottom = "1px solid rgba(150, 150, 150, 0.3)";
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
            "1px solid rgba(150, 150, 150, 0.3)";
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

// --- INYECTOR MAESTRO DE ESTADOS DESDE Estados.json ---
async function cargarEstadoAnimo(nombreEstado) {
  try {
    const respuesta = await fetch("data/estados.json");
    const data = await respuesta.json();
    let estadosArray = data.estados[nombreEstado];

    if (!estadosArray || estadosArray.length === 0) return;

    // 1. Obtener fecha de hoy (formato: "2026-08-16")
    const hoy = new Date().toISOString().split("T")[0];

    // 2. Recuperar progreso del localStorage
    let progreso = JSON.parse(
      localStorage.getItem(`progreso_${nombreEstado}`),
    ) || { dia: 0, fecha: "" };

    // 3. Lógica: ¿Es un día nuevo?
    if (progreso.fecha !== hoy) {
      progreso.dia = (progreso.dia + 1) % estadosArray.length;
      progreso.fecha = hoy;
      localStorage.setItem(
        `progreso_${nombreEstado}`,
        JSON.stringify(progreso),
      );
    }

    const datosEstado = estadosArray[progreso.dia];

    // ... (El resto de la inyección sigue igual, no lo toques)
    const pantalla = document.getElementById(`screen-${nombreEstado}`);
    if (!pantalla) return;

    // Inyección de datos
    const elTitulo = pantalla.querySelector(".titulo-estado");
    if (elTitulo)
      elTitulo.textContent = `Pantalla: ${nombreEstado.charAt(0).toUpperCase() + nombreEstado.slice(1)}`;

    // ... [Aquí va todo tu código de elAcogida, elRef, etc., igual que antes]
    const elAcogida = pantalla.querySelector(".acogida-estado");
    if (elAcogida && datosEstado.acogida)
      elAcogida.textContent = datosEstado.acogida;

    const elRef = pantalla.querySelector(".evangelio-referencia");
    if (elRef && datosEstado.evangelio?.referencia)
      elRef.textContent = datosEstado.evangelio.referencia;

    const elTxt = pantalla.querySelector(".evangelio-texto");
    if (elTxt && datosEstado.evangelio?.texto)
      elTxt.textContent = datosEstado.evangelio.texto;

    const elMed = pantalla.querySelector(".evangelio-meditacion");
    if (elMed && datosEstado.evangelio?.meditacion)
      elMed.textContent = datosEstado.evangelio.meditacion;

    const elOracion = pantalla.querySelector(".oracion-texto");
    if (elOracion && datosEstado.oracion)
      elOracion.textContent = datosEstado.oracion;

    const elSanto = pantalla.querySelector(".santo-nombre");
    if (elSanto && datosEstado.companero_de_camino?.santo)
      elSanto.textContent = datosEstado.companero_de_camino.santo;

    const elRec = pantalla.querySelector(".santo-recomendacion");
    if (elRec && datosEstado.companero_de_camino?.recomendacion)
      elRec.textContent = datosEstado.companero_de_camino.recomendacion;

    const elPaso = pantalla.querySelector(".paso-hoy-texto");
    if (elPaso && datosEstado.paso_de_hoy)
      elPaso.textContent = datosEstado.paso_de_hoy;
  } catch (error) {
    console.error("Error al inyectar los datos del estado:", error);
  }
}

// funcion idiomas
function cambiarIdioma(lang) {
  const elementosTraducibles = document.querySelectorAll("[data-es][data-en]");

  elementosTraducibles.forEach((el) => {
    if (lang === "en") {
      el.innerText = el.getAttribute("data-en");
    } else {
      el.innerText = el.getAttribute("data-es");
    }
  });

  const botonesIdioma = document.querySelectorAll("#screen-idioma button");
  botonesIdioma.forEach((btn) => btn.classList.remove("active"));
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
function alternarSepia() {
  const body = document.body;
  const htmlTag = document.documentElement;
  const indicador = document.getElementById("indicador-sepia");

  // Alternamos la clase sepia
  body.classList.toggle("modo-sepia");
  htmlTag.classList.toggle("modo-sepia");

  // Si el elemento indicador existe, mostramos u ocultamos el cartelito
  if (indicador) {
    if (body.classList.contains("modo-sepia")) {
      indicador.style.display = "inline-block";
    } else {
      indicador.style.display = "none";
    }
  }

  // Cerramos el modal de forma segura
  if (typeof cerrarModalHerramientas === "function") {
    cerrarModalHerramientas();
  }
}
document.querySelectorAll("#btn-goto-bible, #btn-goto-path").forEach((el) => {
  el.style.setProperty("background-color", "#f4ebd0", "important");
  el.style.setProperty("color", "#4b3621", "important");
});
let tamanoActual = 18;

function actualizarIndicadorVisual() {
  const indicador = document.getElementById("indicador-tamano");
  if (indicador) {
    indicador.innerText = tamanoActual + "px";
  }
}

function cambiarTamanio(delta) {
  const areaLectura = document.getElementById("texto-lectura-final");
  if (!areaLectura) return;

  // Sumamos o restamos (2 o -2), manteniendo límites seguros entre 14px y 30px
  tamanoActual = Math.max(14, Math.min(30, tamanoActual + delta));

  areaLectura.style.fontSize = tamanoActual + "px";
  localStorage.setItem("tamanoLetra", tamanoActual);

  // Actualizamos el numerito en pantalla al instante
  actualizarIndicadorVisual();
}

// Al cargar la página, aplicamos el tamaño guardado y seteamos el número correcto
window.addEventListener("DOMContentLoaded", () => {
  const guardado = localStorage.getItem("tamanoLetra");
  if (guardado) {
    tamanoActual = parseInt(guardado);
    const areaLectura = document.getElementById("texto-lectura-final");
    if (areaLectura) areaLectura.style.fontSize = tamanoActual + "px";
  }
  actualizarIndicadorVisual();
});
function actualizarIndicadorVisual() {
  // 1. Actualizamos el nuevo indicador de la barra (el que dice A+ / A-)
  const indicadorFijo = document.getElementById("indicador-estatus-letra");
  const textoEstado = document.getElementById("texto-estado");
  const valorEstado = document.getElementById("valor-estado");

  // 2. Actualizamos el del medio (el que dice "18px" o similar dentro del modal)
  const indicadorModal = document.getElementById("indicador-tamano");

  // Lógica para el cartelito de la barra (A+ / A-)
  if (indicadorFijo) {
    if (tamanoActual === 18) {
      indicadorFijo.style.display = "none";
    } else {
      indicadorFijo.style.display = "inline-block";
      textoEstado.innerText = tamanoActual > 18 ? "A+" : "A-";
      valorEstado.innerText = tamanoActual + "px";
    }
  }

  // Lógica para el numerito del medio en el modal
  if (indicadorModal) {
    indicadorModal.innerText = tamanoActual + "px";
  }
}
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
// Acá está la función para conectar el asistente o el chatbot
if (linkAsistente) {
  linkAsistente.addEventListener("click", (e) => {
    e.preventDefault();
    changeScreen(screenAsistente);
    menuLateral?.classList.remove("active");
  });
}
// Variable para recordar el último tema conversado 🧠
let ultimoTema = null;
// Bandera para saber si el asistente está esperando el nombre del usuario
let esperandoNombre = false;

// Función asincrónica para procesar el mensaje con soporte local y externo
async function procesarMensaje(texto, contenedorMensajes) {
  const t = texto.toLowerCase();

  // 0. Capturar el nombre si el asistente lo estaba pidiendo 💾
  if (esperandoNombre) {
    // Limpiamos el texto eliminando palabras comunes al inicio
    const nombreLimpio = texto
      .replace(/^(soy|me llamo|mi nombre es)\s+/i, "")
      .trim();

    // Verificamos que realmente haya quedado texto después de limpiar
    if (nombreLimpio.length > 0) {
      localStorage.setItem("nombrePalabraViva", nombreLimpio);
      esperandoNombre = false;
      return `¡Mucho gusto, ${nombreLimpio}! Ya te tengo anotado. ¿En qué te puedo ayudar hoy con Palabra Viva? 🌟`;
    }
  }

  // 1. Saludos comunes 👋
  if (t === "hola" || t === "buenos días" || t === "buenas") {
    return "¡Hola! Qué bueno encontrarte por aquí. Estoy para ayudarte a explorar Palabra Viva 📱. ¿Qué te gustaría saber?";
  }

  // 2. Comprobar respuestas afirmativas cortas ("sí", "si", etc.)
  if (t === "sí" || t === "si" || t === "por favor" || t === "claro") {
    if (ultimoTema === "biblia") {
      ultimoTema = null;
      return "¡Excelente! Al tocar un versículo subrayado podrás ver el origen de las palabras, el contexto social y notas formativas. ¿Te gustaría saber algo más?";
    } else if (ultimoTema === "menu") {
      ultimoTema = null;
      return "Perfecto. En el menú lateral también puedes cambiar el idioma y sugerir enlaces recomendados. ¿Hay otra herramienta que quieras explorar?";
    }
    return "¿Sobre qué sección específica de la aplicación te gustaría saber más?";
  }

  // 3. Evaluaciones locales rápidas ⚡
  if (
    t.includes("para qué sirve") ||
    t.includes("qué puedo hacer") ||
    t.includes("programa") ||
    t.includes("palabra viva")
  ) {
    ultimoTema = "programa";
    return "Palabra Viva es un programa diseñado para acompañar tanto el estudio de la Sagrada Escritura 📖 como el desarrollo de tu camino espiritual personal 🌟. ¿Sobre qué sección te gustaría saber más?";
  } else if (
    t.includes("menu") ||
    t.includes("rayitas") ||
    t.includes("opciones")
  ) {
    ultimoTema = "menu";
    return "En la barra superior encontrarás tres rayitas 📱 que abren la barra lateral con todas las herramientas de la app. ¿Te gustaría saber más sobre alguna de ellas?";
  } else if (
    t.includes("biblia") ||
    t.includes("escritura") ||
    t.includes("versículo") ||
    t.includes("profundizar")
  ) {
    ultimoTema = "biblia";
    return "En la sección de la Sagrada Escritura 📖 puedes seleccionar testamentos y encontrar textos subrayados con opciones de profundización. ¿Te gustaría saber más?";
  }

  // 4. Si no está en lo local, consultamos al servidor externo 🌐
  const idMensajeTemporal = "temp-" + Date.now();
  contenedorMensajes.innerHTML += `<p id="${idMensajeTemporal}"><em>⏳ Buscando respuesta en la fuente externa, espere un momento...</em></p>`;
  contenedorMensajes.scrollTop = contenedorMensajes.scrollHeight;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const respuestaApi = await fetch("https://tu-api-externa.com/consultar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pregunta: texto }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!respuestaApi.ok) {
      throw new Error("Error en la respuesta del servidor");
    }

    const datos = await respuestaApi.json();
    document.getElementById(idMensajeTemporal)?.remove();
    return datos.respuesta || "Respuesta recibida del servidor externo.";
  } catch (error) {
    document.getElementById(idMensajeTemporal)?.remove();
    if (error.name === "AbortError") {
      return "⚠️ La consulta al servidor externo tardó demasiado. En este momento operas en modo offline, pero las herramientas locales siguen funcionando perfectamente.";
    } else {
      return "⚠️ En este momento no hay conexión con el servidor externo para responder consultas doctrinales profundas, pero todo lo local sigue operativo.";
    }
  }
}

// ==========================================
// PALABRA VIVA - NÚCLEO JAVASCRIPT PRINCIPAL
// ==========================================

// Variables de estado global

let esperandoConfirmacionMic = false;

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. CHAT Y ASISTENTE ---
  const inputChat = document.getElementById("chat-input");
  const btnEnviar = document.getElementById("chat-btn-enviar");
  const contenedorMensajes = document.getElementById("chat-mensajes");

  // Verificación inicial del nombre al cargar
  const nombreGuardado = localStorage.getItem("nombrePalabraViva");
  if (contenedorMensajes) {
    if (nombreGuardado) {
      contenedorMensajes.innerHTML += `<p><strong>Asistente:</strong> ¡Bienvenido de nuevo por acá, ${nombreGuardado}! ¿En qué te puedo ayudar hoy? 🌟</p>`;
    } else {
      contenedorMensajes.innerHTML += `<p><strong>Asistente:</strong> ¡Hola! Bienvenido, soy tu asistente de Palabra Viva. Decime cómo te llamás, por favor 📱.</p>`;
      esperandoNombre = true;
    }
    contenedorMensajes.scrollTop = contenedorMensajes.scrollHeight;
  }

  btnEnviar?.addEventListener("click", async () => {
    const textoUsuario = inputChat.value.trim();

    if (textoUsuario !== "") {
      contenedorMensajes.innerHTML += `<p><strong>Tú:</strong> ${textoUsuario}</p>`;
      inputChat.value = "";
      contenedorMensajes.scrollTop = contenedorMensajes.scrollHeight;

      // Si tenemos la función procesarMensaje definida en otro lado, la llamamos
      let respuestaAsistente = "Entendido.";
      if (typeof procesarMensaje === "function") {
        respuestaAsistente = await procesarMensaje(
          textoUsuario,
          contenedorMensajes,
        );
      }

      contenedorMensajes.innerHTML += `<p><strong>Asistente:</strong> ${respuestaAsistente}</p>`;
      contenedorMensajes.scrollTop = contenedorMensajes.scrollHeight;
    }
  });

  inputChat?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      btnEnviar?.click();
    }
  });

  // --- FUNCIÓN PARA ABRIR EL ASISTENTE DE APOYO Y ACTIVAR SU VOZ ---
  function abrirPantallaAsistente() {
    // 1. Acá va la lógica que ya tenés para mostrar la pantalla del chat (ej: agregar clase 'active')
    const screenAsistente = document.getElementById("screen-asistente");
    if (screenAsistente) {
      screenAsistente.classList.add("active"); // o la clase que uses para mostrarlo
    }

    // 2. Disparamos el saludo hablado EXCLUSIVAMENTE cuando entra acá
    const mensajeBienvenida = "¡Hola! Bienvenido, soy tu asistente de apoyo.";
    hacerHablarAlRobot(mensajeBienvenida);
  }

  // --- 2. CONTROL DEL MICRÓFONO (Limpio, sin cartelitos y con feedback visual) ---
  const btnMic = document.getElementById("btnMic");

  btnMic?.addEventListener("click", () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const reconocimiento = new SpeechRecognition();
      reconocimiento.lang = "es-AR";

      reconocimiento.onstart = () => {
        // Se enciende el indicador visual (le añade la clase para que titile o cambie de color)
        btnMic.classList.add("mic-escuchando");
      };

      reconocimiento.onresult = (evento) => {
        const textoCapturado = evento.results[0][0].transcript;
        if (inputChat) {
          inputChat.value = textoCapturado;
          if (inputChat) {
            inputChat.value = textoCapturado;
            // ¡Mandalo a hablar de una!
            hacerHablarAlRobot("Entendido: " + textoCapturado);
          }
        }
      };

      reconocimiento.onend = () => {
        // Se apaga el indicador cuando el reconocimiento corta solo
        btnMic.classList.remove("mic-escuchando");
      };

      reconocimiento.onerror = () => {
        btnMic.classList.remove("mic-escuchando");
      };

      // Arranca la escucha de inmediato al hacer clic
      reconocimiento.start();
    } else {
      console.log(
        "El reconocimiento de voz no está soportado en este navegador.",
      );
    }
  });

  // --- 3. FUNCIÓN DE SÍNTESIS DE VOZ (Texto a Voz) ---
  function hacerHablarAlRobot(texto) {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel(); // Corta cualquier audio anterior

      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = "es-AR";
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      window.speechSynthesis.speak(utterance);
    } else {
      console.log("Este navegador no soporta síntesis de voz.");
    }
  }

  // --- 3. GESTO SWIPE-DOWN PARA CERRAR EL PANEL DE ESTUDIO ---
  const studyCard = document.getElementById("study-card");
  if (studyCard) {
    let startY = 0;
    let currentY = 0;
    let isDragging = false;

    if (typeof window.restaurarLecturaNormal === "function") {
      window.restaurarLecturaNormal();
    }

    studyCard.addEventListener(
      "touchstart",
      (e) => {
        startY = e.touches[0].clientY;
        isDragging = true;
        studyCard.style.transition = "none";
      },
      { passive: true },
    );

    studyCard.addEventListener(
      "touchmove",
      (e) => {
        if (!isDragging) return;
        currentY = e.touches[0].clientY;
        let diffY = currentY - startY;

        if (diffY > 0) {
          studyCard.style.transform = `translateY(${diffY}px)`;
        }
      },
      { passive: true },
    );

    studyCard.addEventListener("touchend", () => {
      if (!isDragging) return;
      isDragging = false;

      let diffY = currentY - startY;
      studyCard.style.transition = "transform 0.3s ease";

      if (diffY > 100) {
        studyCard.classList.remove("expanded");
        studyCard.style.transform = "translateY(100%)";
      } else {
        studyCard.style.transform = "translateY(0)";
      }

      startY = 0;
      currentY = 0;
    });
  }

  // --- 4. HISTORIAL INICIAL PARA LA APP ---
  history.replaceState({ vista: "main" }, "", "");
});

// --- 5. MANEJADOR GLOBAL DEL BOTÓN "ATRÁS" ---
window.addEventListener("popstate", () => {
  const studyCard = document.getElementById("study-card");

  if (studyCard && studyCard.classList.contains("expanded")) {
    studyCard.classList.remove("expanded");
    studyCard.style.transform = "";
    history.pushState({ vista: "main" }, "", "");
    return;
  }

  history.replaceState({ vista: "main" }, "", "");
});
function hacerHablarAlRobot(texto) {
  // Nos aseguramos de que el navegador soporte la síntesis de voz
  if ("speechSynthesis" in window) {
    // Cancelamos cualquier audio anterior para que no se pisapuenten
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(texto);

    // Configuramos el idioma en español (podés cambiar la 'es-AR' si querés tono local)
    utterance.lang = "es-AR";
    utterance.rate = 1.0; // Velocidad normal (de 0.1 a 10)
    utterance.pitch = 1.0; // Tono (de 0 a 2)

    // (Opcional) Si querés sincronizar visualmente el momento en que habla:
    utterance.onstart = () => {
      console.log("El robot comenzó a hablar...");
    };

    utterance.onend = () => {
      console.log("El robot terminó de hablar.");
    };

    // Disparamos la voz
    window.speechSynthesis.speak(utterance);
  } else {
    console.log("Este navegador no soporta síntesis de voz.");
  }
}
