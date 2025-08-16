import { computed, inject } from '@angular/core';
import { I18nService } from './services/translation.service';

/**
 * Clase base abstracta para componentes que necesitan traducciones
 * Proporciona el método t() sin necesidad de repetir código
 * Optimizado para evitar flash de contenido no traducido
 */
export abstract class BaseTranslatableComponent {
  protected readonly i18n = inject(I18nService);
  protected readonly currentLang = this.i18n.currentLang;
  protected readonly isTranslationsReady = this.i18n.isReady;
  protected readonly langChanged = computed(() => this.currentLang());

  /**
   * Método optimizado de traducción que evita mostrar claves durante la carga
   */
  protected t = (key: string): string => {
    // Si las traducciones no están listas, retorna cadena vacía para evitar flash
    try {
      if (!this.isTranslationsReady || !this.isTranslationsReady()) {
        return '';
      }
    } catch {
      // En caso de error (tests), asumir que las traducciones están listas
      return this.i18n.t(key);
    }
    return this.i18n.t(key);
  };

  /**
   * Método de traducción que permite mostrar un placeholder mientras carga
   */
  protected tWithPlaceholder = (key: string, placeholder = '...'): string => {
    try {
      if (!this.isTranslationsReady || !this.isTranslationsReady()) {
        return placeholder;
      }
    } catch {
      // En caso de error (tests), asumir que las traducciones están listas
      return this.i18n.t(key);
    }
    return this.i18n.t(key);
  };
}
