module.exports = async (req, res) => {
  try {
    const { app } = await import('../dist/almuerzos-peru-front/server/server.mjs');
    const expressApp = app();
    return expressApp(req, res);
  } catch (error) {
    console.error('Error loading server:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
