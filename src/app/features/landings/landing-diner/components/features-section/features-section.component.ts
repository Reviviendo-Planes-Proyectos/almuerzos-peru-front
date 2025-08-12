import { Component } from '@angular/core';
import { BaseTranslatableComponent } from '../../../../../shared/i18n';
import { MaterialModule } from '../../../../../shared/material.module';

@Component({
  selector: 'app-features-section',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './features-section.component.html',
  styleUrls: ['./features-section.component.scss']
})
export class FeaturesSectionComponent extends BaseTranslatableComponent {
  features = [
    {
      icon: 'search',
      title: 'landing.features.smartSearch.title',
      description: 'landing.features.smartSearch.description',
      image: '/img/landing/lima-downtown-restaurants.png'
    },
    {
      icon: 'schedule',
      title: 'landing.features.saveTime.title',
      description: 'landing.features.saveTime.description',
      image: '/img/landing/peruvian-menu-board.png'
    },
    {
      icon: 'location_on',
      title: 'landing.features.location.title',
      description: 'landing.features.location.description',
      image: '/img/landing/lima-food-delivery.png'
    },
    {
      icon: 'favorite',
      title: 'landing.features.favorites.title',
      description: 'landing.features.favorites.description',
      image: '/img/landing/restaurant-kitchen-cooking.png'
    }
  ];
}
