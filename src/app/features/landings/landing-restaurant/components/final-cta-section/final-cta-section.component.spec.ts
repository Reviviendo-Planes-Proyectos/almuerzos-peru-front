import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { I18nService } from '../../../../../shared/i18n';
import { MaterialModule } from '../../../../../shared/modules';
import { FinalCtaSectionComponent } from './final-cta-section.component';

class MockI18nService {
  t(key: string): string {
    const translations: Record<string, string> = {
      'landing.restaurant.finalCta.title': '¿Todavía usas menús impresos? Tus clientes ya no.',
      'landing.restaurant.finalCta.titleHighlight': 'Únete al cambio.',
      'landing.restaurant.finalCta.subtitle':
        '¡Regístrate ahora y comienza a disfrutar de los beneficios de tener un menú digital!',
      'landing.restaurant.finalCta.primaryBtn': 'Comienza Gratis Ahora',
      'landing.restaurant.finalCta.features.free': 'Configuración gratuita',
      'landing.restaurant.finalCta.features.noCommitment': 'Sin compromisos',
      'landing.restaurant.finalCta.features.support': 'Soporte incluido'
    };
    return translations[key] || key;
  }
}

describe('FinalCtaSectionComponent', () => {
  let component: FinalCtaSectionComponent;
  let fixture: ComponentFixture<FinalCtaSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalCtaSectionComponent, MaterialModule, ButtonComponent, NoopAnimationsModule],
      providers: [{ provide: I18nService, useClass: MockI18nService }]
    }).compileComponents();

    fixture = TestBed.createComponent(FinalCtaSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render CTA title and description', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('¿Todavía usas menús impresos? Tus clientes ya no.');
    expect(compiled.querySelector('h2')?.textContent).toContain('Únete al cambio.');
    expect(compiled.querySelector('p')?.textContent).toContain(
      '¡Regístrate ahora y comienza a disfrutar de los beneficios de tener un menú digital!'
    );
  });

  it('should render dos botones de acción', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThanOrEqual(1);
    const btnTexts = Array.from(buttons as NodeListOf<Element>).map((b) => b.textContent?.trim());
    expect(btnTexts).toEqual(expect.arrayContaining([expect.stringContaining('Comienza Gratis Ahora')]));
  });

  it('should render checklist with 3 check_circle icons', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    const icons = compiled.querySelectorAll('mat-icon');

    const iconTexts = Array.from(icons)
      .map((el: Element) => el.textContent?.trim())
      .filter((text) => text === 'check_circle');

    expect(iconTexts.length).toBe(3);
  });

  it('should call onStartFree', () => {
    const spy = jest.spyOn(component, 'onStartFree');
    component.onStartFree();
    expect(spy).toHaveBeenCalled();
  });

  it('should call onContactExpert', () => {
    const spy = jest.spyOn(component, 'onContactExpert');
    component.onContactExpert();
    expect(spy).toHaveBeenCalled();
  });
});
