import { Component } from '@angular/core';
import { MaterialModule } from '../../../../../shared/material.module';

enum Role {
  DUENO = 'Dueño de restaurante',
  DUENA = 'Dueña de restaurante',
  CHEF = 'Chef y dueño'
}

@Component({
  selector: 'app-testimonials-section',
  standalone: true,
  templateUrl: './testimonials-section.component.html',
  styleUrls: ['./testimonials-section.component.scss'],
  imports: [MaterialModule]
})
export class TestimonialsSectionComponent {
  roles = Role;

  testimonials = [
    {
      name: 'Rosa Méndez',
      role: Role.DUENO,
      restaurant: 'Antojitos Doña Rosa',
      image: 'https://images.unsplash.com/photo-1659354218682-86007e49d844?w=80&h=80&fit=crop&auto=format&q=80',
      text: `Antes actualizábamos el menú en un grupo de WhatsApp y nadie lo veía. Con Almuerza Perú, los clientes ya llegan sabiendo qué pedir. En 2 semanas, tuvimos más movimiento en el almuerzo que en todo un mes antes.`,
      rating: 5
    },
    {
      name: 'Luis Contreras',
      role: Role.DUENA,
      restaurant: 'Fonda San Martín – Callao',
      image: 'https://images.unsplash.com/photo-1615090509943-dd93a62a60f6?w=80&h=80&fit=crop&auto=format&q=80',
      text: `Lo mejor es que no necesito tener redes sociales ni pagar a nadie para publicar. Yo misma actualizo desde mi celular y los clientes nos encuentran por ubicación. ¡Hasta personas que vivían cerca, pero no nos conocían, ahora vienen a nosotros!`,
      rating: 5
    },
    {
      name: 'Maricielo Ramírez',
      role: Role.CHEF,
      restaurant: 'Cocina Criolla Familiar – Ate Vitarte',
      image: 'https://images.unsplash.com/photo-1698827623494-c4e1196ba0ca?w=80&h=80&fit=crop&auto=format&q=80',
      text: `Nos costaba mostrar todos los platos del menú diario porque cambiamos seguido. Ahora los subimos en 1 minuto y la gente los ve con foto, precio y hasta comenta. Se siente más profesional, aunque somos un negocio familiar.`,
      rating: 4
    }
  ];
}
