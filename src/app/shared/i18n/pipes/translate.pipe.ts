import { inject, Pipe, PipeTransform } from '@angular/core';
import { I18nService } from '../services/translation.service';

@Pipe({
  name: 't',
  standalone: true,
  pure: false
})
export class TranslatePipe implements PipeTransform {
  private readonly i18n = inject(I18nService);

  transform(key: string): string {
    return this.i18n.t(key);
  }
}
