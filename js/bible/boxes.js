// js/bible/boxes.js

export function cerrarPanelPorCompleto() {
  const studyCard = document.getElementById("study-card");
  const fanColumns = document.querySelectorAll(".fan-column");

  if (!studyCard) return;

  // Ocultar tarjeta y resetear animación
  studyCard.classList.add("hidden");
  studyCard.style.transform = "";

  // Resetear columnas expandidas
  fanColumns.forEach((c) => c.classList.remove("expanded-full"));

  if (typeof window.restaurarLecturaNormal === "function") {
    window.restaurarLecturaNormal();
  }
}

export function initBoxesEvents() {
  // Buscamos por la clase .panel-handle (o por ID por las dudas)
  const panelHandle =
    document.querySelector(".panel-handle") ||
    document.getElementById("panel-handle");
  const fanColumns = document.querySelectorAll(".fan-column");

  if (panelHandle) {
    // Escuchador directo por evento click
    panelHandle.onclick = () => {
      const studyCard = document.getElementById("study-card");
      if (studyCard) {
        studyCard.style.transition = "transform 0.2s ease-in";
        studyCard.style.transform = "translateY(100%)";

        setTimeout(() => {
          cerrarPanelPorCompleto();
        }, 200);
      }
    };
  }

  // Interactividad de las columnas del abanico y sus botones de cierre
  fanColumns.forEach((col) => {
    col.addEventListener("click", (e) => {
      if (!col.classList.contains("has-content")) return;
      if (e.target.classList.contains("btn-close-extended")) return;

      const yaEstabaAbierta = col.classList.contains("expanded-full");
      fanColumns.forEach((c) => c.classList.remove("expanded-full"));

      if (!yaEstabaAbierta) {
        col.classList.add("expanded-full");
      }
    });

    const btnClose = col.querySelector(".btn-close-extended");
    if (btnClose) {
      btnClose.addEventListener("click", (e) => {
        e.stopPropagation();
        col.classList.remove("expanded-full");
      });
    }
  });
}

export async function aplicarSubrayadosCapitulo(nombreLibro, numeroCapitulo) {
  try {
    let respuesta = await fetch("data/contenido.json");
    let datos = await respuesta.json();

    let keyLibro = nombreLibro.toLowerCase().trim();
    let idioma = window.idiomaActual || "es"; // Asume 'es' por defecto si no está definido

    // Verificamos paso a paso con corchetes y puntos según corresponda:
    if (
      !datos.idiomas ||
      !datos.idiomas[idioma] ||
      !datos.idiomas[idioma].libros ||
      !datos.idiomas[idioma].libros[keyLibro] ||
      !datos.idiomas[idioma].libros[keyLibro].capitulos[numeroCapitulo]
    ) {
      // Si no hay notas de estudio, igual aplicamos los resaltados personales del Fibrón
      aplicarResaltadosPersonales(nombreLibro, numeroCapitulo);
      return;
    }

    // Y para traer los datos del capítulo usamos la misma lógica:
    let capituloData =
      datos.idiomas[idioma].libros[keyLibro].capitulos[numeroCapitulo];

    const mapaColoresHex = {
      filologia: "#9b59b6",
      historico: "#ecf0f1",
      apologetica: "#e74c3c",
      sucesion: "#f1c40f",
    };

    // Función auxiliar para restaurar todo a su estado normal
    window.restaurarLecturaNormal = function () {
      document.querySelectorAll("[data-versiculo]").forEach((el) => {
        if (el.style.borderBottom && el.style.borderBottom !== "none") {
          el.style.borderBottom = "3px solid rgba(150, 150, 150, 0.3)";
        }
        el.style.opacity = "1";
      });

      const studyCard = document.getElementById("study-card");
      if (studyCard) {
        studyCard.classList.add("hidden");
      }

      const fanColumns = document.querySelectorAll(".fan-column");
      fanColumns.forEach((col) => {
        col.classList.remove("expanded-full");
        col.classList.remove("has-content");
        let textoExt = col.querySelector(".extended-text");
        if (textoExt) textoExt.innerHTML = "";
      });
    };

    // Limpieza inicial de la capa de estudio al cambiar de capítulo
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
            "3px solid rgba(184, 139, 139, 0.3)";
          elementoVersiculo.style.cursor = "pointer";
          elementoVersiculo.title =
            "Tocá para ver el estudio de este versículo";

          let colorPrincipal = "#d4af37";
          if (activas.length === 1) {
            colorPrincipal = mapaColoresHex[activas[0]] || "#d4af37";
          }

          // Evento al hacer clic en el versículo (Estudio)
          elementoVersiculo.onclick = (e) => {
            // Evitamos interferir si el modo Fibrón está activo en la barra superior
            if (window.modoFibronActivo) return;

            document.querySelectorAll("[data-versiculo]").forEach((el) => {
              if (el.style.borderBottom && el.style.borderBottom !== "none") {
                el.style.borderBottom = "1px solid rgba(150, 150, 150, 0.15)";
              }
              el.style.opacity = "1";
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

    // Finalmente, pintamos los resaltados de color personales (Fibrón)
    aplicarResaltadosPersonales(nombreLibro, numeroCapitulo);
  } catch (error) {
    console.error("Error al procesar los subrayados:", error);
  }
}

/* ==========================================================================
  /* ==========================================================================
   MÓDULO FIBRÓN / RESALTADOR PERSONAL Y BITÁCORA DE PASAJES
   ========================================================================== */

const STORAGE_KEY_RESALTADOS = "palabra_viva_resaltados";

/**
 * Mapeo de nombres de color a fondos RGBA suaves para el texto
 */
export function obtenerCodigoColorFibron(nombreColor) {
  switch (nombreColor) {
    case "verde":
      return "rgba(46, 204, 113, 0.35)";
    case "azul":
      return "rgba(52, 152, 219, 0.35)";
    case "rosa":
      return "rgba(233, 30, 99, 0.35)";
    case "amarillo":
    default:
      return "rgba(241, 196, 15, 0.35)";
  }
}

/**
 * Obtiene la lista de versículos resaltados personalmente por el usuario
 */
export function obtenerResaltadosPersonales() {
  try {
    const data = localStorage.getItem(STORAGE_KEY_RESALTADOS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Guarda, cambia o quita un resaltado con el Fibrón
 */
export function guardarResaltadoPersonal(
  nombreLibro,
  capitulo,
  versiculo,
  texto,
  color = "amarillo",
) {
  let lista = obtenerResaltadosPersonales();
  const capNum = Number(capitulo);
  const verNum = Number(versiculo);

  const idx = lista.findIndex(
    (item) =>
      item.libro === nombreLibro &&
      Number(item.capitulo) === capNum &&
      Number(item.versiculo) === verNum,
  );

  // Si eligió la Gomita de Borrar
  if (color === "borrar") {
    if (idx >= 0) {
      lista.splice(idx, 1); // Lo elimina de la lista
    }
  } else if (idx >= 0) {
    // Si ya existía y tocó EXACTAMENTE el mismo color, actúa como borrado (toggle)
    if (lista[idx].color === color) {
      lista.splice(idx, 1);
    } else {
      // Si eligió otro color, reemplaza el color guardado
      lista[idx].color = color;
    }
  } else {
    // Es un marcado nuevo
    lista.push({
      id: Date.now(),
      libro: nombreLibro,
      capitulo: capNum,
      versiculo: verNum,
      texto: texto,
      color: color,
      fecha: new Date().toLocaleDateString(),
    });
  }

  localStorage.setItem(STORAGE_KEY_RESALTADOS, JSON.stringify(lista));
}

/**
 * Pinta o limpia los versículos en pantalla según lo guardado en localStorage
 */
export function aplicarResaltadosPersonales(nombreLibro, numeroCapitulo) {
  const lista = obtenerResaltadosPersonales();
  const capNum = Number(numeroCapitulo);

  // 1. Limpieza visual previa de todos los versículos
  document.querySelectorAll("[data-versiculo]").forEach((el) => {
    el.style.backgroundColor = "transparent";
    el.style.padding = "0px";
    el.style.borderRadius = "0px";
  });

  // 2. Aplicar únicamente los resaltados guardados en la lista activa
  const delCapitulo = lista.filter(
    (item) => item.libro === nombreLibro && Number(item.capitulo) === capNum,
  );

  delCapitulo.forEach((item) => {
    const elVerso = document.querySelector(
      `[data-versiculo="${item.versiculo}"]`,
    );
    if (elVerso) {
      elVerso.style.backgroundColor = obtenerCodigoColorFibron(item.color);
      elVerso.style.borderRadius = "4px";
      elVerso.style.padding = "2px 6px";
    }
  });
}

/**
 * Borra TODOS los resaltados personales del capítulo activo
 */
export function borrarTodosResaltadosCapitulo(nombreLibro, numeroCapitulo) {
  let lista = obtenerResaltadosPersonales();
  const capNum = Number(numeroCapitulo);

  // Filtramos la lista dejando únicamente los versículos de OTROS capítulos o libros
  const listaFiltrada = lista.filter(
    (item) => !(item.libro === nombreLibro && Number(item.capitulo) === capNum),
  );

  // Guardamos la lista actualizada en localStorage
  localStorage.setItem(STORAGE_KEY_RESALTADOS, JSON.stringify(listaFiltrada));

  // Volvemos a renderizar la vista para que queden todos limpios
  aplicarResaltadosPersonales(nombreLibro, numeroCapitulo);
}
