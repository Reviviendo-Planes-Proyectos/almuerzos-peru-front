import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { I18nService } from '../../../i18n';
import { MaterialModule } from '../../../modules';
import { BackButtonComponent } from './back-button.component';

class MockI18nService {
  t(key: string): string {
    const translations: Record<string, string> = {
      'common.back': 'Volver'
    };
    return translations[key] || key;
  }
}

class MockLocation {
  back = jest.fn();
}

class MockRouter {
  navigate = jest.fn();
}

describe('BackButtonComponent', () => {
  let component: BackButtonComponent;
  let fixture: ComponentFixture<BackButtonComponent>;
  let mockLocation: MockLocation;
  let mockRouter: MockRouter;
  let mockI18nService: MockI18nService;

  beforeEach(async () => {
    mockLocation = new MockLocation();
    mockRouter = new MockRouter();
    mockI18nService = new MockI18nService();

    await TestBed.configureTestingModule({
      imports: [BackButtonComponent, MaterialModule, NoopAnimationsModule],
      providers: [
        { provide: Location, useValue: mockLocation },
        { provide: Router, useValue: mockRouter },
        { provide: I18nService, useValue: mockI18nService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BackButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default position as top-left', () => {
    expect(component.position).toBe('top-left');
    expect(component.positionClasses).toBe('top-4 left-4');
  });

  it('should return correct position classes for different positions', () => {
    component.position = 'top-right';
    expect(component.positionClasses).toBe('top-4 right-4');

    component.position = 'bottom-left';
    expect(component.positionClasses).toBe('bottom-4 left-4');

    component.position = 'bottom-right';
    expect(component.positionClasses).toBe('bottom-4 right-4');
  });

  it('should use custom aria label when provided', () => {
    component.ariaLabel = 'Custom back button';
    expect(component.buttonAriaLabel).toBe('Custom back button');
  });

  it('should use translated aria label when no custom label provided', () => {
    component.ariaLabel = '';
    expect(component.buttonAriaLabel).toBe('Volver');
  });

  it('should call location.back() when goBack is called', () => {
    component.goBack();
    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('should call goBack when button is clicked', () => {
    const goBackSpy = jest.spyOn(component, 'goBack');
    const button = fixture.debugElement.nativeElement.querySelector('button');

    button.click();

    expect(goBackSpy).toHaveBeenCalled();
  });

  it('should have correct button classes', () => {
    const button = fixture.debugElement.nativeElement.querySelector('button');

    expect(button.classList).toContain('absolute');
    expect(button.classList).toContain('z-50');
    expect(button.classList).toContain('bg-white');
    expect(button.classList).toContain('bg-opacity-70');
    expect(button.classList).toContain('rounded-full');
    expect(button.classList).toContain('shadow-md');
    expect(button.classList).toContain('top-4');
    expect(button.classList).toContain('left-4');
  });

  it('should include custom class when provided', () => {
    component.customClass = 'my-custom-class';
    fixture.detectChanges();

    const button = fixture.debugElement.nativeElement.querySelector('button');
    expect(button.classList).toContain('my-custom-class');
  });

  it('should have mat-icon with arrow_back', () => {
    const icon = fixture.debugElement.nativeElement.querySelector('mat-icon');
    expect(icon).toBeTruthy();
    expect(icon.textContent.trim()).toBe('arrow_back');
  });

  it('should have proper aria-label attribute', () => {
    const button = fixture.debugElement.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-label')).toBe('Volver');
  });

  describe('Position variations', () => {
    it('should apply top-right position classes', () => {
      component.position = 'top-right';
      fixture.detectChanges();

      const button = fixture.debugElement.nativeElement.querySelector('button');
      expect(button.classList).toContain('top-4');
      expect(button.classList).toContain('right-4');
    });

    it('should apply bottom-left position classes', () => {
      component.position = 'bottom-left';
      fixture.detectChanges();

      const button = fixture.debugElement.nativeElement.querySelector('button');
      expect(button.classList).toContain('bottom-4');
      expect(button.classList).toContain('left-4');
    });

    it('should apply bottom-right position classes', () => {
      component.position = 'bottom-right';
      fixture.detectChanges();

      const button = fixture.debugElement.nativeElement.querySelector('button');
      expect(button.classList).toContain('bottom-4');
      expect(button.classList).toContain('right-4');
    });
  });

  describe('Navigation', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should call location.back() when no routerLink is provided', () => {
      component.goBack();
      expect(mockLocation.back).toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should navigate to routerLink when provided as string', () => {
      component.routerLink = '/auth/login';
      component.goBack();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
      expect(mockLocation.back).not.toHaveBeenCalled();
    });

    it('should navigate to routerLink when provided as array', () => {
      component.routerLink = ['auth', 'login'];
      component.goBack();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['auth', 'login']);
      expect(mockLocation.back).not.toHaveBeenCalled();
    });

    it('should prioritize routerLink over location.back() when both options are available', () => {
      component.routerLink = '/home';
      component.goBack();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
      expect(mockLocation.back).not.toHaveBeenCalled();
    });

    it('should handle empty string routerLink as falsy value', () => {
      component.routerLink = '';
      component.goBack();
      expect(mockLocation.back).toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });
});
