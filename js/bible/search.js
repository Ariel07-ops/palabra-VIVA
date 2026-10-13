// js/bible/search.js
// Módulo de búsqueda inteligente en las Escrituras

import { state } from "../core/state.js";
import { limpiarTexto, palabrasANumeros, escaparHTML } from "../core/utils.js";

// Lista oficial de libros católicos (73 libros)
const LIBROS = [
  // Antiguo Testamento
  "genesis",
  "exodo",
  "levitico",
  "numeros",
  "deuteronomio",
  "josue",
  "jueces",
  "rut",
  "1 samuel",
  "2 samuel",
  "1 reyes",
  "2 reyes",
  "1 cronicas",
  "2 cronicas",
  "esdras",
  "nehemias",
  "tobias",
  "judit",
  "ester",
  "1 macabeos",
  "2 macabeos",
  "job",
  "salmos",
  "proverbios",
  "eclesiastes",
  "cantar de los cantares",
  "sabiduria",
  "eclesiastico",
  "isaias",
  "jeremias",
  "lamentaciones",
  "baruc",
  "ezequiel",
  "daniel",
  "oseas",
  "joel",
  "amos",
  "abdias",
  "jonas",
  "miqueas",
  "nahum",
  "habacuc",
  "sofonias",
  "hageo",
  "zacarias",
  "malaquias",
  // Nuevo Testamento
  "mateo",
  "marcos",
  "lucas",
  "juan",
  "hechos",
  "romanos",
  "1 corintios",
  "2 corintios",
  "galatas",
  "efesios",
  "filipenses",
  "colosenses",
  "1 tesalonicenses",
  "2 tesalonicenses",
  "1 timoteo",
  "2 timoteo",
  "tito",
  "filemon",
  "hebreos",
  "santiago",
  "1 pedro",
  "2 pedro",
  "1 juan",
  "2 juan",
  "3 juan",
  "judas",
  "apocalipsis",
];

// Correcciones de voz / tipeo frecuentes
const CORRECCIONES = {
  misaias: "isaias",
  isaias: "isaias",
  isaías: "isaias",
  lamentaciones: "lamentaciones",
  lamentacion: "lamentaciones",
  mateo: "mateo",
  matheo: "mateo",
  juan: "juan",
  "san juan": "juan",
  salmo: "salmos",
  salmos: "salmos",
  apocalipsis: "apocalipsis",
  revelacion: "apocalipsis",
  sabiduria: "sabiduria",
  siracida: "eclesiastico",
};

/**
 * Inicializa los eventos del buscador de la Biblia
 */
export function initSearch() {
  const btnBuscar = document.getElementById("btn-ejecutar-busqueda");
  if (btnBuscar) {
    btnBuscar.addEventListener("click", ejecutarBusqueda);
  }
}

/**
 * Función principal de búsqueda
 */
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

  let inputParaCita = palabrasANumeros(inputOriginal);
  inputParaCita = inputParaCita
    .replace(/capitulo|cap\.?/g, " ")
    .replace(/versiculos?|vers\.?|v\.?/g, " ")
    .replace(/\bal\b|\ba\b|\bhasta\b/g, "-")
    .replace(/[,;]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const inputLimpio = limpiarTexto(inputOriginal);
  const terminoBusqueda = inputLimpio;
  const palabrasBusqueda = terminoBusqueda
    .split(/\s+/)
    .filter((p) => p.length > 2);

  contenedorResultados.innerHTML = `<p class="placeholder-text">Buscando en las Escrituras...</p>`;

  try {
    // Si no tenemos los datos guardados en state, hacemos el fetch
    if (!state.bibliaData) {
      const respuesta = await fetch("data/biblia.json");
      state.bibliaData = await respuesta.json();
    }

    const datos = state.bibliaData;
    let encontrados = [];

    if (datos.verses && Array.isArray(datos.verses)) {
      let libroDetectado = null;
      let capituloBuscado = null;
      let versoDesde = null;
      let versoHasta = null;
      let esSoloLibro = false;

      const regexCita =
        /^([1-3]?\s*[a-zÁÉÍÓÚáéíóúñü]+(?:\s+[a-zÁÉÍÓÚáéíóúñü]+)?)\s+(\d{1,3})(?:\s*[:\s-]\s*(\d{1,3})(?:\s*-\s*(\d{1,3}))?)?$/i;
      const match = inputParaCita.match(regexCita);

      if (match) {
        let posible = limpiarTexto(match[1].replace(/\s+/g, " ").trim());
        if (CORRECCIONES[posible]) posible = CORRECCIONES[posible];

        libroDetectado = LIBROS.find(
          (l) =>
            l === posible || l.startsWith(posible) || posible.startsWith(l),
        );

        if (libroDetectado) {
          capituloBuscado = parseInt(match[2], 10);
          if (match[3]) {
            versoDesde = parseInt(match[3], 10);
            versoHasta = match[4] ? parseInt(match[4], 10) : versoDesde;
          }
        }
      }

      if (!libroDetectado) {
        let posible = inputLimpio;
        if (CORRECCIONES[posible]) posible = CORRECCIONES[posible];

        libroDetectado = LIBROS.find(
          (l) =>
            l === posible ||
            (posible.length >= 4 &&
              (l.startsWith(posible) || posible.startsWith(l))),
        );

        if (libroDetectado) {
          esSoloLibro = true;
        }
      }

      // Proceso de filtrado
      datos.verses.forEach((item) => {
        const libroItem = limpiarTexto(item.book_name || "");
        const textoLimpio = limpiarTexto(item.text || "");

        if (libroDetectado) {
          const coincideLibro =
            libroItem === libroDetectado ||
            libroItem.startsWith(libroDetectado) ||
            libroDetectado.startsWith(libroItem);

          if (coincideLibro) {
            if (esSoloLibro) {
              encontrados.push({
                referencia: `${item.book_name} ${item.chapter}:${item.verse}`,
                texto: item.text,
              });
            } else if (item.chapter === capituloBuscado) {
              if (versoDesde == null) {
                encontrados.push({
                  referencia: `${item.book_name} ${item.chapter}:${item.verse}`,
                  texto: item.text,
                });
              } else if (
                item.verse >= versoDesde &&
                item.verse <= (versoHasta || versoDesde)
              ) {
                encontrados.push({
                  referencia: `${item.book_name} ${item.chapter}:${item.verse}`,
                  texto: item.text,
                });
              }
            }
          }
        } else {
          if (textoLimpio.includes(terminoBusqueda)) {
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
        }
      });
    }

    // Guardar los resultados en el estado central
    state.resultadosBusqueda = encontrados;

    // Renderizar
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
          <div class="search-result-item" data-index="${inicio + i}"
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
// Agregar al final de js/bible/search.js

export function cerrarCajita() {
  const modalVentana = document.getElementById("modal-versiculo");
  if (modalVentana) {
    modalVentana.style.display = "none";
  }
}

export function abrirResultadoPorIndice(indiceGlobal) {
  console.log("Índice recibido:", indiceGlobal);

  // Usamos el array global o importado de búsquedas
  const resultados = window.resultadosBusquedaActuales || [];
  const item = resultados[indiceGlobal];

  if (!item) {
    console.warn("⚠️ No se encontró ningún item en ese índice.");
    return;
  }

  const modalTexto = document.getElementById("texto-versiculo");
  const modalVentana = document.getElementById("modal-versiculo");

  if (modalTexto) {
    modalTexto.innerHTML = `<strong style="color: var(--gold);">${item.referencia}</strong><br><br>"${item.texto}"`;
  } else {
    console.error("No se encontró el elemento #texto-versiculo en el HTML.");
  }

  if (modalVentana) {
    modalVentana.style.setProperty("display", "flex", "important");
    console.log("¡Apertura de modal realizada!");
  } else {
    console.error("No se encontró el elemento #modal-versiculo!");
  }
}

export function cerrarModalHerramientas() {
  const modal = document.getElementById("modal-herramientas");
  if (modal) {
    modal.style.display = "none";
  }
}
