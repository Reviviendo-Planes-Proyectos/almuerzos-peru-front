import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss'],
  standalone: true,
  imports: [MatIconModule, ButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HeroSectionComponent {
  handleFeatureClick(feature: string) {
    console.log(`Feature clicked: ${feature}`);
   }
}
