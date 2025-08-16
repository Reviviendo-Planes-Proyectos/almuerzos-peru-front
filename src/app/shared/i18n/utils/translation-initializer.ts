import { I18nService } from '../services/translation.service';

/**
 * Factory function para inicializar las traducciones antes del arranque de la app
 * Se usa con APP_INITIALIZER para precargar las traducciones
 * Optimizado para Render: carga solo el idioma actual primero
 */
export function initializeTranslations(i18nService: I18nService) {
  return (): Promise<void> => {
    // Solo carga el idioma actual para optimizar el tiempo de inicio
    return i18nService.initializeTranslationsOptimized();
  };
}
