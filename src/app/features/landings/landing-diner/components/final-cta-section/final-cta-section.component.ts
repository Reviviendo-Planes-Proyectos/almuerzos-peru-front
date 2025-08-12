import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../../shared/material.module';
import { TranslatePipe } from '../../../../../shared/i18n';

@Component({
  selector: 'app-final-cta-section',
  standalone: true,
  imports: [MaterialModule, FormsModule, TranslatePipe],
  templateUrl: './final-cta-section.component.html',
  styleUrls: ['./final-cta-section.component.scss']
})
export class FinalCtaSectionComponent {
  email = '';

  stats = [
    { value: '500+', label: 'landing.diner.finalCta.stats.restaurants' },
    { value: '10k+', label: 'landing.diner.finalCta.stats.users' },
    { value: '4.8★', label: 'landing.diner.finalCta.stats.rating' }
  ];

  onSubscribe() {
    // Implementar lógica de suscripción
  }
}
