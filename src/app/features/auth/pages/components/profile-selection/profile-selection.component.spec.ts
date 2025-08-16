import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { I18nService, TranslatePipe } from '../../../../../shared/i18n';
import { MaterialModule } from '../../../../../shared/modules';
import { LoggerService } from '../../../../../shared/services/logger/logger.service';
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
      navigate: jest.fn().mockResolvedValue(true)
    };

    const activatedRouteSpy = {
      snapshot: {
        queryParams: {}
      }
    };

    mockI18nService = new MockI18nService();
    mockLoggerService = new MockLoggerService();

    await TestBed.configureTestingModule({
      imports: [ProfileSelectionComponent, MaterialModule, NoopAnimationsModule, TranslatePipe],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
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

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
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
    const clientCards = debugElement.queryAll(By.css('.grid > button'));
    const clientCard = clientCards[0];
    const clientTitle = clientCard.query(By.css('h3'));
    const clientDescription = clientCard.query(By.css('p'));

    expect(clientTitle.nativeElement.textContent.trim()).toBe('Cliente');
    expect(clientDescription.nativeElement.textContent.trim()).toBe('Encuentra almuerzos cerca de ti en segundos.');
  });

  it('should display restaurant owner option', () => {
    const ownerCards = debugElement.queryAll(By.css('.grid > button'));
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
    const comensalCard = debugElement.queryAll(By.css('.grid > button'))[0];
    comensalCard.nativeElement.click();

    expect(component.selectedType).toBe('comensal');
    expect(component.isNavigating).toBe(true);
  });

  it('should select restaurante type when clicked', () => {
    const restauranteCard = debugElement.queryAll(By.css('.grid > button'))[1];
    restauranteCard.nativeElement.click();

    expect(component.selectedType).toBe('restaurante');
    expect(component.isNavigating).toBe(true);
  });

  it('should navigate to auth/login when elegirTipoUsuario is called with comensal', fakeAsync(() => {
    component.elegirTipoUsuario('comensal');

    tick(800);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['auth/login'], {
      queryParams: { userType: 'comensal' }
    });
  }));

  it('should navigate to auth/login when elegirTipoUsuario is called with restaurante', fakeAsync(() => {
    component.elegirTipoUsuario('restaurante');

    tick(800);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['auth/login'], {
      queryParams: { userType: 'restaurante' }
    });
  }));

  it('should navigate to auth/login when register later button is clicked', () => {
    const registerLaterButton = debugElement.query(By.css('.mt-6 button'));
    registerLaterButton.nativeElement.click();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['auth/login']);
  });

  it('should not allow multiple selections when navigating', () => {
    component.elegirTipoUsuario('comensal');
    expect(component.isNavigating).toBe(true);
    component.elegirTipoUsuario('restaurante');
    expect(component.selectedType).toBe('comensal');
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

  describe('Template Integration', () => {
    it('should render both option cards', () => {
      const compiled = fixture.nativeElement;
      const cards = compiled.querySelectorAll('[class*="cursor-pointer"]');
      expect(cards.length).toBe(3);
    });

    it('should call elegirTipoUsuario when card is clicked', () => {
      jest.spyOn(component, 'elegirTipoUsuario');

      const compiled = fixture.nativeElement;
      const comensalCard = compiled.querySelector('[class*="cursor-pointer"]');

      comensalCard.click();

      expect(component.elegirTipoUsuario).toHaveBeenCalled();
    });

    it('should show back button', () => {
      const compiled = fixture.nativeElement;
      const backButton = compiled.querySelector('button[mat-icon-button]');
      expect(backButton).toBeTruthy();
    });

    it('should show back button component', () => {
      const compiled = fixture.nativeElement;
      const backButton = compiled.querySelector('app-back-button');
      expect(backButton).toBeTruthy();
    });
  });

  describe('CSS Classes Application', () => {
    it('should apply selected-card class when type is selected', () => {
      component.selectedType = 'restaurante';
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const restauranteCard = compiled.querySelectorAll('[class*="cursor-pointer"]')[1];

      expect(restauranteCard.classList.contains('selected-card')).toBeTruthy();
    });

    it('should apply unselected-card class to non-selected option', () => {
      component.selectedType = 'restaurante';
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const comensalCard = compiled.querySelectorAll('[class*="cursor-pointer"]')[0];

      expect(comensalCard.classList.contains('unselected-card')).toBeTruthy();
    });

    it('should disable pointer events when isNavigating is true', () => {
      component.isNavigating = true;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const cards = compiled.querySelectorAll('.grid > div[class*="cursor-pointer"]');

      for (const card of cards) {
        expect(card.classList.contains('pointer-events-none')).toBeTruthy();
      }
    });
  });

  describe('goBackToLanding', () => {
    it('should navigate to /home-diner when from query param is "diner"', () => {
      const activatedRoute = TestBed.inject(ActivatedRoute);
      activatedRoute.snapshot.queryParams = { from: 'diner' };

      component.goBackToLanding();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home-diner']);
    });

    it('should navigate to /home-restaurant when from query param is "restaurant"', () => {
      const activatedRoute = TestBed.inject(ActivatedRoute);
      activatedRoute.snapshot.queryParams = { from: 'restaurant' };

      component.goBackToLanding();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home-restaurant']);
    });

    it('should navigate to /home-restaurant by default when no from query param', () => {
      const activatedRoute = TestBed.inject(ActivatedRoute);
      activatedRoute.snapshot.queryParams = {};

      component.goBackToLanding();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home-restaurant']);
    });

    it('should navigate to /home-restaurant by default when from query param is unknown', () => {
      const activatedRoute = TestBed.inject(ActivatedRoute);
      activatedRoute.snapshot.queryParams = { from: 'unknown' };

      component.goBackToLanding();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home-restaurant']);
    });
  });
});
