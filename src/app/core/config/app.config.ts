import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, ErrorHandler, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { routes } from '../routes/app.routes';

// Error handler personalizado para manejar errores de Zone.js
class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    // Detectar errores específicos de Zone.js (NG0908)
    if (error?.code === 'NG0908' || error?.message?.includes('NG0908')) {
      console.warn('Zone.js error detected, attempting recovery...');

      // Intentar recargar la página en caso de error crítico de Zone.js
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
      return;
    }

    // Para otros errores, usar manejo estándar
    console.error('Global error:', error);
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    // Configuración más robusta de Zone.js
    provideZoneChangeDetection({
      eventCoalescing: true,
      runCoalescing: true
    }),
    provideRouter(
      routes,
      withEnabledBlockingInitialNavigation(), // Importante para SSR
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled'
      })
    ),
    // Hidratación con event replay para mejor rendimiento
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    // Error handler personalizado
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    }
  ]
};
