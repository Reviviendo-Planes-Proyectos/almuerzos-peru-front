import './zone-polyfill';
import { provideHttpClient } from '@angular/common/http';
import { APP_INITIALIZER } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/core/config/app.config';
import { I18nService, initializeTranslations } from './app/shared/i18n';

// Función para manejar errores de bootstrap
async function startApp(): Promise<void> {
  try {
    // Verificar que Zone.js esté disponible antes de hacer bootstrap
    if (typeof (window as any).Zone === 'undefined') {
      console.error('Zone.js not loaded properly');
      throw new Error('Zone.js initialization failed');
    }

    await bootstrapApplication(AppComponent, {
      providers: [
        ...appConfig.providers,
        provideAnimations(),
        provideHttpClient(),
        {
          provide: APP_INITIALIZER,
          useFactory: initializeTranslations,
          deps: [I18nService],
          multi: true
        }
      ]
    });
  } catch (error) {
    console.error('Error during application bootstrap:', error);

    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorCode = (error as any)?.code;

    // Si es un error de Zone.js, intentar recargar después de un delay
    if (errorMessage.includes('Zone') || errorCode === 'NG0908' || errorMessage.includes('NG0908')) {
      console.warn('Zone.js error detected, reloading page...');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      // Para otros errores, mostrar mensaje de error al usuario
      document.body.innerHTML = `
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          flex-direction: column;
          font-family: Arial, sans-serif;
          background: #f8f9fa;
          color: #333;
        ">
          <h1 style="margin-bottom: 16px;">Error de Aplicación</h1>
          <p style="margin-bottom: 16px;">Ha ocurrido un error al cargar la aplicación.</p>
          <button onclick="window.location.reload()" style="
            padding: 12px 24px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          ">
            Recargar Página
          </button>
        </div>
      `;
    }
  }
}

// Iniciar la aplicación
startApp();
