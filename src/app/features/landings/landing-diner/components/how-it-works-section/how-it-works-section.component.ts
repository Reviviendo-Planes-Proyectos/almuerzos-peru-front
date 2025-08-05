import { Component } from '@angular/core';
import { MaterialModule } from '../../../../../shared/material.module';

@Component({
  selector: 'app-how-it-works-section',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './how-it-works-section.component.html',
  styleUrls: ['./how-it-works-section.component.scss']
})
export class HowItWorksSectionComponent {
  steps = [
    {
      step: '1',
      title: 'Busca tu zona',
      description: 'Ingresa tu ubicación o distrito en Lima',
      image: '/img/landing/search-interface.png'
    },
    {
      step: '2',
      title: 'Explora menús',
      description: 'Ve los menús diarios y precios actualizados',
      image: '/img/landing/peruvian-menu-board.png'
    },
    {
      step: '3',
      title: '¡Disfruta!',
      description: 'Dirígete al restaurante o haz tu pedido',
      image: '/img/landing/happy-office-workers-eating.png'
    }
  ];
}
