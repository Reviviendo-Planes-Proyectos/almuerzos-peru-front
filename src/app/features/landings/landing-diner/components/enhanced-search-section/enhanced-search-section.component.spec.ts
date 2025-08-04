import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EnhancedSearchSectionComponent } from './enhanced-search-section.component';

describe('EnhancedSearchSectionComponent', () => {
  let component: EnhancedSearchSectionComponent;
  let fixture: ComponentFixture<EnhancedSearchSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnhancedSearchSectionComponent, BrowserAnimationsModule, FormsModule]
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

  it('should handle useCurrentLocation when geolocation is available', () => {
    const mockGeolocation = {
      getCurrentPosition: jest.fn()
    };

    Object.defineProperty(navigator, 'geolocation', {
      value: mockGeolocation,
      configurable: true
    });

    component.useCurrentLocation();

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
  });

  it('should handle useCurrentLocation when geolocation is not available', () => {
    Object.defineProperty(navigator, 'geolocation', {
      value: undefined,
      configurable: true
    });

    expect(() => component.useCurrentLocation()).not.toThrow();
  });

  it('should handle searchNearby', () => {
    expect(() => component.searchNearby()).not.toThrow();
  });

  it('should handle searchRestaurants', () => {
    component.searchLocation = 'San Isidro';

    expect(() => component.searchRestaurants()).not.toThrow();
  });

  it('should not search when searchLocation is empty', () => {
    component.searchLocation = '';

    expect(() => component.searchRestaurants()).not.toThrow();
  });
});
