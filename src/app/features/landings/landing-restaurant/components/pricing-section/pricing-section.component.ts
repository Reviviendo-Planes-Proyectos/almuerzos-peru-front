import { Component } from '@angular/core';
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
export class PricingSectionComponent {
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
        { label: 'Integración con POS' },
        { label: 'Capacitación personalizada' },
        { label: 'Soporte para cadenas' }
      ],
      buttonLabel: 'Contactar Ventas',
      buttonClass: 'bg-gray-900 hover:bg-gray-800 text-white',
      bgClass: 'bg-white',
      borderClass: 'border-gray-200'
    }
  ];

  comparisonFeatures: ComparisonFeature[] = [
    {
      name: 'Menú digital básico',
      free: true,
      premium: true,
      enterprise: true
    },
    {
      name: 'Número de platos',
      free: '20',
      premium: 'Ilimitados',
      enterprise: 'Ilimitados'
    },
    {
      name: 'Pagos en línea integrados',
      free: false,
      premium: true,
      enterprise: true
    },
    {
      name: 'Soporte',
      free: 'Email',
      premium: '24/7 Premium',
      enterprise: 'Dedicado'
    },
    {
      name: 'Analytics y reportes',
      free: false,
      premium: true,
      enterprise: 'Avanzados'
    }
  ];
}
