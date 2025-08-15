import { I18nService } from '../services/translation.service';

/**
 * Factory function para inicializar las traducciones antes del arranque de la app
 * Se usa con APP_INITIALIZER para precargar las traducciones
 */
export function initializeTranslations(i18nService: I18nService) {
  return (): Promise<void> => {
    return i18nService.initializeTranslations();
  };
}
