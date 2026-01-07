/**
 * Netlify Function: getEventos
 * Lee datos desde Google Sheets vía Google Apps Script
 * Compatible con Netlify (Node 18+ / Node 22)
 * NO usa node-fetch
 * NO requiere package.json
 */

exports.handler = async () => {
  try {
    // 🔴 URL REAL de tu Google Apps Script (ya deployado)
    const GOOGLE_SHEET_API_URL =
      "https://script.google.com/macros/s/AKfycbXXXXXXXXXXXXXXX/exec";

    const response = await fetch(GOOGLE_SHEET_API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error al consultar Google Sheets (status ${response.status})`
      );
    }

    const registros = await response.json();

    // Validación básica (NO inventa datos)
    if (!Array.isArray(registros)) {
      throw new Error("La respuesta no es un array válido");
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({
        ok: true,
        total_registros: registros.length,
        registros: registros,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        ok: false,
        error: error.message,
      }),
    };
  }
};