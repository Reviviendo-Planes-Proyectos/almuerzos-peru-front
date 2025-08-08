import { Component } from '@angular/core';
import { MaterialModule } from '../../../../../shared/material.module';

@Component({
  selector: 'app-testimonials-section',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './testimonials-section.component.html',
  styleUrls: ['./testimonials-section.component.scss']
})
export class TestimonialsSectionComponent {
  testimonials = [
    {
      name: 'Carla Rodríguez',
      role: '29 años, diseñadora gráfica',
      avatar: '/img/landing/young-professional-woman-lima.png',
      rating: 5,
      text: 'Yo almuerzo cerca del trabajo en Surco y siempre caía en lo mismo. Con esta app descubrí 3 huariques que no sabía que existían.'
    },
    {
      name: 'Julio Fernández',
      role: '31 años, técnico en telecomunicaciones',
      avatar: '/img/landing/business-executive-lunch.png',
      rating: 5,
      text: 'La carta estaba actualizada y pude pagar con Yape. Súper práctico.'
    },
    {
      name: 'David García',
      role: '34 años, repartidor',
      avatar: '/img/landing/student-eating-lunch.png',
      rating: 5,
      text: 'Me gustó que pude ver los precios antes de salir. Ya no gasto más de la cuenta.'
    }
  ];

  getStarArray(rating: number): number[] {
    return Array(rating).fill(0);
  }
}
