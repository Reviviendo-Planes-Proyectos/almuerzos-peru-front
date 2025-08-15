import { Component, inject } from '@angular/core';
import { CoreModule } from '../../../../shared/modules';
import { LoggerService } from '../../../../shared/services/logger/logger.service';

interface DiscoverRestaurant {
  id: number;
  name: string;
  location: string;
  image: string;
  rating: number;
  deliveryTime: string;
  distance: string;
  category: string;
  categoryColor: string;
  price: string;
  isPromoted?: boolean;
}

@Component({
  selector: 'app-discover-section',
  standalone: true,
  imports: [CoreModule],
  templateUrl: './discover-section.component.html',
  styleUrl: './discover-section.component.scss'
})
export class DiscoverSectionComponent {
  private readonly logger = inject(LoggerService);

  // Propiedades para paginación
  currentPage = 0;
  itemsPerPage = 20;
  isLoading = false;
  hasMoreItems = true;

  // Lista completa de restaurantes (simulando API)
  private allRestaurants: DiscoverRestaurant[] = this.generateMockRestaurants();

  // Lista visible actual
  discoverRestaurants: DiscoverRestaurant[] = [];

  constructor() {
    this.loadInitialRestaurants();
  }

  // Cargar primeros 20 restaurantes
  private loadInitialRestaurants(): void {
    this.discoverRestaurants = this.allRestaurants.slice(0, this.itemsPerPage);
    this.currentPage = 1;
    this.logger.info('Initial restaurants loaded', this.discoverRestaurants.length);
  }

  // Cargar más restaurantes (scroll infinito)
  loadMoreRestaurants(): void {
    if (this.isLoading || !this.hasMoreItems) return;

    this.isLoading = true;
    this.logger.info('Loading more restaurants...');

    // Simular delay de API
    setTimeout(() => {
      const startIndex = this.currentPage * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      const newRestaurants = this.allRestaurants.slice(startIndex, endIndex);

      if (newRestaurants.length > 0) {
        this.discoverRestaurants = [...this.discoverRestaurants, ...newRestaurants];
        this.currentPage++;
        this.logger.info('More restaurants loaded', newRestaurants.length);
      }

      // Verificar si hay más elementos
      this.hasMoreItems = endIndex < this.allRestaurants.length;
      this.isLoading = false;
    }, 1000); // Simular 1 segundo de carga
  }

  // Generar datos mock de restaurantes
  private generateMockRestaurants(): DiscoverRestaurant[] {
    const restaurantNames = [
      'El Arándano',
      'Maido',
      'Central',
      'Lima 27',
      'Astrid y Gastón',
      'Panchita',
      'La Mar',
      'Isolina',
      'Fiesta',
      'Malabar',
      'Osso',
      'Rafael',
      'Pescados Capitales',
      'Amaz',
      'IK Restaurant',
      'Mérito',
      'Kjolle',
      'Mil Centro',
      'Costanera 700',
      'Statera',
      'Tanta',
      'Cala',
      'Barranco Beer Company',
      'El Mercado',
      'Sáenz Briones'
    ];

    const locations = ['Miraflores', 'San Isidro', 'Barranco', 'Jesús María', 'La Molina', 'Surco', 'Pueblo Libre'];
    const categories = [
      { name: 'Peruana', color: 'bg-red-500' },
      { name: 'Nikkei', color: 'bg-purple-500' },
      { name: 'Contemporánea', color: 'bg-blue-500' },
      { name: 'Gourmet', color: 'bg-green-500' },
      { name: 'Mariscos', color: 'bg-cyan-500' },
      { name: 'Fusión', color: 'bg-orange-500' }
    ];

    const restaurants: DiscoverRestaurant[] = [];

    for (let i = 0; i < 100; i++) {
      // Generar 100 restaurantes
      const category = categories[Math.floor(Math.random() * categories.length)];
      const restaurant: DiscoverRestaurant = {
        id: i + 1,
        name: `${restaurantNames[i % restaurantNames.length]} ${i > 24 ? `(Sucursal ${Math.ceil(i / 25)})` : ''}`,
        location: locations[Math.floor(Math.random() * locations.length)],
        image: `https://images.unsplash.com/photo-${1517248135467 + i}?w=400&h=300&fit=crop&auto=format`,
        rating: +(3.5 + Math.random() * 1.5).toFixed(1),
        deliveryTime: `${15 + Math.floor(Math.random() * 30)}-${25 + Math.floor(Math.random() * 35)} min`,
        distance: `${(1 + Math.random() * 12).toFixed(1)} km`,
        category: category.name,
        categoryColor: category.color,
        price: `S/ ${(15 + Math.random() * 85).toFixed(0)}`,
        isPromoted: Math.random() > 0.8 // 20% de restaurantes promocionados
      };
      restaurants.push(restaurant);
    }

    return restaurants;
  }

  // Método para manejar click en restaurante
  onRestaurantClick(restaurant: DiscoverRestaurant): void {
    this.logger.info('Restaurant clicked:', restaurant.name);
    // Aquí iría la navegación al detalle del restaurante
  }

  // TrackBy para optimización de rendimiento
  trackByRestaurant(_index: number, restaurant: DiscoverRestaurant): number {
    return restaurant.id;
  }

  // Manejo de errores de imagen
  onImageError(event: any): void {
    event.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop';
    this.logger.error('Error loading restaurant image');
  }
}
