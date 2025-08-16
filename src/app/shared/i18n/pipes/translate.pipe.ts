import { computed, inject, Pipe, PipeTransform } from '@angular/core';
import { I18nService } from '../services/translation.service';

@Pipe({
  name: 't',
  standalone: true,
  pure: false
})
export class TranslatePipe implements PipeTransform {
  private readonly i18n = inject(I18nService);

  private translation = computed(() => {
    if (!this.i18n.isReady()) return null;
    return this.i18n.currentLang();
  });

  /**
   * Optimizado para evitar mostrar claves durante la carga inicial
   */
  transform(key: string, placeholder?: string): string {
    this.translation();

    // Si las traducciones no están listas, mostrar placeholder o cadena vacía
    if (!this.i18n.isReady()) {
      return placeholder || '';
    }

    return this.i18n.t(key);
  }
}
