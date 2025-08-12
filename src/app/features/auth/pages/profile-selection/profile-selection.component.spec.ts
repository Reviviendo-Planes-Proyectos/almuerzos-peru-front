import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { I18nService, TranslatePipe } from '../../../../shared/i18n';
import { MaterialModule } from '../../../../shared/material.module';
import { ProfileSelectionComponent } from './profile-selection.component';

// Mock del servicio de traducción
class MockI18nService {
  t(key: string): string {
    const translations: Record<string, string> = {
      'app.name': 'ALMUERZOS PERU',
      'common.back': 'Volver',
      'auth.profileSelection.question': '¿Cómo deseas ingresar?',
      'auth.profileSelection.restaurant.title': 'Tengo mi restaurante',
      'auth.profileSelection.restaurant.description':
        'Administra tu menú diario y haz que tus clientes encuentren tu restaurante fácilmente.',
      'auth.profileSelection.diner.title': 'Quiero comer',
      'auth.profileSelection.diner.description':
        'Explora los menús del día de restaurantes cerca de ti y haz tu elección rápida y fácil.',
      'auth.profileSelection.registerLater': 'Registrarme luego'
    };
    return translations[key] || key;
  }
}

describe('ProfileSelectionComponent', () => {
  let component: ProfileSelectionComponent;
  let fixture: ComponentFixture<ProfileSelectionComponent>;
  let debugElement: DebugElement;
  let mockRouter: jest.Mocked<Router>;
  let mockI18nService: MockI18nService;

  beforeEach(async () => {
    const routerSpy = {
      navigate: jest.fn()
    };

    mockI18nService = new MockI18nService();

    await TestBed.configureTestingModule({
      imports: [ProfileSelectionComponent, MaterialModule, NoopAnimationsModule, TranslatePipe],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: I18nService, useValue: mockI18nService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileSelectionComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    mockRouter = TestBed.inject(Router) as jest.Mocked<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the app name', () => {
    const titleElement = debugElement.query(By.css('h1'));
    expect(titleElement.nativeElement.textContent.trim()).toBe('ALMUERZOS PERU');
  });

  it('should display the profile selection question', () => {
    const questionElement = debugElement.query(By.css('p'));
    expect(questionElement.nativeElement.textContent.trim()).toBe('¿Cómo deseas ingresar?');
  });

  it('should display restaurant option with translated text', () => {
    const restaurantTitle = debugElement.queryAll(By.css('h3'))[0];
    const restaurantDescription = debugElement.queryAll(By.css('.text-sm'))[0];

    expect(restaurantTitle.nativeElement.textContent.trim()).toBe('Tengo mi restaurante');
    expect(restaurantDescription.nativeElement.textContent.trim()).toBe(
      'Administra tu menú diario y haz que tus clientes encuentren tu restaurante fácilmente.'
    );
  });

  it('should display diner option with translated text', () => {
    const dinerTitle = debugElement.queryAll(By.css('h3'))[1];
    const dinerDescription = debugElement.queryAll(By.css('.text-sm'))[1];

    expect(dinerTitle.nativeElement.textContent.trim()).toBe('Quiero comer');
    expect(dinerDescription.nativeElement.textContent.trim()).toBe(
      'Explora los menús del día de restaurantes cerca de ti y haz tu elección rápida y fácil.'
    );
  });

  it('should display register later link with translated text', () => {
    const linkElement = debugElement.query(By.css('.mt-6 button'));
    expect(linkElement.nativeElement.textContent.trim()).toBe('Registrarme luego');
  });

  it('should have proper aria-label for back button with translation', () => {
    const backButton = debugElement.query(By.css('button[mat-icon-button]'));
    expect(backButton.nativeElement.getAttribute('aria-label')).toBe('Volver');
  });

  it('should navigate to auth/login when goToLogin is called with restaurante', () => {
    component.goToLogin('restaurante');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['auth/login']);
  });

  it('should navigate to auth/login when goToLogin is called with comensal', () => {
    component.goToLogin('comensal');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['auth/login']);
  });

  it('should navigate to auth/login when register later button is clicked', () => {
    const registerLaterButton = debugElement.query(By.css('.mt-6 button'));
    registerLaterButton.nativeElement.click();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['auth/login']);
  });

  describe('Internationalization', () => {
    it('should display all text elements with proper translations', () => {
      const titleElement = debugElement.query(By.css('h1'));
      const questionElement = debugElement.query(By.css('p'));
      const linkElement = debugElement.query(By.css('.mt-6 button'));

      expect(titleElement.nativeElement.textContent.trim()).toBe('ALMUERZOS PERU');
      expect(questionElement.nativeElement.textContent.trim()).toBe('¿Cómo deseas ingresar?');
      expect(linkElement.nativeElement.textContent.trim()).toBe('Registrarme luego');
    });

    it('should use translation function correctly', () => {
      expect(debugElement.query(By.css('h1')).nativeElement.textContent.trim()).toBe('ALMUERZOS PERU');
      expect(debugElement.query(By.css('p')).nativeElement.textContent.trim()).toBe('¿Cómo deseas ingresar?');
    });
  });

  it('should have router property accessible', () => {
    expect(component.router).toBeDefined();
    expect(component.router).toBe(mockRouter);
  });
});
