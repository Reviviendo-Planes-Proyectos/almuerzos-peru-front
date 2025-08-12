import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { I18nService, TranslatePipe } from '../../../../shared/i18n';
import { MaterialModule } from '../../../../shared/material.module';
import { LoggerService } from '../../../../shared/services/logger/logger.service';
import { ProfileSelectionComponent } from './profile-selection.component';

// Mock del servicio de traducción
class MockI18nService {
  t(key: string): string {
    const translations: Record<string, string> = {
      'app.name': 'ALMUERZOS PERU',
      'common.back': 'Volver',
      'common.background': 'Fondo',
      'auth.profileSelection.question': '¿Cómo deseas ingresar?',
      'auth.profileSelection.registerLater': 'Registrarme luego'
    };
    return translations[key] || key;
  }
}

// Mock del LoggerService
class MockLoggerService {
  info = jest.fn();
  error = jest.fn();
  warn = jest.fn();
  debug = jest.fn();
}

describe('ProfileSelectionComponent', () => {
  let component: ProfileSelectionComponent;
  let fixture: ComponentFixture<ProfileSelectionComponent>;
  let debugElement: DebugElement;
  let mockRouter: jest.Mocked<Router>;
  let mockI18nService: MockI18nService;
  let mockLoggerService: MockLoggerService;

  beforeEach(async () => {
    const routerSpy = {
      navigate: jest.fn()
    };

    mockI18nService = new MockI18nService();
    mockLoggerService = new MockLoggerService();

    await TestBed.configureTestingModule({
      imports: [ProfileSelectionComponent, MaterialModule, NoopAnimationsModule, TranslatePipe],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: I18nService, useValue: mockI18nService },
        { provide: LoggerService, useValue: mockLoggerService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileSelectionComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    mockRouter = TestBed.inject(Router) as jest.Mocked<Router>;
    mockLoggerService = TestBed.inject(LoggerService) as unknown as MockLoggerService;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the app name', () => {
    const titleElement = debugElement.query(By.css('h1 span'));
    expect(titleElement.nativeElement.textContent.trim()).toBe('ALMUERZOS PERU');
  });

  it('should display the welcome title', () => {
    const welcomeElement = debugElement.query(By.css('h2'));
    expect(welcomeElement.nativeElement.textContent.trim()).toBe('¡Bienvenido!');
  });

  it('should display the profile selection question', () => {
    const questionElement = debugElement.query(By.css('p'));
    expect(questionElement.nativeElement.textContent.trim()).toBe('¿Cómo deseas ingresar?');
  });

  it('should display client option', () => {
    const clientCards = debugElement.queryAll(By.css('.grid > div'));
    const clientCard = clientCards[0];
    const clientTitle = clientCard.query(By.css('h3'));
    const clientDescription = clientCard.query(By.css('p'));

    expect(clientTitle.nativeElement.textContent.trim()).toBe('Cliente');
    expect(clientDescription.nativeElement.textContent.trim()).toBe('Encuentra almuerzos cerca de ti en segundos.');
  });

  it('should display restaurant owner option', () => {
    const ownerCards = debugElement.queryAll(By.css('.grid > div'));
    const ownerCard = ownerCards[1];
    const ownerTitle = ownerCard.query(By.css('h3'));
    const ownerDescription = ownerCard.query(By.css('p'));

    expect(ownerTitle.nativeElement.textContent.trim()).toBe('Dueño');
    expect(ownerDescription.nativeElement.textContent.trim()).toBe('Administra tu menú diario y atrae más clientes.');
  });

  it('should display register later link', () => {
    const linkElement = debugElement.query(By.css('.mt-6 button'));
    expect(linkElement.nativeElement.textContent.trim()).toBe('Registrarme luego');
  });

  it('should select comensal type when clicked', () => {
    const comensalCard = debugElement.queryAll(By.css('.grid > div'))[0];
    comensalCard.nativeElement.click();

    expect(component.selectedType).toBe('comensal');
    expect(component.isNavigating).toBe(true);
  });

  it('should select restaurante type when clicked', () => {
    const restauranteCard = debugElement.queryAll(By.css('.grid > div'))[1];
    restauranteCard.nativeElement.click();

    expect(component.selectedType).toBe('restaurante');
    expect(component.isNavigating).toBe(true);
  });

  it('should navigate to auth/login when elegirTipoUsuario is called with comensal', (done) => {
    component.elegirTipoUsuario('comensal');

    setTimeout(() => {
      expect(mockRouter.navigate).toHaveBeenCalledWith(['auth/login']);
      expect(mockLoggerService.info).toHaveBeenCalledWith('Tipo de usuario seleccionado:', 'comensal');
      done();
    }, 900);
  });

  it('should navigate to auth/login when elegirTipoUsuario is called with restaurante', (done) => {
    component.elegirTipoUsuario('restaurante');

    setTimeout(() => {
      expect(mockRouter.navigate).toHaveBeenCalledWith(['auth/login']);
      expect(mockLoggerService.info).toHaveBeenCalledWith('Tipo de usuario seleccionado:', 'restaurante');
      done();
    }, 900);
  });

  it('should navigate to auth/login when register later button is clicked', () => {
    const registerLaterButton = debugElement.query(By.css('.mt-6 button'));
    registerLaterButton.nativeElement.click();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['auth/login']);
  });

  it('should not allow multiple selections when navigating', () => {
    component.elegirTipoUsuario('comensal');
    expect(component.isNavigating).toBe(true);

    // Try to select again
    component.elegirTipoUsuario('restaurante');
    expect(component.selectedType).toBe('comensal'); // Should remain unchanged
  });

  describe('Internationalization', () => {
    it('should display all text elements with proper translations', () => {
      const titleElement = debugElement.query(By.css('h1 span'));
      const questionElement = debugElement.query(By.css('p'));
      const linkElement = debugElement.query(By.css('.mt-6 button'));

      expect(titleElement.nativeElement.textContent.trim()).toBe('ALMUERZOS PERU');
      expect(questionElement.nativeElement.textContent.trim()).toBe('¿Cómo deseas ingresar?');
      expect(linkElement.nativeElement.textContent.trim()).toBe('Registrarme luego');
    });
  });

  it('should have router property accessible', () => {
    expect(component.router).toBeDefined();
    expect(component.router).toBe(mockRouter);
  });
});
