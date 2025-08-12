import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { MaterialModule } from '../../../../../shared/material.module';
import { I18nService } from '../../../../../shared/i18n';
import { HeroSectionComponent } from './hero-section.component';

// Mock del servicio de traducción
class MockI18nService {
  t(key: string): string {
    const translations: Record<string, string> = {
      'landing.restaurant.hero.title.upload': 'Sube tu carta.',
      'landing.restaurant.hero.title.sales': 'Incrementa tus ventas. Fácil y rápido.',
      'landing.restaurant.hero.description':
        '¡Lleva tu restaurante al siguiente nivel con un menú digital fácil de usar y accesible desde cualquier dispositivo!',
      'landing.restaurant.hero.buttons.startFree': 'Comenzar Gratis',
      'landing.restaurant.hero.buttons.seeHowItWorks': 'Ver como funciona',
      'landing.restaurant.hero.benefits.noCreditCard': 'Sin tarjeta de crédito',
      'landing.restaurant.hero.benefits.setup5min': 'Configuración en 5 min',
      'landing.restaurant.hero.stats.sales': '+150% Ventas',
      'landing.restaurant.hero.stats.salesDescription': 'Promedio mensual',
      'landing.restaurant.hero.imageAlt': 'Restaurante moderno con menú digital'
    };
    return translations[key] || key;
  }
}

describe('HeroSectionComponent', () => {
  let component: HeroSectionComponent;
  let fixture: ComponentFixture<HeroSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroSectionComponent, MaterialModule, ButtonComponent],
      providers: [{ provide: I18nService, useClass: MockI18nService }]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the hero section content', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('section')).toBeTruthy();
    expect(compiled.querySelector('.gradient-text')?.textContent).toContain('Sube tu carta.');
  });

  it('should alert feature when handleFeatureClick is called', () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation();
    const feature = 'Menú Digital';

    component.handleFeatureClick(feature);

    expect(alertSpy).toHaveBeenCalledWith(`Feature clicked: ${feature}`);
    alertSpy.mockRestore();
  });
});
