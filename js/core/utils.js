// js/core/utils.js
// Funciones auxiliares reutilizables

export function limpiarTexto(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ñ/g, "n");
}

export function escaparHTML(str = "") {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

export function normalizarTexto(str = "") {
  return limpiarTexto(str);
}

export function palabrasANumeros(texto = "") {
  const mapa = {
    cero: 0,
    uno: 1,
    una: 1,
    dos: 2,
    tres: 3,
    cuatro: 4,
    cinco: 5,
    seis: 6,
    siete: 7,
    ocho: 8,
    nueve: 9,
    diez: 10,
    once: 11,
    doce: 12,
    trece: 13,
    catorce: 14,
    quince: 15,
    dieciseis: 16,
    diecisiete: 17,
    dieciocho: 18,
    diecinueve: 19,
    veinte: 20,
    veintiuno: 21,
    veintidos: 22,
    veintitres: 23,
    veinticuatro: 24,
    veinticinco: 25,
    veintiseis: 26,
    veintisiete: 27,
    veintiocho: 28,
    veintinueve: 29,
    treinta: 30,
    cuarenta: 40,
    cincuenta: 50,
    sesenta: 60,
    setenta: 70,
    ochenta: 80,
    noventa: 90,
    cien: 100,
    ciento: 100,
  };

  let t = " " + limpiarTexto(texto) + " ";

  t = t.replace(
    /\b(treinta|cuarenta|cincuenta|sesenta|setenta|ochenta|noventa)\s+y\s+(uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve)\b/g,
    (m, dec, uni) => " " + (mapa[dec] + mapa[uni]) + " ",
  );

  Object.keys(mapa).forEach((palabra) => {
    const re = new RegExp(`\\b${palabra}\\b`, "g");
    t = t.replace(re, " " + mapa[palabra] + " ");
  });

  return t.replace(/\s+/g, " ").trim();
}
