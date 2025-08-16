import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CoreModule } from '../../../../shared/modules';
import { LoggerService } from '../../../../shared/services/logger/logger.service';

interface Restaurant {
  id: number;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  isFavorite: boolean;
}

@Component({
  selector: 'app-favorites-section',
  standalone: true,
  imports: [CoreModule],
  templateUrl: './favorites-section.component.html',
  styleUrl: './favorites-section.component.scss'
})
export class FavoritesSectionComponent {
  @ViewChild('favoritesContainer') favoritesContainer!: ElementRef;
  private readonly logger = inject(LoggerService);

  // Propiedades para drag scroll
  private isDragging = false;
  private startX = 0;
  private scrollLeft = 0;
  favoriteRestaurants: Restaurant[] = [
    {
      id: 1,
      name: 'Tanta (San Isidro)',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop',
      rating: 4.5,
      deliveryTime: '10-30 min',
      isFavorite: true
    },
    {
      id: 2,
      name: 'Primos Chicken Bar',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop',
      rating: 4.6,
      deliveryTime: '5-30 min',
      isFavorite: true
    },
    {
      id: 3,
      name: 'La Rosa Náutica',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&h=200&fit=crop',
      rating: 4.8,
      deliveryTime: '15-35 min',
      isFavorite: true
    },
    {
      id: 4,
      name: 'Maido',
      image: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=300&h=200&fit=crop',
      rating: 4.9,
      deliveryTime: '20-40 min',
      isFavorite: true
    },
    {
      id: 5,
      name: 'Maido',
      image: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=300&h=200&fit=crop',
      rating: 4.9,
      deliveryTime: '20-40 min',
      isFavorite: true
    },
    {
      id: 6,
      name: 'Maido',
      image: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=300&h=200&fit=crop',
      rating: 4.9,
      deliveryTime: '20-40 min',
      isFavorite: true
    },
    {
      id: 7,
      name: 'Maido',
      image: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=300&h=200&fit=crop',
      rating: 4.9,
      deliveryTime: '20-40 min',
      isFavorite: true
    },
    {
      id: 8,
      name: 'Maido',
      image: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=300&h=200&fit=crop',
      rating: 4.9,
      deliveryTime: '20-40 min',
      isFavorite: true
    },
    {
      id: 9,
      name: 'Maido',
      image: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=300&h=200&fit=crop',
      rating: 4.9,
      deliveryTime: '20-40 min',
      isFavorite: true
    },
    {
      id: 10,
      name: 'Maido',
      image: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=300&h=200&fit=crop',
      rating: 4.9,
      deliveryTime: '20-40 min',
      isFavorite: true
    },
    {
      id: 4,
      name: 'Maido',
      image: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=300&h=200&fit=crop',
      rating: 4.9,
      deliveryTime: '20-40 min',
      isFavorite: true
    },
    {
      id: 11,
      name: 'Maido',
      image: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=300&h=200&fit=crop',
      rating: 4.9,
      deliveryTime: '20-40 min',
      isFavorite: true
    },
    {
      id: 12,
      name: 'Maido',
      image: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=300&h=200&fit=crop',
      rating: 4.9,
      deliveryTime: '20-40 min',
      isFavorite: true
    },
    {
      id: 13,
      name: 'Maido',
      image: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=300&h=200&fit=crop',
      rating: 4.9,
      deliveryTime: '20-40 min',
      isFavorite: true
    }
  ];

  toggleFavorite(restaurant: Restaurant): void {
    restaurant.isFavorite = !restaurant.isFavorite;
    this.logger.info('Toggle favorite for restaurant:', restaurant.name);
  }

  onWheel(event: WheelEvent): void {
    event.preventDefault();
    const container = this.favoritesContainer.nativeElement;
    container.scrollLeft += event.deltaY;
  }

  startDrag(event: MouseEvent): void {
    event.preventDefault();
    this.isDragging = true;
    const container = this.favoritesContainer.nativeElement;
    this.startX = event.pageX - container.offsetLeft;
    this.scrollLeft = container.scrollLeft;
    container.style.cursor = 'grabbing';
  }

  onDrag(event: MouseEvent): void {
    if (!this.isDragging) return;
    event.preventDefault();
    const container = this.favoritesContainer.nativeElement;
    const x = event.pageX - container.offsetLeft;
    const walk = (x - this.startX) * 2;
    container.scrollLeft = this.scrollLeft - walk;
  }

  endDrag(): void {
    this.isDragging = false;
    const container = this.favoritesContainer.nativeElement;
    container.style.cursor = 'grab';
  }
}
