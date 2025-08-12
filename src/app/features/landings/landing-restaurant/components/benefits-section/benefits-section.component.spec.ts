import { ComponentFixture, TestBed } from '@angular/core/testing';
import { I18nService } from '../../../../../shared/translations';
import { BenefitsSectionComponent } from './benefits-section.component';

// Mock del servicio de traducción
class MockI18nService {
  t(key: string): string {
    const translations: Record<string, string> = {
      'landing.restaurant.benefits.title.prefix': 'Beneficios que',
      'landing.restaurant.benefits.title.highlight': 'Transforman',
      'landing.restaurant.benefits.title.suffix': 'tu Negocio',
      'landing.restaurant.benefits.description':
        'Descubre cómo nuestro software revoluciona la experiencia gastronómica tanto para restaurantes como para comensales',
      'landing.restaurant.benefits.restaurant.title': 'Para Restaurantes',
      'landing.restaurant.benefits.customer.title': 'Para Comensales',
      'landing.restaurant.benefits.restaurant.subtitle': 'Gestiona tu menú',
      'landing.restaurant.benefits.customer.subtitle': 'Descubre sabores increíbles',
      'landing.restaurant.benefits.realTimeUpdate.title': 'Actualización en Tiempo Real',
      'landing.restaurant.benefits.realTimeUpdate.subtitle': 'Si algo se acabó, retíralo fácilmente.',
      'landing.restaurant.benefits.whatsappShare.title': 'Comparte por WhatsApp',
      'landing.restaurant.benefits.whatsappShare.subtitle':
        'Envía tu carta por WhatsApp y compártesela a tus contactos.',
      'landing.restaurant.benefits.freeAdvertising.title': 'Publicidad Gratis',
      'landing.restaurant.benefits.freeAdvertising.subtitle':
        'Sube tu menú y listo. Tu restaurante será visible para más clientes sin esfuerzos.',
      'landing.restaurant.benefits.allInOnePlace.title': 'Todo en un Solo Lugar',
      'landing.restaurant.benefits.allInOnePlace.subtitle':
        'Encuentra el menú diario de tu restaurante favorito en un solo lugar, fácil y rápido.',
      'landing.restaurant.benefits.gpsFilter.title': 'Filtro por Ubicación GPS',
      'landing.restaurant.benefits.gpsFilter.subtitle':
        'Encuentra opciones cercanas con el filtro de ubicación GPS. Descubre nuevos sabores.',
      'landing.restaurant.benefits.exclusivePromotions.title': 'Promociones exclusivas',
      'landing.restaurant.benefits.exclusivePromotions.subtitle':
        'Accede a menús con descuentos,y promocionas solo para usuarios activos. ¡Usa la app, gana más y almuerza mejor!'
    };
    return translations[key] || key;
  }
}

describe('BenefitsSectionComponent', () => {
  let component: BenefitsSectionComponent;
  let fixture: ComponentFixture<BenefitsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BenefitsSectionComponent],
      providers: [{ provide: I18nService, useClass: MockI18nService }]
    }).compileComponents();

    fixture = TestBed.createComponent(BenefitsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the benefits section', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('section#beneficios')).toBeTruthy();
  });

  it('should display the gradient text "Transforman"', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const titleElement = compiled.querySelector('.gradient-text');
    expect(titleElement?.textContent).toContain('Transforman');
  });

  it('should render all defined benefits', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('mat-card');
    expect(cards.length).toBe(component.benefits.length);
  });
});
