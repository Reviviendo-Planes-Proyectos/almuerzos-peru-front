import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { MaterialModule } from '../../../../../shared/material.module';
import { I18nService } from '../../../../../shared/i18n';

@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss'],
  standalone: true,
  imports: [MaterialModule, ButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HeroSectionComponent {
  private i18n = inject(I18nService);

  protected t = (key: string): string => {
    return this.i18n.t(key);
  };

  handleFeatureClick(feature: string) {
    window.alert(`Feature clicked: ${feature}`);
  }
}
