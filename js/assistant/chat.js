// js/assistant/chat.js
// Manejadores de eventos de la interfaz del chat y procesamiento de mensajes

import {
  escaparHTML,
  obtenerTextoIdioma,
  normalizarTexto,
  obtenerPalabras,
  buscarEnSeccionJson,
  hacerHablarAlRobot,
  getEsperandoNombre,
  setEsperandoNombre,
} from "./engine.js";

export function devolverFocoPC() {
  const esMovil =
    /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    window.innerWidth <= 768;

  if (!esMovil) {
    setTimeout(() => {
      const inputChat = document.getElementById("chat-input");
      if (inputChat) {
        inputChat.focus();
      }
    }, 50);
  }
}

export function initChatEvents() {
  const inputChat = document.getElementById("chat-input");
  const btnEnviar = document.getElementById("chat-btn-enviar");
  const contenedorMensajes = document.getElementById("chat-mensajes");
  const linkAsistente = document.getElementById("link-asistente");
  const menuLateral = document.getElementById("menu-lateral");
  const btnMic = document.getElementById("btnMic");

  // 1. CONTROL DEL MICRÓFONO
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (btnMic) {
    if (!SpeechRecognition) {
      btnMic.style.opacity = "0.4";
      btnMic.title =
        "El reconocimiento de voz no está soportado en este navegador.";
    } else {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      btnMic.addEventListener("click", () => {
        if ("speechSynthesis" in window) {
          window.speechSynthesis.cancel();
        }

        if (!navigator.onLine) {
          console.warn("Sin conexión a internet para usar la voz.");
          return;
        }

        try {
          const idiomaActual = localStorage.getItem("idiomaApp") || "es";
          let langCode = "es-AR";
          if (idiomaActual === "en") langCode = "en-US";
          else if (idiomaActual === "pt") langCode = "pt-BR";

          recognition.lang = langCode;
          recognition.start();
        } catch (e) {
          console.log(
            "El micrófono ya estaba activo o hubo un error al iniciar:",
            e,
          );
        }
      });

      recognition.onstart = () => {
        btnMic.classList.add("mic-escuchando");
      };

      recognition.onresult = (event) => {
        const textoCapturado = event.results[0][0].transcript;
        console.log("Texto por voz:", textoCapturado);

        if (inputChat) {
          inputChat.value = textoCapturado;
        }
      };

      recognition.onerror = (event) => {
        console.warn("Error en reconocimiento de voz:", event.error);
        apagarMicrofono();
      };

      recognition.onend = () => {
        apagarMicrofono();
      };

      function apagarMicrofono() {
        btnMic.classList.remove("mic-escuchando");
      }
    }
  }

  // 2. NAVEGACIÓN Y TECLA ENTER
  if (linkAsistente) {
    linkAsistente.addEventListener("click", (e) => {
      e.preventDefault();
      if (
        typeof window.changeScreen === "function" &&
        typeof window.screenAsistente !== "undefined"
      ) {
        window.changeScreen(window.screenAsistente);
      }
      menuLateral?.classList.remove("active");
    });
  }

  inputChat?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      btnEnviar?.click();
      devolverFocoPC();
    }
  });

  const nombreGuardado = localStorage.getItem("nombrePalabraViva");

  // 3. CARGA INICIAL Y MENSAJE DE BIENVENIDA
  (async () => {
    try {
      const resRespuestas = await fetch("data/respuestas_asistente.json");
      window.datosAsistenteGlobal = await resRespuestas.json();
    } catch (e) {
      console.warn("No se pudo precargar el JSON inicial:", e);
      window.datosAsistenteGlobal = {};
    }

    if (contenedorMensajes) {
      let saludoInicialHTML = "";
      const datosLocales = window.datosAsistenteGlobal || {};
      const sistemasNombres = datosLocales.sistema_nombres || {};

      if (nombreGuardado) {
        const textoSaludado =
          obtenerTextoIdioma(sistemasNombres.saludado) ||
          `¡Qué alegría encontrarte de nuevo, ${nombreGuardado}! ¿De qué te gustaría que hablemos hoy?`;
        saludoInicialHTML = `<div class="mensaje-asistente"><strong>Asistente:</strong> ${textoSaludado}</div>`;
      } else {
        const textoPedir =
          obtenerTextoIdioma(sistemasNombres.pedir_nombre) ||
          `¡Hola ✨! ¡Qué alegría darte la bienvenida a Palabra Viva! Para empezar, ¿cuál es tu nombre de pila?`;
        saludoInicialHTML = `<div class="mensaje-asistente"><strong>Asistente:</strong> ${textoPedir}</div>`;
        setEsperandoNombre(true);
      }
      contenedorMensajes.innerHTML += saludoInicialHTML;
      contenedorMensajes.scrollTop = contenedorMensajes.scrollHeight;
    }
  })();

  // 4. PROCESAMIENTO DEL ENVÍO DE MENSAJES
  btnEnviar?.addEventListener("click", async () => {
    const textoUsuarioCrudo = inputChat.value.trim();

    if (textoUsuarioCrudo !== "") {
      const esMovil =
        /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
        window.innerWidth <= 768;

      if (esMovil) {
        inputChat.blur();
      } else {
        devolverFocoPC();
      }

      const textoUsuario = escaparHTML(textoUsuarioCrudo);
      let textoLimpio = normalizarTexto(textoUsuarioCrudo);
      let palabrasUsuario = obtenerPalabras(textoUsuarioCrudo);

      contenedorMensajes.innerHTML += `<div class="mensaje-usuario">${textoUsuario}</div>`;
      inputChat.value = "";
      contenedorMensajes.scrollTop = contenedorMensajes.scrollHeight;

      let respuestaAsistente = "";

      try {
        const datosMaestros = window.datosAsistenteGlobal || {};

        if (getEsperandoNombre()) {
          const palabrasScias = [
            "hola",
            "soy",
            "me",
            "llamo",
            "mi",
            "nombre",
            "es",
            "el",
            "un",
          ];
          const tokens = textoUsuarioCrudo
            .split(" ")
            .filter(
              (t) => !palabrasScias.includes(t.toLowerCase()) && t.length > 1,
            );
          const nombreIngresado = tokens[0]
            ? tokens[0].charAt(0).toUpperCase() +
              tokens[0].slice(1).toLowerCase()
            : textoUsuarioCrudo.split(" ")[0];

          if (nombreIngresado.length > 2) {
            localStorage.setItem("nombrePalabraViva", nombreIngresado);
            setEsperandoNombre(false);
            const respConNombre =
              datosMaestros.sistema_nombres?.saludo_con_nombre;
            const textoConNombre =
              obtenerTextoIdioma(respConNombre) ||
              `¡Mucho gusto, ${nombreIngresado} 🌟! Ya guardé tu nombre. ¿De qué charlamos hoy?`;
            respuestaAsistente = textoConNombre.replace(
              /\$\{nombreIngresado\}/g,
              nombreIngresado,
            );
          } else {
            const respPedir = datosMaestros.sistema_nombres?.pedir_nombre;
            respuestaAsistente =
              obtenerTextoIdioma(respPedir) ||
              "Contame, ¿cuál es tu primer nombre así nos conocemos mejor?💬";
          }
        } else {
          let procesadoConExito = false;

          // Acciones especiales
          if (
            textoLimpio.includes("borrar mi nombre") ||
            textoLimpio.includes("olvidar mi nombre")
          ) {
            localStorage.removeItem("nombrePalabraViva");
            setEsperandoNombre(true);
            respuestaAsistente =
              "Listo, borré el nombre que tenía guardado. ¿Cómo querés que te llame ahora?";
            procesadoConExito = true;
          }

          // Saludos y respuestas sociales
          if (!procesadoConExito) {
            let respuestaEncontrada = buscarEnSeccionJson(textoLimpio, {
              saludos: datosMaestros.saludos,
            });
            if (!respuestaEncontrada) {
              respuestaEncontrada = buscarEnSeccionJson(textoLimpio, {
                como_estas: datosMaestros.como_estas,
              });
            }
            if (!respuestaEncontrada) {
              respuestaEncontrada = buscarEnSeccionJson(
                textoLimpio,
                datosMaestros.identidad_asistente,
              );
            }
            if (!respuestaEncontrada) {
              respuestaEncontrada = buscarEnSeccionJson(textoLimpio, {
                despedidas: datosMaestros.despedidas,
              });
            }
            if (!respuestaEncontrada) {
              respuestaEncontrada = buscarEnSeccionJson(textoLimpio, {
                agradecimientos: datosMaestros.agradecimientos,
              });
            }
            if (!respuestaEncontrada) {
              respuestaEncontrada = buscarEnSeccionJson(
                textoLimpio,
                datosMaestros.respuestas_pastorales,
              );
            }
            if (!respuestaEncontrada) {
              respuestaEncontrada = buscarEnSeccionJson(
                textoLimpio,
                datosMaestros.guia_uso,
              );
            }
            if (!respuestaEncontrada && datosMaestros.preguntas_frecuentes) {
              const mapPreguntasFrecuentes = {};
              datosMaestros.preguntas_frecuentes.forEach((item, index) => {
                mapPreguntasFrecuentes[`faq_${index}`] = item;
              });
              respuestaEncontrada = buscarEnSeccionJson(
                textoLimpio,
                mapPreguntasFrecuentes,
              );
            }

            if (respuestaEncontrada) {
              respuestaAsistente = respuestaEncontrada;
              procesadoConExito = true;
            }
          }

          // Caminos interactivos globales
          if (!procesadoConExito) {
            if (
              textoLimpio.includes("razon") ||
              textoLimpio.includes("razón") ||
              (typeof window.pasoActualRazon !== "undefined" &&
                window.pasoActualRazon > 1)
            ) {
              respuestaAsistente = window.manejarCaminoRazon
                ? window.manejarCaminoRazon(textoUsuarioCrudo)
                : "";
              procesadoConExito = true;
            } else if (
              textoLimpio.includes("trinidad") ||
              (typeof window.pasoActualTrinidad !== "undefined" &&
                window.pasoActualTrinidad > 1)
            ) {
              respuestaAsistente = window.manejarCaminoTrinidad
                ? window.manejarCaminoTrinidad(textoUsuarioCrudo)
                : "";
              procesadoConExito = true;
            } else if (
              textoLimpio.includes("pesaj") ||
              (typeof window.pasoActualPascua !== "undefined" &&
                window.pasoActualPascua > 1)
            ) {
              respuestaAsistente = window.manejarCaminoPascua
                ? window.manejarCaminoPascua(textoUsuarioCrudo)
                : "";
              procesadoConExito = true;
            } else if (
              textoLimpio.includes("elohin") ||
              textoLimpio.includes("doble naturaleza") ||
              (typeof window.pasoActualDobleNaturaleza !== "undefined" &&
                window.pasoActualDobleNaturaleza > 1)
            ) {
              respuestaAsistente = window.manejarCaminoDobleNaturaleza
                ? window.manejarCaminoDobleNaturaleza(textoUsuarioCrudo)
                : "";
              procesadoConExito = true;
            } else if (
              textoLimpio.includes("alma") ||
              textoLimpio.includes("cuerpo y alma") ||
              (typeof window.pasoActualAlma !== "undefined" &&
                window.pasoActualAlma > 1)
            ) {
              respuestaAsistente = window.manejarCaminoAlma
                ? window.manejarCaminoAlma(textoUsuarioCrudo)
                : "";
              procesadoConExito = true;
            }
          }

          // Motor de catequesis
          if (!procesadoConExito) {
            try {
              const baseDatosCatequesis = datosMaestros.catequesis || [];
              let mejorMatchCat = null;
              let maxPuntosCat = 0;
              let categoriaActivaLocal = null;

              baseDatosCatequesis.forEach((item) => {
                let puntos = 0;
                const itemIdLimpio = item.id ? normalizarTexto(item.id) : "";

                if (itemIdLimpio && textoLimpio === itemIdLimpio) {
                  puntos += 300;
                }

                const idiomaActual =
                  window.idiomaActual ||
                  localStorage.getItem("idiomaApp") ||
                  "es";
                const datosItemIdioma = item[idiomaActual] || item.es || item;

                const textoPreguntaItem =
                  datosItemIdioma.pregunta_principal ||
                  datosItemIdioma.pregunta ||
                  item.pregunta_principal ||
                  item.pregunta ||
                  "";
                const preguntaItem = normalizarTexto(textoPreguntaItem);

                if (preguntaItem && textoLimpio === preguntaItem) {
                  puntos += 220;
                } else if (preguntaItem && textoLimpio.includes(preguntaItem)) {
                  puntos += 60;
                }

                if (item.keywords && Array.isArray(item.keywords)) {
                  item.keywords.forEach((kw) => {
                    const keywordLimpia = normalizarTexto(
                      typeof kw === "object" ? kw.palabra || kw.texto : kw,
                    );
                    const pesoExtra = typeof kw === "object" ? kw.peso || 0 : 0;

                    if (keywordLimpia.length < 3) return;

                    if (textoLimpio === keywordLimpia) {
                      puntos += 80 + pesoExtra;
                    } else if (
                      textoLimpio.includes(` ${keywordLimpia} `) ||
                      textoLimpio.startsWith(keywordLimpia + " ") ||
                      textoLimpio.endsWith(" " + keywordLimpia)
                    ) {
                      puntos += 35 + pesoExtra;
                    } else if (textoLimpio.includes(keywordLimpia)) {
                      puntos += 15 + pesoExtra;
                    }
                  });
                }

                palabrasUsuario.forEach((palabra) => {
                  if (palabra.length > 3 && preguntaItem.includes(palabra)) {
                    puntos += 4;
                  }
                });

                if (puntos > maxPuntosCat) {
                  maxPuntosCat = puntos;
                  mejorMatchCat = item;
                  categoriaActivaLocal = item.categoria || item.modulo || null;
                }
              });

              if (!mejorMatchCat || maxPuntosCat < 30) {
                const todosLosComodines = baseDatosCatequesis.filter(
                  (item) => item.id && item.id.startsWith("comodin-asistente"),
                );

                const comodinItem =
                  todosLosComodines.length > 0
                    ? todosLosComodines[
                        Math.floor(Math.random() * todosLosComodines.length)
                      ]
                    : null;

                if (comodinItem) {
                  const idiomaActual =
                    window.idiomaActual ||
                    localStorage.getItem("idiomaApp") ||
                    "es";
                  const datosComodinIdioma =
                    comodinItem[idiomaActual] || comodinItem.es || comodinItem;

                  const textoPrincipal =
                    datosComodinIdioma.pregunta_principal || "";
                  const respuestaBreve =
                    datosComodinIdioma.respuesta_breve || "";
                  const pasoConcreto = datosComodinIdioma.paso_concreto || "";

                  let respuestaConstruida = `<strong>${textoPrincipal}</strong><br><br>${respuestaBreve}<br><br>📌 ${pasoConcreto}`;

                  const itemsDisponibles = baseDatosCatequesis.filter(
                    (item) =>
                      !item.id || !item.id.startsWith("comodin-asistente"),
                  );
                  const relacionadosRandom = [...itemsDisponibles]
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 3);

                  if (relacionadosRandom.length > 0) {
                    const textoExplorar =
                      idiomaActual === "en"
                        ? "🧭 <strong>Keep exploring here?</strong><br>"
                        : idiomaActual === "pt"
                          ? "🧭 <strong>Continuar explorando por aqui?</strong><br>"
                          : "🧭 <strong>¿Seguimos explorando por acá?</strong><br>";

                    respuestaConstruida += `<br><br>${textoExplorar}`;
                    respuestaConstruida += `<div class="camino-botones-activos" style="margin-top: 10px; display: flex; flex-direction: column; gap: 6px;">`;

                    relacionadosRandom.forEach((rel) => {
                      const datosRelIdioma = rel[idiomaActual] || rel.es || rel;
                      const textoPregRel =
                        datosRelIdioma.pregunta_principal ||
                        datosRelIdioma.pregunta ||
                        "";
                      const preguntaLimpia = textoPregRel
                        .replace(/'/g, "\\'")
                        .replace(/"/g, "&quot;");

                      respuestaConstruida += `
<button onclick="enviarMensajeSugerido('${preguntaLimpia}')" style="background: #2c3e50; color: white; border: none; padding: 8px 14px; border-radius: 15px; cursor: pointer; text-align: left; font-family: inherit; font-size: 0.85rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
  📌 ${textoPregRel}
</button>
`;
                    });
                    respuestaConstruida += `</div>`;
                  }

                  respuestaAsistente = respuestaConstruida;
                  procesadoConExito = true;
                }
              } else if (mejorMatchCat && maxPuntosCat >= 30) {
                let respuestaConstruida =
                  typeof window.construirRespuestaCatequesis === "function"
                    ? window.construirRespuestaCatequesis(mejorMatchCat)
                    : mejorMatchCat.respuesta_breve || "";

                const relacionados = baseDatosCatequesis
                  .filter(
                    (item) =>
                      (item.categoria === categoriaActivaLocal ||
                        item.modulo === categoriaActivaLocal) &&
                      item.id !== mejorMatchCat.id,
                  )
                  .sort(() => 0.5 - Math.random())
                  .slice(0, 2);

                if (relacionados.length > 0) {
                  const idiomaActual =
                    window.idiomaActual ||
                    localStorage.getItem("idiomaApp") ||
                    "es";
                  const textoExplorar =
                    idiomaActual === "en"
                      ? "🧭 <strong>Keep exploring here?</strong><br>"
                      : idiomaActual === "pt"
                        ? "🧭 <strong>Continuar explorando por aqui?</strong><br>"
                        : "🧭 <strong>¿Seguimos explorando por acá?</strong><br>";

                  respuestaConstruida += `<br><br>${textoExplorar}`;
                  respuestaConstruida += `<div class="camino-botones-activos" style="margin-top: 10px; display: flex; flex-direction: column; gap: 6px;">`;

                  relacionados.forEach((rel) => {
                    const datosRelIdioma = rel[idiomaActual] || rel.es || rel;
                    const textoPregRel =
                      datosRelIdioma.pregunta_principal ||
                      datosRelIdioma.pregunta ||
                      "";
                    const preguntaLimpia = textoPregRel
                      .replace(/'/g, "\\'")
                      .replace(/"/g, "&quot;");

                    respuestaConstruida += `
                      <button onclick="enviarMensajeSugerido('${preguntaLimpia}')" style="background: #2c3e50; color: white; border: none; padding: 8px 14px; border-radius: 15px; cursor: pointer; text-align: left; font-family: inherit; font-size: 0.85rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                        📌 ${textoPregRel}
                      </button>
                    `;
                  });
                  respuestaConstruida += `</div>`;
                }

                respuestaAsistente = respuestaConstruida;
                procesadoConExito = true;
              }
            } catch (errCat) {
              console.error("Error en motor de catequesis unificado:", errCat);
            }
          }

          // Comodín humano final
          if (!procesadoConExito) {
            const comodinesHumanos = [
              "Qué tema ese. A veces nos pasa como con los átomos o con el viento: no los vemos con nuestros ojos, pero sabemos que están ahí. Contame un poco más de lo que estás pensando.",
              "Lo que decís me deja pensando. Este es un espacio para explorar la fe, la Palabra y nuestras dudas de todos los días. ¿Querés que busquemos algo sobre nuestra fe o charlemos sobre otro tema?",
              "¡Es para pensarlo! Acá podés venir con cualquier duda, desde historias de la Biblia hasta un ratito de oración. Contame un poco más hacia dónde te gustaría llevar la charla 🧉.",
              "Interesante lo que planteás. A veces las respuestas no vienen en un manual exacto, pero las vamos descubriendo al andar. ¿Querés que veamos algo de catequesis o preferís que charlemos tranquilos?",
            ];
            respuestaAsistente =
              comodinesHumanos[
                Math.floor(Math.random() * comodinesHumanos.length)
              ];
          }
        }
      } catch (error) {
        console.error("Error general procesando el JSON unificado:", error);
        respuestaAsistente =
          "Se me trabó un segundo la idea, pero acá sigo con vos. ¿Qué me decías?";
      }

      const textoCrudo =
        typeof respuestaAsistente === "string"
          ? respuestaAsistente
          : respuestaAsistente?.toString() || "";
      const textoParaVoz = textoCrudo
        .replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .trim();

      const botonesViejos =
        contenedorMensajes.querySelectorAll(".btn-voz-robot");
      botonesViejos.forEach((btn) => btn.remove());

      const divAsistente = document.createElement("div");
      divAsistente.className = "mensaje-asistente";

      const idiomaApp =
        window.idiomaActual || localStorage.getItem("idiomaApp") || "es";
      const textoBotonEscuchar =
        idiomaApp === "en"
          ? "🔊 Listen"
          : idiomaApp === "pt"
            ? "🔊 Ouvir"
            : "🔊 Escuchar";

      divAsistente.innerHTML = `<strong>Asistente:</strong><br>${textoCrudo}<br><button class="btn-voz-robot" style="margin-top:8px; background:#000; color:#D4AF37; border:1px solid #D4AF37; border-radius:20px; padding:6px 12px; cursor:pointer; font-size:12px;">${textoBotonEscuchar}</button>`;
      contenedorMensajes.appendChild(divAsistente);

      divAsistente
        .querySelector(".btn-voz-robot")
        .addEventListener("click", () => {
          hacerHablarAlRobot(textoParaVoz);
        });

      contenedorMensajes.scrollTop = contenedorMensajes.scrollHeight;
    }
  });
}

window.devolverFocoPC = devolverFocoPC;
