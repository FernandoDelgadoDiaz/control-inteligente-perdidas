// ===============================
// CONFIGURACIÓN
// ===============================
const API_URL = "https://script.google.com/macros/s/AKfycby4QCiHE9BI496qmBwY7-ZnCFKUSkV1UPBXegu8xAnq18s4kFfglBLCVaZtum585K6IUQ/exec";

const output = document.getElementById("output");
const btnGenerar = document.getElementById("btnGenerar");
const selectReporte = document.getElementById("tipoReporte");
const selectSucursal = document.getElementById("sucursal");
const selectSector = document.getElementById("sector");

// ===============================
// HELPERS
// ===============================
function mostrarMensaje(msg, color = "#7CFC98") {
  output.innerHTML = `<p style="color:${color}">${msg}</p>`;
}

function formatoFecha(fecha) {
  return new Date(fecha).toLocaleDateString("es-AR");
}

// ===============================
// FETCH A GOOGLE SHEETS
// ===============================
async function obtenerEventos() {
  try {
    mostrarMensaje("Cargando datos reales desde Google Sheets…", "#FFD966");

    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Error al obtener datos");

    const data = await response.json();
    return data;
  } catch (err) {
    mostrarMensaje("❌ Error al conectar con Google Sheets", "#FF6B6B");
    console.error(err);
    return [];
  }
}

// ===============================
// FILTROS
// ===============================
function filtrarEventos(eventos) {
  const tipoReporte = selectReporte.value;
  const sucursal = selectSucursal.value;
  const sector = selectSector.value;

  let filtrados = [...eventos];

  // Filtro sucursal
  if (sucursal !== "todas") {
    filtrados = filtrados.filter(e => e.sucursal === sucursal);
  }

  // Filtro sector
  if (sector !== "todos") {
    filtrados = filtrados.filter(e => e.sector === sector);
  }

  // Filtro tipo reporte
  if (tipoReporte === "rag") {
    filtrados = filtrados.filter(e => e.tipo === "RAG");
  }

  if (tipoReporte === "donaciones") {
    filtrados = filtrados.filter(e => e.tipo === "DONACION");
  }

  return filtrados;
}

// ===============================
// RENDER
// ===============================
function renderEventos(eventos) {
  if (eventos.length === 0) {
    mostrarMensaje("⚠️ No hay eventos para los filtros seleccionados", "#FFD966");
    return;
  }

  let html = `<table class="tabla">
    <thead>
      <tr>
        <th>Fecha</th>
        <th>Tipo</th>
        <th>Sector</th>
        <th>Artículo</th>
        <th>Cantidad</th>
        <th>Kg</th>
        <th>Importe</th>
      </tr>
    </thead>
    <tbody>`;

  eventos.forEach(e => {
    let color = "#FFFFFF";

    if (e.alerta === "ROJO") color = "#FF6B6B";
    if (e.alerta === "AMARILLO") color = "#FFD966";

    html += `
      <tr style="background:${color}">
        <td>${formatoFecha(e.fecha)}</td>
        <td>${e.tipo}</td>
        <td>${e.sector}</td>
        <td>${e.articulo}</td>
        <td>${e.unidades || "-"}</td>
        <td>${e.kg || "-"}</td>
        <td>$${Number(e.total).toFixed(2)}</td>
      </tr>`;
  });

  html += "</tbody></table>";
  output.innerHTML = html;
}

// ===============================
// EVENTO PRINCIPAL
// ===============================
btnGenerar.addEventListener("click", async () => {
  const eventos = await obtenerEventos();
  const filtrados = filtrarEventos(eventos);
  renderEventos(filtrados);
});

// ===============================
// ESTADO INICIAL
// ===============================
mostrarMensaje("Esperando carga de archivos y selección de reporte.");