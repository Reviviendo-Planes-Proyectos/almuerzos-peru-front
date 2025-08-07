import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PricingSectionComponent } from './pricing-section.component';

describe('PricingSectionComponent', () => {
  let component: PricingSectionComponent;
  let fixture: ComponentFixture<PricingSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PricingSectionComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PricingSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the section title and subtitle', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Planes que se Adaptan');
    expect(compiled.querySelector('p')?.textContent).toContain('Elige el plan perfecto');
  });

  it('should render three pricing cards', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    // Buscar las tarjetas de precios con la estructura actual
    const plans = compiled.querySelectorAll('div[data-plan]');
    expect(plans.length).toBe(3); // Ahora son 3 planes (Gratuito, Premium, Empresarial)

    // Buscar las listas de características dentro de las tarjetas
    const featureLists = compiled.querySelectorAll('div[data-plan] ul');
    expect(featureLists.length).toBe(3); // 3 listas de características

    // Verificar que cada lista tiene características
    const freePlanFeatures = featureLists[0].querySelectorAll('li');
    const premiumPlanFeatures = featureLists[1].querySelectorAll('li');
    const enterprisePlanFeatures = featureLists[2].querySelectorAll('li');

    expect(freePlanFeatures.length).toBeGreaterThan(0);
    expect(premiumPlanFeatures.length).toBeGreaterThan(0);
    expect(enterprisePlanFeatures.length).toBeGreaterThan(0);

    // Verificar los botones de acción
    const buttons = compiled.querySelectorAll('div[data-plan] button');
    expect(buttons.length).toBe(3); // 3 botones

    // Verificar el texto de los botones
    expect(buttons[0].textContent).toContain('Comenzar Gratis');
    expect(buttons[1].textContent).toContain('Comenzar Premium');
    expect(buttons[2].textContent).toContain('Contactar Ventas'); // Botón del plan empresarial
  });

  it('should render correct features per plan', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const featureLists = compiled.querySelectorAll('ul');
    expect(featureLists.length).toBe(3);

    const freePlanFeatures = featureLists[0].querySelectorAll('li');
    const premiumPlanFeatures = featureLists[1].querySelectorAll('li');
    const enterprisePlanFeatures = featureLists[2].querySelectorAll('li');

    expect(freePlanFeatures.length).toBe(5);
    expect(premiumPlanFeatures.length).toBe(6);
    expect(enterprisePlanFeatures.length).toBeGreaterThan(0); // Plan empresarial tiene características
  });

  it('should mark the premium plan as popular', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const popularBadge = compiled.querySelector('span.bg-gradient-to-r');
    expect(popularBadge?.textContent).toContain('Más Popular');
  });
});
