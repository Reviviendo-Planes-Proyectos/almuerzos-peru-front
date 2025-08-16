import { Component } from '@angular/core';
import { BaseTranslatableComponent, MaterialModule } from '../../../../../../shared/modules';

@Component({
  selector: 'app-diner-hero-section',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './diner-hero-section.component.html',
  styleUrls: ['./diner-hero-section.component.scss']
})
export class DinerHeroSectionComponent extends BaseTranslatableComponent {
  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
