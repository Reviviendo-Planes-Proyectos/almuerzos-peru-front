import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MaterialModule } from '../../../../../shared/material.module';

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

  plans: Plan[] = [
    {
      type: PlanType.FREE,
      title: 'Plan Gratuito',
      price: 'S/ 0',
      period: 'Para siempre',
      features: [
        { label: 'Menú digital básico con hasta 5 cartas' },
        { label: 'Hasta 20 platos' },
        { label: 'Compartir por WhatsApp' },
        { label: 'Actualizaciones en tiempo real' },
        { label: 'Soporte por email. Hasta 5 promociones diarias' }
      ],
      buttonLabel: 'Comenzar Gratis',
      buttonClass: 'bg-gray-900 hover:bg-gray-800 text-white',
      bgClass: 'bg-white',
      borderClass: 'border-gray-200'
    },
    {
      type: PlanType.PREMIUM,
      title: 'Plan Premium',
      price: 'S/ 10',
      period: 'por mes',
      popular: true,
      features: [
        { label: 'Menú digital personalizado' },
        { label: 'Platos ilimitados' },
        { label: 'Cartas ilimitadas' },
        { label: 'Reporte de informes' },
        { label: 'Soporte premium 24/7' },
        { label: 'Promociones ilimitadas' }
      ],
      buttonLabel: 'Comenzar Premium',
      buttonClass:
        'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white',
      bgClass: 'bg-yellow-100/25',
      borderClass: 'border-orange-300'
    },

    {
      type: PlanType.ENTERPRISE,
      title: 'Plan Empresarial',
      price: 'S/ 25',
      period: 'por mes',
      features: [
        { label: 'Todo del plan premium' },
        { label: 'Función multi-restaurante' },
        { label: 'Personalización marca o sede' },
        { label: 'Integración con POS' },
        { label: 'Facturación automática' },
        { label: 'Capacitación personalizada' },
        { label: 'Gestión de combos inteligentes' }
      ],
      buttonLabel: 'Contactar Ventas',
      buttonClass: 'bg-gray-900 hover:bg-gray-800 text-white',
      bgClass: 'bg-white',
      borderClass: 'border-gray-200'
    }
  ];

  togglePricing(annual: boolean) {
    this.isAnnual = annual;
    this.updatePrices();
  }

  @ViewChild('pricingContainer') pricingContainer!: ElementRef;

  ngAfterViewInit() {
    // Scroll automático al plan Premium en móvil después de que la vista se haya inicializado
    // Aumentamos el timeout para asegurar renderizado completo
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

        // Obtener el padding del contenedor flex para compensar
        const flexContainer = container.querySelector('.flex') as HTMLElement;
        const paddingLeft = flexContainer ? parseInt(getComputedStyle(flexContainer).paddingLeft) : 16; // 16px es el px-4 por defecto

        // Calcular la posición para centrar perfectamente la tarjeta Premium
        // Compensar el padding y centrar exactamente
        const scrollPosition = cardOffsetLeft - (containerWidth - cardWidth) / 2 - paddingLeft;

        container.scrollTo({
          left: Math.max(0, scrollPosition),
          behavior: 'smooth'
        });
      }
    }
  }

  private updatePrices() {
    this.plans = this.plans.map((plan) => ({
      ...plan,
      price: this.isAnnual ? this.annualPrices[plan.type] : this.monthlyPrices[plan.type],
      period: plan.type === PlanType.FREE ? 'Para siempre' : this.isAnnual ? 'por año' : 'por mes'
    }));
  }

  // Control de filas visibles en la tabla de comparación
  showAllFeatures = false;
  defaultVisibleRows = 6;
  comparisonFeatures: ComparisonFeature[] = [
    { name: 'Menú digital básico', free: true, premium: true, enterprise: true },
    { name: 'Número de platos', free: '20', premium: 'ilimitados', enterprise: 'ilimitados' },
    { name: 'Compartir por WhatsApp', free: true, premium: true, enterprise: true },
    { name: 'Actualizaciones en tiempo real', free: true, premium: true, enterprise: true },
    { name: 'Soporte por email', free: true, premium: false, enterprise: false },
    { name: 'Pagos en línea integrados', free: false, premium: true, enterprise: true },
    { name: 'Informes de desempeño', free: false, premium: true, enterprise: true },
    { name: 'Soporte premium 24/7', free: false, premium: true, enterprise: true },
    { name: 'Personalización avanzada', free: false, premium: true, enterprise: true },
    { name: 'Analytics detallados', free: false, premium: true, enterprise: true },
    { name: 'Múltiples ubicaciones', free: false, premium: 'Hasta 3', enterprise: 'ilimitadas' },
    { name: 'Gestión multi-restaurante', free: false, premium: false, enterprise: true },
    { name: 'API personalizada', free: false, premium: false, enterprise: true },
    { name: 'Integración con POS', free: false, premium: false, enterprise: true },
    { name: 'Gerente de cuenta dedicado', free: false, premium: false, enterprise: true }
  ];

  // Devuelve las filas a mostrar según el estado del botón
  get visibleComparisonFeatures(): ComparisonFeature[] {
    return this.showAllFeatures ? this.comparisonFeatures : this.comparisonFeatures.slice(0, this.defaultVisibleRows);
  }

  toggleShowAllFeatures() {
    this.showAllFeatures = !this.showAllFeatures;
  }
}
