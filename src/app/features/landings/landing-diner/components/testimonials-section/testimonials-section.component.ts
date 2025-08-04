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
      name: 'María González',
      role: 'Ejecutiva en San Isidro',
      avatar: '/img/landing/young-professional-woman-lima.png',
      rating: 5,
      text: 'Increíble! Ahora encuentro los mejores menús cerca de mi oficina en segundos. Ya no pierdo tiempo buscando dónde almorzar.'
    },
    {
      name: 'Carlos Mendoza',
      role: 'Estudiante PUCP',
      avatar: '/img/landing/business-executive-lunch.png',
      rating: 5,
      text: 'Perfecto para estudiantes. Los precios están actualizados y puedo ver las opciones más económicas cerca de la universidad.'
    },
    {
      name: 'Roberto Silva',
      role: 'Gerente en Miraflores',
      avatar: '/img/landing/student-eating-lunch.png',
      rating: 5,
      text: 'La app me ha cambiado la vida. Ahora puedo planificar mis almuerzos de trabajo y siempre encuentro opciones de calidad.'
    }
  ];

  getStarArray(rating: number): number[] {
    return Array(rating).fill(0);
  }
}
