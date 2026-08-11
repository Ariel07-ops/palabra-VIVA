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
    cargarEstadoAnimo(estado); // <--- ¡AQUÍ ESTÁ LA MAGIA! Inyecta los datos del JSON antes de cambiar
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
function abrirPasoEmaus(numero) {
  const pasosEmausData = {
    1: {
      titulo: "1. El inicio en lo oculto",
      texto:
        "Los discípulos caminan hacia Emaús con el rostro sombrío y el corazón cargado de desilusión. Jesús mismo se acerca y camina con ellos, pero sus ojos estaban retenidos para que no le reconocieran. Así camina muchas veces el Señor a nuestro lado en medio de nuestras tristezas cotidianas.",
    },
    2: {
      titulo: "2. El caminar diario",
      texto:
        "Mientras van de camino, Él les explica las Escrituras comenzando por Moisés y todos los profetas. El calor de su palabra va encendiendo lentamente el fuego en sus corazones cansados, enseñándonos que la oración y la lectura meditada de la Palabra son el sustento del peregrino.",
    },
    3: {
      titulo: "3. La fracción del pan",
      texto:
        "Al llegar a la aldea, lo invitan a quedarse y, sentado a la mesa, toma el pan, pronuncia la bendición, lo parte y se lo da. En este gesto supremo se abren sus ojos y lo reconocen. Es el misterio de la Eucaristía, centro y cumbre de nuestra vida cristiana.",
    },
    4: {
      titulo: "4. Hacia la Plenitud",
      texto:
        "Recobrada la luz y la esperanza, se levantan al instante y regresan a Jerusalén para anunciar la Buena Nueva a los hermanos: '¡El Señor ha resucitado verdaderamente!'. El camino que comenzó en la tristeza culmina en el testimonio y en la alegría desbordante del Resucitado.",
    },
  };

  const datos = pasosEmausData[numero];
  if (!datos) return;

  document.getElementById("titulo-emaus-detalle").innerText = datos.titulo;
  document.getElementById("texto-emaus-detalle").innerHTML = datos.texto;
  changeScreen(screenEmausDetalle);
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

// --- CAMBIO DE TEMA ---
document.addEventListener("DOMContentLoaded", () => {
  const btnTheme = document.getElementById("btn-theme");
  if (btnTheme) {
    btnTheme.addEventListener("click", () => {
      document.body.classList.toggle("light-mode");
    });
  }
});

// --- MENÚ LATERAL Y ENLACES ---
if (btnMenu && menuLateral) {
  btnMenu.addEventListener("click", () =>
    menuLateral.classList.toggle("active"),
  );
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
  changeScreen(screenIdioma);
  menuLateral.classList.remove("active");
});
document.getElementById("link-sugerir")?.addEventListener("click", (e) => {
  e.preventDefault();
  changeScreen(screenSugerir);
  menuLateral.classList.remove("active");
});
document.getElementById("link-acerca")?.addEventListener("click", (e) => {
  e.preventDefault();
  changeScreen(screenAcerca);
  menuLateral.classList.remove("active");
});

document
  .getElementById("btn-volver-idioma")
  ?.addEventListener("click", () => changeScreen(screenMain));
document
  .getElementById("btn-volver-sugerir")
  ?.addEventListener("click", () => changeScreen(screenMain));
if (btnVolverAcerca)
  btnVolverAcerca.addEventListener("click", () => changeScreen(screenMain));

// --- BÚSQUEDA INTELIGENTE CON ENTER Y PAGINACIÓN ---
const inputBusquedaEl = document.getElementById("input-busqueda");
if (inputBusquedaEl) {
  inputBusquedaEl.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("btn-ejecutar-busqueda")?.click();
    }
  });
}

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
      const respuesta = await fetch("biblia.json");
      const datos = await respuesta.json();
      let encontrados = [];

      if (datos.verses && Array.isArray(datos.verses)) {
        datos.verses.forEach((item) => {
          const textoLimpio = limpiarTexto(item.text || "");
          const libroLimpio = limpiarTexto(item.book_name || "");

          const coincideFraseCompleta =
            textoLimpio.includes(terminoBusqueda) ||
            libroLimpio.includes(terminoBusqueda);
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

      if (encontrados.length > 0) {
        let paginaBusquedaActual = 1;
        const porPagina = 20;
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
      const respuesta = await fetch("biblia.json");
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
      const respuesta = await fetch("biblia.json");
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
// funcion para buscar capitulos y subrayar esplicaciones
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
    // AQUÍ ESTÁ EL GATILLO: data-versiculo="${v.verse}"
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

  // Disparamos pasando el nombre del libro y el capítulo actual
  aplicarSubrayadosCapitulo(nombreLibro, numCapitulo);
  // 🚀 DISPARADOR: Llamamos a la función para que lea el JSON y aplique los subrayados al capítulo actual

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

function ejecutarLecturaVoz() {
  if (!("speechSynthesis" in window)) {
    alert("Tu dispositivo no soporta la síntesis de voz.");
    return;
  }

  const btnAudio = document.getElementById("btn-hablar-lectura");
  const areaLecturaFinal = document.getElementById("texto-lectura-final");

  if (!areaLecturaFinal || areaLecturaFinal.innerText.trim() === "") {
    alert("Por favor, abrí un capítulo para poder escucharlo.");
    return;
  }

  // Si ya se está reproduciendo, el botón actúa como DETENER (Stop) y resetea
  if (estaReproduciendo) {
    window.speechSynthesis.cancel();
    estaReproduciendo = false;
    textoCompletoActual = "";
    if (btnAudio)
      btnAudio.innerHTML = '<i class="fas fa-volume-up"></i> Escuchar';
    return;
  }

  // Preparamos el texto limpio sin los números de los versículos
  const clone = areaLecturaFinal.cloneNode(true);
  clone.querySelectorAll("sup").forEach((sup) => sup.remove());
  const textoEnPantalla = clone.innerText.trim();

  if (!textoEnPantalla) return;

  // Cancelamos cualquier locución previa por seguridad
  window.speechSynthesis.cancel();

  textoCompletoActual = textoEnPantalla;
  utteranceActual = new SpeechSynthesisUtterance(textoCompletoActual);
  utteranceActual.lang = "es-AR";
  utteranceActual.rate = 0.95;

  utteranceActual.onend = () => {
    estaReproduciendo = false;
    textoCompletoActual = "";
    if (btnAudio)
      btnAudio.innerHTML = '<i class="fas fa-volume-up"></i> Escuchar';
  };

  utteranceActual.onerror = () => {
    estaReproduciendo = false;
    if (btnAudio)
      btnAudio.innerHTML = '<i class="fas fa-volume-up"></i> Escuchar';
  };

  estaReproduciendo = true;
  if (btnAudio) btnAudio.innerHTML = '<i class="fas fa-stop"></i> Detener';

  window.speechSynthesis.speak(utteranceActual);
}
// --- INTERACTIVIDAD DEL PANEL INFERIOR (Abanico en dos niveles) ---
// --- Lógica del Panel de Estudio (Abanico) ---

const fanColumns = document.querySelectorAll(".fan-column");

// Función para alternar el estado del panel
// Evento para cerrar desde la barrita dorada (ya no abre por casualidad)
if (panelHandle) {
  panelHandle.addEventListener("click", () => {
    if (studyCard) {
      studyCard.classList.add("hidden");
    }
  });
}
// Evento para expandir cada columna
fanColumns.forEach((col) => {
  col.addEventListener("click", (e) => {
    // 1. SI ESTÁ APAGADA (no tiene contenido), NO HACE NADA
    if (!col.classList.contains("has-content")) {
      return;
    }

    // Si el usuario hace clic en el botón de cerrar interno de la columna, no expandas
    if (e.target.classList.contains("btn-close-extended")) return;

    // Quitamos la expansión de todas y expandimos la seleccionada
    fanColumns.forEach((c) => c.classList.remove("expanded-full"));
    col.classList.add("expanded-full");
  });

  // Botón de cierre específico de cada columna expandida
  const btnClose = col.querySelector(".btn-close-extended");
  if (btnClose) {
    btnClose.addEventListener("click", (e) => {
      e.stopPropagation(); // Evita que se dispare el evento del padre
      col.classList.remove("expanded-full");
    });
  }
});

// Función que recibe los datos del JSON y enciende la columna correspondiente
function procesarYResaltarDesdeJSON(datosCapitulo) {
  const fanColumns = document.querySelectorAll(".fan-column");

  // 1. Apagamos todas primero para limpiar la pantalla
  fanColumns.forEach((col) => col.classList.remove("has-content"));

  // 2. Recorremos el JSON o evaluamos sus propiedades
  // Por ejemplo, si tu JSON tiene campos como: { seccion1: "texto", seccion2: "", ... }

  if (datosCapitulo.opcion1 && datosCapitulo.opcion1.trim() !== "") {
    fanColumns[0].classList.add("has-content"); // Prende la primera
  }

  if (datosCapitulo.opcion2 && datosCapitulo.opcion2.trim() !== "") {
    fanColumns[1].classList.add("has-content"); // Prende la segunda
  }

  if (datosCapitulo.opcion3 && datosCapitulo.opcion3.trim() !== "") {
    fanColumns[2].classList.add("has-content"); // Prende la tercera
  }

  // Y así sucesivamente según cómo armes la estructura de tu JSON
}
function toggleStudyCard(datosDelLibroActual) {
  if (studyCard) {
    studyCard.classList.toggle("hidden");

    // Si se acaba de abrir, evaluamos el JSON cargado
    if (!studyCard.classList.contains("hidden")) {
      procesarYResaltarDesdeJSON(datosDelLibroActual);
    }
  }
}
// Función para encender una columna específica de a una
function encenderColumna(numeroColumna) {
  const fanColumns = document.querySelectorAll(".fan-column");

  // 1. Apagamos todas las columnas primero
  fanColumns.forEach((col) => col.classList.remove("has-content"));

  // 2. Si el número es válido, encendemos solo esa (restamos 1 porque los índices empiezan en 0)
  const index = numeroColumna - 1;
  if (fanColumns[index]) {
    fanColumns[index].classList.add("has-content");
  }
}
async function aplicarSubrayadosCapitulo(nombreLibro, numeroCapitulo) {
  try {
    let respuesta = await fetch("contenido.json");
    let datos = await respuesta.json();

    let keyLibro = nombreLibro.toLowerCase().trim();

    if (
      !datos.libros ||
      !datos.libros[keyLibro] ||
      !datos.libros[keyLibro].capitulos[numeroCapitulo]
    ) {
      console.log(
        `No hay contenido especial para ${nombreLibro} cap. ${numeroCapitulo}.`,
      );
      return;
    }

    let capituloData = datos.libros[keyLibro].capitulos[numeroCapitulo];

    const mapaColoresHex = {
      filologia: "#9b59b6",
      historico: "#ecf0f1",
      apologetica: "#e74c3c",
      sucesion: "#f1c40f",
    };

    for (let numVersiculo in capituloData.versiculos) {
      let v = capituloData.versiculos[numVersiculo];
      let elementoVersiculo = document.querySelector(
        `[data-versiculo="${numVersiculo}"]`,
      );

      if (elementoVersiculo) {
        elementoVersiculo.className = "";
        elementoVersiculo.style.borderBottom = "";
        elementoVersiculo.style.borderImage = "";

        let cats = v.categorias;
        let activas = Object.keys(cats).filter((key) => cats[key] === true);

        if (activas.length === 1) {
          elementoVersiculo.classList.add(`subrayado-${activas[0]}`);
        } else if (activas.length > 1) {
          let coloresActivos = activas
            .map((cat) => mapaColoresHex[cat])
            .join(", ");
          elementoVersiculo.style.borderBottom = "3px solid";
          elementoVersiculo.style.borderImage = `linear-gradient(to right, ${coloresActivos}) 1`;
        }

        // Interactividad de clics: Gatillo directo para pintar de dorado e iluminar el abanico
        if (activas.length > 0) {
          elementoVersiculo.style.cursor = "pointer";
          elementoVersiculo.title =
            "Tocá para ver el estudio de este versículo";

          elementoVersiculo.onclick = () => {
            // 1. Limpiamos el fondo dorado de cualquier otro versículo previo
            document.querySelectorAll("[data-versiculo]").forEach((el) => {
              el.style.backgroundColor = "transparent";
              el.style.padding = "0px";
            });

            // 2. Pintamos y destacamos directamente el versículo seleccionado
            elementoVersiculo.style.backgroundColor = "rgba(212, 175, 55, 0.1)";
            elementoVersiculo.style.borderRadius = "6px";
            elementoVersiculo.style.padding = "4px 8px";
            elementoVersiculo.style.transition = "all 0.3s ease";

            // 3. Mostrar la tarjeta de estudio
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

// Función para cerrar las columnas, ocultar el panel y limpiar los estilos al cambiar
function cerrarAbanicoAlCambiar() {
  const studyCard = document.getElementById("study-card");
  if (studyCard) {
    studyCard.classList.add("hidden");
  }

  const fanColumns = document.querySelectorAll(".fan-column");
  fanColumns.forEach((col) => {
    col.classList.remove("expanded-full");
  });

  // Limpiamos los fondos dorados de los versículos
  document.querySelectorAll("[data-versiculo]").forEach((linea) => {
    linea.style.backgroundColor = "transparent";
    linea.style.padding = "0px";
  });
}
// ==========================================
// INYECTOR MAESTRO DE ESTADOS DESDE caminemos.json
// ==========================================

async function cargarEstadoAnimo(nombreEstado) {
  try {
    // 1. Leemos el archivo JSON
    const respuesta = await fetch("caminemos.json");
    const data = await respuesta.json();

    // 2. Extraemos los datos del estado correspondiente (ej: 'optimo', 'feliz', etc.)
    const datosEstado = data.estados[nombreEstado];

    if (!datosEstado) {
      console.warn("No se encontró el estado en el JSON:", nombreEstado);
      return;
    }

    // 3. Buscamos la pantalla contenedora en el HTML
    const pantalla = document.getElementById(`screen-${nombreEstado}`);
    if (!pantalla) return;

    // 4. Inyectamos cada pieza de contenido en su lugar correspondiente
    const elTitulo = pantalla.querySelector(".titulo-estado");
    if (elTitulo)
      elTitulo.textContent = `Pantalla: ${nombreEstado.charAt(0).toUpperCase() + nombreEstado.slice(1)}`;

    const elAcogida = pantalla.querySelector(".acogida-estado");
    if (elAcogida) elAcogida.textContent = datosEstado.acogida;

    // Evangelio
    const elRef = pantalla.querySelector(".evangelio-referencia");
    if (elRef) elRef.textContent = datosEstado.evangelio.referencia;

    const elTxt = pantalla.querySelector(".evangelio-texto");
    if (elTxt) elTxt.textContent = datosEstado.evangelio.texto;

    const elMed = pantalla.querySelector(".evangelio-meditacion");
    if (elMed) elMed.textContent = datosEstado.evangelio.meditacion;

    // Oración
    const elOracion = pantalla.querySelector(".oracion-texto");
    if (elOracion) elOracion.textContent = datosEstado.oracion;

    // Santo / Compañero de camino
    const elSanto = pantalla.querySelector(".santo-nombre");
    if (elSanto) elSanto.textContent = datosEstado.companero_de_camino.santo;

    const elRec = pantalla.querySelector(".santo-recomendacion");
    if (elRec)
      elRec.textContent = datosEstado.companero_de_camino.recomendacion;

    // Paso de hoy
    const elPaso = pantalla.querySelector(".paso-hoy-texto");
    if (elPaso) elPaso.textContent = datosEstado.paso_de_hoy;
  } catch (error) {
    console.error("Error al inyectar los datos del estado:", error);
  }
}
function cambiarIdioma(lang) {
  console.log("Cambiando idioma a: ", lang);

  // Buscamos todos los elementos que tengan atributos de traducción en la app
  const elementosTraducibles = document.querySelectorAll("[data-es][data-en]");

  elementosTraducibles.forEach((el) => {
    if (lang === "en") {
      el.innerText = el.getAttribute("data-en");
    } else {
      el.innerText = el.getAttribute("data-es");
    }
  });

  // Actualizamos clases activas en los botones de selección de idioma si los hubiera
  const botonesIdioma = document.querySelectorAll("#screen-idioma button");
  botonesIdioma.forEach((btn) => btn.classList.remove("active"));
}
