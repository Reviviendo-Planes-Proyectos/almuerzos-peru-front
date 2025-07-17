import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();

// Configuración adicional para mostrar siempre el resumen de cobertura
Object.defineProperty(globalThis, '__coverage__', {
  value: {},
  writable: true,
  configurable: true,
});
