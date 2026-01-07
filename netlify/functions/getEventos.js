// ARCHIVO DESACTIVADO
exports.handler = async () => {
  return {
    statusCode: 410,
    body: JSON.stringify({ error: "Función desactivada" })
  };
};