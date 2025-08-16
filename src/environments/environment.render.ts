export const environment = {
  production: true,
  apiUrl: 'https://almuerzos-peru.fly.dev/api/v1', // URL del backend en producción

  // Optimizaciones específicas para Render
  render: {
    optimizeInitialLoad: true,
    preloadTranslations: true,
    enableResourceHints: true,
    criticalCSSInline: true,
    lazyLoadNonCritical: true
  }
};
