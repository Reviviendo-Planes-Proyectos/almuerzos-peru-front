import { Component } from '@angular/core';
import { BaseTranslatableComponent, CoreModule, MaterialModule } from '../../../../../../shared/modules';

@Component({
  selector: 'app-enhanced-search-section',
  standalone: true,
  imports: [CoreModule, MaterialModule, CoreModule],
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
    } else {
      this.showSuggestions = true;
    }
  }
}
