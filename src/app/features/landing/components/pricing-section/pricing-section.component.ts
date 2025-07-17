import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

enum PlanType {
  FREE = 'free',
  PREMIUM = 'premium',
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

@Component({
  selector: 'app-pricing-section',
  templateUrl: './pricing-section.component.html',
  styleUrls: ['./pricing-section.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class PricingSectionComponent {
  plans: Plan[] = [
    {
      type: PlanType.FREE,
      title: 'Plan Gratuito',
      price: 'S/ 0',
      period: 'Para siempre',
      features: [
        { label: 'Menú digital básico' },
        { label: 'Hasta 20 platos' },
        { label: 'Compartir por WhatsApp' },
        { label: 'Actualizaciones en tiempo real' },
        { label: 'Soporte por email' },
      ],
      buttonLabel: 'Comenzar Gratis',
      buttonClass: 'bg-gray-900 hover:bg-gray-800 text-white',
      bgClass: 'bg-white',
      borderClass: 'border-gray-200',
    },
    {
      type: PlanType.PREMIUM,
      title: 'Plan Premium',
      price: 'S/ 10',
      period: 'por mes',
      popular: true,
      features: [
        { label: 'Todo del plan gratuito' },
        { label: 'Platos ilimitados' },
        { label: 'Pagos en línea integrados' },
        { label: 'Informes de desempeño' },
        { label: 'Soporte premium 24/7' },
        { label: 'Personalización avanzada' },
      ],
      buttonLabel: 'Comenzar Premium',
      buttonClass:
        'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white',
      bgClass: 'bg-yellow-100/25',
      borderClass: 'border-orange-300',
    },
  ];
}
