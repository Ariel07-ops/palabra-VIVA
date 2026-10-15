/// js/bible/reader.js
// Módulo de lectura y navegación por Libros y Capítulos de la Biblia

import { listaLibrosAntiguo, listaLibrosNuevo } from "./canon.js";

// Canon completo unificado para mapear la posición de los libros (73 libros)
const CANON_COMPLETO = [...listaLibrosAntiguo, ...listaLibrosNuevo];

// Función para determinar la ruta del JSON según el idioma activo
function obtenerInfoBibliaActual() {
  const idioma = localStorage.getItem("palabra_viva_idioma") || "es";
  switch (idioma) {
    case "pt":
      return { ruta: "data/bibliaAveMaria.json", idioma: "pt" };
    case "en":
      return { ruta: "data/bibleweb.json", idioma: "en" };
    case "es":
    default:
      return { ruta: "data/SpaPlatense.json", idioma: "es" };
  }
}

/**
 * Normaliza los JSONs asignando los nombres exactos de canon.js
 * de acuerdo a la estructura de cada archivo.
 */
function normalizarConCanonOficial(jsonRaw, idioma) {
  const versosPlanos = [];

  // 1. ESPAÑOL (Straubinger - SpaPlatense.json)
  if (idioma === "es") {
    const libros = jsonRaw.books || [];
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
  // 2. PORTUGUÉS (Bíblia Ave Maria - bibliaAveMaria.json)
  else if (idioma === "pt") {
    const libros = [
      ...(jsonRaw.antigoTestamento || []),
      ...(jsonRaw.novoTestamento || []),
    ];
    libros.forEach((libro, idx) => {
      const nombreOficial = CANON_COMPLETO[idx] || libro.nome;
      (libro.capitulos || []).forEach((cap) => {
        (cap.versiculos || []).forEach((v) => {
          versosPlanos.push({
            book_name: nombreOficial,
            chapter: cap.capitulo,
            verse: v.versiculo,
            text: v.texto,
          });
        });
      });
    });
  }
  // 3. INGLÉS (World English Bible / KJV - bibleweb.json)
  else if (idioma === "en") {
    const mapaLibros = {};

    // Opcional: Elegimos una traducción específica para no duplicar (ej: la primera o "King James Version")
    // Si querés filtrar por una en particular, podés descomentar la línea de abajo:
    // const jsonFiltrado = jsonRaw.filter(capObj => capObj.translationName === "King James Version");
    const jsonFiltrado = jsonRaw; // O usamos todo si ya lo separamos

    // Agrupamos todos los capítulos según la propiedad bookName del JSON
    // (Filtramos para tomar una sola translationName si el archivo trae varias)
    const traduccionElegida =
      jsonRaw.find((item) => item.translationName)?.translationName || "";

    jsonRaw.forEach((capObj) => {
      // Si el archivo trae varias traductions mezcladas, nos quedamos solo con la primera
      if (capObj.translationName !== traduccionElegida) return;

      const bName = capObj.bookName;
      if (!mapaLibros[bName]) mapaLibros[bName] = [];
      mapaLibros[bName].push(capObj);
    });

    const llavesLibros = Object.keys(mapaLibros);
    llavesLibros.forEach((bName, idx) => {
      const nombreOficial = CANON_COMPLETO[idx] || bName;
      const capitulosList = mapaLibros[bName];

      capitulosList.forEach((capObj) => {
        (capObj.verses || []).forEach((v) => {
          versosPlanos.push({
            book_name: nombreOficial,
            chapter: capObj.chapterNo,
            verse: v.verseNo,
            text: v.verseText,
          });
        });
      });
    });
  }

  return versosPlanos;
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
      const info = obtenerInfoBibliaActual();
      const respuesta = await fetch(info.ruta);
      const jsonRaw = await respuesta.json();

      const todosLosVersos = normalizarConCanonOficial(jsonRaw, info.idioma);

      listaLibrosAntiguo.forEach((nombreLibro) => {
        const btn = document.createElement("div");
        btn.style.cssText =
          "border: 1px solid var(--gold); border-radius: 8px; padding: 15px; text-align: center; cursor: pointer; background: rgba(255,255,255,0.05); color: #fff; font-size: 0.9rem;";
        btn.innerText = nombreLibro;
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
      const info = obtenerInfoBibliaActual();
      const respuesta = await fetch(info.ruta);
      const jsonRaw = await respuesta.json();

      const todosLosVersos = normalizarConCanonOficial(jsonRaw, info.idioma);

      listaLibrosNuevo.forEach((nombreLibro) => {
        const btn = document.createElement("div");
        btn.style.cssText =
          "border: 1px solid var(--gold); border-radius: 8px; padding: 15px; text-align: center; cursor: pointer; background: rgba(255,255,255,0.05); color: #fff; font-size: 0.9rem;";
        btn.innerText = nombreLibro;
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

  if (tituloLibro) tituloLibro.textContent = nombreLibro;
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
    const btnAudio = document.getElementById("btn-hablar-lectura");
    if (btnAudio)
      btnAudio.innerHTML = '<i class="fas fa-volume-up"></i> Escuchar';
  }

  if (typeof changeScreen === "function" && screenLectura) {
    changeScreen(screenLectura);
  }

  const tituloLectura = document.getElementById("titulo-lectura-completa");
  const areaLectura = document.getElementById("texto-lectura-final");

  if (tituloLectura)
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

  if (typeof window.aplicarSubrayadosCapitulo === "function") {
    window.aplicarSubrayadosCapitulo(nombreLibro, numCapitulo);
  }

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
