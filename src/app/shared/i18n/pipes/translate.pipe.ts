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

  transform(key: string): string {
    this.translation();
    return this.i18n.t(key);
  }
}
