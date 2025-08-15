// Angular Universal SSR handler for Vercel
let expressApp = null;

module.exports = async function handler(req, res) {
  try {
    // Initialize Express app on first request (cold start optimization)
    if (!expressApp) {
      const { app } = await import('../dist/almuerzos-peru-front/server/server.mjs');
      expressApp = app();
    }

    // Set security headers
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    // Forward request to Angular Universal Express app
    expressApp(req, res);

  } catch (error) {
    console.error('SSR Error:', error);
    res.status(500).json({
      error: 'Server Side Rendering failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};
