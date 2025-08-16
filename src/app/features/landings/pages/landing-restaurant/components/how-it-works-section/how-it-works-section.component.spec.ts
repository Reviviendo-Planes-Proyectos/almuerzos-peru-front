import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { I18nService } from '../../../../../../shared/i18n';
import { HowItWorksSectionComponent } from './how-it-works-section.component';

class MockI18nService {
  t(key: string): string {
    const translations: Record<string, string> = {
      'landing.restaurant.howItWorks.title': '¿Cómo',
      'landing.restaurant.howItWorks.titleHighlight': 'Funciona',
      'landing.restaurant.howItWorks.titleSuffix': '?',
      'landing.restaurant.howItWorks.subtitle':
        'En solo 3 pasos simples, tu restaurante estará listo para la era digital',
      'landing.restaurant.howItWorks.steps.register.title': 'Regístrate Gratis',
      'landing.restaurant.howItWorks.steps.register.description':
        'Crea tu cuenta en menos de 2 minutos. Solo necesitas tu email y el nombre de tu restaurante para comenzar.',
      'landing.restaurant.howItWorks.steps.uploadMenu.title': 'Sube tu Menú',
      'landing.restaurant.howItWorks.steps.uploadMenu.description':
        'Agrega los platos de tu menú diario con fotos, precios y descripciones. Es súper fácil e intuitivo.',
      'landing.restaurant.howItWorks.steps.publishShare.title': 'Publica y Comparte',
      'landing.restaurant.howItWorks.steps.publishShare.description':
        'Tu menú estará disponible al instante. Compártelo por WhatsApp, redes sociales o déjanos ayudarte a encontrar más clientes.'
    };
    return translations[key] || key;
  }
}

describe('HowItWorksSectionComponent', () => {
  let component: HowItWorksSectionComponent;
  let fixture: ComponentFixture<HowItWorksSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HowItWorksSectionComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: I18nService, useClass: MockI18nService }]
    }).compileComponents();

    fixture = TestBed.createComponent(HowItWorksSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the how-it-works section content', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('section#como-funciona')).toBeTruthy();
    expect(compiled.querySelector('.gradient-text')?.textContent).toContain('Funciona');
  });
});
