// categories-section.component.ts
import { AfterViewInit, Component, ElementRef, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { CoreModule } from '../../../../shared/modules';
import { LoggerService } from '../../../../shared/services/logger/logger.service';

export interface Category {
  id: number;
  name: string;
  image: string;
  count: number;
  slug?: string;
}

@Component({
  selector: 'app-categories-section',
  standalone: true,
  imports: [CoreModule],
  templateUrl: './categories-section.component.html',
  styleUrls: ['./categories-section.component.scss']
})
export class CategoriesSectionComponent implements AfterViewInit {
  @ViewChild('categoriesContainer') categoriesContainer!: ElementRef;
  private readonly logger = inject(LoggerService);

  // Propiedades para drag scroll
  private isDragging = false;
  private startX = 0;
  private scrollLeft = 0;

  // Eventos para comunicar con el componente padre
  @Output() categorySelected = new EventEmitter<Category>();
  @Output() viewAllClicked = new EventEmitter<void>();

  // Datos de categorías
  categories: Category[] = [
    {
      id: 1,
      name: 'Postres',
      image: '/img/pollo.png',
      count: 45
    },
    {
      id: 2,
      name: 'Productos',
      image: '/img/pollo.png',
      count: 23
    },
    {
      id: 3,
      name: 'Saludable',
      image: '/img/pollo.png',
      count: 32
    },
    {
      id: 4,
      name: 'Cafetería',
      image: '/img/pollo.png',
      count: 18
    },
    {
      id: 5,
      name: 'Marino',
      image: '/img/pollo.png',
      count: 28
    },
    {
      id: 6,
      name: 'Comida Criolla',
      image: '/img/pollo.png',
      count: 35
    },
    {
      id: 7,
      name: 'Parrillas',
      image: '/img/pollo.png',
      count: 22
    },
    {
      id: 8,
      name: 'Pizza',
      image: '/img/pollo.png',
      count: 15
    },
    {
      id: 9,
      name: 'Pizza',
      image: '/img/pollo.png',
      count: 15
    },
    {
      id: 10,
      name: 'Pizza',
      image: '/img/pollo.png',
      count: 15
    },
    {
      id: 11,
      name: 'Pizza',
      image: '/img/pollo.png',
      count: 15
    },
    {
      id: 12,
      name: 'Pizza',
      image: '/img/pollo.png',
      count: 15
    },
    {
      id: 13,
      name: 'Pizza',
      image: '/img/pollo.png',
      count: 15
    },
    {
      id: 14,
      name: 'Pizza',
      image: '/img/pollo.png',
      count: 15
    },
    {
      id: 15,
      name: 'Pizza',
      image: '/img/pollo.png',
      count: 15
    },
    {
      id: 16,
      name: 'Pizza',
      image: '/img/pollo.png',
      count: 15
    },
    {
      id: 17,
      name: 'Pizza',
      image: '/img/pollo.png',
      count: 15
    },
    {
      id: 18,
      name: 'Pizza',
      image: '/img/pollo.png',
      count: 15
    },
    {
      id: 19,
      name: 'Pizza',
      image: '/img/pollo.png',
      count: 15
    },
    {
      id: 20,
      name: 'Pizza',
      image: '/img/pollo.png',
      count: 15
    },
    {
      id: 20,
      name: 'Pizza',
      image: '/img/pollo.png',
      count: 15
    },
    {
      id: 20,
      name: 'Pizza',
      image: '/img/pollo.png',
      count: 15
    },
    {
      id: 20,
      name: 'Pizza',
      image: '/img/pollo.png',
      count: 15
    },
    {
      id: 20,
      name: 'Pizza',
      image: '/img/pollo.png',
      count: 15
    },
    {
      id: 20,
      name: 'Pizza',
      image: '/img/pollo.png',
      count: 15
    },
    {
      id: 20,
      name: 'Pizza',
      image: '/img/pollo.png',
      count: 15
    },
    {
      id: 20,
      name: 'Pizza',
      image: '/img/pollo.png',
      count: 15
    },
    {
      id: 20,
      name: 'Pizza',
      image: '/img/pollo.png',
      count: 15
    },

    {
      id: 20,
      name: 'Pizza',
      image: '/img/pollo.png',
      count: 15
    },
    {
      id: 20,
      name: 'Pizza',
      image: '/img/pollo.png',
      count: 15
    },
    {
      id: 20,
      name: 'Pizza',
      image: '/img/pollo.png',
      count: 15
    }
  ];

  ngAfterViewInit(): void {
    // Ya no necesitamos configurar listeners para botones de navegación
  }

  // Método para manejar click en categoría
  onCategoryClick(category: Category): void {
    this.categorySelected.emit(category);
  }

  // Método para ver todas las categorías
  onViewAll(): void {
    this.viewAllClicked.emit();
  }

  // TrackBy para optimización de rendimiento
  trackByCategory(_index: number, category: Category): number {
    return category.id;
  }

  // Manejo de errores de imagen
  onImageError(event: any, category: Category): void {
    event.target.src = 'assets/images/categories/default.jpg';
    this.logger.error('Error loading image for category:', category.name);
  }

  // Método para scroll horizontal con rueda del mouse
  onWheel(event: WheelEvent): void {
    event.preventDefault();
    const container = this.categoriesContainer.nativeElement;
    container.scrollLeft += event.deltaY;
  }

  // Métodos para drag scroll
  startDrag(event: MouseEvent): void {
    event.preventDefault();
    this.isDragging = true;
    const container = this.categoriesContainer.nativeElement;
    this.startX = event.pageX - container.offsetLeft;
    this.scrollLeft = container.scrollLeft;
    container.style.cursor = 'grabbing';
  }

  onDrag(event: MouseEvent): void {
    if (!this.isDragging) return;
    event.preventDefault();
    const container = this.categoriesContainer.nativeElement;
    const x = event.pageX - container.offsetLeft;
    const walk = (x - this.startX) * 2; // Multiplicador para velocidad
    container.scrollLeft = this.scrollLeft - walk;
  }

  endDrag(): void {
    this.isDragging = false;
    const container = this.categoriesContainer.nativeElement;
    container.style.cursor = 'grab';
  }
}
