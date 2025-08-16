import { Component } from '@angular/core';
import { MaterialModule } from '../../../../shared/modules';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { DinerHeroSectionComponent } from './components/diner-hero-section/diner-hero-section.component';
import { EnhancedSearchSectionComponent } from './components/enhanced-search-section/enhanced-search-section.component';
import { FeaturesSectionComponent } from './components/features-section/features-section.component';
import { FinalCtaSectionComponent } from './components/final-cta-section/final-cta-section.component';
import { HowItWorksSectionComponent } from './components/how-it-works-section/how-it-works-section.component';
import { TestimonialsSectionComponent } from './components/testimonials-section/testimonials-section.component';

@Component({
  selector: 'app-landing-diner',
  templateUrl: './landing-diner.component.html',
  styleUrls: ['./landing-diner.component.scss'],
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    DinerHeroSectionComponent,
    EnhancedSearchSectionComponent,
    FeaturesSectionComponent,
    HowItWorksSectionComponent,
    TestimonialsSectionComponent,
    FinalCtaSectionComponent,
    MaterialModule
  ]
})
export class LandingDinerComponent {
  // Lógica del componente
}
