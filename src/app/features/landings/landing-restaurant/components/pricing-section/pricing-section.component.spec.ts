import { ElementRef } from '@angular/core';
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
    const freePlanFeatures = featureLists[0]?.querySelectorAll('li');
    const premiumPlanFeatures = featureLists[1]?.querySelectorAll('li');
    const enterprisePlanFeatures = featureLists[2]?.querySelectorAll('li');

    expect(freePlanFeatures?.length).toBeGreaterThan(0);
    expect(premiumPlanFeatures?.length).toBeGreaterThan(0);
    expect(enterprisePlanFeatures?.length).toBeGreaterThan(0);

    // Verificar los botones de acción
    const buttons = compiled.querySelectorAll('div[data-plan] button');
    expect(buttons.length).toBe(3); // 3 botones

    // Verificar el texto de los botones (más flexible)
    expect(buttons[0]?.textContent).toContain('Gratis');
    expect(buttons[1]?.textContent).toContain('Premium');
    expect(buttons[2]?.textContent).toContain('Ventas');
  });

  it('should render correct features per plan', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const featureLists = compiled.querySelectorAll('div[data-plan] ul');
    expect(featureLists.length).toBeGreaterThanOrEqual(3);

    if (featureLists.length >= 3) {
      const freePlanFeatures = featureLists[0].querySelectorAll('li');
      const premiumPlanFeatures = featureLists[1].querySelectorAll('li');
      const enterprisePlanFeatures = featureLists[2].querySelectorAll('li');

      expect(freePlanFeatures.length).toBeGreaterThan(0);
      expect(premiumPlanFeatures.length).toBeGreaterThan(0);
      expect(enterprisePlanFeatures.length).toBeGreaterThan(0);
    }
  });

  it('should mark the premium plan as popular', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const popularBadge = compiled.querySelector('span.bg-gradient-to-r, .bg-gradient-to-r');
    expect(popularBadge?.textContent).toContain('Popular');
  });

  it('should toggle pricing and update prices', () => {
    // Verificar que los planes existen antes de acceder
    expect(component.plans).toBeDefined();
    expect(component.plans.length).toBeGreaterThan(1);

    const initialPrice = component.plans[1].price;
    component.togglePricing(true);
    expect(component.isAnnual).toBe(true);
    expect(component.plans[1].price).not.toBe(initialPrice);

    component.togglePricing(false);
    expect(component.isAnnual).toBe(false);
    expect(component.plans[1].price).toBe(initialPrice);
  });

  it('should toggle showAllFeatures and update visibleComparisonFeatures', () => {
    // Verificar que las propiedades existen
    expect(component.showAllFeatures).toBeDefined();
    expect(component.visibleComparisonFeatures).toBeDefined();
    expect(component.comparisonFeatures).toBeDefined();
    expect(component.defaultVisibleRows).toBeDefined();

    const initialShowAll = component.showAllFeatures;

    // Activar mostrar todas las características
    component.toggleShowAllFeatures();
    expect(component.showAllFeatures).toBe(!initialShowAll);

    // Desactivar mostrar todas las características
    component.toggleShowAllFeatures();
    expect(component.showAllFeatures).toBe(initialShowAll);
  });

  it('should handle mobile scroll functionality', (done) => {
    // Simular entorno móvil
    const originalInnerWidth = window.innerWidth;
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375
    });

    // Mock de getComputedStyle
    const originalGetComputedStyle = window.getComputedStyle;
    window.getComputedStyle = jest.fn().mockReturnValue({
      paddingLeft: '16px'
    });

    // Crear mock del contenedor
    const mockScrollTo = jest.fn();
    const mockFlexContainer = {
      style: { paddingLeft: '16px' }
    };
    const mockPremiumCard = {
      offsetWidth: 350,
      offsetLeft: 350
    };

    const mockQuerySelector = jest.fn().mockImplementation((selector) => {
      if (selector === '[data-plan="premium"]') {
        return mockPremiumCard;
      }
      if (selector === '.flex') {
        return mockFlexContainer;
      }
      return null;
    });

    const mockContainer = {
      offsetWidth: 375,
      querySelector: mockQuerySelector,
      scrollTo: mockScrollTo
    };

    // Asignar el mock al componente
    component.pricingContainer = new ElementRef(mockContainer);

    // Llamar al método
    component.ngAfterViewInit();

    // Usar setTimeout para esperar que se ejecute el timeout del componente
    setTimeout(() => {
      // Verificar que se llamó scrollTo
      expect(mockScrollTo).toHaveBeenCalled();

      // Restaurar valores originales
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: originalInnerWidth
      });
      window.getComputedStyle = originalGetComputedStyle;

      done();
    }, 400); // Esperar más que el timeout del componente (300ms)
  });
});
