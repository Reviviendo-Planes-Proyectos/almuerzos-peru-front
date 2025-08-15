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

  currentPage = 0;
  itemsPerPage = 20;
  isLoading = false;
  hasMoreItems = true;

  private searchTerm = '';
  private filteredRestaurants: DiscoverRestaurant[] = [];

  get isSearching(): boolean {
    return this.searchTerm.length > 0;
  }

  get currentSearchTerm(): string {
    return this.searchTerm;
  }

  get totalResults(): number {
    return this.isSearching ? this.filteredRestaurants.length : this.allRestaurants.length;
  }

  private allRestaurants: DiscoverRestaurant[] = this.generateMockRestaurants();

  discoverRestaurants: DiscoverRestaurant[] = [];

  constructor() {
    this.loadInitialRestaurants();
  }

  private loadInitialRestaurants(): void {
    this.discoverRestaurants = this.allRestaurants.slice(0, this.itemsPerPage);
    this.currentPage = 1;
    this.logger.info('Initial restaurants loaded', this.discoverRestaurants.length);
  }

  loadMoreRestaurants(): void {
    if (this.isLoading || !this.hasMoreItems) return;

    this.isLoading = true;
    this.logger.info('Loading more restaurants...');

    setTimeout(() => {
      const dataSource = this.searchTerm ? this.filteredRestaurants : this.allRestaurants;
      const startIndex = this.currentPage * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      const newRestaurants = dataSource.slice(startIndex, endIndex);

      if (newRestaurants.length > 0) {
        this.discoverRestaurants = [...this.discoverRestaurants, ...newRestaurants];
        this.currentPage++;
        this.logger.info('More restaurants loaded', newRestaurants.length);
      }

      this.hasMoreItems = endIndex < dataSource.length;
      this.isLoading = false;
    }, 1000);
  }

  filterRestaurants(searchTerm: string): void {
    this.searchTerm = searchTerm.toLowerCase().trim();
    this.logger.info('Filtering restaurants with term:', this.searchTerm);

    if (!this.searchTerm) {
      this.resetToAllRestaurants();
      return;
    }

    this.filteredRestaurants = this.allRestaurants.filter(
      (restaurant) =>
        restaurant.name.toLowerCase().includes(this.searchTerm) ||
        restaurant.category.toLowerCase().includes(this.searchTerm) ||
        restaurant.location.toLowerCase().includes(this.searchTerm)
    );

    this.currentPage = 0;
    this.discoverRestaurants = this.filteredRestaurants.slice(0, this.itemsPerPage);
    this.currentPage = 1;
    this.hasMoreItems = this.filteredRestaurants.length > this.itemsPerPage;

    this.logger.info(`Found ${this.filteredRestaurants.length} restaurants matching "${searchTerm}"`);
  }

  private resetToAllRestaurants(): void {
    this.filteredRestaurants = [];
    this.currentPage = 0;
    this.discoverRestaurants = this.allRestaurants.slice(0, this.itemsPerPage);
    this.currentPage = 1;
    this.hasMoreItems = this.allRestaurants.length > this.itemsPerPage;
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.resetToAllRestaurants();
    this.logger.info('Search cleared, showing all restaurants');
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
      'Sáenz Briones',
      'Cevichería La Choza',
      'Anticuchería Don Antioquio',
      'Lomo Saltado Express',
      'Pollería El Criollito',
      'Parrillas del Sur',
      'Ají de Gallina Mama Rosa',
      'Causa Limeña',
      'Tacu Tacu Tradicional',
      'Arroz con Pollo Doña Carmen',
      'Papa Rellena San Isidro',
      'Chicharrón Colorado',
      'Seco de Cabrito Norte',
      'Tallarines Verdes Italia',
      'Pollo a la Brasa Norky',
      'Chifa Dragón Dorado'
    ];

    const locations = [
      'Miraflores',
      'San Isidro',
      'Barranco',
      'Jesús María',
      'La Molina',
      'Surco',
      'Pueblo Libre',
      'Lima Centro',
      'Lince',
      'Magdalena',
      'San Miguel',
      'Chorrillos'
    ];

    const categories = [
      { name: 'Peruana', color: 'bg-red-500' },
      { name: 'Nikkei', color: 'bg-purple-500' },
      { name: 'Contemporánea', color: 'bg-blue-500' },
      { name: 'Gourmet', color: 'bg-green-500' },
      { name: 'Mariscos', color: 'bg-cyan-500' },
      { name: 'Fusión', color: 'bg-orange-500' },
      { name: 'Criolla', color: 'bg-yellow-500' },
      { name: 'Chifa', color: 'bg-pink-500' },
      { name: 'Parrillas', color: 'bg-indigo-500' },
      { name: 'Pollerías', color: 'bg-gray-500' }
    ];

    const restaurants: DiscoverRestaurant[] = [];

    for (let i = 0; i < 100; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const restaurant: DiscoverRestaurant = {
        id: i + 1,
        name: `${restaurantNames[i % restaurantNames.length]} ${i > 39 ? `(Sucursal ${Math.ceil(i / 40)})` : ''}`,
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

  onRestaurantClick(restaurant: DiscoverRestaurant): void {
    this.logger.info('Restaurant clicked:', restaurant.name);
  }

  trackByRestaurant(_index: number, restaurant: DiscoverRestaurant): number {
    return restaurant.id;
  }

  onImageError(event: any): void {
    event.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop';
    this.logger.error('Error loading restaurant image');
  }
}
