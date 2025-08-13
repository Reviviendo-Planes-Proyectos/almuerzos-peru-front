import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let mockRouter: any;

  beforeEach(async () => {
    const routerSpy = {
      navigate: jest.fn(),
      url: '/home-restaurant'
    };

    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [{ provide: Router, useValue: routerSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the footer element', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('footer')).toBeTruthy();
  });

  it('should display the brand name "ALMUERZOSPERÚ"', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const brandText = compiled.textContent || '';
    expect(brandText).toContain('ALMUERZOS');
    expect(brandText).toContain('PERÚ');
  });

  it('should contain social icons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const icons = compiled.querySelectorAll('span.material-icons');
    const iconNames = Array.from(icons).map((el) => el.textContent?.trim());
    expect(iconNames).toContain('facebook');
    expect(iconNames).toContain('camera_alt');
  });

  describe('getCurrentLandingType', () => {
    it('should return "diner" when URL contains /home-diner', () => {
      mockRouter.url = '/home-diner';
      const result = (component as any).getCurrentLandingType();
      expect(result).toBe('diner');
    });

    it('should return "restaurant" when URL contains /home-restaurant', () => {
      mockRouter.url = '/home-restaurant';
      const result = (component as any).getCurrentLandingType();
      expect(result).toBe('restaurant');
    });

    it('should return "restaurant" as default when URL does not match known patterns', () => {
      mockRouter.url = '/some-other-page';
      const result = (component as any).getCurrentLandingType();
      expect(result).toBe('restaurant');
    });

    it('should return "restaurant" as default when URL is empty', () => {
      mockRouter.url = '';
      const result = (component as any).getCurrentLandingType();
      expect(result).toBe('restaurant');
    });
  });

  describe('navigateToTerms', () => {
    it('should navigate to terms-and-conditions with correct query params from restaurant landing', () => {
      mockRouter.url = '/home-restaurant';

      component.navigateToTermsAndConditions();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/legal/terms-and-conditions'], {
        queryParams: { from: 'restaurant' }
      });
    });

    it('should navigate to terms-and-conditions with correct query params from diner landing', () => {
      mockRouter.url = '/home-diner';

      component.navigateToTermsAndConditions();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/legal/terms-and-conditions'], {
        queryParams: { from: 'diner' }
      });
    });
  });

  describe('navigateToPrivacyPolicy', () => {
    it('should navigate to privacy-policy with correct query params from restaurant landing', () => {
      mockRouter.url = '/home-restaurant';

      component.navigateToPrivacyPolicy();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/legal/privacy-policy'], {
        queryParams: { from: 'restaurant' }
      });
    });

    it('should navigate to politica-privacidad with correct query params from diner landing', () => {
      mockRouter.url = '/home-diner';

      component.navigateToPrivacyPolicy();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/legal/privacy-policy'], {
        queryParams: { from: 'diner' }
      });
    });

    it('should navigate to politica-privacidad with default restaurant param for unknown URLs', () => {
      mockRouter.url = '/unknown-page';

      component.navigateToPrivacyPolicy();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/legal/privacy-policy'], {
        queryParams: { from: 'restaurant' }
      });
    });
  });

  describe('isDinerLanding getter', () => {
    it('should return true when current landing type is diner', () => {
      mockRouter.url = '/home-diner';
      expect(component.isDinerLanding).toBe(true);
    });

    it('should return false when current landing type is restaurant', () => {
      mockRouter.url = '/home-restaurant';
      expect(component.isDinerLanding).toBe(false);
    });

    it('should return false when current landing type is unknown', () => {
      mockRouter.url = '/unknown-page';
      expect(component.isDinerLanding).toBe(false);
    });
  });

  describe('isRestaurantLanding getter', () => {
    it('should return true when current landing type is restaurant', () => {
      mockRouter.url = '/home-restaurant';
      expect(component.isRestaurantLanding).toBe(true);
    });

    it('should return false when current landing type is diner', () => {
      mockRouter.url = '/home-diner';
      expect(component.isRestaurantLanding).toBe(false);
    });

    it('should return true when current landing type is unknown (defaults to restaurant)', () => {
      mockRouter.url = '/unknown-page';
      expect(component.isRestaurantLanding).toBe(true);
    });
  });
});
