// js/core/moods.js
// Módulo para la carga dinámica de estados de ánimo y lecturas diarias

export async function cargarEstadoAnimo(nombreEstado) {
  try {
    const idioma =
      window.idiomaActual || localStorage.getItem("idiomaApp") || "es";
    console.log("=== INICIO CARGA ESTADO ===", nombreEstado, "Idioma:", idioma);

    const respuesta = await fetch("data/estados.json");
    const data = await respuesta.json();
    let estadosArray = data.estados[nombreEstado];

    if (!estadosArray || estadosArray.length === 0) {
      console.warn("⚠️ No se encontró el array para el estado:", nombreEstado);
      return;
    }

    const hoy = new Date().toISOString().split("T")[0];
    let progreso = JSON.parse(
      localStorage.getItem(`progreso_${nombreEstado}`),
    ) || { dia: 0, fecha: "" };

    if (progreso.fecha !== hoy) {
      progreso.dia = (progreso.dia + 1) % estadosArray.length;
      progreso.fecha = hoy;
      localStorage.setItem(
        `progreso_${nombreEstado}`,
        JSON.stringify(progreso),
      );
    }

    const datosEstado = estadosArray[progreso.dia];
    console.log("📄 Datos del día obtenidos del JSON:", datosEstado);

    // Mapeo seguro buscando por ID de pantalla en el DOM o variables globales
    const estadosMap = {
      agradecido:
        window.screenAgradecido || document.getElementById("screen-agradecido"),
      bendecido:
        window.screenBendecido || document.getElementById("screen-bendecido"),
      cansado:
        window.screenCansado || document.getElementById("screen-cansado"),
      feliz: window.screenFeliz || document.getElementById("screen-feliz"),
      triste: window.screenTriste || document.getElementById("screen-triste"),
      ansioso:
        window.screenAnsioso || document.getElementById("screen-ansioso"),
      temeroso:
        window.screenTemeroso || document.getElementById("screen-temeroso"),
      preocupado:
        window.screenPreocupado || document.getElementById("screen-preocupado"),
      "en-paz": window.screenEnpaz || document.getElementById("screen-en-paz"),
    };

    const pantalla = estadosMap[nombreEstado];
    console.log("🖥️ Pantalla mapeada:", pantalla);
    if (!pantalla) {
      console.warn(
        "⚠️ No se encontró la variable de pantalla para:",
        nombreEstado,
      );
      return;
    }

    // 1. Título y Acogida
    const elTitulo = pantalla.querySelector(".titulo-estado");
    if (elTitulo) {
      elTitulo.textContent =
        nombreEstado.charAt(0).toUpperCase() + nombreEstado.slice(1);
    }

    const elAcogida = pantalla.querySelector(".acogida-estado");
    if (elAcogida && datosEstado.acogida) {
      const textoAcogida =
        typeof datosEstado.acogida === "object"
          ? datosEstado.acogida[idioma] || datosEstado.acogida.es
          : datosEstado.acogida;
      elAcogida.textContent = textoAcogida || "";
      console.log("✅ Acogida inyectada:", textoAcogida);
    }

    // 2. Evangelio (Referencia, Texto, Meditación)
    const elRef = pantalla.querySelector(".evangelio-referencia");
    if (elRef && datosEstado.evangelio) {
      elRef.textContent = datosEstado.evangelio.referencia || "";
    }

    const elTxt = pantalla.querySelector(".evangelio-texto");
    if (elTxt && datosEstado.evangelio) {
      const txtEv =
        typeof datosEstado.evangelio.texto === "object"
          ? datosEstado.evangelio.texto[idioma] ||
            datosEstado.evangelio.texto.es
          : datosEstado.evangelio.texto;
      elTxt.textContent = txtEv || "";
      console.log("✅ Texto evangelio inyectado:", txtEv);
    }

    const elMed = pantalla.querySelector(".evangelio-meditacion");
    if (elMed && datosEstado.evangelio) {
      const medEv =
        typeof datosEstado.evangelio.meditacion === "object"
          ? datosEstado.evangelio.meditacion[idioma] ||
            datosEstado.evangelio.meditacion.es
          : datosEstado.evangelio.meditacion;
      elMed.textContent = medEv || "";
    }

    // 3. Oración
    const elOracion = pantalla.querySelector(".oracion-texto");
    if (elOracion && datosEstado.oracion) {
      const txtOr =
        typeof datosEstado.oracion === "object"
          ? datosEstado.oracion[idioma] || datosEstado.oracion.es
          : datosEstado.oracion;
      elOracion.textContent = txtOr || "";
      console.log("✅ Oración inyectada:", txtOr);
    }

    // 4. Santo / Compañero de camino
    const elSanto = pantalla.querySelector(".santo-nombre");
    if (elSanto && datosEstado.companero_de_camino) {
      elSanto.textContent = datosEstado.companero_de_camino.santo || "";
    }

    const elRec = pantalla.querySelector(".santo-recomendacion");
    if (elRec && datosEstado.companero_de_camino) {
      const recSanto =
        typeof datosEstado.companero_de_camino.recomendacion === "object"
          ? datosEstado.companero_de_camino.recomendacion[idioma] ||
            datosEstado.companero_de_camino.recomendacion.es
          : datosEstado.companero_de_camino.recomendacion;
      elRec.textContent = recSanto || "";
    }

    // 5. Paso de hoy
    const elPaso = pantalla.querySelector(".paso-hoy-texto");
    if (elPaso && datosEstado.paso_de_hoy) {
      const txtPaso =
        typeof datosEstado.paso_de_hoy === "object"
          ? datosEstado.paso_de_hoy[idioma] || datosEstado.paso_de_hoy.es
          : datosEstado.paso_de_hoy;
      elPaso.textContent = txtPaso || "";
    }

    console.log("=== FIN INYECCIÓN EXITOSA ===");
  } catch (error) {
    console.error("❌ Error general en cargarEstadoAnimo:", error);
  }
}
