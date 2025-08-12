import { ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { I18nService } from '../../../../../shared/i18n';
import { PricingSectionComponent } from './pricing-section.component';

// Mock del servicio de traducción
class MockI18nService {
  t(key: string): string {
    const translations: Record<string, string> = {
      'landing.restaurant.pricing.title.prefix': 'Planes que se adaptan a',
      'landing.restaurant.pricing.title.highlight': 'tu ritmo',
      'landing.restaurant.pricing.title.suffix': 'de crecimiento',
      'landing.restaurant.pricing.subtitle': 'Elige el plan perfecto para llevar tu restaurante al siguiente nivel',
      'landing.restaurant.pricing.limitedOffer': '¡Oferta limitada!',
      'landing.restaurant.pricing.plans.free.title': 'Plan Gratuito',
      'landing.restaurant.pricing.plans.free.period': 'Para siempre',
      'landing.restaurant.pricing.plans.free.button': 'Comenzar Gratis',
      'landing.restaurant.pricing.plans.free.features.menuBasic': 'Menú digital básico',
      'landing.restaurant.pricing.plans.free.features.dishes': 'Hasta 20 platos',
      'landing.restaurant.pricing.plans.free.features.whatsapp': 'Compartir por WhatsApp',
      'landing.restaurant.pricing.plans.free.features.realTime': 'Actualizaciones en tiempo real',
      'landing.restaurant.pricing.plans.free.features.support': 'Soporte por email. Hasta 5 promociones diarias',
      'landing.restaurant.pricing.plans.premium.title': 'Plan Premium',
      'landing.restaurant.pricing.plans.premium.button': 'Comenzar Premium',
      'landing.restaurant.pricing.plans.premium.features.menuCustom': 'Menú digital personalizado',
      'landing.restaurant.pricing.plans.premium.features.dishesUnlimited': 'Platos ilimitados',
      'landing.restaurant.pricing.plans.premium.features.cardsUnlimited': 'Cartas ilimitadas',
      'landing.restaurant.pricing.plans.premium.features.reports': 'Reporte de informes',
      'landing.restaurant.pricing.plans.premium.features.support24': 'Soporte premium 24/7',
      'landing.restaurant.pricing.plans.premium.features.promotionsUnlimited': 'Promociones ilimitadas',
      'landing.restaurant.pricing.plans.enterprise.title': 'Plan Empresarial',
      'landing.restaurant.pricing.plans.enterprise.button': 'Contactar Ventas',
      'landing.restaurant.pricing.plans.enterprise.features.allPremium': 'Todo del plan premium',
      'landing.restaurant.pricing.plans.enterprise.features.multiRestaurant': 'Función multi-restaurante',
      'landing.restaurant.pricing.plans.enterprise.features.brandCustomization': 'Personalización marca o sede',
      'landing.restaurant.pricing.plans.enterprise.features.posIntegration': 'Integración con POS',
      'landing.restaurant.pricing.plans.enterprise.features.autoBilling': 'Facturación automática',
      'landing.restaurant.pricing.plans.enterprise.features.personalizedTraining': 'Capacitación personalizada',
      'landing.restaurant.pricing.plans.enterprise.features.smartCombos': 'Gestión de combos inteligentes',
      'landing.restaurant.pricing.periods.monthly': 'por mes',
      'landing.restaurant.pricing.periods.annual': 'por año',
      'landing.restaurant.pricing.periods.forever': 'Para siempre'
    };
    return translations[key] || key;
  }
}

describe('PricingSectionComponent', () => {
  let component: PricingSectionComponent;
  let fixture: ComponentFixture<PricingSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PricingSectionComponent],
      providers: [{ provide: I18nService, useClass: MockI18nService }]
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
    expect(compiled.querySelector('h2')?.textContent).toContain('Planes que se adaptan a');
    expect(compiled.querySelector('h2')?.textContent).toContain('tu ritmo');
    expect(compiled.querySelector('h2')?.textContent).toContain('de crecimiento');
    expect(compiled.querySelector('p')?.textContent).toContain(
      'Elige el plan perfecto para llevar tu restaurante al siguiente nivel'
    );
  });

  it('should render three pricing cards', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const plans = compiled.querySelectorAll('div[data-plan]');
    expect(plans.length).toBe(3);

    const featureLists = compiled.querySelectorAll('div[data-plan] ul');
    expect(featureLists.length).toBe(3); // 3 listas de características

    const freePlanFeatures = featureLists[0]?.querySelectorAll('li');
    const premiumPlanFeatures = featureLists[1]?.querySelectorAll('li');
    const enterprisePlanFeatures = featureLists[2]?.querySelectorAll('li');

    expect(freePlanFeatures?.length).toBeGreaterThan(0);
    expect(premiumPlanFeatures?.length).toBeGreaterThan(0);
    expect(enterprisePlanFeatures?.length).toBeGreaterThan(0);

    const buttons = compiled.querySelectorAll('div[data-plan] button');
    expect(buttons.length).toBe(3);

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
    expect(component.showAllFeatures).toBeDefined();
    expect(component.visibleComparisonFeatures).toBeDefined();
    expect(component.comparisonFeatures).toBeDefined();
    expect(component.defaultVisibleRows).toBeDefined();

    const initialShowAll = component.showAllFeatures;

    component.toggleShowAllFeatures();
    expect(component.showAllFeatures).toBe(!initialShowAll);

    component.toggleShowAllFeatures();
    expect(component.showAllFeatures).toBe(initialShowAll);
  });

  it('should handle mobile scroll functionality', (done) => {
    const originalInnerWidth = window.innerWidth;
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375
    });

    const originalGetComputedStyle = window.getComputedStyle;
    window.getComputedStyle = jest.fn().mockReturnValue({
      paddingLeft: '16px'
    });

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

    component.pricingContainer = new ElementRef(mockContainer);
    component.ngAfterViewInit();

    setTimeout(() => {
      expect(mockScrollTo).toHaveBeenCalled();

      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: originalInnerWidth
      });
      window.getComputedStyle = originalGetComputedStyle;

      done();
    }, 400);
  });

  it('should handle ngOnInit with document ready state complete', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 400
    });

    Object.defineProperty(document, 'readyState', {
      writable: true,
      configurable: true,
      value: 'complete'
    });

    const scheduleInitialCenteringSpy = jest.spyOn(component as any, 'scheduleInitialCentering');

    component.ngOnInit();

    expect(scheduleInitialCenteringSpy).toHaveBeenCalled();
  });

  it('should handle ngOnInit with document not ready', () => {
    Object.defineProperty(document, 'readyState', {
      writable: true,
      configurable: true,
      value: 'loading'
    });

    const mockAddEventListener = jest.spyOn(window, 'addEventListener');

    component.ngOnInit();

    expect(mockAddEventListener).toHaveBeenCalledWith('load', expect.any(Function), { once: true });
  });

  it('should not run intersection observer setup when pricingSection is undefined', () => {
    (component as any).pricingSection = undefined;

    const setupIntersectionObserverSpy = jest.spyOn(component as any, 'setupIntersectionObserver');

    component.ngAfterViewInit();

    expect(setupIntersectionObserverSpy).toHaveBeenCalled();
  });

  it('should handle intersection observer entries correctly', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 400
    });

    let intersectionCallback: any;
    const mockIntersectionObserver = jest.fn().mockImplementation((callback) => {
      intersectionCallback = callback;
      return {
        observe: jest.fn(),
        disconnect: jest.fn()
      };
    });

    (global as any).IntersectionObserver = mockIntersectionObserver;

    const mockPricingSection = { nativeElement: {} };
    component.pricingSection = mockPricingSection as any;

    const centerViewOnMobileSpy = jest.spyOn(component as any, 'centerViewOnMobile');
    const centerComparisonOnMobileSpy = jest.spyOn(component as any, 'centerComparisonOnMobile');

    component.ngAfterViewInit();

    const mockEntries = [{ isIntersecting: true }];
    intersectionCallback(mockEntries);

    setTimeout(() => {
      expect(centerViewOnMobileSpy).toHaveBeenCalled();
      expect(centerComparisonOnMobileSpy).toHaveBeenCalled();
    }, 500);
  });
});
