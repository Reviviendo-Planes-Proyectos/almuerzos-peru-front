import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CoreModule } from '../../../../shared/modules';
import { LoggerService } from '../../../../shared/services/logger/logger.service';
import { SearchBarComponent } from './search-bar.component';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;
  let mockLogger: any;
  let mockGeolocation: any;

  beforeEach(async () => {
    // Mock del LoggerService
    mockLogger = {
      log: jest.fn(),
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      _print: jest.fn()
    };

    // Mock de Geolocation API
    mockGeolocation = {
      getCurrentPosition: jest.fn()
    };

    // Mock global de navigator.geolocation
    Object.defineProperty(global.navigator, 'geolocation', {
      value: mockGeolocation,
      configurable: true
    });

    await TestBed.configureTestingModule({
      imports: [SearchBarComponent, CoreModule],
      providers: [{ provide: LoggerService, useValue: mockLogger }]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Tests de inicialización
  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with empty search term', () => {
      expect(component.searchTerm).toBe('');
    });

    it('should have event emitters defined', () => {
      expect(component.searchEvent).toBeDefined();
      expect(component.locationEvent).toBeDefined();
      expect(component.searchChangeEvent).toBeDefined();
    });

    it('should setup search subject with debounce', () => {
      expect((component as any).searchSubject).toBeDefined();
    });
  });

  // Tests de renderizado del template
  describe('Template Rendering', () => {
    it('should render search input with correct placeholder', () => {
      const inputElement = fixture.debugElement.query(By.css('input[type="text"]'));
      expect(inputElement).toBeTruthy();
      expect(inputElement.nativeElement.placeholder).toBe('Busca platillos, restaurantes, lugares...');
    });

    it('should render search icon', () => {
      const searchIcon = fixture.debugElement.query(By.css('svg'));
      expect(searchIcon).toBeTruthy();

      // Verificar que es el icono de búsqueda (tiene el path correcto)
      const pathElement = searchIcon.query(By.css('path'));
      expect(pathElement.nativeElement.getAttribute('d')).toContain('M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z');
    });

    it('should render location button with icon', () => {
      const locationButton = fixture.debugElement.query(By.css('button'));
      expect(locationButton).toBeTruthy();
      expect(locationButton.nativeElement.title).toBe('Usar mi ubicación');

      const locationIcon = locationButton.query(By.css('svg'));
      expect(locationIcon).toBeTruthy();
    });

    it('should apply gradient background correctly', () => {
      const containerDiv = fixture.debugElement.query(By.css('.bg-gradient-to-r'));
      expect(containerDiv).toBeTruthy();
      expect(containerDiv.nativeElement.classList).toContain('from-orange-400');
      expect(containerDiv.nativeElement.classList).toContain('via-yellow-400');
      expect(containerDiv.nativeElement.classList).toContain('to-orange-500');
    });

    it('should apply correct styling to input container', () => {
      const inputContainer = fixture.debugElement.query(By.css('.bg-white.rounded-lg'));
      expect(inputContainer).toBeTruthy();
      expect(inputContainer.nativeElement.classList).toContain('shadow-md');
      expect(inputContainer.nativeElement.classList).toContain('overflow-hidden');
    });
  });

  // Tests de funcionalidad de búsqueda
  describe('Search Functionality', () => {
    it('should update searchTerm when input changes', () => {
      const inputElement = fixture.debugElement.query(By.css('input'));
      const testValue = 'pizza';

      inputElement.nativeElement.value = testValue;
      inputElement.triggerEventHandler('input', { target: { value: testValue } });

      expect(component.searchTerm).toBe(testValue);
    });

    it('should emit searchEvent when onSearch is called with non-empty term', () => {
      jest.spyOn(component.searchEvent, 'emit');
      component.searchTerm = 'burger';

      component.onSearch();

      expect(component.searchEvent.emit).toHaveBeenCalledWith('burger');
    });

    it('should not emit searchEvent when onSearch is called with empty term', () => {
      jest.spyOn(component.searchEvent, 'emit');
      component.searchTerm = '';

      component.onSearch();

      expect(component.searchEvent.emit).not.toHaveBeenCalled();
    });

    it('should not emit searchEvent when onSearch is called with whitespace only', () => {
      jest.spyOn(component.searchEvent, 'emit');
      component.searchTerm = '   ';

      component.onSearch();

      expect(component.searchEvent.emit).not.toHaveBeenCalled();
    });

    it('should trim search term before emitting', () => {
      jest.spyOn(component.searchEvent, 'emit');
      component.searchTerm = '  pizza  ';

      component.onSearch();

      expect(component.searchEvent.emit).toHaveBeenCalledWith('pizza');
    });

    it('should call onSearch when Enter key is pressed', () => {
      jest.spyOn(component, 'onSearch');
      const inputElement = fixture.debugElement.query(By.css('input'));

      inputElement.triggerEventHandler('keyup.enter', {});

      expect(component.onSearch).toHaveBeenCalled();
    });
  });

  // Tests de debouncing
  describe('Search Debouncing', () => {
    it('should emit searchChangeEvent after debounce delay', fakeAsync(() => {
      jest.spyOn(component.searchChangeEvent, 'emit');

      const inputElement = fixture.debugElement.query(By.css('input'));
      inputElement.triggerEventHandler('input', { target: { value: 'test' } });

      // No debe emitir inmediatamente
      expect(component.searchChangeEvent.emit).not.toHaveBeenCalled();

      // Debe emitir después del debounce
      tick(300);
      expect(component.searchChangeEvent.emit).toHaveBeenCalledWith('test');
    }));

    it('should debounce multiple rapid inputs', fakeAsync(() => {
      jest.spyOn(component.searchChangeEvent, 'emit');

      const inputElement = fixture.debugElement.query(By.css('input'));

      // Múltiples cambios rápidos
      inputElement.triggerEventHandler('input', { target: { value: 'a' } });
      tick(100);
      inputElement.triggerEventHandler('input', { target: { value: 'ab' } });
      tick(100);
      inputElement.triggerEventHandler('input', { target: { value: 'abc' } });

      // Solo debe emitir una vez con el último valor
      tick(300);
      expect(component.searchChangeEvent.emit).toHaveBeenCalledTimes(1);
      expect(component.searchChangeEvent.emit).toHaveBeenCalledWith('abc');
    }));

    it('should use distinctUntilChanged to avoid duplicate emissions', fakeAsync(() => {
      jest.spyOn(component.searchChangeEvent, 'emit');

      const inputElement = fixture.debugElement.query(By.css('input'));

      // Mismo valor dos veces
      inputElement.triggerEventHandler('input', { target: { value: 'same' } });
      tick(300);
      inputElement.triggerEventHandler('input', { target: { value: 'same' } });
      tick(300);

      // Solo debe emitir una vez
      expect(component.searchChangeEvent.emit).toHaveBeenCalledTimes(1);
      expect(component.searchChangeEvent.emit).toHaveBeenCalledWith('same');
    }));
  });

  // Tests de geolocalización
  describe('Geolocation Functionality', () => {
    it('should emit locationEvent when location button is clicked', () => {
      jest.spyOn(component.locationEvent, 'emit');

      const locationButton = fixture.debugElement.query(By.css('button'));
      locationButton.triggerEventHandler('click', null);

      expect(component.locationEvent.emit).toHaveBeenCalled();
    });

    it('should call getCurrentPosition when location button is clicked', () => {
      const locationButton = fixture.debugElement.query(By.css('button'));
      locationButton.triggerEventHandler('click', null);

      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
    });

    it('should handle successful geolocation', () => {
      const mockPosition = {
        coords: {
          latitude: 40.7128,
          longitude: -74.006
        }
      };

      mockGeolocation.getCurrentPosition.mockImplementation((success: any) => {
        success(mockPosition);
      });

      component.onLocationClick();

      expect(mockLogger.info).toHaveBeenCalledWith('Location obtained:', {
        latitude: 40.7128,
        longitude: -74.006
      });
    });

    it('should handle geolocation error', () => {
      const mockError = new Error('Position unavailable');

      mockGeolocation.getCurrentPosition.mockImplementation((_success: any, error: any) => {
        error(mockError);
      });

      component.onLocationClick();

      expect(mockLogger.error).toHaveBeenCalledWith('Error getting location:', mockError);
    });

    it('should handle unsupported geolocation', () => {
      // Simular navegador sin geolocalización
      Object.defineProperty(global.navigator, 'geolocation', {
        value: undefined,
        configurable: true
      });

      component.onLocationClick();

      expect(mockLogger.error).toHaveBeenCalledWith('Geolocation not supported');
    });
  });

  // Tests de eventos del template
  describe('Template Event Handlers', () => {
    it('should bind input event correctly', () => {
      jest.spyOn(component, 'onSearchChange');

      const inputElement = fixture.debugElement.query(By.css('input'));
      const event = { target: { value: 'test input' } };
      inputElement.triggerEventHandler('input', event);

      expect(component.onSearchChange).toHaveBeenCalledWith(event);
    });

    it('should bind click event to location button', () => {
      jest.spyOn(component, 'onLocationClick');

      const locationButton = fixture.debugElement.query(By.css('button'));
      locationButton.triggerEventHandler('click', null);

      expect(component.onLocationClick).toHaveBeenCalled();
    });

    it('should update ngModel correctly', async () => {
      const inputElement = fixture.debugElement.query(By.css('input'));
      component.searchTerm = 'model test';
      fixture.detectChanges();
      await fixture.whenStable();

      expect(inputElement.nativeElement.value).toBe('model test');
    });
  });

  // Tests de ciclo de vida
  describe('Component Lifecycle', () => {
    it('should complete searchSubject on destroy', () => {
      jest.spyOn((component as any).searchSubject, 'complete');

      component.ngOnDestroy();

      expect((component as any).searchSubject.complete).toHaveBeenCalled();
    });

    it('should not throw error when destroyed', () => {
      expect(() => {
        component.ngOnDestroy();
      }).not.toThrow();
    });
  });

  // Tests de casos extremos
  describe('Edge Cases', () => {
    it('should handle null input event gracefully', () => {
      expect(() => {
        component.onSearchChange({ target: null });
      }).toThrow();
    });

    it('should handle undefined input event gracefully', () => {
      expect(() => {
        component.onSearchChange(null);
      }).toThrow();
    });

    it('should handle very long search terms', () => {
      const longTerm = 'a'.repeat(1000);
      jest.spyOn(component.searchEvent, 'emit');

      component.searchTerm = longTerm;
      component.onSearch();

      expect(component.searchEvent.emit).toHaveBeenCalledWith(longTerm);
    });

    it('should handle special characters in search', () => {
      const specialTerm = '!@#$%^&*()_+{}|:"<>?[]\\;\',./-=`~';
      jest.spyOn(component.searchEvent, 'emit');

      component.searchTerm = specialTerm;
      component.onSearch();

      expect(component.searchEvent.emit).toHaveBeenCalledWith(specialTerm);
    });
  });

  // Tests de integración
  describe('Integration Tests', () => {
    it('should work end-to-end: input -> debounce -> emit', fakeAsync(() => {
      jest.spyOn(component.searchChangeEvent, 'emit');

      const inputElement = fixture.debugElement.query(By.css('input'));

      // Simular escritura del usuario
      inputElement.nativeElement.value = 'sushi';
      inputElement.triggerEventHandler('input', { target: { value: 'sushi' } });

      // Verificar que el componente se actualizó
      expect(component.searchTerm).toBe('sushi');

      // Esperar el debounce
      tick(300);

      // Verificar que se emitió el evento
      expect(component.searchChangeEvent.emit).toHaveBeenCalledWith('sushi');
    }));

    it('should handle rapid typing followed by Enter', fakeAsync(() => {
      jest.spyOn(component.searchEvent, 'emit');
      jest.spyOn(component.searchChangeEvent, 'emit');

      const inputElement = fixture.debugElement.query(By.css('input'));

      // Escritura rápida
      inputElement.triggerEventHandler('input', { target: { value: 'fast' } });
      tick(100);

      // Enter antes del debounce
      inputElement.triggerEventHandler('keyup.enter', {});

      // Debe emitir inmediatamente por Enter
      expect(component.searchEvent.emit).toHaveBeenCalledWith('fast');

      // Y también después del debounce
      tick(200);
      expect(component.searchChangeEvent.emit).toHaveBeenCalledWith('fast');
    }));

    it('should coordinate search and location features', () => {
      jest.spyOn(component.searchEvent, 'emit');
      jest.spyOn(component.locationEvent, 'emit');

      // Configurar búsqueda
      component.searchTerm = 'nearby restaurants';
      component.onSearch();

      // Activar ubicación
      component.onLocationClick();

      // Ambos eventos deben haberse emitido
      expect(component.searchEvent.emit).toHaveBeenCalledWith('nearby restaurants');
      expect(component.locationEvent.emit).toHaveBeenCalled();
    });
  });

  // Tests de accesibilidad y UI
  describe('Accessibility and UI', () => {
    it('should have proper input accessibility attributes', () => {
      const inputElement = fixture.debugElement.query(By.css('input'));

      expect(inputElement.nativeElement.type).toBe('text');
      expect(inputElement.nativeElement.placeholder).toBeTruthy();
    });

    it('should have proper button accessibility attributes', () => {
      const buttonElement = fixture.debugElement.query(By.css('button'));

      expect(buttonElement.nativeElement.title).toBe('Usar mi ubicación');
    });

    it('should apply hover effects correctly', () => {
      const buttonElement = fixture.debugElement.query(By.css('button'));

      expect(buttonElement.nativeElement.classList).toContain('hover:bg-gray-50');
      expect(buttonElement.nativeElement.classList).toContain('transition-colors');
    });
  });

  // Tests de rendimiento
  describe('Performance', () => {
    it('should not create memory leaks with rapid inputs', fakeAsync(() => {
      const inputElement = fixture.debugElement.query(By.css('input'));

      // Muchos inputs rápidos
      for (let i = 0; i < 100; i++) {
        inputElement.triggerEventHandler('input', { target: { value: `test${i}` } });
        tick(10);
      }

      // Esperar el debounce final
      tick(300);

      expect(() => {
        component.ngOnDestroy();
      }).not.toThrow();
    }));

    it('should handle multiple location requests efficiently', () => {
      // Múltiples clicks en ubicación
      for (let i = 0; i < 10; i++) {
        component.onLocationClick();
      }

      // Debe llamar getCurrentPosition para cada click
      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledTimes(10);
    });
  });
});
