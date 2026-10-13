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

    // Función auxiliar para restaurar todo a su estado normal
    window.restaurarLecturaNormal = function () {
      document.querySelectorAll("[data-versiculo]").forEach((el) => {
        if (el.style.borderBottom && el.style.borderBottom !== "none") {
          el.style.borderBottom = "3px solid rgba(150, 150, 150, 0.3)";
        }
        el.style.opacity = "1";
        el.style.backgroundColor = "transparent";
        el.style.padding = "0px";
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
            "3px solid rgba(184, 139, 139, 0.3)";
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
                el.style.borderBottom = "1px solid rgba(150, 150, 150, 0.15)";
              }
              el.style.opacity = "1";
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
