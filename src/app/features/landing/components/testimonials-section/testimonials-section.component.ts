import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

enum Role {
  DUENO = 'Dueño de restaurante',
  DUENA = 'Dueña de restaurante',
  CHEF = 'Chef y dueño',
}

@Component({
  selector: 'app-testimonials-section',
  standalone: true,
  templateUrl: './testimonials-section.component.html',
  styleUrls: ['./testimonials-section.component.scss'],
  imports: [MatCardModule, CommonModule, MatIconModule],
})
export class TestimonialsSectionComponent {
  roles = Role;

  testimonials = [
    {
      name: 'Juan Pérez',
      role: Role.DUENO,
      restaurant: 'Restaurante El Sabor',
      image: 'https://images.unsplash.com/photo-1659354218682-86007e49d844',
      text: `Gracias a esta plataforma, podemos mantener nuestro menú siempre actualizado y nuestros clientes ahora nos encuentran más fácilmente. ¡Las ventas aumentaron un 40%!"`,
      rating: 3
    },
    {
      name: 'María González',
      role: Role.DUENA,
      restaurant: 'Cocina Tradicional',
      image: 'https://images.unsplash.com/photo-1615090509943-dd93a62a60f6',
      text: `La facilidad para actualizar nuestro menú diario es increíble. Antes perdíamos clientes por no tener información actualizada. Ahora todo es automático.`,
      rating: 5
    },
    {
      name: 'Carlos Mendoza',
      role: Role.CHEF,
      restaurant: 'Bistró Moderno',
      image: 'https://images.unsplash.com/photo-1698827623494-c4e1196ba0ca',
      text: `Nuestros clientes aman poder ver las fotos de los platos antes de venir. El sistema de WhatsApp nos ha conectado mejor con nuestra comunidad.`,
      rating: 4
    }
  ];
}
