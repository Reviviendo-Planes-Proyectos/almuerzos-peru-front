import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { MaterialModule } from '../../../../../shared/material.module';

@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss'],
  standalone: true,
  imports: [MaterialModule, ButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HeroSectionComponent {
  handleFeatureClick(feature: string) {
    window.alert(`Feature clicked: ${feature}`);
  }
}
