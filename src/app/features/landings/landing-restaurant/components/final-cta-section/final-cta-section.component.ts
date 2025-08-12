import { Component, inject } from '@angular/core';
import { MaterialModule } from '../../../../../shared/material.module';
import { I18nService } from '../../../../../shared/i18n';

@Component({
  selector: 'app-final-cta-section',
  standalone: true,
  templateUrl: './final-cta-section.component.html',
  styleUrls: ['./final-cta-section.component.scss'],
  imports: [MaterialModule]
})
export class FinalCtaSectionComponent {
  private i18n = inject(I18nService);

  protected t = (key: string): string => {
    return this.i18n.t(key);
  };

  onStartFree() {}
  onContactExpert() {}
}
