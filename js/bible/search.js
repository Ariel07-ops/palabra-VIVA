// js/bible/search.js
// Módulo de búsqueda inteligente en las Escrituras (Soporte Multidioma Ajustado)

import { state } from "../core/state.js";
import { limpiarTexto, palabrasANumeros, escaparHTML } from "../core/utils.js";

/**
 * Detecta qué idioma o versión de Biblia está seleccionada
 */
function obtenerConfiguracionIdioma() {
  const selectIdioma =
    document.getElementById("select-idioma") ||
    document.getElementById("selector-idioma") ||
    document.getElementById("idioma-select");

  const lang = (
    selectIdioma?.value ||
    state.idioma ||
    state.version ||
    "es"
  ).toLowerCase();

  if (lang.includes("en") || lang.includes("douay") || lang === "en") {
    return {
      archivo: "data/bibleweb.json",
      idioma: "en",
    };
  } else if (
    lang.includes("pt") ||
    lang.includes("portugues") ||
    lang === "pt"
  ) {
    return {
      archivo: "data/bibliaAveMaria.json",
      idioma: "pt",
    };
  }

  // Por defecto: Español (Platense)
  return {
    archivo: "data/SpaPlatense.json",
    idioma: "es",
  };
}

/**
 * Convierte las 3 estructuras distintas de JSON en una lista plana estandarizada
 */
function extraerVersiculosDeJSON(datos) {
  let lista = [];

  // CASO 1: Portugués (bibliaAveMaria.json) -> 'antigoTestamento' y 'novoTestamento'
  if (datos.antigoTestamento || datos.novoTestamento) {
    const todosLosLibrosPT = [
      ...(datos.antigoTestamento || []),
      ...(datos.novoTestamento || []),
    ];

    todosLosLibrosPT.forEach((b) => {
      const bookName = b.nome || "";
      if (b.capitulos && Array.isArray(b.capitulos)) {
        b.capitulos.forEach((c) => {
          const chapNum = c.capitulo || 1;
          if (c.versiculos && Array.isArray(c.versiculos)) {
            c.versiculos.forEach((v) => {
              lista.push({
                book_name: bookName,
                chapter: chapNum,
                verse: v.versiculo || 1,
                text: v.texto || "",
              });
            });
          }
        });
      }
    });
    return lista;
  }

  // CASO 2: Español e Inglés (SpaPlatense.json y bibleweb.json) -> 'books'
  if (datos.books && Array.isArray(datos.books)) {
    datos.books.forEach((b) => {
      const bookName = b.name || b.book || "";
      if (b.chapters && Array.isArray(b.chapters)) {
        b.chapters.forEach((c) => {
          const chapNum = c.chapter || 1;
          if (c.verses && Array.isArray(c.verses)) {
            c.verses.forEach((v) => {
              lista.push({
                book_name: bookName,
                chapter: v.chapter !== undefined ? v.chapter : chapNum,
                verse: v.verse !== undefined ? v.verse : 1,
                text: v.text || "",
              });
            });
          }
        });
      }
    });
    return lista;
  }

  // CASO 3: Estructura plana estándar
  if (datos.verses && Array.isArray(datos.verses)) {
    return datos.verses;
  }

  return lista;
}

export function initSearch() {
  const btnBuscar = document.getElementById("btn-ejecutar-busqueda");
  if (btnBuscar) {
    btnBuscar.addEventListener("click", ejecutarBusqueda);
  }
}

export async function ejecutarBusqueda() {
  state.resultadosBusqueda = [];

  const inputOriginal =
    document.getElementById("input-busqueda")?.value.trim() || "";
  const contenedorResultados = document.getElementById("resultados-busqueda");

  if (!contenedorResultados) return;

  if (!inputOriginal) {
    contenedorResultados.innerHTML = `<p class="placeholder-text">Escribí algo para buscar...</p>`;
    return;
  }

  contenedorResultados.innerHTML = `<p class="placeholder-text">Buscando en las Escrituras...</p>`;

  try {
    const config = obtenerConfiguracionIdioma();

    // Hacemos fetch si cambió el idioma o no están cargados los datos
    if (!state.bibliaData || state.rutaBibliaCargada !== config.archivo) {
      console.log(
        "📥 Cargar motor para idioma:",
        config.idioma,
        "->",
        config.archivo,
      );
      const respuesta = await fetch(config.archivo);
      state.bibliaData = await respuesta.json();
      state.rutaBibliaCargada = config.archivo;
    }

    const datos = state.bibliaData;
    const listaVersiculos = extraerVersiculosDeJSON(datos);

    let encontrados = [];
    const terminoBusqueda = limpiarTexto(inputOriginal);
    const palabrasBusqueda = terminoBusqueda
      .split(/\s+/)
      .filter((p) => p.length > 2);

    listaVersiculos.forEach((item) => {
      const textoLimpio = limpiarTexto(item.text || "");
      const libroLimpio = limpiarTexto(item.book_name || "");

      const coincideLibro =
        libroLimpio.includes(terminoBusqueda) ||
        (terminoBusqueda.length >= 4 && terminoBusqueda.includes(libroLimpio));
      const coincideTexto = textoLimpio.includes(terminoBusqueda);

      if (coincideLibro || coincideTexto) {
        encontrados.push({
          referencia: `${item.book_name} ${item.chapter}:${item.verse}`,
          texto: item.text,
        });
      } else if (palabrasBusqueda.length >= 2) {
        const coincidencias = palabrasBusqueda.filter((p) =>
          textoLimpio.includes(p),
        ).length;
        const umbral = Math.ceil(palabrasBusqueda.length * 0.8);
        if (coincidencias >= umbral) {
          encontrados.push({
            referencia: `${item.book_name} ${item.chapter}:${item.verse}`,
            texto: item.text,
          });
        }
      }
    });

    state.resultadosBusqueda = encontrados;
    window.resultadosBusquedaActuales = encontrados;

    // Renderizado de resultados
    if (encontrados.length > 0) {
      let paginaActual = 1;
      const porPagina = 20;
      const totalPaginas = Math.ceil(encontrados.length / porPagina);

      const renderizar = () => {
        const inicio = (paginaActual - 1) * porPagina;
        const lote = encontrados.slice(inicio, inicio + porPagina);

        let html = lote
          .map(
            (item, i) => `
          <div class="search-result-item" data-index="${inicio + i}" onclick="window.abrirResultadoPorIndice(${inicio + i})"
               style="margin-bottom:15px; border-bottom:1px solid rgba(212,175,55,0.2); padding-bottom:10px; cursor:pointer;">
            <strong style="color:var(--gold); display:block; margin-bottom:5px;">${escaparHTML(item.referencia)}</strong>
            <p style="color:#e0e0e0; font-size:0.95rem; line-height:1.4;">"${escaparHTML(item.texto)}"</p>
          </div>
        `,
          )
          .join("");

        if (totalPaginas > 1) {
          html += `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:25px; padding:15px 0; border-top:1px solid var(--gold);">
              <button id="btn-ant-busqueda" style="background:rgba(212,175,55,0.1); border:1px solid var(--gold); color:#fff; padding:8px 14px; border-radius:6px; cursor:pointer;"
                ${paginaActual === 1 ? "disabled style='opacity:0.4;cursor:default;'" : ""}>⬅ Anterior</button>
              <span style="color:var(--gold); font-size:0.85rem; text-align:center;">
                Pág. ${paginaActual} / ${totalPaginas}<br>
                <small style="color:#aaa;">(${encontrados.length} encontrados)</small>
              </span>
              <button id="btn-sig-busqueda" style="background:rgba(212,175,55,0.1); border:1px solid var(--gold); color:#fff; padding:8px 14px; border-radius:6px; cursor:pointer;"
                ${paginaActual === totalPaginas ? "disabled style='opacity:0.4;cursor:default;'" : ""}>Siguiente ➡</button>
            </div>`;
        }

        contenedorResultados.innerHTML = html;

        document
          .getElementById("btn-ant-busqueda")
          ?.addEventListener("click", () => {
            if (paginaActual > 1) {
              paginaActual--;
              renderizar();
              contenedorResultados.scrollIntoView({ behavior: "smooth" });
            }
          });

        document
          .getElementById("btn-sig-busqueda")
          ?.addEventListener("click", () => {
            if (paginaActual < totalPaginas) {
              paginaActual++;
              renderizar();
              contenedorResultados.scrollIntoView({ behavior: "smooth" });
            }
          });
      };

      renderizar();
    } else {
      contenedorResultados.innerHTML = `
        <div style="text-align:center; padding:10px;">
          <p style="color:#d4af37; font-weight:bold; margin-bottom:5px;">Sin resultados</p>
          <p class="placeholder-text">No se encontraron pasajes con el término "${escaparHTML(inputOriginal)}".</p>
        </div>`;
    }
  } catch (error) {
    console.error("Error en la búsqueda:", error);
    contenedorResultados.innerHTML = `<p class="placeholder-text" style="color:#e34234;">Ocurrió un error al realizar la búsqueda.</p>`;
  }
}

export function cerrarCajita() {
  const modalVentana = document.getElementById("modal-versiculo");
  if (modalVentana) {
    modalVentana.style.display = "none";
  }
}

export function abrirResultadoPorIndice(indiceGlobal) {
  const resultados = window.resultadosBusquedaActuales || [];
  const item = resultados[indiceGlobal];

  if (!item) return;

  const modalTexto = document.getElementById("texto-versiculo");
  const modalVentana = document.getElementById("modal-versiculo");

  if (modalTexto) {
    modalTexto.innerHTML = `<strong style="color: var(--gold);">${item.referencia}</strong><br><br>"${item.texto}"`;
  }

  if (modalVentana) {
    modalVentana.style.setProperty("display", "flex", "important");
  }
}

window.abrirResultadoPorIndice = abrirResultadoPorIndice;

export function cerrarModalHerramientas() {
  const modal = document.getElementById("modal-herramientas");
  if (modal) {
    modal.style.display = "none";
  }
}
