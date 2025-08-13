import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseTranslatableComponent } from '../../../../../shared/i18n';
import { MaterialModule } from '../../../../../shared/material.module';

@Component({
  selector: 'app-enhanced-search-section',
  standalone: true,
  imports: [MaterialModule, FormsModule],
  templateUrl: './enhanced-search-section.component.html',
  styleUrls: ['./enhanced-search-section.component.scss']
})
export class EnhancedSearchSectionComponent extends BaseTranslatableComponent {
  searchLocation = '';
  showSuggestions = false;

  stats = [
    { value: '5000+', label: 'landing.diner.enhancedSearch.stats.restaurants' },
    { value: '10k+', label: 'landing.diner.enhancedSearch.stats.users' },
    { value: '24/7', label: 'landing.diner.enhancedSearch.stats.available' }
  ];

  popularDistricts = [
    'San Isidro',
    'Miraflores',
    'Surco',
    'La Molina',
    'San Borja',
    'Magdalena',
    'Jesús María',
    'Lince'
  ];

  onLocationSearch() {
    if (this.searchLocation.trim()) {
      // Aquí se implementaría la navegación o llamada a API
      // Por ejemplo: this.router.navigate(['/restaurants'], { queryParams: { district: this.searchLocation } });
    }
  }

  onInputChange(event: any) {
    const value = event.target.value;
    this.showSuggestions = value.length > 0;
  }

  selectDistrict(district: string) {
    this.searchLocation = district;
    this.showSuggestions = false;
    this.onLocationSearch();
  }

  searchRestaurants() {
    if (this.searchLocation.trim()) {
      // Implementar búsqueda general de restaurantes
      // Por ejemplo: this.router.navigate(['/search'], { queryParams: { location: this.searchLocation } });
    } else {
      // Mostrar sugerencias si no hay distrito seleccionado
      this.showSuggestions = true;
    }
  }
}
