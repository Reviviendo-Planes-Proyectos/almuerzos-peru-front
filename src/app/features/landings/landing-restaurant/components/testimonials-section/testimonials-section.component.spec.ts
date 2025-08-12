import { ComponentFixture, TestBed } from '@angular/core/testing';
import { I18nService } from '../../../../../shared/translations';
import { TestimonialsSectionComponent } from './testimonials-section.component';

class MockI18nService {
  t(key: string): string {
    const translations: Record<string, string> = {
      'landing.restaurant.testimonials.title': 'Lo que Dicen Nuestros',
      'landing.restaurant.testimonials.titleHighlight': 'Clientes',
      'landing.restaurant.testimonials.subtitle': 'Historias reales de restaurantes que han transformado su negocio',
      'landing.restaurant.testimonials.users.rosa.name': 'Rosa Méndez',
      'landing.restaurant.testimonials.users.rosa.role': 'Dueña de restaurante',
      'landing.restaurant.testimonials.users.rosa.restaurant': 'Antojitos Doña Rosa',
      'landing.restaurant.testimonials.users.rosa.text':
        'Antes actualizábamos el menú en un grupo de WhatsApp y nadie lo veía. Con Almuerza Perú, los clientes ya llegan sabiendo qué pedir. En 2 semanas, tuvimos más movimiento en el almuerzo que en todo un mes antes.',
      'landing.restaurant.testimonials.users.luis.name': 'Luis Contreras',
      'landing.restaurant.testimonials.users.luis.role': 'Dueña de restaurante',
      'landing.restaurant.testimonials.users.luis.restaurant': 'Fonda San Martín – Callao',
      'landing.restaurant.testimonials.users.luis.text':
        'Lo mejor es que no necesito tener redes sociales ni pagar a nadie para publicar. Yo misma actualizo desde mi celular y los clientes nos encuentran por ubicación. ¡Hasta personas que vivían cerca, pero no nos conocían, ahora vienen a nosotros!',
      'landing.restaurant.testimonials.users.maricielo.name': 'Maricielo Ramírez',
      'landing.restaurant.testimonials.users.maricielo.role': 'Chef y dueña',
      'landing.restaurant.testimonials.users.maricielo.restaurant': 'Cocina Criolla Familiar – Ate Vitarte',
      'landing.restaurant.testimonials.users.maricielo.text':
        'Nos costaba mostrar todos los platos del menú diario porque cambiamos seguido. Ahora los subimos en 1 minuto y la gente los ve con foto, precio y hasta comenta. Se siente más profesional, aunque somos un negocio familiar.'
    };
    return translations[key] || key;
  }
}

describe('TestimonialsSectionComponent', () => {
  let component: TestimonialsSectionComponent;
  let fixture: ComponentFixture<TestimonialsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestimonialsSectionComponent],
      providers: [{ provide: I18nService, useClass: MockI18nService }]
    }).compileComponents();

    fixture = TestBed.createComponent(TestimonialsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the testimonials section', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const section = compiled.querySelector('section#testimonios');
    expect(section).toBeTruthy();
    expect(section?.textContent).toContain('Clientes');
  });

  it('should render 3 testimonials', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('mat-card');
    expect(cards.length).toBe(3);
  });

  it('should render correct rating icons per testimonial', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const ratings = component.testimonials.map((t) => t.rating);
    const iconRows = compiled.querySelectorAll('.rating');

    iconRows.forEach((row, i) => {
      const stars = row.querySelectorAll('mat-icon');
      expect(stars.length).toBe(ratings[i]);
    });
  });
});
