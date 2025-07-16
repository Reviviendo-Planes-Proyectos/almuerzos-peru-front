import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

enum StepId {
  REGISTRO = 1,
  MENU = 2,
  PUBLICAR = 3,
}

@Component({
  selector: 'app-how-it-works-section',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './how-it-works-section.component.html',
  styleUrls: ['./how-it-works-section.component.scss'],
})
export class HowItWorksSectionComponent {
  steps = [
    {
      id: StepId.REGISTRO,
      title: 'Regístrate',
      description: 'Regístrate como dueño de restaurante en menos de 2 minutos. Es completamente gratis.',
      image: 'https://images.unsplash.com/photo-1649034472225-2438b0c97d57',
      alt: 'Registro de restaurante en la plataforma',
    },
    {
      id: StepId.MENU,
      title: 'Sube tu Menú',
      description: 'Sube y actualiza tu menú diario con facilidad. Añade fotos, precios y descripciones.',
      image: 'https://images.unsplash.com/photo-1616578981448-9e9d74efe3c8',
      alt: 'Chef subiendo menú digital con fotos de platos',
    },
    {
      id: StepId.PUBLICAR,
      title: 'Publica y Comparte',
      description: 'Publica tu menú en una página web accesible y compártelo con tus clientes por WhatsApp.',
      image: 'https://images.unsplash.com/photo-1649034472225-2438b0c97d57',
      alt: 'Compartiendo menú digital por WhatsApp',
    },
  ];
}
