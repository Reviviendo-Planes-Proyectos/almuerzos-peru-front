import { Component } from '@angular/core';
import { BaseTranslatableComponent } from '../../../i18n';

@Component({
  selector: 'app-lang',
  standalone: true,
  imports: [],
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.scss'
})
export class LangComponent extends BaseTranslatableComponent {
  change(e: Event) {
    const lang = (e.target as HTMLSelectElement).value as 'es' | 'en';
    this.i18n.setLang(lang);
  }
}
