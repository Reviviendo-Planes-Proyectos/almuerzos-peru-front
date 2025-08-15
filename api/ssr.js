// Angular Universal SSR handler for Vercel
let expressApp = null;

module.exports = async function handler(req, res) {
  try {
    // Initialize Express app on first request (cold start optimization)
    if (!expressApp) {
      const { app } = await import('../dist/almuerzos-peru-front/server/server.mjs');
      expressApp = app();
    }

    // Forward request to Angular Universal Express app
    expressApp(req, res);

  } catch (error) {
    console.error('SSR Error:', error);
    
    // Fallback to client-side rendering
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Almuerzos Perú</title>
        <base href="/">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script>window.location.href = '/browser/index.html';</script>
      </head>
      <body>
        <div>Cargando...</div>
      </body>
      </html>
    `);
  }
};
