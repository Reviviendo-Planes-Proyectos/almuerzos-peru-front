import { Location } from '@angular/common';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { I18nService, TranslatePipe } from '../../../../shared/i18n';
import { MaterialModule } from '../../../../shared/material.module';
import { LoginComponent } from './login.component';

class MockI18nService {
  t(key: string): string {
    const translations: Record<string, string> = {
      'app.name': 'ALMUERZOS PERU',
      'app.tagline': '¡Encuentra tu menú diario, sin perder tiempo!',
      'auth.login.title': 'Iniciar Sesión',
      'auth.login.button': 'Iniciar Sesión',
      'auth.login.email': 'Correo',
      'auth.login.noAccount': '¿No tienes cuenta? Regístrate',
      'auth.login.withGoogle': 'Iniciar Sesión con Google',
      'auth.login.withFacebook': 'Iniciar Sesión con Facebook',
      'auth.login.withEmail': 'Iniciar Sesión con Correo',
      'auth.register.button': 'Continuar',
      'auth.forgot.title': 'Olvidé mi Contraseña',
      'common.back': 'Volver',
      'common.or': 'O',
      'common.with': 'con',
      'common.background': 'Fondo',
      'common.google': 'Google',
      'common.facebook': 'Facebook',
      'messages.welcome': '¡Bienvenido a Almuerzos Peru!'
    };
    return translations[key] || key;
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let debugElement: DebugElement;
  let locationSpy: Location;
  let routerSpy: Router;
  let mockI18nService: MockI18nService;

  beforeEach(async () => {
    const locationSpyObj = {
      back: jest.fn()
    };

    const routerSpyObj = {
      navigate: jest.fn()
    };

    mockI18nService = new MockI18nService();

    await TestBed.configureTestingModule({
      imports: [LoginComponent, MaterialModule, NoopAnimationsModule, TranslatePipe],
      providers: [
        { provide: Location, useValue: locationSpyObj },
        { provide: Router, useValue: routerSpyObj },
        { provide: I18nService, useValue: mockI18nService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    locationSpy = TestBed.inject(Location);
    routerSpy = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title "ALMUERZOS PERU"', () => {
    const titleElement = debugElement.query(By.css('h1'));
    expect(titleElement.nativeElement.textContent.trim()).toBe('ALMUERZOS PERU');
  });

  it('should display the welcome message', () => {
    const welcomeElement = debugElement.query(By.css('h2'));
    expect(welcomeElement.nativeElement.textContent.trim()).toBe('¡Bienvenido a Almuerzos Peru!');
  });

  it('should display the login subtitle', () => {
    const subtitleElement = debugElement.query(By.css('p'));
    expect(subtitleElement.nativeElement.textContent.trim()).toBe('Iniciar Sesión');
  });

  it('should render all action buttons', () => {
    const buttons = debugElement.queryAll(By.css('button:not([mat-icon-button])'));
    expect(buttons.length).toBe(3); // Google, Facebook, Email
  });

  it('should render Google login button', () => {
    const googleButton = debugElement.query(By.css('button[class*="border-red-500"]'));
    expect(googleButton).toBeTruthy();
    expect(googleButton.nativeElement.textContent).toContain('Iniciar Sesión con Google');
  });

  it('should render Facebook login button', () => {
    const facebookButton = debugElement.query(By.css('button[class*="border-blue-600"]'));
    expect(facebookButton).toBeTruthy();
    expect(facebookButton.nativeElement.textContent).toContain('Iniciar Sesión con Facebook');
  });

  it('should render Email login button', () => {
    const emailButton = debugElement.query(By.css('button[class*="border-gray-700"]'));
    expect(emailButton).toBeTruthy();
    expect(emailButton.nativeElement.textContent).toContain('Iniciar Sesión con Correo');
  });

  it('should display "O" separator', () => {
    const separatorElement = debugElement.query(By.css('.mx-4'));
    expect(separatorElement.nativeElement.textContent.trim()).toBe('O');
  });

  it('should display forgot password link', () => {
    const links = debugElement.queryAll(By.css('a'));
    const forgotLink = links.find((link) => link.nativeElement.textContent.includes('Olvidé mi Contraseña'));
    expect(forgotLink).toBeTruthy();
  });

  it('should display register link', () => {
    const links = debugElement.queryAll(By.css('a'));
    const registerLink = links.find((link) => link.nativeElement.textContent.includes('¿No tienes cuenta? Regístrate'));
    expect(registerLink).toBeTruthy();
  });

  it('should have background image', () => {
    const imageElement = debugElement.query(By.css('img'));
    expect(imageElement.nativeElement.getAttribute('src')).toBe('img/background_almuerza_peru.png');
    expect(imageElement.nativeElement.getAttribute('alt')).toBe('Fondo');
  });

  it('should have back button with proper attributes', () => {
    const backButton = debugElement.query(By.css('button[mat-icon-button]'));
    expect(backButton).toBeTruthy();
    expect(backButton.nativeElement.getAttribute('aria-label')).toBe('Volver');
  });

  it('should call location.back() when goBack is called', () => {
    component.goBack();
    expect(locationSpy.back).toHaveBeenCalled();
  });

  it('should call goBack when back button is clicked', () => {
    const goBackSpy = jest.spyOn(component, 'goBack');
    const backButton = debugElement.query(By.css('button[mat-icon-button]'));
    backButton.nativeElement.click();
    expect(goBackSpy).toHaveBeenCalled();
  });

  it('should call loginWithGoogle when Google button is clicked', () => {
    const loginGoogleSpy = jest.spyOn(component, 'loginWithGoogle');
    const googleButton = debugElement.query(By.css('button[class*="border-red-500"]'));
    googleButton.nativeElement.click();
    expect(loginGoogleSpy).toHaveBeenCalled();
  });

  it('should call loginWithFacebook when Facebook button is clicked', () => {
    const loginFacebookSpy = jest.spyOn(component, 'loginWithFacebook');
    const facebookButton = debugElement.query(By.css('button[class*="border-blue-600"]'));
    facebookButton.nativeElement.click();
    expect(loginFacebookSpy).toHaveBeenCalled();
  });

  it('should call iniciarConEmail when Email button is clicked', () => {
    const emailSpy = jest.spyOn(component, 'iniciarConEmail');
    const emailButton = debugElement.query(By.css('button[class*="border-gray-700"]'));
    emailButton.nativeElement.click();
    expect(emailSpy).toHaveBeenCalled();
  });

  it('should call forgotPassword when forgot password link is clicked', () => {
    const forgotSpy = jest.spyOn(component, 'forgotPassword');
    const links = debugElement.queryAll(By.css('a'));
    const forgotLink = links.find((link) => link.nativeElement.textContent.includes('Olvidé mi Contraseña'));
    expect(forgotLink).toBeTruthy();
    if (forgotLink) {
      forgotLink.nativeElement.click();
      expect(forgotSpy).toHaveBeenCalled();
    }
  });

  it('should call goToRegister when register link is clicked', () => {
    const registerSpy = jest.spyOn(component, 'goToRegister');
    const links = debugElement.queryAll(By.css('a'));
    const registerLink = links.find((link) => link.nativeElement.textContent.includes('¿No tienes cuenta? Regístrate'));
    expect(registerLink).toBeTruthy();
    if (registerLink) {
      registerLink.nativeElement.click();
      expect(registerSpy).toHaveBeenCalled();
    }
  });

  it('should navigate to register when goToRegister is called', () => {
    component.goToRegister();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/register']);
  });

  describe('Internationalization', () => {
    it('should use translation function for all text elements', () => {
      const titleElement = debugElement.query(By.css('h1'));
      const welcomeElement = debugElement.query(By.css('h2'));
      const subtitleElement = debugElement.query(By.css('p'));

      expect(titleElement.nativeElement.textContent.trim()).toBe('ALMUERZOS PERU');
      expect(welcomeElement.nativeElement.textContent.trim()).toBe('¡Bienvenido a Almuerzos Peru!');
      expect(subtitleElement.nativeElement.textContent.trim()).toBe('Iniciar Sesión');
    });

    it('should translate button texts correctly', () => {
      const googleButton = debugElement.query(By.css('button[class*="border-red-500"]'));
      const facebookButton = debugElement.query(By.css('button[class*="border-blue-600"]'));
      const emailButton = debugElement.query(By.css('button[class*="border-gray-700"]'));

      expect(googleButton.nativeElement.textContent.trim()).toBe('Iniciar Sesión con Google');
      expect(facebookButton.nativeElement.textContent.trim()).toBe('Iniciar Sesión con Facebook');
      expect(emailButton.nativeElement.textContent.trim()).toBe('mail Iniciar Sesión con Correo');
    });

    it('should translate "O" separator correctly', () => {
      const separatorElement = debugElement.query(By.css('.mx-4'));
      expect(separatorElement.nativeElement.textContent.trim()).toBe('O');
    });

    it('should call translation service for welcome message', () => {
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
      component.showWelcome();
      expect(alertSpy).toHaveBeenCalledWith('¡Bienvenido a Almuerzos Peru!');
      alertSpy.mockRestore();
    });
  });
});
