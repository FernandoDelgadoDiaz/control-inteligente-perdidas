export async function handler(event) {
  try {
    const dias = event.queryStringParameters?.dias || "7";
    const sector = event.queryStringParameters?.sector || "ALL";

    // URL OFICIAL DEL GS DE ANÁLISIS (VALIDADA)
    const GOOGLE_SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycbybjXxMFFaopLSN8-duzT1dKLPnxH8rb-FmAiFS2-gFTdgcf0WWlPxbTWIm0b6NK9Fz/exec";

    const url = `${GOOGLE_SCRIPT_URL}?dias=${dias}&sector=${encodeURIComponent(sector)}`;

    const resp = await fetch(url);
    if (!resp.ok) {
      throw new Error(`Error Google Script (${resp.status})`);
    }

    // NO parseamos acá: devolvemos tal cual
    const body = await resp.text();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ error: err.message })
    };
  }
}