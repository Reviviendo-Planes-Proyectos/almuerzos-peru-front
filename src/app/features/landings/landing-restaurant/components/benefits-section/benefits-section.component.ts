import { Component } from '@angular/core';
import { BaseTranslatableComponent } from '../../../../../shared/i18n';
import { MaterialModule } from '../../../../../shared/material.module';

enum Audience {
  RESTAURANT = 'restaurant',
  CUSTOMER = 'customer'
}

interface Benefit {
  audience: Audience;
  title: string;
  subtitle: string;
  icon: string;
  iconColor: string;
  bgColor: string;
}
@Component({
  selector: 'app-benefits-section',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './benefits-section.component.html',
  styleUrls: ['./benefits-section.component.scss']
})
export class BenefitsSectionComponent extends BaseTranslatableComponent {
  audience = Audience;

  get benefits(): Benefit[] {
    return [
      {
        audience: Audience.RESTAURANT,
        title: this.t('landing.restaurant.benefits.realTimeUpdate.title'),
        subtitle: this.t('landing.restaurant.benefits.realTimeUpdate.subtitle'),
        icon: 'schedule',
        iconColor: 'text-blue-600',
        bgColor: 'bg-blue-100'
      },
      {
        audience: Audience.RESTAURANT,
        title: this.t('landing.restaurant.benefits.whatsappShare.title'),
        subtitle: this.t('landing.restaurant.benefits.whatsappShare.subtitle'),
        icon: 'share',
        iconColor: 'text-green-600',
        bgColor: 'bg-green-100'
      },
      {
        audience: Audience.RESTAURANT,
        title: this.t('landing.restaurant.benefits.freeAdvertising.title'),
        subtitle: this.t('landing.restaurant.benefits.freeAdvertising.subtitle'),
        icon: 'campaign',
        iconColor: 'text-red-600',
        bgColor: 'bg-red-100'
      },
      {
        audience: Audience.CUSTOMER,
        title: this.t('landing.restaurant.benefits.allInOnePlace.title'),
        subtitle: this.t('landing.restaurant.benefits.allInOnePlace.subtitle'),
        icon: 'menu_book',
        iconColor: 'text-orange-600',
        bgColor: 'bg-orange-100'
      },
      {
        audience: Audience.CUSTOMER,
        title: this.t('landing.restaurant.benefits.gpsFilter.title'),
        subtitle: this.t('landing.restaurant.benefits.gpsFilter.subtitle'),
        icon: 'place',
        iconColor: 'text-purple-600',
        bgColor: 'bg-purple-100'
      },
      {
        audience: Audience.CUSTOMER,
        title: this.t('landing.restaurant.benefits.exclusivePromotions.title'),
        subtitle: this.t('landing.restaurant.benefits.exclusivePromotions.subtitle'),
        icon: 'image',
        iconColor: 'text-yellow-600',
        bgColor: 'bg-yellow-100'
      }
    ];
  }
}
