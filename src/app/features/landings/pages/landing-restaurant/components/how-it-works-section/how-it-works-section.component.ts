import { Component } from '@angular/core';
import { BaseTranslatableComponent, CoreModule, MaterialModule } from '../../../../../../shared/modules';

enum StepId {
  REGISTRO = 1,
  MENU = 2,
  PUBLICAR = 3
}

@Component({
  selector: 'app-how-it-works-section',
  standalone: true,
  imports: [CoreModule, MaterialModule],
  templateUrl: './how-it-works-section.component.html',
  styleUrls: ['./how-it-works-section.component.scss']
})
export class HowItWorksSectionComponent extends BaseTranslatableComponent {
  get steps() {
    return [
      {
        id: StepId.REGISTRO,
        title: this.t('landing.restaurant.howItWorks.steps.register.title'),
        description: this.t('landing.restaurant.howItWorks.steps.register.description'),
        image: 'https://images.unsplash.com/photo-1649034472225-2438b0c97d57?w=400&h=300&fit=crop&auto=format&q=80',
        alt: this.t('landing.restaurant.howItWorks.steps.register.alt')
      },
      {
        id: StepId.MENU,
        title: this.t('landing.restaurant.howItWorks.steps.uploadMenu.title'),
        description: this.t('landing.restaurant.howItWorks.steps.uploadMenu.description'),
        image: 'https://images.unsplash.com/photo-1616578981448-9e9d74efe3c8?w=400&h=300&fit=crop&auto=format&q=80',
        alt: this.t('landing.restaurant.howItWorks.steps.uploadMenu.alt')
      },
      {
        id: StepId.PUBLICAR,
        title: this.t('landing.restaurant.howItWorks.steps.publishShare.title'),
        description: this.t('landing.restaurant.howItWorks.steps.publishShare.description'),
        image: 'https://images.unsplash.com/photo-1649034472225-2438b0c97d57?w=400&h=300&fit=crop&auto=format&q=80',
        alt: this.t('landing.restaurant.howItWorks.steps.publishShare.alt')
      }
    ];
  }
}
