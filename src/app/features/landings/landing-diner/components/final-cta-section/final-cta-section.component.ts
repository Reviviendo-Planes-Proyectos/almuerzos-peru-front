import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../../shared/material.module';

@Component({
  selector: 'app-final-cta-section',
  standalone: true,
  imports: [MaterialModule, FormsModule],
  templateUrl: './final-cta-section.component.html',
  styleUrls: ['./final-cta-section.component.scss']
})
export class FinalCtaSectionComponent {
  email = '';

  stats = [
    { value: '500+', label: 'Restaurantes verificados' },
    { value: '10k+', label: 'Usuarios activos' },
    { value: '4.8★', label: 'Calificación promedio' }
  ];

  onSubscribe() {
    // Implementar lógica de suscripción
  }
}
