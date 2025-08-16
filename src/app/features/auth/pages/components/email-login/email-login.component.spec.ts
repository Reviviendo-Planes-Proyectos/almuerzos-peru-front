import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { I18nService } from '../../../../../shared/i18n';
import { CoreModule } from '../../../../../shared/modules';
import { LoggerService } from '../../../../../shared/services/logger/logger.service';
import { PWA_TEST_PROVIDERS } from '../../../../../testing/pwa-mocks';
import { EmailLoginComponent } from './email-login.component';

describe('EmailLoginComponent', () => {
  let component: EmailLoginComponent;
  let fixture: ComponentFixture<EmailLoginComponent>;
  let mockRouter: jest.Mocked<Router>;
  let mockActivatedRoute: Partial<ActivatedRoute>;
  let mockLogger: jest.Mocked<LoggerService>;
  let mockI18nService: jest.Mocked<I18nService>;

  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn()
    } as any;

    mockActivatedRoute = {
      queryParams: of({ userType: 'cliente' })
    };

    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
      log: jest.fn()
    } as any;

    mockI18nService = {
      t: jest.fn((key: string) => key),
      getCurrentLanguage: jest.fn(() => 'es'),
      setLanguage: jest.fn(),
      getAvailableLanguages: jest.fn(() => ['es', 'en'])
    } as any;

    await TestBed.configureTestingModule({
      imports: [EmailLoginComponent, CoreModule, ReactiveFormsModule, NoopAnimationsModule],
      providers: [
        FormBuilder,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: LoggerService, useValue: mockLogger },
        { provide: I18nService, useValue: mockI18nService },
        ...PWA_TEST_PROVIDERS
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(EmailLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario con campos requeridos', () => {
    expect(component.loginForm.get('email')).toBeTruthy();
    expect(component.loginForm.get('password')).toBeTruthy();
    expect(component.loginForm.get('email')?.hasError('required')).toBe(true);
    expect(component.loginForm.get('password')?.hasError('required')).toBe(true);
  });

  it('debe validar el formato del email', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('email-invalido');
    expect(emailControl?.hasError('email')).toBe(true);

    emailControl?.setValue('test@example.com');
    expect(emailControl?.hasError('email')).toBe(false);
  });

  it('debe validar la longitud mínima de la contraseña', () => {
    const passwordControl = component.loginForm.get('password');
    passwordControl?.setValue('123');
    expect(passwordControl?.hasError('minlength')).toBe(true);

    passwordControl?.setValue('123456');
    expect(passwordControl?.hasError('minlength')).toBe(false);
  });

  it('debe alternar la visibilidad de la contraseña', () => {
    expect(component.showPassword).toBe(false);
    component.togglePasswordVisibility();
    expect(component.showPassword).toBe(true);
    component.togglePasswordVisibility();
    expect(component.showPassword).toBe(false);
  });

  it('debe navegar a forgot-password', () => {
    component.goToForgotPassword();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/forgot-password'], {
      queryParams: { userType: 'cliente' }
    });
  });

  it('debe navegar al registro con el tipo de usuario', () => {
    component.tipo = 'restaurante';
    component.goToRegister();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/register'], {
      queryParams: { userType: 'restaurante' }
    });
  });

  it('debe volver al login principal', () => {
    component.tipo = 'cliente';
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login'], {
      queryParams: { userType: 'cliente' }
    });
  });

  it('debe marcar campos como tocados si el formulario es inválido al enviar', () => {
    component.onSubmit();

    expect(component.loginForm.get('email')?.touched).toBe(true);
    expect(component.loginForm.get('password')?.touched).toBe(true);
  });

  it('debe procesar el login si el formulario es válido', (done) => {
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: '123456'
    });

    component.onSubmit();
    expect(component.isLoading).toBe(true);
    expect(mockLogger.info).toHaveBeenCalledWith('Iniciando sesión con email:', 'test@example.com');

    setTimeout(() => {
      expect(component.isLoading).toBe(false);
      done();
    }, 2100);
  });
});
