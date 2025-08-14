import { Component } from '@angular/core';
import { BaseTranslatableComponent, CoreModule, MaterialModule } from '../../../../../../shared/modules';

@Component({
  selector: 'app-testimonials-section',
  standalone: true,
  templateUrl: './testimonials-section.component.html',
  styleUrls: ['./testimonials-section.component.scss'],
  imports: [CoreModule, MaterialModule]
})
export class TestimonialsSectionComponent extends BaseTranslatableComponent {
  get testimonials() {
    return [
      {
        name: this.t('landing.restaurant.testimonials.users.rosa.name'),
        role: this.t('landing.restaurant.testimonials.users.rosa.role'),
        restaurant: this.t('landing.restaurant.testimonials.users.rosa.restaurant'),
        image: 'https://images.unsplash.com/photo-1659354218682-86007e49d844?w=80&h=80&fit=crop&auto=format&q=80',
        text: this.t('landing.restaurant.testimonials.users.rosa.text'),
        rating: 5
      },
      {
        name: this.t('landing.restaurant.testimonials.users.luis.name'),
        role: this.t('landing.restaurant.testimonials.users.luis.role'),
        restaurant: this.t('landing.restaurant.testimonials.users.luis.restaurant'),
        image: 'https://images.unsplash.com/photo-1615090509943-dd93a62a60f6?w=80&h=80&fit=crop&auto=format&q=80',
        text: this.t('landing.restaurant.testimonials.users.luis.text'),
        rating: 5
      },
      {
        name: this.t('landing.restaurant.testimonials.users.maricielo.name'),
        role: this.t('landing.restaurant.testimonials.users.maricielo.role'),
        restaurant: this.t('landing.restaurant.testimonials.users.maricielo.restaurant'),
        image: 'https://images.unsplash.com/photo-1698827623494-c4e1196ba0ca?w=80&h=80&fit=crop&auto=format&q=80',
        text: this.t('landing.restaurant.testimonials.users.maricielo.text'),
        rating: 4
      }
    ];
  }
}
