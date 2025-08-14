import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BaseTranslatableComponent, CoreModule, MaterialModule } from '../../../../../../shared/modules';

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
  imports: [CoreModule, MaterialModule]
})
export class PricingSectionComponent extends BaseTranslatableComponent implements AfterViewInit, OnDestroy, OnInit {
  isAnnual = false;
  private isFirstLoad = true;

  monthlyPrices = {
    [PlanType.FREE]: 'S/ 0',
    [PlanType.PREMIUM]: 'S/ 20',
    [PlanType.ENTERPRISE]: 'S/ 50'
  };

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
          { label: this.t('landing.restaurant.pricing.plans.free.features.cards') },
          { label: this.t('landing.restaurant.pricing.plans.free.features.promotions') },
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

  // Plans reordenados para móvil: Premium en el centro
  get mobilePlans(): Plan[] {
    const allPlans = this.plans;
    const freePlan = allPlans.find((plan) => plan.type === PlanType.FREE);
    const premiumPlan = allPlans.find((plan) => plan.type === PlanType.PREMIUM);
    const enterprisePlan = allPlans.find((plan) => plan.type === PlanType.ENTERPRISE);

    return [freePlan, premiumPlan, enterprisePlan].filter(Boolean) as Plan[];
  }

  getPlansForDisplay(): Plan[] {
    return this.mobilePlans;
  }

  togglePricing(annual: boolean) {
    this.isAnnual = annual;
    this.updatePrices();

    setTimeout(() => {
      this.centerViewOnMobile();
    }, 100);
  }

  @ViewChild('pricingContainer') pricingContainer!: ElementRef;
  @ViewChild('comparisonContainer') comparisonContainer!: ElementRef;
  @ViewChild('pricingSection') pricingSection!: ElementRef;

  private intersectionObserver?: IntersectionObserver;
  private resizeListener?: () => void;

  ngOnInit() {
    if (typeof window !== 'undefined') {
      if (document.readyState === 'complete') {
        this.scheduleInitialCentering();
      } else {
        window.addEventListener(
          'load',
          () => {
            this.scheduleInitialCentering();
          },
          { once: true }
        );
      }
    }
  }

  private scheduleInitialCentering() {
    if (window.innerWidth < 768) {
      setTimeout(() => {
        this.centerViewOnMobileImmediate();
      }, 50);

      setTimeout(() => {
        this.centerComparisonOnMobile();
      }, 100);
    }
  }

  ngAfterViewInit() {
    this.setupIntersectionObserver();

    this.centerViewOnMobileImmediate();

    this.resizeListener = () => {
      setTimeout(() => {
        this.centerViewOnMobile();
        this.centerComparisonOnMobile();
      }, 100);
    };
    window.addEventListener('resize', this.resizeListener);
  }

  private centerViewOnMobileImmediate() {
    if (window.innerWidth < 768) {
      this.isFirstLoad = true;

      const attempts = [0, 50, 100, 200, 300, 500, 1000];

      for (const delay of attempts) {
        setTimeout(() => {
          if (window.innerWidth < 768) {
            this.centerViewOnMobile();
            this.centerComparisonOnMobile();
          }
        }, delay);
      }
    }
  }

  ngOnDestroy() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  private setupIntersectionObserver() {
    if (typeof window !== 'undefined' && this.pricingSection) {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && window.innerWidth < 768) {
              setTimeout(() => {
                this.centerViewOnMobile();
              }, 200);

              setTimeout(() => {
                this.centerComparisonOnMobile();
              }, 400);
            }
          }
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        }
      );

      this.intersectionObserver.observe(this.pricingSection.nativeElement);
    }
  }
  private centerViewOnMobile() {
    if (this.pricingContainer && window.innerWidth < 768) {
      const container = this.pricingContainer.nativeElement;
      const premiumCard = container.querySelector('[data-plan="premium"]') as HTMLElement;

      if (premiumCard) {
        const containerWidth = container.offsetWidth;
        const cardWidth = premiumCard.offsetWidth;
        const cardOffsetLeft = premiumCard.offsetLeft;

        const scrollPosition = cardOffsetLeft - (containerWidth - cardWidth) / 2;

        if (this.isFirstLoad) {
          container.scrollLeft = Math.max(0, scrollPosition);
          this.isFirstLoad = false;

          setTimeout(() => {
            container.scrollLeft = Math.max(0, scrollPosition);
          }, 10);
        } else {
          container.scrollTo({
            left: Math.max(0, scrollPosition),
            behavior: 'smooth'
          });
        }
      }
    }
  }

  private centerComparisonOnMobile() {
    if (this.comparisonContainer && window.innerWidth < 768) {
      const container = this.comparisonContainer.nativeElement;
      const premiumCard = container.querySelector('[data-comparison-plan="premium"]') as HTMLElement;

      if (premiumCard) {
        const containerWidth = container.offsetWidth;
        const cardWidth = premiumCard.offsetWidth;
        const cardOffsetLeft = premiumCard.offsetLeft;

        const scrollPosition = cardOffsetLeft - (containerWidth - cardWidth) / 2;

        container.scrollTo({
          left: Math.max(0, scrollPosition),
          behavior: 'smooth'
        });
      }
    }
  }

  private updatePrices() {
    // Los planes se regeneran automáticamente con el getter
  }

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

  get visibleComparisonFeatures(): ComparisonFeature[] {
    return this.showAllFeatures ? this.comparisonFeatures : this.comparisonFeatures.slice(0, this.defaultVisibleRows);
  }

  toggleShowAllFeatures() {
    this.showAllFeatures = !this.showAllFeatures;
  }
}
