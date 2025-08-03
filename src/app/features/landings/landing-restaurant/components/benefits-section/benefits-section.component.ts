import { Component } from '@angular/core';
import { MaterialModule } from '../../../../../shared/material.module';

enum Audience {
  RESTAURANT = 'Para Restaurantes',
  CUSTOMER = 'Para Comensales'
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
export class BenefitsSectionComponent {
  audience = Audience;

  benefits: Benefit[] = [
    {
      audience: Audience.RESTAURANT,
      title: 'Actualización en Tiempo Real',
      subtitle: 'Actualiza tu menú en tiempo real con solo unos clics. Sin esperas, sin complicaciones.',
      icon: 'schedule',
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      audience: Audience.RESTAURANT,
      title: 'Comparte por WhatsApp',
      subtitle: 'Comparte tu menú directamente con los clientes a través de WhatsApp de forma instantánea.',
      icon: 'share',
      iconColor: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      audience: Audience.RESTAURANT,
      title: 'Publicidad Automática',
      subtitle: 'Sube tu menú y listo. Tu restaurante será visible para más clientes sin esfuerzos.',
      icon: 'campaign',
      iconColor: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      audience: Audience.CUSTOMER,
      title: 'Todo en un Solo Lugar',
      subtitle: 'Encuentra el menú diario de tu restaurante favorito en un solo lugar, fácil y rápido.',
      icon: 'menu_book',
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      audience: Audience.CUSTOMER,
      title: 'Filtro por Ubicación GPS',
      subtitle: 'Encuentra opciones cercanas con el filtro de ubicación GPS. Descubre nuevos sabores cerca de ti.',
      icon: 'place',
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      audience: Audience.CUSTOMER,
      title: 'Fotos y Precios Detallados',
      subtitle: 'Consulta fotos, precios y más desde tu teléfono. Decide con confianza.',
      icon: 'image',
      iconColor: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ];
}
