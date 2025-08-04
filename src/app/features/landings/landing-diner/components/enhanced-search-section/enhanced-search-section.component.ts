import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../../shared/material.module';

@Component({
  selector: 'app-enhanced-search-section',
  standalone: true,
  imports: [MaterialModule, FormsModule],
  templateUrl: './enhanced-search-section.component.html',
  styleUrls: ['./enhanced-search-section.component.scss']
})
export class EnhancedSearchSectionComponent {
  searchLocation = '';
  showSuggestions = false;

  stats = [
    { value: '500+', label: 'Restaurantes' },
    { value: '10k+', label: 'Usuarios' },
    { value: '24/7', label: 'Disponible' }
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
      // Implementar lógica de búsqueda
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

  useCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (_position) => {
          // Implementar lógica con coordenadas
        },
        (_error) => {
          // Handle error
        }
      );
    }
  }

  searchNearby() {
    // Implementar búsqueda de restaurantes cercanos
  }

  searchRestaurants() {
    if (this.searchLocation.trim()) {
      // Implementar búsqueda general de restaurantes
    }
  }
}
