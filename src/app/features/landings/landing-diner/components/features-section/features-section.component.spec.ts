import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { I18nService, TranslatePipe } from '../../../../../shared/translations';
import { FeaturesSectionComponent } from './features-section.component';

// Mock del servicio de traducción
class MockI18nService {
  t(key: string): string {
    const translations: Record<string, string> = {
      'landing.features.title': 'Características principales',
      'landing.features.subtitle': 'Todo lo que necesitas para encontrar tu almuerzo ideal',
      'landing.features.smartSearch.title': 'Búsqueda inteligente',
      'landing.features.saveTime.title': 'Ahorra tiempo',
      'landing.features.location.title': 'Ubicación precisa',
      'landing.features.favorites.title': 'Favoritos',
      'landing.features.smartSearch.description':
        'Encuentra restaurantes cerca de ti con menús actualizados diariamente',
      'landing.features.saveTime.description': 'No más llamadas o esperas. Ve el menú y precios al instante',
      'landing.features.location.description': 'Restaurantes organizados por distrito y proximidad a tu ubicación',
      'landing.features.favorites.description': 'Guarda tus restaurantes favoritos y accede rápidamente a sus menús'
    };
    return translations[key] || key;
  }
}

describe('FeaturesSectionComponent', () => {
  let component: FeaturesSectionComponent;
  let fixture: ComponentFixture<FeaturesSectionComponent>;
  let mockI18nService: MockI18nService;

  beforeEach(async () => {
    mockI18nService = new MockI18nService();

    await TestBed.configureTestingModule({
      imports: [FeaturesSectionComponent, BrowserAnimationsModule, TranslatePipe],
      providers: [{ provide: I18nService, useValue: mockI18nService }]
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturesSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have features data', () => {
    expect(component.features).toBeDefined();
    expect(component.features.length).toBe(4);
  });

  it('should have correct features structure', () => {
    for (const feature of component.features) {
      expect(feature).toHaveProperty('icon');
      expect(feature).toHaveProperty('title');
      expect(feature).toHaveProperty('description');
      expect(feature).toHaveProperty('image');
    }
  });

  it('should contain expected feature titles', () => {
    const titles = component.features.map((f) => f.title);

    expect(titles).toContain('landing.features.smartSearch.title');
    expect(titles).toContain('landing.features.saveTime.title');
    expect(titles).toContain('landing.features.location.title');
    expect(titles).toContain('landing.features.favorites.title');
  });

  it('should contain expected feature icons', () => {
    const icons = component.features.map((f) => f.icon);

    expect(icons).toContain('search');
    expect(icons).toContain('schedule');
    expect(icons).toContain('location_on');
    expect(icons).toContain('favorite');
  });

  it('should have non-empty descriptions for all features', () => {
    for (const feature of component.features) {
      expect(feature.description).toBeTruthy();
      expect(feature.description.length).toBeGreaterThan(0);
    }
  });

  it('should have valid image paths for all features', () => {
    for (const feature of component.features) {
      expect(feature.image).toBeTruthy();
      expect(feature.image).toContain('/img/landing/');
      expect(feature.image).toContain('.png');
    }
  });
});
