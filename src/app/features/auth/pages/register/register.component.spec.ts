import { Location } from '@angular/common';
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { LoggerService } from '../../../../shared/services/logger/logger.service';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let router: Router;
  let location: Location;
  let debugElement: DebugElement;
  let activatedRoute: ActivatedRoute;
  let loggerService: LoggerService;

  beforeEach(async () => {
    const routerSpy = {
      navigate: jest.fn().mockResolvedValue(true),
      getCurrentNavigation: jest.fn().mockReturnValue(null),
      routerState: {
        root: {
          firstChild: {
            snapshot: {
              data: {}
            }
          }
        }
      }
    };

    const locationSpy = {
      back: jest.fn()
    };

    const activatedRouteSpy = {
      queryParams: of({}),
      snapshot: {
        queryParams: {}
      }
    };

    const loggerServiceSpy = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, NoopAnimationsModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: Location, useValue: locationSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: LoggerService, useValue: loggerServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    activatedRoute = TestBed.inject(ActivatedRoute);
    loggerService = TestBed.inject(LoggerService);
    debugElement = fixture.debugElement;

    // Mock window.history.state
    Object.defineProperty(window, 'history', {
      value: { state: {} },
      writable: true
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial loading states as false', () => {
    expect(component.isGoogleLoading).toBe(false);
    expect(component.isFacebookLoading).toBe(false);
    expect(component.isEmailLoading).toBe(false);
  });

  describe('ngOnInit', () => {
    it('should get tipo from router navigation state', () => {
      const routerSpy = router as any;
      routerSpy.getCurrentNavigation.mockReturnValue({
        extras: {
          state: { tipo: 'restaurante' }
        }
      });

      component.ngOnInit();

      expect(component.tipo).toBe('restaurante');
    });

    it('should get tipo from router state as fallback', () => {
      const routerSpy = router as any;
      routerSpy.getCurrentNavigation.mockReturnValue(null);
      routerSpy.routerState.root.firstChild.snapshot.data = { tipo: 'comensal' };

      component.ngOnInit();

      expect(component.tipo).toBe('comensal');
    });

    it('should get tipo from queryParams as backup', () => {
      const activatedRouteSpy = activatedRoute as any;
      activatedRouteSpy.queryParams = of({ userType: 'restaurante' });

      component.ngOnInit();

      expect(component.tipo).toBe('restaurante');
    });

    it('should get tipo from window.history.state as final fallback', () => {
      Object.defineProperty(window, 'history', {
        value: { state: { tipo: 'comensal' } },
        writable: true
      });

      component.ngOnInit();

      expect(component.tipo).toBe('comensal');
    });
  });

  describe('UI Elements', () => {
    it('should display the main title correctly', () => {
      const titleElement = debugElement.query(By.css('h1'));
      expect(titleElement.nativeElement.textContent.trim()).toContain('ALMUERZOS');
      expect(titleElement.nativeElement.textContent.trim()).toContain('PERÚ');
    });

    it('should display welcome message', () => {
      const welcomeElement = debugElement.query(By.css('h2'));
      expect(welcomeElement.nativeElement.textContent.trim()).toBe('¡Bienvenido!');
    });

    it('should display subtitle message', () => {
      const subtitleElements = debugElement.queryAll(By.css('p'));
      const subtitleElement = subtitleElements.find(
        (el) => el.nativeElement.textContent.trim() === '¿Cómo deseas registrarte?'
      );
      expect(subtitleElement).toBeTruthy();
      expect(subtitleElement?.nativeElement.textContent.trim()).toBe('¿Cómo deseas registrarte?');
    });

    it('should display back button with correct icon', () => {
      const backButton = debugElement.query(By.css('button[mat-icon-button]'));
      const iconElement = backButton.query(By.css('mat-icon'));

      expect(backButton).toBeTruthy();
      expect(iconElement.nativeElement.textContent.trim()).toBe('arrow_back');
    });

    it('should display Google login button with correct text', () => {
      const buttons = debugElement.queryAll(By.css('button:not([mat-icon-button])'));
      const googleButton = buttons.find((btn) => {
        const img = btn.query(By.css('img[alt="Google"]'));
        const span = btn.query(By.css('span'));
        return img !== null || span?.nativeElement?.textContent?.includes('Google');
      });

      expect(googleButton).toBeTruthy();

      if (googleButton) {
        const spans = googleButton.queryAll(By.css('span'));
        const textSpan = spans.find((span) => span.nativeElement.textContent.trim() === 'Continuar con Google');
        expect(textSpan).toBeTruthy();
      }
    });

    it('should display Facebook login button with correct text', () => {
      const buttons = debugElement.queryAll(By.css('button:not([mat-icon-button])'));
      const facebookButton = buttons.find((btn) => {
        const img = btn.query(By.css('img[alt="Facebook"]'));
        const span = btn.query(By.css('span'));
        return img !== null || span?.nativeElement?.textContent?.includes('Facebook');
      });

      expect(facebookButton).toBeTruthy();

      if (facebookButton) {
        const spans = facebookButton.queryAll(By.css('span'));
        const textSpan = spans.find((span) => span.nativeElement.textContent.trim() === 'Continuar con Facebook');
        expect(textSpan).toBeTruthy();
      }
    });

    it('should display email registration button with correct text', () => {
      const buttons = debugElement.queryAll(By.css('button:not([mat-icon-button])'));
      const emailButton = buttons.find((btn) => {
        const matIcon = btn.query(By.css('mat-icon'));
        return matIcon !== null && matIcon.nativeElement.textContent.trim() === 'mail';
      });

      expect(emailButton).toBeTruthy();

      if (emailButton) {
        const spanElement = emailButton.query(By.css('span'));
        expect(spanElement).toBeTruthy();
        if (spanElement) {
          expect(spanElement.nativeElement.textContent.trim()).toBe('Crear cuenta con email');
        }
      }
    });

    it('should display "Registrarme luego" link', () => {
      const laterLink = debugElement.query(By.css('a[href="#"]'));
      expect(laterLink).toBeTruthy();
      expect(laterLink.nativeElement.textContent.trim()).toBe('Registrarme luego');
    });
  });

  describe('Navigation', () => {
    it('should call goBack when back button is clicked', () => {
      const spy = jest.spyOn(component, 'goBack');
      const backButton = debugElement.query(By.css('button[mat-icon-button]'));

      backButton.triggerEventHandler('click', null);

      expect(spy).toHaveBeenCalled();
    });

    it('should call location.back() when goBack is called', () => {
      component.goBack();

      expect(location.back).toHaveBeenCalled();
    });

    it('should call goBack when "Registrarme luego" link is clicked', () => {
      const spy = jest.spyOn(component, 'goBack');
      const laterLink = debugElement.query(By.css('a[href="#"]'));

      laterLink.triggerEventHandler('click', null);

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Google Login', () => {
    it('should call loginWithGoogle when Google button is clicked', () => {
      const spy = jest.spyOn(component, 'loginWithGoogle');

      const buttons = debugElement.queryAll(By.css('button:not([mat-icon-button])'));
      const googleButton = buttons.find((btn) => {
        const spans = btn.queryAll(By.css('span'));
        return spans.some((span) => span?.nativeElement?.textContent?.includes('Google'));
      });

      expect(googleButton).toBeTruthy();
      if (googleButton) {
        googleButton.triggerEventHandler('click', null);
        expect(spy).toHaveBeenCalled();
      }
    });

    it('should set isGoogleLoading to true when loginWithGoogle is called', () => {
      component.loginWithGoogle();

      expect(component.isGoogleLoading).toBe(true);
    });

    it('should prevent multiple clicks when Google loading', () => {
      component.isGoogleLoading = true;
      const spy = jest.spyOn(component as any, 'navigateToBasicInfo');

      component.loginWithGoogle();

      expect(spy).not.toHaveBeenCalled();
    });

    it('should navigate to customer-basic-info after Google login when tipo is comensal', fakeAsync(() => {
      component.tipo = 'comensal';
      component.loginWithGoogle();
      tick(2000);

      expect(router.navigate).toHaveBeenCalledWith(['/auth/customer-basic-info']);
      expect(component.isGoogleLoading).toBe(false);
    }));

    it('should navigate to restaurant-basic-info after Google login when tipo is restaurante', fakeAsync(() => {
      component.tipo = 'restaurante';
      component.loginWithGoogle();
      tick(2000);

      expect(router.navigate).toHaveBeenCalledWith(['/auth/restaurant-basic-info']);
      expect(component.isGoogleLoading).toBe(false);
    }));

    it('should show loading spinner when Google loading', () => {
      component.isGoogleLoading = true;
      fixture.detectChanges();

      const spinner = debugElement.query(By.css('.animate-spin'));
      expect(spinner).toBeTruthy();

      //const loadingText = debugElement.query(By.css('span'));
      const connectingSpan = Array.from(debugElement.queryAll(By.css('span'))).find(
        (span) => span?.nativeElement?.textContent?.trim() === 'Conectando...'
      );
      expect(connectingSpan).toBeTruthy();
    });

    it('should disable all buttons when Google loading', () => {
      component.isGoogleLoading = true;
      fixture.detectChanges();

      const buttons = debugElement.queryAll(By.css('button:not([mat-icon-button])'));
      for (const button of buttons) {
        expect(button.nativeElement.disabled).toBe(true);
      }
    });
  });

  describe('Facebook Login', () => {
    it('should call loginWithFacebook when Facebook button is clicked', () => {
      const spy = jest.spyOn(component, 'loginWithFacebook');

      const buttons = debugElement.queryAll(By.css('button:not([mat-icon-button])'));
      const facebookButton = buttons.find((btn) => {
        const spans = btn.queryAll(By.css('span'));
        return spans.some((span) => span?.nativeElement?.textContent?.includes('Facebook'));
      });

      expect(facebookButton).toBeTruthy();
      if (facebookButton) {
        facebookButton.triggerEventHandler('click', null);
        expect(spy).toHaveBeenCalled();
      }
    });

    it('should set isFacebookLoading to true when loginWithFacebook is called', () => {
      component.loginWithFacebook();

      expect(component.isFacebookLoading).toBe(true);
    });

    it('should prevent multiple clicks when Facebook loading', () => {
      component.isFacebookLoading = true;
      const spy = jest.spyOn(component as any, 'navigateToBasicInfo');

      component.loginWithFacebook();

      expect(spy).not.toHaveBeenCalled();
    });

    it('should reset loading state after Facebook login timeout', fakeAsync(() => {
      component.loginWithFacebook();
      tick(2000);

      expect(component.isFacebookLoading).toBe(false);
    }));

    it('should show loading spinner when Facebook loading', () => {
      component.isFacebookLoading = true;
      fixture.detectChanges();

      const spinner = debugElement.query(By.css('.animate-spin'));
      expect(spinner).toBeTruthy();

      const connectingSpan = Array.from(debugElement.queryAll(By.css('span'))).find(
        (span) => span?.nativeElement?.textContent?.trim() === 'Conectando...'
      );
      expect(connectingSpan).toBeTruthy();
    });

    it('should disable all buttons when Facebook loading', () => {
      component.isFacebookLoading = true;
      fixture.detectChanges();

      const buttons = debugElement.queryAll(By.css('button:not([mat-icon-button])'));
      for (const button of buttons) {
        expect(button.nativeElement.disabled).toBe(true);
      }
    });
  });

  describe('Email Registration', () => {
    it('should call crearConEmail when email button is clicked', () => {
      const spy = jest.spyOn(component, 'crearConEmail');

      const buttons = debugElement.queryAll(By.css('button:not([mat-icon-button])'));
      const emailButton = buttons.find((btn) => {
        const matIcon = btn.query(By.css('mat-icon'));
        return matIcon && matIcon.nativeElement.textContent.trim() === 'mail';
      });

      expect(emailButton).toBeTruthy();
      if (emailButton) {
        emailButton.triggerEventHandler('click', null);
        expect(spy).toHaveBeenCalled();
      }
    });

    it('should set isEmailLoading to true when crearConEmail is called', () => {
      component.crearConEmail();

      expect(component.isEmailLoading).toBe(true);
    });

    it('should prevent multiple clicks when email loading', () => {
      component.isEmailLoading = true;
      const spy = jest.spyOn(component as any, 'navigateToBasicInfo');

      component.crearConEmail();

      expect(spy).not.toHaveBeenCalled();
    });

    it('should reset loading state after email registration timeout', fakeAsync(() => {
      component.crearConEmail();
      tick(500);

      expect(component.isEmailLoading).toBe(false);
    }));

    it('should disable all buttons when email loading', () => {
      component.isEmailLoading = true;
      fixture.detectChanges();

      const buttons = debugElement.queryAll(By.css('button:not([mat-icon-button])'));
      for (const button of buttons) {
        expect(button.nativeElement.disabled).toBe(true);
      }
    });

    it('should not show loading spinner for email button', () => {
      component.isEmailLoading = true;
      fixture.detectChanges();

      const buttons = debugElement.queryAll(By.css('button:not([mat-icon-button])'));
      const emailButton = buttons.find((btn) => {
        const matIcon = btn.query(By.css('mat-icon'));
        return matIcon && matIcon.nativeElement.textContent.trim() === 'mail';
      });

      expect(emailButton).toBeTruthy();
      if (emailButton) {
        const spinner = emailButton.query(By.css('.animate-spin'));
        expect(spinner).toBeFalsy();
      }
    });
  });

  describe('Navigation Logic', () => {
    it('should navigate to restaurant-basic-info when tipo is restaurante', () => {
      component.tipo = 'restaurante';
      (component as any).navigateToBasicInfo();

      expect(router.navigate).toHaveBeenCalledWith(['/auth/restaurant-basic-info']);
    });

    it('should navigate to customer-basic-info when tipo is comensal', () => {
      component.tipo = 'comensal';
      (component as any).navigateToBasicInfo();

      expect(router.navigate).toHaveBeenCalledWith(['/auth/customer-basic-info']);
    });

    it('should default to customer-basic-info when tipo is undefined', () => {
      component.tipo = null;
      (component as any).navigateToBasicInfo();

      expect(router.navigate).toHaveBeenCalledWith(['/auth/customer-basic-info']);
      expect(loggerService.info).toHaveBeenCalledWith('Tipo no detectado, redirigiendo a customer-basic-info');
    });
  });

  describe('Cross-loading behavior', () => {
    it('should disable all buttons when any loading state is active', () => {
      component.isGoogleLoading = true;
      fixture.detectChanges();

      const allButtons = debugElement.queryAll(By.css('button:not([mat-icon-button])'));
      for (const button of allButtons) {
        expect(button.nativeElement.disabled).toBe(true);
      }
    });

    it('should allow methods to execute if their specific loading state is false', () => {
      component.isGoogleLoading = false;
      component.isFacebookLoading = false;
      component.isEmailLoading = false;

      // Ejecutar Google login
      component.loginWithGoogle();
      expect(component.isGoogleLoading).toBe(true);

      // Reiniciar estados
      component.isGoogleLoading = false;
      component.isFacebookLoading = false;
      component.isEmailLoading = false;

      // Ejecutar Facebook login
      component.loginWithFacebook();
      expect(component.isFacebookLoading).toBe(true);

      // Reiniciar estados
      component.isGoogleLoading = false;
      component.isFacebookLoading = false;
      component.isEmailLoading = false;

      // Ejecutar email registration
      component.crearConEmail();
      expect(component.isEmailLoading).toBe(true);
    });
  });

  describe('Background image', () => {
    it('should display background image with correct src', () => {
      const backgroundImg = debugElement.query(By.css('img[alt="Fondo"]'));

      expect(backgroundImg).toBeTruthy();
      expect(backgroundImg.nativeElement.src).toContain('background_almuerza_peru.png');
    });
  });
});
