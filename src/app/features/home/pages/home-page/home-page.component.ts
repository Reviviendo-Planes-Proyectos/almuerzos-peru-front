import { Component, EventEmitter, Output } from '@angular/core';
import { CoreModule } from '../../../../shared/modules';
import {
  CategoriesSectionComponent,
  type Category
} from '../../components/categories-section/categories-section.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CoreModule, SearchBarComponent, CategoriesSectionComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
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
