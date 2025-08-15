import { computed, inject } from '@angular/core';
import { I18nService } from './services/translation.service';

/**
 * Clase base abstracta para componentes que necesitan traducciones
 * Proporciona el método t() sin necesidad de repetir código
 */
export abstract class BaseTranslatableComponent {
  protected readonly i18n = inject(I18nService);
  protected readonly currentLang = this.i18n.currentLang;
  protected readonly isTranslationsReady = this.i18n.isReady;
  protected readonly langChanged = computed(() => this.currentLang());

  protected t = (key: string): string => {
    return this.i18n.t(key);
  };
}
