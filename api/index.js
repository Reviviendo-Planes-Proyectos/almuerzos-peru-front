// Angular Universal SSR handler for Vercel
let app = null;

module.exports = async (req, res) => {
  try {
    // Initialize app on first request (cold start)
    if (!app) {
      const { app: createApp } = await import('../dist/almuerzos-peru-front/server/server.mjs');
      app = createApp();
    }

    // Forward request to Angular Universal Express app
    app(req, res);
  } catch (error) {
    console.error('SSR Error:', error);
    res.status(500).json({
      error: 'Server rendering failed',
      message: error.message
    });
  }
};
