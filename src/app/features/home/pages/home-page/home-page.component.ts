import { Component, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { CoreModule } from '../../../../shared/modules';
import { LoggerService } from '../../../../shared/services/logger/logger.service';
import {
  CategoriesSectionComponent,
  type Category
} from '../../components/categories-section/categories-section.component';
import { DiscoverSectionComponent } from '../../components/discover-section/discover-section.component';
import { FavoritesSectionComponent } from '../../components/favorites-section/favorites-section.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CoreModule,
    SearchBarComponent,
    CategoriesSectionComponent,
    FavoritesSectionComponent,
    DiscoverSectionComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  private readonly logger = inject(LoggerService);

  @ViewChild(DiscoverSectionComponent) discoverSection!: DiscoverSectionComponent;

  notificationCount = 3; // Ejemplo con valor inicial
  cartItemsCount = 2; // Ejemplo con valor inicial

  // Eventos para comunicar con el componente padre
  @Output() menuToggled = new EventEmitter<void>();
  @Output() notificationsOpened = new EventEmitter<void>();
  @Output() cartOpened = new EventEmitter<void>();

  // Métodos para manejar los clicks
  toggleMenu(): void {
    this.menuToggled.emit();
  }

  openNotifications(): void {
    this.notificationsOpened.emit();
  }

  openCart(): void {
    this.cartOpened.emit();
  }

  // Manejar búsqueda en tiempo real
  onSearchChange(searchTerm: string): void {
    this.logger.info('Search term changed:', searchTerm);
    if (this.discoverSection) {
      this.discoverSection.filterRestaurants(searchTerm);
    }
  }

  // Manejar búsqueda al presionar Enter
  onSearch(searchTerm: string): void {
    this.logger.info('Search executed:', searchTerm);
    if (this.discoverSection) {
      this.discoverSection.filterRestaurants(searchTerm);
    }
  }

  // Manejar ubicación
  onLocationUpdate(): void {
    this.logger.info('Location update requested');
    // Aquí puedes implementar lógica de filtrado por ubicación
  }

  onCategorySelected(_category: Category): void {
    // Navegar a vista filtrada por categoría
    // this.router.navigate(['/restaurants'], { queryParams: { category: category.id } });
  }

  // Manejar "ver todo"
  onViewAllCategories(): void {
    // Navegar a vista de todas las categorías
    // this.router.navigate(['/categories']);
  }
}
