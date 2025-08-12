import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { I18nService, TranslatePipe } from '../../../../../shared/translations';
import { HowItWorksSectionComponent } from './how-it-works-section.component';

// Mock del servicio de traducción
class MockI18nService {
  t(key: string): string {
    const translations: Record<string, string> = {
      'landing.howItWorks.title': 'Cómo funciona',
      'landing.howItWorks.subtitle': 'Encuentra tu almuerzo en 3 simples pasos',
      'landing.howItWorks.steps.search.title': 'Busca',
      'landing.howItWorks.steps.explore.title': 'Explora',
      'landing.howItWorks.steps.enjoy.title': 'Disfruta',
      'landing.howItWorks.steps.search.description': 'Ingresa tu ubicación y preferencias alimentarias',
      'landing.howItWorks.steps.explore.description': 'Ve menús y precios de restaurantes cercanos',
      'landing.howItWorks.steps.enjoy.description': 'Llama directamente o visita el restaurante'
    };
    return translations[key] || key;
  }
}

describe('HowItWorksSectionComponent', () => {
  let component: HowItWorksSectionComponent;
  let fixture: ComponentFixture<HowItWorksSectionComponent>;
  let mockI18nService: MockI18nService;

  beforeEach(async () => {
    mockI18nService = new MockI18nService();

    await TestBed.configureTestingModule({
      imports: [HowItWorksSectionComponent, BrowserAnimationsModule, TranslatePipe],
      providers: [{ provide: I18nService, useValue: mockI18nService }]
    }).compileComponents();

    fixture = TestBed.createComponent(HowItWorksSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have steps data', () => {
    expect(component.steps).toBeDefined();
    expect(component.steps.length).toBe(3);
  });

  it('should have correct steps structure', () => {
    for (const step of component.steps) {
      expect(step).toHaveProperty('step');
      expect(step).toHaveProperty('title');
      expect(step).toHaveProperty('description');
      expect(step).toHaveProperty('image');
    }
  });

  it('should have sequential step numbers', () => {
    expect(component.steps[0].step).toBe('1');
    expect(component.steps[1].step).toBe('2');
    expect(component.steps[2].step).toBe('3');
  });

  it('should contain expected step titles', () => {
    const titles = component.steps.map((s) => s.title);

    expect(titles).toContain('landing.howItWorks.steps.search.title');
    expect(titles).toContain('landing.howItWorks.steps.explore.title');
    expect(titles).toContain('landing.howItWorks.steps.enjoy.title');
  });

  it('should have non-empty descriptions for all steps', () => {
    for (const step of component.steps) {
      expect(step.description).toBeTruthy();
      expect(step.description.length).toBeGreaterThan(0);
    }
  });

  it('should have valid image paths for all steps', () => {
    for (const step of component.steps) {
      expect(step.image).toBeTruthy();
      expect(step.image).toContain('/img/landing/');
      expect(step.image).toContain('.png');
    }
  });

  it('should have logical step progression', () => {
    expect(component.steps[0].description).toContain('landing.howItWorks.steps.search.description');
    expect(component.steps[1].description).toContain('landing.howItWorks.steps.explore.description');
    expect(component.steps[2].description).toContain('landing.howItWorks.steps.enjoy.description');
  });
});
