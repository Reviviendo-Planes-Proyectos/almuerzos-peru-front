module.exports = async (req, res) => {
  try {
    // Importar dinámicamente el servidor Angular
    const { app } = await import('../dist/almuerzos-peru-front/server/server.mjs');
    
    // Crear la instancia de Express
    const expressApp = app();
    
    // Manejar la request con Express
    return expressApp(req, res);
  } catch (error) {
    console.error('Error loading Angular SSR server:', error);
    
    // Fallback básico en caso de error
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Error - Almuerzos Peru</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body>
          <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
            <h1>Error del servidor</h1>
            <p>Lo sentimos, hay un problema temporal. Intenta de nuevo en unos minutos.</p>
            <script>
              setTimeout(() => {
                window.location.reload();
              }, 3000);
            </script>
          </div>
        </body>
      </html>
    `);
  }
};
