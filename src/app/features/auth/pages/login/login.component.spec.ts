import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { I18nService, TranslatePipe } from '../../../../shared/i18n';
import { MaterialModule } from '../../../../shared/modules';
import { LoggerService } from '../../../../shared/services/logger/logger.service';
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
  let routerSpy: Router;
  let mockI18nService: MockI18nService;

  beforeEach(async () => {
    const routerSpyObj = {
      navigate: jest.fn()
    };

    const mockActivatedRoute = {
      queryParams: of({ userType: null })
    };

    const mockLoggerService = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn()
    };

    mockI18nService = new MockI18nService();

    await TestBed.configureTestingModule({
      imports: [LoginComponent, MaterialModule, NoopAnimationsModule, TranslatePipe],
      providers: [
        { provide: Router, useValue: routerSpyObj },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: LoggerService, useValue: mockLoggerService },
        { provide: I18nService, useValue: mockI18nService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
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

  it('should display the login subtitle', () => {
    const subtitleElement = debugElement.query(By.css('p'));
    expect(subtitleElement.nativeElement.textContent.trim()).toBe('Iniciar Sesión');
  });

  it('should render all action buttons', () => {
    const buttons = debugElement.queryAll(By.css('button:not([mat-icon-button])'));
    expect(buttons.length).toBe(5);
  });

  it('should render Google login button', () => {
    const googleButton = debugElement.query(By.css('button[class*="text-red-600"]'));
    expect(googleButton).toBeTruthy();
    expect(googleButton.nativeElement.textContent).toContain('Iniciar Sesión con Google');
  });

  it('should render Facebook login button', () => {
    const facebookButton = debugElement.query(By.css('button[class*="text-blue-600"]'));
    expect(facebookButton).toBeTruthy();
    expect(facebookButton.nativeElement.textContent).toContain('Iniciar Sesión con Facebook');
  });

  it('should render Email login button', () => {
    const emailButton = debugElement.query(By.css('button[class*="text-gray-800"]'));
    expect(emailButton).toBeTruthy();
    expect(emailButton.nativeElement.textContent).toContain('Iniciar Sesión con Correo');
  });

  it('should display "O" separator', () => {
    const separatorElement = debugElement.query(By.css('.mx-4'));
    expect(separatorElement.nativeElement.textContent.trim()).toBe('O');
  });

  it('should display forgot password link', () => {
    const buttons = debugElement.queryAll(By.css('button'));
    const forgotButton = buttons.find((button) => button.nativeElement.textContent.includes('Olvidé mi Contraseña'));
    expect(forgotButton).toBeTruthy();
  });

  it('should display register link', () => {
    const buttons = debugElement.queryAll(By.css('button'));
    const registerButton = buttons.find((button) =>
      button.nativeElement.textContent.includes('¿No tienes cuenta? Regístrate')
    );
    expect(registerButton).toBeTruthy();
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

  it('should call loginWithGoogle when Google button is clicked', () => {
    const loginGoogleSpy = jest.spyOn(component, 'loginWithGoogle');
    const googleButton = debugElement.query(By.css('button[class*="text-red-600"]'));
    googleButton.nativeElement.click();
    expect(loginGoogleSpy).toHaveBeenCalled();
  });

  it('should call loginWithFacebook when Facebook button is clicked', () => {
    const loginFacebookSpy = jest.spyOn(component, 'loginWithFacebook');
    const facebookButton = debugElement.query(By.css('button[class*="text-blue-600"]'));
    facebookButton.nativeElement.click();
    expect(loginFacebookSpy).toHaveBeenCalled();
  });

  it('should call iniciarConEmail when Email button is clicked', () => {
    const emailSpy = jest.spyOn(component, 'iniciarConEmail');
    const emailButton = debugElement.query(By.css('button[class*="text-gray-800"]'));
    emailButton.nativeElement.click();
    expect(emailSpy).toHaveBeenCalled();
  });

  it('should call forgotPassword when forgot password link is clicked', () => {
    const forgotSpy = jest.spyOn(component, 'forgotPassword');
    const buttons = debugElement.queryAll(By.css('button'));
    const forgotButton = buttons.find((button) => button.nativeElement.textContent.includes('Olvidé mi Contraseña'));
    expect(forgotButton).toBeTruthy();
    if (forgotButton) {
      forgotButton.nativeElement.click();
      expect(forgotSpy).toHaveBeenCalled();
    }
  });

  it('should call goToRegister when register link is clicked', () => {
    const registerSpy = jest.spyOn(component, 'goToRegister');
    const buttons = debugElement.queryAll(By.css('button'));
    const registerButton = buttons.find((button) =>
      button.nativeElement.textContent.includes('¿No tienes cuenta? Regístrate')
    );
    expect(registerButton).toBeTruthy();
    if (registerButton) {
      registerButton.nativeElement.click();
      expect(registerSpy).toHaveBeenCalled();
    }
  });

  it('should navigate to register when goToRegister is called', () => {
    component.goToRegister();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['auth/register'], {
      queryParams: { userType: null }
    });
  });

  describe('Internationalization', () => {
    it('should use translation function for all text elements', () => {
      const titleElement = debugElement.query(By.css('h1'));
      const subtitleElement = debugElement.query(By.css('p'));

      expect(titleElement.nativeElement.textContent.trim()).toBe('ALMUERZOS PERU');
      expect(subtitleElement.nativeElement.textContent.trim()).toBe('Iniciar Sesión');
    });

    it('should translate button texts correctly', () => {
      const googleButton = debugElement.query(By.css('button[class*="text-red-600"]'));
      const facebookButton = debugElement.query(By.css('button[class*="text-blue-600"]'));
      const emailButton = debugElement.query(By.css('button[class*="text-gray-800"]'));

      expect(googleButton.nativeElement.textContent.trim()).toBe('Iniciar Sesión con Google');
      expect(facebookButton.nativeElement.textContent.trim()).toBe('Iniciar Sesión con Facebook');
      expect(emailButton.nativeElement.textContent.trim()).toBe('mail Iniciar Sesión con Correo');
    });

    it('should translate "O" separator correctly', () => {
      const separatorElement = debugElement.query(By.css('.mx-4'));
      expect(separatorElement.nativeElement.textContent.trim()).toBe('O');
    });
  });
});
