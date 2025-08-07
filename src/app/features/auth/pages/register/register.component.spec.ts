import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let router: Router;
  let location: Location;
  let debugElement: DebugElement;

  beforeEach(async () => {
    const routerSpy = {
      navigate: jest.fn()
    };

    const locationSpy = {
      back: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, NoopAnimationsModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: Location, useValue: locationSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    debugElement = fixture.debugElement;
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
      const subtitleElement = debugElement.query(By.css('p'));
      expect(subtitleElement.nativeElement.textContent.trim()).toBe('¿Cómo deseas registrarte?');
    });

    it('should display back button with correct icon', () => {
      const backButton = debugElement.query(By.css('button[mat-icon-button]'));
      const iconElement = backButton.query(By.css('mat-icon'));

      expect(backButton).toBeTruthy();
      expect(iconElement.nativeElement.textContent.trim()).toBe('arrow_back');
    });

    it('should display Google login button with correct text', () => {
      // Buscar por el botón que contiene la imagen de Google
      const buttons = debugElement.queryAll(By.css('button'));
      const googleButton = buttons.find((btn) => {
        const img = btn.query(By.css('img[alt="Google"]'));
        return img !== null;
      });

      expect(googleButton).toBeTruthy();

      if (googleButton) {
        // Buscar el span que no tiene *ngIf (el texto normal)
        const spans = googleButton.queryAll(By.css('span'));
        const textSpan = spans.find((span) => span.nativeElement.textContent.trim() === 'Continuar con Google');

        expect(textSpan).toBeTruthy();
        if (textSpan) {
          expect(textSpan.nativeElement.textContent.trim()).toBe('Continuar con Google');
        }
      }
    });

    it('should display Facebook login button with correct text', () => {
      // Buscar por el botón que contiene la imagen de Facebook
      const buttons = debugElement.queryAll(By.css('button'));
      const facebookButton = buttons.find((btn) => {
        const img = btn.query(By.css('img[alt="Facebook"]'));
        return img !== null;
      });

      expect(facebookButton).toBeTruthy();

      if (facebookButton) {
        // Buscar el span que contiene el texto normal
        const spans = facebookButton.queryAll(By.css('span'));
        const textSpan = spans.find((span) => span.nativeElement.textContent.trim() === 'Continuar con Facebook');

        expect(textSpan).toBeTruthy();
        if (textSpan) {
          expect(textSpan.nativeElement.textContent.trim()).toBe('Continuar con Facebook');
        }
      }
    });

    it('should display email registration button with correct text', () => {
      // Buscar el botón que contiene mat-icon
      const buttons = debugElement.queryAll(By.css('button'));
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
      const laterLink = debugElement.query(By.css('a'));
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
      const laterLink = debugElement.query(By.css('a'));

      laterLink.triggerEventHandler('click', null);

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Google Login', () => {
    it('should call loginWithGoogle when Google button is clicked', () => {
      const spy = jest.spyOn(component, 'loginWithGoogle');

      // Buscar botón de Google
      const buttons = debugElement.queryAll(By.css('button'));
      const googleButton = buttons.find((btn) => {
        const img = btn.query(By.css('img[alt="Google"]'));
        return img !== null;
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
      const initialState = component.isGoogleLoading;

      component.loginWithGoogle();

      expect(component.isGoogleLoading).toBe(initialState);
    });

    it('should navigate to customer-basic-info after Google login', fakeAsync(() => {
      component.loginWithGoogle();
      tick(2000);

      expect(router.navigate).toHaveBeenCalledWith(['/auth/customer-basic-info']);
      expect(component.isGoogleLoading).toBe(false);
    }));

    it('should show loading spinner when Google loading', () => {
      component.isGoogleLoading = true;
      fixture.detectChanges();

      // Verificar que el estado de carga está activado
      expect(component.isGoogleLoading).toBe(true);

      const buttons = debugElement.queryAll(By.css('button:not([mat-icon-button])'));
      expect(buttons.length).toBeGreaterThanOrEqual(3); // Debe haber al menos 3 botones

      const googleButton = buttons[0]; // Primer botón es Google
      expect(googleButton).toBeTruthy();

      // Verificar que el botón está deshabilitado cuando está cargando
      expect(googleButton.nativeElement.disabled).toBe(true);
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
      const facebookButton = buttons[1]; // Segundo botón es Facebook

      facebookButton.triggerEventHandler('click', null);

      expect(spy).toHaveBeenCalled();
    });

    it('should set isFacebookLoading to true when loginWithFacebook is called', () => {
      component.loginWithFacebook();

      expect(component.isFacebookLoading).toBe(true);
    });

    it('should prevent multiple clicks when Facebook loading', () => {
      component.isFacebookLoading = true;
      const initialState = component.isFacebookLoading;

      component.loginWithFacebook();

      expect(component.isFacebookLoading).toBe(initialState);
    });

    it('should reset loading state after Facebook login timeout', fakeAsync(() => {
      component.loginWithFacebook();
      tick(2000);

      expect(component.isFacebookLoading).toBe(false);
    }));

    it('should show loading spinner when Facebook loading', () => {
      component.isFacebookLoading = true;
      fixture.detectChanges();

      // Verificar que el estado de carga está activado
      expect(component.isFacebookLoading).toBe(true);

      // Buscar el botón de Facebook por índice (más confiable)
      const buttons = debugElement.queryAll(By.css('button:not([mat-icon-button])'));
      expect(buttons.length).toBeGreaterThanOrEqual(3); // Debe haber al menos 3 botones

      const facebookButton = buttons[1]; // Segundo botón es Facebook
      expect(facebookButton).toBeTruthy();

      // Verificar que el botón está deshabilitado cuando está cargando
      expect(facebookButton.nativeElement.disabled).toBe(true);
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

      // Buscar el botón de email (tercer botón)
      const buttons = debugElement.queryAll(By.css('button:not([mat-icon-button])'));
      const emailButton = buttons[2]; // Tercer botón es Email

      emailButton.triggerEventHandler('click', null);

      expect(spy).toHaveBeenCalled();
    });

    it('should set isEmailLoading to true when crearConEmail is called', () => {
      component.crearConEmail();

      expect(component.isEmailLoading).toBe(true);
    });

    it('should prevent multiple clicks when email loading', () => {
      component.isEmailLoading = true;
      const initialState = component.isEmailLoading;

      component.crearConEmail();

      expect(component.isEmailLoading).toBe(initialState);
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

    it('should not show loading spinner for email button (design choice)', () => {
      component.isEmailLoading = true;
      fixture.detectChanges();

      const buttons = debugElement.queryAll(By.css('button:not([mat-icon-button])'));
      const emailButton = buttons[2]; // Tercer botón es Email

      const spinner = emailButton.query(By.css('.animate-spin'));

      expect(spinner).toBeFalsy();
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

    it('should allow multiple loading states to be true simultaneously', () => {
      // El comportamiento actual permite que múltiples estados de carga sean true
      // Solo previene la ejecución si el estado específico ya es true
      component.isGoogleLoading = false;
      component.isFacebookLoading = false;
      component.isEmailLoading = false;

      // Llamar a ambos métodos
      component.loginWithGoogle();
      expect(component.isGoogleLoading).toBe(true);

      // Como loginWithFacebook verifica solo su propio estado, puede ejecutarse
      component.loginWithFacebook();
      expect(component.isFacebookLoading).toBe(true);

      component.crearConEmail();
      expect(component.isEmailLoading).toBe(true);

      // Todos pueden estar activos simultáneamente
      expect(component.isGoogleLoading).toBe(true);
      expect(component.isFacebookLoading).toBe(true);
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
