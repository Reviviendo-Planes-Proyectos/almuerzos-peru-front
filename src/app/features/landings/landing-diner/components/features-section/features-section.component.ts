import { Component } from '@angular/core';
import { MaterialModule } from '../../../../../shared/material.module';

@Component({
  selector: 'app-features-section',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './features-section.component.html',
  styleUrls: ['./features-section.component.scss']
})
export class FeaturesSectionComponent {
  features = [
    {
      icon: 'search',
      title: 'Búsqueda inteligente',
      description: 'Encuentra restaurantes cerca de ti con menús actualizados diariamente',
      image: '/img/landing/lima-downtown-restaurants.png'
    },
    {
      icon: 'schedule',
      title: 'Ahorra tiempo',
      description: 'No más llamadas ni esperas. Ve el menú y precios al instante',
      image: '/img/landing/peruvian-menu-board.png'
    },
    {
      icon: 'location_on',
      title: 'Ubicación precisa',
      description: 'Restaurantes organizados por distrito y cercanía a tu ubicación',
      image: '/img/landing/lima-food-delivery.png'
    },
    {
      icon: 'favorite',
      title: 'Favoritos',
      description: 'Guarda tus restaurantes preferidos para acceso rápido',
      image: '/img/landing/restaurant-kitchen-cooking.png'
    }
  ];
}
