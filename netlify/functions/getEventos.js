export async function handler(event) {
  try {
    const dias = event.queryStringParameters?.dias || 7;
    const sector = event.queryStringParameters?.sector || "ALL";

    const GOOGLE_SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycbxakcoust-d-geI214--f4NJy8C_VR0Dm5IYVbE_JRgHnMvE-wnZTSjQdxb3SzeDLICSQ/exec";

    const url = `${GOOGLE_SCRIPT_URL}?dias=${dias}&sector=${encodeURIComponent(sector)}`;

    const resp = await fetch(url);
    if (!resp.ok) throw new Error("Error al consultar Google Script");

    const data = await resp.json();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}

