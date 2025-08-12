import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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
      'auth.register.title': 'Crear Cuenta',
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
  let debugElement: DebugElement;
  let mockI18nService: MockI18nService;

  beforeEach(async () => {
    const routerSpy = {
      navigate: jest.fn()
    };

    mockI18nService = new MockI18nService();

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, MaterialModule, NoopAnimationsModule, TranslatePipe],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: I18nService, useValue: mockI18nService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the app name', () => {
    const titleElement = debugElement.query(By.css('h1'));
    expect(titleElement.nativeElement.textContent.trim()).toBe('ALMUERZOS PERU');
  });

  it('should display welcome message', () => {
    const welcomeElement = debugElement.query(By.css('h2'));
    expect(welcomeElement.nativeElement.textContent.trim()).toBe('¡Bienvenido a Almuerzos Peru!');
  });

  it('should display register title', () => {
    const titleElement = debugElement.query(By.css('p'));
    expect(titleElement.nativeElement.textContent.trim()).toBe('Crear Cuenta');
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

  it('should execute loginWithGoogle method without errors', () => {
    expect(() => component.loginWithGoogle()).not.toThrow();
  });

  it('should execute loginWithFacebook method without errors', () => {
    expect(() => component.loginWithFacebook()).not.toThrow();
  });

  it('should execute crearConEmail method without errors', () => {
    expect(() => component.crearConEmail()).not.toThrow();
  });

  describe('Internationalization', () => {
    it('should display all text elements with proper translations', () => {
      const titleElement = debugElement.query(By.css('h1'));
      const welcomeElement = debugElement.query(By.css('h2'));
      const subtitleElement = debugElement.query(By.css('p'));
      const separatorElement = debugElement.query(By.css('.mx-4'));
      const linkElement = debugElement.query(By.css('button.text-purple-700'));

      expect(titleElement.nativeElement.textContent.trim()).toBe('ALMUERZOS PERU');
      expect(welcomeElement.nativeElement.textContent.trim()).toBe('¡Bienvenido a Almuerzos Peru!');
      expect(subtitleElement.nativeElement.textContent.trim()).toBe('Crear Cuenta');
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
      expect(debugElement.query(By.css('h2')).nativeElement.textContent.trim()).toBe('¡Bienvenido a Almuerzos Peru!');
    });
  });
});
