/**
 * Polyfill para Zone.js que asegura la disponibilidad antes de la inicialización de Angular
 */

declare global {
  interface Window {
    Zone: any;
  }
}

// Verificar disponibilidad de Zone.js
if (typeof window !== 'undefined' && !window.Zone) {
  console.error('Zone.js not loaded - creating fallback');

  // Crear un fallback básico para Zone si no está disponible
  const FallbackZone = {
    current: {
      name: 'fallback',
      fork: () => FallbackZone.current,
      run: (callback: () => unknown) => callback(),
      runGuarded: (callback: () => unknown) => {
        try {
          return callback();
        } catch (error) {
          console.error('Zone fallback error:', error);
          return null;
        }
      }
    },
    root: {
      name: 'root',
      fork: () => FallbackZone.current,
      run: (callback: () => unknown) => callback()
    }
  };

  window.Zone = FallbackZone;

  // También lo asignamos globalmente
  (globalThis as any).Zone = FallbackZone;
}

export {};
