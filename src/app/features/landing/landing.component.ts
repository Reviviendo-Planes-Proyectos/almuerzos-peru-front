import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { BenefitsSectionComponent } from './components/benefits-section/benefits-section.component';
import { HowItWorksSectionComponent } from './components/how-it-works-section/how-it-works-section.component';
import { TestimonialsSectionComponent } from './components/testimonials-section/testimonials-section.component';
import { PricingSectionComponent } from './components/pricing-section/pricing-section.component';
import { FinalCtaSectionComponent } from './components/final-cta-section/final-cta-section.component';
import { MatIconModule } from '@angular/material/icon';
import { provideAnimations } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  standalone: true,
  imports: [HeaderComponent, FooterComponent, HeroSectionComponent, BenefitsSectionComponent, HowItWorksSectionComponent, TestimonialsSectionComponent, PricingSectionComponent, FinalCtaSectionComponent, MatIconModule],
  providers: [provideAnimations()] // Proveer animaciones
})
export class LandingComponent {
  // Lógica del componente
}
