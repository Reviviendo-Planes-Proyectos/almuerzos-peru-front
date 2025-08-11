import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ProfileSelectionComponent } from './profile-selection.component';

describe('ProfileSelectionComponent', () => {
  let component: ProfileSelectionComponent;
  let fixture: ComponentFixture<ProfileSelectionComponent>;
  let mockLocation: jest.Mocked<Location>;
  let mockRouter: jest.Mocked<Router>;

  beforeEach(async () => {
    const locationSpy = {
      back: jest.fn()
    };
    const routerSpy = {
      navigate: jest.fn().mockResolvedValue(true)
    };

    await TestBed.configureTestingModule({
      imports: [ProfileSelectionComponent],
      providers: [
        { provide: Location, useValue: locationSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileSelectionComponent);
    component = fixture.componentInstance;
    mockLocation = TestBed.inject(Location) as jest.Mocked<Location>;
    mockRouter = TestBed.inject(Router) as jest.Mocked<Router>;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.selectedType).toBeNull();
      expect(component.isNavigating).toBeFalsy();
    });

    it('should have router property accessible', () => {
      expect(component.router).toBeDefined();
      expect(component.router).toBe(mockRouter);
    });
  });

  describe('goBack method', () => {
    it('should call location.back() when goBack is called', () => {
      component.goBack();
      expect(mockLocation.back).toHaveBeenCalled();
      expect(mockLocation.back).toHaveBeenCalledTimes(1);
    });
  });

  describe('elegirTipoUsuario method', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should set selectedType and isNavigating when called with restaurante', () => {
      component.elegirTipoUsuario('restaurante');

      expect(component.selectedType).toBe('restaurante');
      expect(component.isNavigating).toBeTruthy();
    });

    it('should set selectedType and isNavigating when called with comensal', () => {
      component.elegirTipoUsuario('comensal');

      expect(component.selectedType).toBe('comensal');
      expect(component.isNavigating).toBeTruthy();
    });

    it('should navigate to register with correct parameters for restaurante', () => {
      component.elegirTipoUsuario('restaurante');

      // Avanzar el tiempo para que se ejecute el setTimeout
      jest.advanceTimersByTime(800);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['auth/register'], {
        state: { tipo: 'restaurante' },
        queryParams: { userType: 'restaurante' }
      });
      expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
    });

    it('should navigate to register with correct parameters for comensal', () => {
      component.elegirTipoUsuario('comensal');

      // Avanzar el tiempo para que se ejecute el setTimeout
      jest.advanceTimersByTime(800);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['auth/register'], {
        state: { tipo: 'comensal' },
        queryParams: { userType: 'comensal' }
      });
      expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
    });

    it('should not navigate immediately, but wait for timeout', () => {
      component.elegirTipoUsuario('restaurante');

      // No debería navegar inmediatamente
      expect(mockRouter.navigate).not.toHaveBeenCalled();

      // Avanzar solo 400ms (menos que los 800ms)
      jest.advanceTimersByTime(400);
      expect(mockRouter.navigate).not.toHaveBeenCalled();

      // Avanzar el resto del tiempo
      jest.advanceTimersByTime(400);
      expect(mockRouter.navigate).toHaveBeenCalled();
    });

    it('should prevent multiple clicks when isNavigating is true', () => {
      // Primera llamada
      component.elegirTipoUsuario('restaurante');
      expect(component.selectedType).toBe('restaurante');
      expect(component.isNavigating).toBeTruthy();

      // Segunda llamada inmediata (debería ser ignorada por la condición isNavigating)
      component.elegirTipoUsuario('comensal');

      // Verificar que selectedType no cambió
      expect(component.selectedType).toBe('restaurante'); // No cambió a 'comensal'

      // Avanzar tiempo completo
      jest.advanceTimersByTime(800);

      // Solo debería haberse llamado navigate una vez (de la primera llamada)
      expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['auth/register'], {
        state: { tipo: 'restaurante' },
        queryParams: { userType: 'restaurante' }
      });
    });

    it('should handle both user types correctly in separate calls', () => {
      // Probar restaurante
      component.elegirTipoUsuario('restaurante');
      jest.advanceTimersByTime(800);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['auth/register'], {
        state: { tipo: 'restaurante' },
        queryParams: { userType: 'restaurante' }
      });

      // Reset para segunda prueba
      component.selectedType = null;
      component.isNavigating = false;
      mockRouter.navigate.mockClear();

      // Probar comensal
      component.elegirTipoUsuario('comensal');
      jest.advanceTimersByTime(800);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['auth/register'], {
        state: { tipo: 'comensal' },
        queryParams: { userType: 'comensal' }
      });
    });
  });

  describe('Template Integration', () => {
    it('should render both option cards', () => {
      const compiled = fixture.nativeElement;
      const cards = compiled.querySelectorAll('[class*="cursor-pointer"]');
      expect(cards.length).toBe(2);
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

    it('should call goBack when back button is clicked', () => {
      jest.spyOn(component, 'goBack');

      const compiled = fixture.nativeElement;
      const backButton = compiled.querySelector('button[mat-icon-button]');

      backButton.click();

      expect(component.goBack).toHaveBeenCalled();
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
      const cards = compiled.querySelectorAll('[class*="cursor-pointer"]');

      for (const card of cards) {
        expect(card.classList.contains('pointer-events-none')).toBeTruthy();
      }
    });
  });
});
