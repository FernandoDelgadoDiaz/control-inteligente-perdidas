const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    const {
      dias = 30,
      sector = "ALL",
      sucursal = "091"
    } = event.queryStringParameters || {};

    const SHEET_ID = "14Mftuoi14DSFz1z2xBNAui1dSy5bvc3GH5lNWGfrg8Q";
    const SHEET_NAME = "Eventos_RAG_Donaciones_MASTER";

    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;
    const res = await fetch(url);
    const text = await res.text();

    const json = JSON.parse(text.substring(47).slice(0, -2));
    const rows = json.table.rows;

    const hoy = new Date();
    const limite = new Date();
    limite.setDate(hoy.getDate() - Number(dias));

    const eventos = rows
      .map(r => ({
        fecha: new Date(r.c[0]?.v),
        sucursal: String(r.c[1]?.v || "").trim(),
        sector: String(r.c[2]?.v || "").trim(),
        codigo: String(r.c[3]?.v || "").trim(),
        producto: String(r.c[4]?.v || "").trim(),
        tipo: String(r.c[5]?.v || "").trim(),
        cantidad: Number(r.c[6]?.v || 0),
        unidad: String(r.c[7]?.v || "").trim()
      }))
      .filter(e =>
        e.fecha instanceof Date &&
        !isNaN(e.fecha) &&
        e.fecha >= limite &&
        e.sucursal === sucursal &&
        (sector === "ALL" || e.sector === sector)
      );

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventos)
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

