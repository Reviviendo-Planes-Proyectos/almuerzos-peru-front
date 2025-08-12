import { Component } from '@angular/core';
import { MaterialModule } from '../../../../../shared/material.module';
import { TranslatePipe } from '../../../../../shared/i18n';

@Component({
  selector: 'app-testimonials-section',
  standalone: true,
  imports: [MaterialModule, TranslatePipe],
  templateUrl: './testimonials-section.component.html',
  styleUrls: ['./testimonials-section.component.scss']
})
export class TestimonialsSectionComponent {
  testimonials = [
    {
      name: 'landing.testimonials.users.maria.name',
      role: 'landing.testimonials.users.maria.role',
      avatar: '/img/landing/young-professional-woman-lima.png',
      rating: 5,
      text: 'landing.testimonials.users.maria.text'
    },
    {
      name: 'landing.testimonials.users.carlos.name',
      role: 'landing.testimonials.users.carlos.role',
      avatar: '/img/landing/business-executive-lunch.png',
      rating: 5,
      text: 'landing.testimonials.users.carlos.text'
    },
    {
      name: 'landing.testimonials.users.roberto.name',
      role: 'landing.testimonials.users.roberto.role',
      avatar: '/img/landing/student-eating-lunch.png',
      rating: 5,
      text: 'landing.testimonials.users.roberto.text'
    }
  ];

  getStarArray(rating: number): number[] {
    return Array(rating).fill(0);
  }
}
