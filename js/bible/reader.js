/// js/bible/reader.js
// Módulo de lectura y navegación por Libros y Capítulos de la Biblia

import { listaLibrosAntiguo, listaLibrosNuevo } from "./canon.js";

export async function abrirAntiguoTestamento() {
  const changeScreen = window.changeScreen;
  const screenAntiguo =
    window.screenAntiguo || document.getElementById("screen-antiguo");

  if (typeof changeScreen === "function" && screenAntiguo) {
    changeScreen(screenAntiguo);
  }

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

export async function abrirNuevoTestamento() {
  const changeScreen = window.changeScreen;
  const screenNuevo =
    window.screenNuevo || document.getElementById("screen-nuevo");

  if (typeof changeScreen === "function" && screenNuevo) {
    changeScreen(screenNuevo);
  }

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
