import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { I18nService, TranslatePipe } from '../../../../../shared/i18n';
import { TestimonialsSectionComponent } from './testimonials-section.component';

// Mock del servicio de traducción
class MockI18nService {
  t(key: string): string {
    const translations: Record<string, string> = {
      'landing.testimonials.title': 'Lo que dicen nuestros usuarios',
      'landing.testimonials.subtitle': 'Miles de personas ya usan Almuerza Perú para encontrar su comida favorita',
      'landing.testimonials.users.maria.name': 'María González',
      'landing.testimonials.users.maria.role': 'Ejecutiva en San Isidro',
      'landing.testimonials.users.maria.text':
        'Desde que uso Almuerza Perú, encontrar un buen restaurante cerca de mi oficina es súper fácil. Los menús están siempre actualizados.',
      'landing.testimonials.users.carlos.name': 'Carlos Mendoza',
      'landing.testimonials.users.carlos.role': 'Empresario en Miraflores',
      'landing.testimonials.users.carlos.text':
        'Me encanta poder ver los precios antes de ir. Ya no tengo sorpresas y puedo planificar mejor mis comidas de trabajo.',
      'landing.testimonials.users.roberto.name': 'Roberto Quispe',
      'landing.testimonials.users.roberto.role': 'Estudiante en Lima Centro',
      'landing.testimonials.users.roberto.text':
        'Como estudiante, necesito opciones económicas y buenas. Almuerza Perú me ayuda a encontrar el mejor menú por mi presupuesto.'
    };
    return translations[key] || key;
  }
}

describe('TestimonialsSectionComponent', () => {
  let component: TestimonialsSectionComponent;
  let fixture: ComponentFixture<TestimonialsSectionComponent>;
  let mockI18nService: MockI18nService;

  beforeEach(async () => {
    mockI18nService = new MockI18nService();

    await TestBed.configureTestingModule({
      imports: [TestimonialsSectionComponent, BrowserAnimationsModule, TranslatePipe],
      providers: [{ provide: I18nService, useValue: mockI18nService }]
    }).compileComponents();

    fixture = TestBed.createComponent(TestimonialsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have testimonials data', () => {
    expect(component.testimonials).toBeDefined();
    expect(component.testimonials.length).toBe(3);
  });

  it('should have correct testimonials structure', () => {
    for (const testimonial of component.testimonials) {
      expect(testimonial).toHaveProperty('name');
      expect(testimonial).toHaveProperty('role');
      expect(testimonial).toHaveProperty('avatar');
      expect(testimonial).toHaveProperty('rating');
      expect(testimonial).toHaveProperty('text');
    }
  });

  it('should have valid testimonial names', () => {
    const names = component.testimonials.map((t) => t.name);

    expect(names).toContain('landing.testimonials.users.maria.name');
    expect(names).toContain('landing.testimonials.users.carlos.name');
    expect(names).toContain('landing.testimonials.users.roberto.name');
  });

  it('should have valid ratings for all testimonials', () => {
    for (const testimonial of component.testimonials) {
      expect(testimonial.rating).toBeGreaterThan(0);
      expect(testimonial.rating).toBeLessThanOrEqual(5);
    }
  });

  it('should have all 5-star ratings', () => {
    for (const testimonial of component.testimonials) {
      expect(testimonial.rating).toBe(5);
    }
  });

  it('should have valid avatar images', () => {
    for (const testimonial of component.testimonials) {
      expect(testimonial.avatar).toBeTruthy();
      expect(testimonial.avatar).toContain('/img/landing/');
      expect(testimonial.avatar).toContain('.png');
    }
  });

  it('should have non-empty testimonial texts', () => {
    for (const testimonial of component.testimonials) {
      expect(testimonial.text).toBeTruthy();
      expect(testimonial.text.length).toBeGreaterThan(10);
    }
  });

  it('should have descriptive roles for testimonials', () => {
    const roles = component.testimonials.map((t) => t.role);

    expect(roles).toContain('landing.testimonials.users.maria.role');
    expect(roles).toContain('landing.testimonials.users.carlos.role');
    expect(roles).toContain('landing.testimonials.users.roberto.role');
  });

  describe('getStarArray method', () => {
    it('should return array of correct length', () => {
      expect(component.getStarArray(5)).toHaveLength(5);
      expect(component.getStarArray(3)).toHaveLength(3);
      expect(component.getStarArray(1)).toHaveLength(1);
    });

    it('should return array filled with zeros', () => {
      const starArray = component.getStarArray(4);
      expect(starArray).toEqual([0, 0, 0, 0]);
    });

    it('should handle edge cases', () => {
      expect(component.getStarArray(0)).toHaveLength(0);
      expect(component.getStarArray(5)).toHaveLength(5);
    });
  });

  it('should contain testimonials with location-specific context', () => {
    const allText = component.testimonials
      .map((t) => `${t.text} ${t.role}`)
      .join(' ')
      .toLowerCase();

    expect(allText).toContain('landing.testimonials.users.maria');
    expect(allText).toContain('landing.testimonials.users.carlos');
    expect(allText).toContain('landing.testimonials.users.roberto');
  });
});
