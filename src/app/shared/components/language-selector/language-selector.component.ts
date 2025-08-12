import { Component, inject } from '@angular/core';
import { I18nService, TranslatePipe } from '../../i18n';

@Component({
  selector: 'app-lang',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.scss'
})
export class LangComponent {
  i18n = inject(I18nService);

  change(e: Event) {
    const lang = (e.target as HTMLSelectElement).value as 'es' | 'en';
    this.i18n.setLang(lang);
  }
}
