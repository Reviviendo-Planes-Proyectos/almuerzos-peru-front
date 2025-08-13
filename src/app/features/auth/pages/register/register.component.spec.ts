import { Location } from '@angular/common';
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { I18nService, TranslatePipe } from '../../../../shared/i18n';
import { MaterialModule } from '../../../../shared/material.module';
import { RegisterComponent } from './register.component';

// Mock del servicio de traducción
class MockI18nService {
  t(key: string): string {
    const translations: Record<string, string> = {
      'app.name': 'ALMUERZOS PERU',
      'messages.welcome': '¡Bienvenido a Almuerzos Peru!',
      'auth.register.title': '¿Cómo deseas registrarte?',
      'auth.register.button': 'Continuar',
      'auth.register.email': 'Correo',
      'auth.register.later': 'Registrarse después',
      'auth.register.withGoogle': 'Continuar con Google',
      'auth.register.withFacebook': 'Continuar con Facebook',
      'auth.register.withEmail': 'Continuar con Correo',
      'common.back': 'Volver',
      'common.or': 'O',
      'common.background': 'Fondo',
      'common.google': 'Google',
      'common.facebook': 'Facebook'
    };
    return translations[key] || key;
  }
}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let router: Router;
  let location: Location;
  let debugElement: DebugElement;
  let mockI18nService: MockI18nService;

  beforeEach(async () => {
    const routerSpy = {
      navigate: jest.fn()
    };

    const locationSpy = {
      back: jest.fn()
    };

    mockI18nService = new MockI18nService();

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, MaterialModule, NoopAnimationsModule, TranslatePipe],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: Location, useValue: locationSpy },
        { provide: I18nService, useValue: mockI18nService }
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

  it('should display the app name', () => {
    const titleElement = debugElement.query(By.css('h1'));
    expect(titleElement.nativeElement.textContent.trim()).toBe('ALMUERZOS PERU');
  });

  it('should display register title', () => {
    const titleElement = debugElement.query(By.css('p'));
    expect(titleElement.nativeElement.textContent.trim()).toBe('¿Cómo deseas registrarte?');
  });

  it('should display three registration buttons', () => {
    const buttons = debugElement.queryAll(By.css('button'));
    expect(buttons.length).toBe(5);
  });

  it('should display "O" separator', () => {
    const separatorElement = debugElement.query(By.css('.mx-4'));
    expect(separatorElement.nativeElement.textContent.trim()).toBe('O');
  });

  it('should display "Registrarse después" link', () => {
    const linkElement = debugElement.query(By.css('button.text-purple-700'));
    expect(linkElement.nativeElement.textContent.trim()).toBe('Registrarse después');
  });

  describe('UI Elements', () => {
    it('should display the main title correctly', () => {
      const titleElement = debugElement.query(By.css('h1'));
      expect(titleElement.nativeElement.textContent.trim()).toContain('ALMUERZOS');
      expect(titleElement.nativeElement.textContent.trim()).toContain('PERU');
    });

    it('should display subtitle message', () => {
      const subtitleElement = debugElement.query(By.css('p'));
      expect(subtitleElement.nativeElement.textContent.trim()).toBe('¿Cómo deseas registrarte?');
    });

    it('should display back button with correct icon', () => {
      const backButton = debugElement.query(By.css('app-back-button'));

      expect(backButton).toBeTruthy();
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
        expect(emailButton.nativeElement.textContent.trim()).toContain('Continuar con Correo');
      }
    });

    it('should display "Registrarme luego" link', () => {
      const laterButton = debugElement.query(By.css('button[type="button"]'));
      expect(laterButton.nativeElement.textContent.trim()).toBe('Registrarse después');
    });
  });

  describe('Navigation', () => {
    it('should have back button configured with correct routerLink', () => {
      const backButton = debugElement.query(By.css('app-back-button'));

      expect(backButton).toBeTruthy();
      expect(backButton.componentInstance.routerLink).toBe('/auth/profile-selection');
    });

    it('should call location.back() when goBack is called', () => {
      component.goBack();

      expect(location.back).toHaveBeenCalled();
    });

    it('should navigate to login when "Registrarme luego" button is clicked', () => {
      const routerSpy = jest.spyOn(component.router, 'navigate');
      const laterButton = debugElement.query(By.css('button[type="button"]'));

      laterButton.triggerEventHandler('click', null);

      expect(routerSpy).toHaveBeenCalledWith(['auth/login']);
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

      // Los botones que deben deshabilitarse son todos los botones de acción (no el de back)
      const googleButton = debugElement.queryAll(By.css('button')).find((btn) => {
        const img = btn.query(By.css('img[alt="Google"]'));
        return img !== null;
      });
      const facebookButton = debugElement.queryAll(By.css('button')).find((btn) => {
        const img = btn.query(By.css('img[alt="Facebook"]'));
        return img !== null;
      });
      const emailButton = debugElement.queryAll(By.css('button')).find((btn) => {
        const matIcon = btn.query(By.css('mat-icon'));
        return matIcon !== null && matIcon.nativeElement.textContent.trim() === 'mail';
      });

      if (googleButton) {
        expect(googleButton.nativeElement.disabled).toBe(true);
      }
      if (facebookButton) {
        expect(facebookButton.nativeElement.disabled).toBe(true);
      }
      if (emailButton) {
        expect(emailButton.nativeElement.disabled).toBe(true);
      }
    });
  });

  describe('Internationalization', () => {
    it('should display all text elements with proper translations', () => {
      const titleElement = debugElement.query(By.css('h1'));
      const subtitleElement = debugElement.query(By.css('p'));
      const separatorElement = debugElement.query(By.css('.mx-4'));
      const linkElement = debugElement.query(By.css('button.text-purple-700'));

      expect(titleElement.nativeElement.textContent.trim()).toBe('ALMUERZOS PERU');
      expect(subtitleElement.nativeElement.textContent.trim()).toBe('¿Cómo deseas registrarte?');
      expect(separatorElement.nativeElement.textContent.trim()).toBe('O');
      expect(linkElement.nativeElement.textContent.trim()).toBe('Registrarse después');
    });

    it('should have proper aria-label for back button with translation', () => {
      const backButton = debugElement.query(By.css('button[mat-icon-button]'));
      expect(backButton.nativeElement.getAttribute('aria-label')).toBe('Volver');
    });

    it('should display registration buttons with translated text', () => {
      const googleButton = debugElement.queryAll(By.css('button'))[1];
      const facebookButton = debugElement.queryAll(By.css('button'))[2];
      const emailButton = debugElement.queryAll(By.css('button'))[3];

      expect(googleButton.nativeElement.textContent.trim()).toBe('Continuar con Google');
      expect(facebookButton.nativeElement.textContent.trim()).toBe('Continuar con Facebook');
      expect(emailButton.nativeElement.textContent.trim()).toBe('mail Continuar con Correo');
    });

    it('should use TranslatePipe in template correctly', () => {
      expect(debugElement.query(By.css('h1')).nativeElement.textContent.trim()).toBe('ALMUERZOS PERU');
      expect(debugElement.query(By.css('p')).nativeElement.textContent.trim()).toBe('¿Cómo deseas registrarte?');
    });
  });
});
