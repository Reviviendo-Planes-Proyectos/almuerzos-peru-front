import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { I18nService } from '../../../../../shared/translations';
import { FinalCtaSectionComponent } from './final-cta-section.component';

class MockI18nService {
  t(key: string): string {
    const translations: Record<string, string> = {
      'landing.diner.finalCta.stats.restaurants': 'Restaurantes verificados',
      'landing.diner.finalCta.stats.users': 'Usuarios activos',
      'landing.diner.finalCta.stats.rating': 'Calificación promedio'
    };
    return translations[key] || key;
  }
}

describe('FinalCtaSectionComponent', () => {
  let component: FinalCtaSectionComponent;
  let fixture: ComponentFixture<FinalCtaSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalCtaSectionComponent, FormsModule, BrowserAnimationsModule],
      providers: [{ provide: I18nService, useClass: MockI18nService }]
    }).compileComponents();

    fixture = TestBed.createComponent(FinalCtaSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty email', () => {
    expect(component.email).toBe('');
  });

  it('should allow email property to be set', () => {
    const testEmail = 'test@example.com';
    component.email = testEmail;
    expect(component.email).toBe(testEmail);
  });

  it('should have stats data', () => {
    expect(component.stats).toBeDefined();
    expect(component.stats.length).toBe(3);
  });

  it('should have correct stats structure', () => {
    for (const stat of component.stats) {
      expect(stat).toHaveProperty('value');
      expect(stat).toHaveProperty('label');
    }
  });

  it('should have expected stats values', () => {
    const values = component.stats.map((s) => s.value);

    expect(values).toContain('500+');
    expect(values).toContain('10k+');
    expect(values).toContain('4.8★');
  });

  it('should have descriptive stats labels', () => {
    const labels = component.stats.map((s) => s.label);

    expect(labels).toContain('landing.diner.finalCta.stats.restaurants');
    expect(labels).toContain('landing.diner.finalCta.stats.users');
    expect(labels).toContain('landing.diner.finalCta.stats.rating');
  });

  it('should have marketing-focused stats', () => {
    const labels = component.stats.map((s) => s.label);

    // Verificar que las etiquetas son claves de traducción válidas
    expect(labels.every((label) => label.startsWith('landing.diner.finalCta.stats.'))).toBe(true);
  });

  it('should have non-empty stats labels', () => {
    for (const stat of component.stats) {
      expect(stat.label).toBeTruthy();
      expect(stat.label.length).toBeGreaterThan(0);
    }
  });

  it('should have non-empty stats values', () => {
    for (const stat of component.stats) {
      expect(stat.value).toBeTruthy();
      expect(stat.value.length).toBeGreaterThan(0);
    }
  });

  describe('onSubscribe method', () => {
    it('should be defined', () => {
      expect(component.onSubscribe).toBeDefined();
      expect(typeof component.onSubscribe).toBe('function');
    });

    it('should execute without errors', () => {
      expect(() => component.onSubscribe()).not.toThrow();
    });

    it('should be callable with valid email', () => {
      component.email = 'user@example.com';
      expect(() => component.onSubscribe()).not.toThrow();
    });

    it('should be callable with empty email', () => {
      component.email = '';
      expect(() => component.onSubscribe()).not.toThrow();
    });
  });

  it('should have compelling numeric stats', () => {
    const numericStats = component.stats.filter((s) => /\d+/.test(s.value));
    expect(numericStats.length).toBeGreaterThan(0);
  });
});
