import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { I18nService } from '../../../../../shared/i18n/services/translation.service';
import { MaterialModule } from '../../../../../shared/modules';
import { EnhancedSearchSectionComponent } from './enhanced-search-section.component';

class MockI18nService {
  t(key: string): string {
    const translations: Record<string, string> = {
      'landing.diner.enhancedSearch.form.label': 'Buscar ubicación',
      'landing.diner.enhancedSearch.form.placeholder': 'Ej: San Isidro, Miraflores...',
      'landing.diner.enhancedSearch.form.hint': 'Ingresa tu distrito o zona',
      'landing.diner.enhancedSearch.popularDistricts': 'Distritos populares',
      'landing.diner.enhancedSearch.stats.restaurants': 'restaurantes',
      'landing.diner.enhancedSearch.stats.users': 'usuarios',
      'landing.diner.enhancedSearch.stats.available': 'disponible'
    };
    return translations[key] || key;
  }

  isTranslationsLoaded(): boolean {
    return true;
  }
}

describe('EnhancedSearchSectionComponent', () => {
  let component: EnhancedSearchSectionComponent;
  let fixture: ComponentFixture<EnhancedSearchSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnhancedSearchSectionComponent, BrowserAnimationsModule, FormsModule, MaterialModule],
      providers: [{ provide: I18nService, useClass: MockI18nService }]
    }).compileComponents();

    fixture = TestBed.createComponent(EnhancedSearchSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty search location', () => {
    expect(component.searchLocation).toBe('');
  });

  it('should initialize with suggestions hidden', () => {
    expect(component.showSuggestions).toBe(false);
  });

  it('should have stats data', () => {
    expect(component.stats).toBeDefined();
    expect(component.stats.length).toBe(3);

    for (const stat of component.stats) {
      expect(stat).toHaveProperty('value');
      expect(stat).toHaveProperty('label');
    }
  });

  it('should have popular districts', () => {
    expect(component.popularDistricts).toBeDefined();
    expect(component.popularDistricts.length).toBeGreaterThan(0);
    expect(component.popularDistricts).toContain('San Isidro');
    expect(component.popularDistricts).toContain('Miraflores');
  });

  it('should show suggestions when input has value', () => {
    const mockEvent = { target: { value: 'San' } };

    component.onInputChange(mockEvent);

    expect(component.showSuggestions).toBe(true);
  });

  it('should hide suggestions when input is empty', () => {
    const mockEvent = { target: { value: '' } };

    component.onInputChange(mockEvent);

    expect(component.showSuggestions).toBe(false);
  });

  it('should select district and hide suggestions', () => {
    jest.spyOn(component, 'onLocationSearch');

    component.selectDistrict('San Isidro');

    expect(component.searchLocation).toBe('San Isidro');
    expect(component.showSuggestions).toBe(false);
    expect(component.onLocationSearch).toHaveBeenCalled();
  });

  it('should call onLocationSearch when searchLocation has value', () => {
    component.searchLocation = 'San Isidro';

    // This should not throw any errors
    expect(() => component.onLocationSearch()).not.toThrow();
  });

  it('should handle searchRestaurants with valid location', () => {
    component.searchLocation = 'San Isidro';

    expect(() => component.searchRestaurants()).not.toThrow();
  });

  it('should show suggestions when searchRestaurants is called with empty location', () => {
    component.searchLocation = '';

    component.searchRestaurants();

    expect(component.showSuggestions).toBe(true);
  });
});
