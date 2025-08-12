import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { MaterialModule } from '../../../../../shared/material.module';
import { I18nService } from '../../../../../shared/translations';

enum PlanType {
  FREE = 'free',
  PREMIUM = 'premium',
  ENTERPRISE = 'enterprise'
}

interface PlanFeature {
  label: string;
}

interface Plan {
  type: PlanType;
  title: string;
  price: string;
  period: string;
  popular?: boolean;
  features: PlanFeature[];
  buttonLabel: string;
  buttonClass: string;
  bgClass: string;
  borderClass: string;
}

interface ComparisonFeature {
  name: string;
  free: string | boolean;
  premium: string | boolean;
  enterprise: string | boolean;
}

@Component({
  selector: 'app-pricing-section',
  templateUrl: './pricing-section.component.html',
  styleUrls: ['./pricing-section.component.scss'],
  standalone: true,
  imports: [MaterialModule]
})
export class PricingSectionComponent implements AfterViewInit {
  isAnnual = false;
  private i18n = inject(I18nService);

  protected t = (key: string): string => {
    return this.i18n.t(key);
  };

  // Precios base mensuales
  monthlyPrices = {
    [PlanType.FREE]: 'S/ 0',
    [PlanType.PREMIUM]: 'S/ 10',
    [PlanType.ENTERPRISE]: 'S/ 25'
  };

  // Precios anuales
  annualPrices = {
    [PlanType.FREE]: 'S/ 0',
    [PlanType.PREMIUM]: 'S/ 200',
    [PlanType.ENTERPRISE]: 'S/ 500'
  };

  get plans(): Plan[] {
    const plans = [
      {
        type: PlanType.FREE,
        title: this.t('landing.restaurant.pricing.plans.free.title'),
        price: 'S/ 0',
        period: this.t('landing.restaurant.pricing.plans.free.period'),
        features: [
          { label: this.t('landing.restaurant.pricing.plans.free.features.menuBasic') },
          { label: this.t('landing.restaurant.pricing.plans.free.features.dishes') },
          { label: this.t('landing.restaurant.pricing.plans.free.features.whatsapp') },
          { label: this.t('landing.restaurant.pricing.plans.free.features.realTime') },
          { label: this.t('landing.restaurant.pricing.plans.free.features.support') }
        ],
        buttonLabel: this.t('landing.restaurant.pricing.plans.free.button'),
        buttonClass: 'bg-gray-900 hover:bg-gray-800 text-white',
        bgClass: 'bg-white',
        borderClass: 'border-gray-200'
      },
      {
        type: PlanType.PREMIUM,
        title: this.t('landing.restaurant.pricing.plans.premium.title'),
        price: this.isAnnual ? this.annualPrices[PlanType.PREMIUM] : this.monthlyPrices[PlanType.PREMIUM],
        period: this.isAnnual
          ? this.t('landing.restaurant.pricing.periods.annual')
          : this.t('landing.restaurant.pricing.periods.monthly'),
        popular: true,
        features: [
          { label: this.t('landing.restaurant.pricing.plans.premium.features.menuCustom') },
          { label: this.t('landing.restaurant.pricing.plans.premium.features.dishesUnlimited') },
          { label: this.t('landing.restaurant.pricing.plans.premium.features.cardsUnlimited') },
          { label: this.t('landing.restaurant.pricing.plans.premium.features.reports') },
          { label: this.t('landing.restaurant.pricing.plans.premium.features.support24') },
          { label: this.t('landing.restaurant.pricing.plans.premium.features.promotionsUnlimited') }
        ],
        buttonLabel: this.t('landing.restaurant.pricing.plans.premium.button'),
        buttonClass:
          'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white',
        bgClass: 'bg-yellow-100/25',
        borderClass: 'border-orange-300'
      },
      {
        type: PlanType.ENTERPRISE,
        title: this.t('landing.restaurant.pricing.plans.enterprise.title'),
        price: this.isAnnual ? this.annualPrices[PlanType.ENTERPRISE] : this.monthlyPrices[PlanType.ENTERPRISE],
        period: this.isAnnual
          ? this.t('landing.restaurant.pricing.periods.annual')
          : this.t('landing.restaurant.pricing.periods.monthly'),
        features: [
          { label: this.t('landing.restaurant.pricing.plans.enterprise.features.allPremium') },
          { label: this.t('landing.restaurant.pricing.plans.enterprise.features.multiRestaurant') },
          { label: this.t('landing.restaurant.pricing.plans.enterprise.features.brandCustomization') },
          { label: this.t('landing.restaurant.pricing.plans.enterprise.features.posIntegration') },
          { label: this.t('landing.restaurant.pricing.plans.enterprise.features.autoBilling') },
          { label: this.t('landing.restaurant.pricing.plans.enterprise.features.personalizedTraining') },
          { label: this.t('landing.restaurant.pricing.plans.enterprise.features.smartCombos') }
        ],
        buttonLabel: this.t('landing.restaurant.pricing.plans.enterprise.button'),
        buttonClass: 'bg-gray-900 hover:bg-gray-800 text-white',
        bgClass: 'bg-white',
        borderClass: 'border-gray-200'
      }
    ];
    return plans;
  }

  togglePricing(annual: boolean) {
    this.isAnnual = annual;
    this.updatePrices();
  }

  @ViewChild('pricingContainer') pricingContainer!: ElementRef;

  ngAfterViewInit() {
    setTimeout(() => {
      this.scrollToPremiumPlan();
    }, 300);
  }

  private scrollToPremiumPlan() {
    if (this.pricingContainer && window.innerWidth < 768) {
      const container = this.pricingContainer.nativeElement;
      const premiumCard = container.querySelector('[data-plan="premium"]') as HTMLElement;

      if (premiumCard) {
        const containerWidth = container.offsetWidth;
        const cardWidth = premiumCard.offsetWidth;
        const cardOffsetLeft = premiumCard.offsetLeft;

        const flexContainer = container.querySelector('.flex') as HTMLElement;
        const paddingLeft = flexContainer ? parseInt(getComputedStyle(flexContainer).paddingLeft) : 16;

        const scrollPosition = cardOffsetLeft - (containerWidth - cardWidth) / 2 - paddingLeft;

        container.scrollTo({
          left: Math.max(0, scrollPosition),
          behavior: 'smooth'
        });
      }
    }
  }

  private updatePrices() {
    // Los planes se regeneran automáticamente con el getter
    // Solo necesitamos detectar cambios
  }

  // Control de filas visibles en la tabla de comparación
  showAllFeatures = false;
  defaultVisibleRows = 6;

  get comparisonFeatures(): ComparisonFeature[] {
    return [
      {
        name: this.t('landing.restaurant.pricing.comparison.features.digitalMenu'),
        free: true,
        premium: true,
        enterprise: true
      },
      {
        name: this.t('landing.restaurant.pricing.comparison.features.numberOfDishes'),
        free: '20',
        premium: this.t('landing.restaurant.pricing.comparison.features.unlimited'),
        enterprise: this.t('landing.restaurant.pricing.comparison.features.unlimited')
      },
      {
        name: this.t('landing.restaurant.pricing.comparison.features.whatsappShare'),
        free: true,
        premium: true,
        enterprise: true
      },
      {
        name: this.t('landing.restaurant.pricing.comparison.features.realTimeUpdates'),
        free: true,
        premium: true,
        enterprise: true
      },
      {
        name: this.t('landing.restaurant.pricing.comparison.features.emailSupport'),
        free: true,
        premium: false,
        enterprise: false
      },
      {
        name: this.t('landing.restaurant.pricing.comparison.features.onlinePayments'),
        free: false,
        premium: true,
        enterprise: true
      },
      {
        name: this.t('landing.restaurant.pricing.comparison.features.performanceReports'),
        free: false,
        premium: true,
        enterprise: true
      },
      {
        name: this.t('landing.restaurant.pricing.comparison.features.premium24Support'),
        free: false,
        premium: true,
        enterprise: true
      },
      {
        name: this.t('landing.restaurant.pricing.comparison.features.advancedCustomization'),
        free: false,
        premium: true,
        enterprise: true
      },
      {
        name: this.t('landing.restaurant.pricing.comparison.features.detailedAnalytics'),
        free: false,
        premium: true,
        enterprise: true
      },
      {
        name: this.t('landing.restaurant.pricing.comparison.features.multipleLocations'),
        free: false,
        premium: this.t('landing.restaurant.pricing.comparison.features.upTo3'),
        enterprise: this.t('landing.restaurant.pricing.comparison.features.unlimited')
      },
      {
        name: this.t('landing.restaurant.pricing.comparison.features.multiRestaurantManagement'),
        free: false,
        premium: false,
        enterprise: true
      },
      {
        name: this.t('landing.restaurant.pricing.comparison.features.customApi'),
        free: false,
        premium: false,
        enterprise: true
      },
      {
        name: this.t('landing.restaurant.pricing.comparison.features.posIntegration'),
        free: false,
        premium: false,
        enterprise: true
      },
      {
        name: this.t('landing.restaurant.pricing.comparison.features.dedicatedAccountManager'),
        free: false,
        premium: false,
        enterprise: true
      }
    ];
  }

  // Devuelve las filas a mostrar según el estado del botón
  get visibleComparisonFeatures(): ComparisonFeature[] {
    return this.showAllFeatures ? this.comparisonFeatures : this.comparisonFeatures.slice(0, this.defaultVisibleRows);
  }

  toggleShowAllFeatures() {
    this.showAllFeatures = !this.showAllFeatures;
  }
}
