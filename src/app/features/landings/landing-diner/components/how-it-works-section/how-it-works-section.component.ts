import { Component } from '@angular/core';
import { TranslatePipe } from '../../../../../shared/i18n';
import { MaterialModule } from '../../../../../shared/material.module';

@Component({
  selector: 'app-how-it-works-section',
  standalone: true,
  imports: [MaterialModule, TranslatePipe],
  templateUrl: './how-it-works-section.component.html',
  styleUrls: ['./how-it-works-section.component.scss']
})
export class HowItWorksSectionComponent {
  steps = [
    {
      step: '1',
      title: 'landing.howItWorks.steps.search.title',
      description: 'landing.howItWorks.steps.search.description',
      image: '/img/landing/search-interface.png'
    },
    {
      step: '2',
      title: 'landing.howItWorks.steps.explore.title',
      description: 'landing.howItWorks.steps.explore.description',
      image: '/img/landing/peruvian-menu-board.png'
    },
    {
      step: '3',
      title: 'landing.howItWorks.steps.enjoy.title',
      description: 'landing.howItWorks.steps.enjoy.description',
      image: '/img/landing/happy-office-workers-eating.png'
    }
  ];
}
