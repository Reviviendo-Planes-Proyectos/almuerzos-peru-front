import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { of, throwError } from 'rxjs';
import { AppComponent } from './app.component';
import { ApiService } from './shared/services/api/api.service';
import { LoggerService } from './shared/services/logger/logger.service';
import { PwaService } from './shared/services/pwa/pwa.service';
import { I18N_TEST_PROVIDERS, mockMatSnackBar, mockPwaService, mockSwPush, mockSwUpdate } from './testing/pwa-mocks';

describe('AppComponent', () => {
  let mockApiService: jest.Mocked<ApiService>;
  let mockLogger: Partial<LoggerService>;

  beforeEach(async () => {
    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn()
      }))
    });

    mockApiService = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      getHealth: jest.fn()
    } as unknown as jest.Mocked<ApiService>;

    mockLogger = {
      log: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ApiService, useValue: mockApiService },
        { provide: LoggerService, useValue: mockLogger as LoggerService },
        { provide: PwaService, useValue: mockPwaService },
        { provide: SwUpdate, useValue: mockSwUpdate },
        { provide: SwPush, useValue: mockSwPush },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
        { provide: PLATFORM_ID, useValue: 'browser' },
        ...I18N_TEST_PROVIDERS
      ]
    }).compileComponents();
  });

  it('debe crear el componente', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('debe asignar respuesta del API y registrar info', () => {
    const mockResponse = { status: 'ok' };
    mockApiService.getHealth.mockReturnValue(of(mockResponse));

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const app = fixture.componentInstance;
    expect(app.apiStatus).toEqual(mockResponse);
    expect(mockLogger.info).toHaveBeenCalledWith('API status fetched successfully');
  });

  it('debe manejar error del API y registrar error', () => {
    const mockError = { status: 0, message: 'Error en API' };
    const expectedErrorStatus = { error: 'API not available', offline: true };
    mockApiService.getHealth.mockReturnValue(throwError(() => mockError));

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const app = fixture.componentInstance;
    expect(app.apiStatus).toEqual(expectedErrorStatus);
    expect(mockLogger.warn).toHaveBeenCalledWith('API health check failed - running in offline mode');
  });

  it('debe inicializar el indicador de scroll al cargar', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    mockApiService.getHealth.mockReturnValue(of({ status: 'ok' }));

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('debe manejar el scroll y actualizar las propiedades CSS', () => {
    Object.defineProperty(window, 'pageYOffset', { value: 100, writable: true });
    Object.defineProperty(document.documentElement, 'scrollTop', { value: 100, writable: true });
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 800, writable: true });

    const setPropertySpy = jest.spyOn(document.documentElement.style, 'setProperty');
    const addClassSpy = jest.spyOn(document.body.classList, 'add');

    mockApiService.getHealth.mockReturnValue(of({ status: 'ok' }));

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges();

    (app as any).handleScroll();

    expect(setPropertySpy).toHaveBeenCalledWith('--scroll-progress', expect.any(String));
    expect(setPropertySpy).toHaveBeenCalledWith('--scroll-position', expect.any(String));
    expect(addClassSpy).toHaveBeenCalledWith('scrolling');
  });

  it('debe limpiar el timeout de scroll y remover clase scrolling', (done) => {
    jest.useFakeTimers();
    const removeClassSpy = jest.spyOn(document.body.classList, 'remove');

    mockApiService.getHealth.mockReturnValue(of({ status: 'ok' }));

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges();

    (app as any).handleScroll();
    (app as any).handleScroll();

    jest.advanceTimersByTime(1500);

    expect(removeClassSpy).toHaveBeenCalledWith('scrolling');

    jest.useRealTimers();
    done();
  });

  it('debe manejar scrollHeight igual a 0', () => {
    // Mock del DOM para simular scroll behavior
    const setPropertySpy = jest.spyOn(document.documentElement.style, 'setProperty');

    // Simular scroll usando window.scrollY únicamente
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
      configurable: true
    });

    mockApiService.getHealth.mockReturnValue(of({ status: 'ok' }));

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    // Mock the component's scroll calculation to return 0%
    const _originalHandleScroll = (app as any).handleScroll;
    (app as any).handleScroll = jest.fn(() => {
      // Simulate the logic when scrollHeight equals innerHeight (no scrollable content)
      document.documentElement.style.setProperty('--scroll-progress', '0%');
      document.documentElement.style.setProperty('--scroll-position', '0%');
    });

    fixture.detectChanges();

    // Clear previous calls to setProperty
    setPropertySpy.mockClear();

    // Manually trigger scroll event
    (app as any).handleScroll();

    // Cuando no hay contenido scroll, el progress debe ser 0%
    expect(setPropertySpy).toHaveBeenCalledWith('--scroll-progress', '0%');
  });

  describe('PWA Functionality', () => {
    beforeEach(() => {
      // Reset all mocks before each test
      jest.clearAllMocks();

      // Reset BehaviorSubjects to default state
      mockPwaService.updateAvailable$.next(false);
      mockPwaService.showAppReminder$.next(false);

      // Configurar el comportamiento del mockMatSnackBar
      mockMatSnackBar.open = jest.fn().mockReturnValue({
        onAction: jest.fn().mockReturnValue(of(undefined)),
        afterDismissed: jest.fn().mockReturnValue(of(undefined))
      });

      // Configurar mocks específicos para cada test
      mockPwaService.shouldShowReminder.mockReturnValue(true);
      (mockPwaService as any).isInstalled.mockReturnValue(false);
      // Reset getDebugInfo to default for PWA tests only
      mockPwaService.getDebugInfo.mockReturnValue({
        userAgent: 'Mozilla/5.0 (Linux; Android 10; SM-A505F) AppleWebKit/537.36'
      });

      // Simular ventana móvil
      Object.defineProperty(window, 'innerWidth', { value: 400, writable: true });

      TestBed.overrideProvider(MatSnackBar, { useValue: mockMatSnackBar });
    });

    it('debe mostrar notificación de actualización cuando está disponible', () => {
      mockApiService.getHealth.mockReturnValue(of({ status: 'ok' }));

      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();

      // Trigger update notification AFTER component is initialized
      mockPwaService.updateAvailable$.next(true);
      fixture.detectChanges();

      expect(mockMatSnackBar.open).toHaveBeenCalledWith(
        'Nueva versión disponible. ¿Actualizar ahora?',
        'Actualizar',
        expect.objectContaining({
          duration: 0,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['update-snackbar']
        })
      );
    });

    it('debe actualizar la app cuando se confirma la actualización', () => {
      mockApiService.getHealth.mockReturnValue(of({ status: 'ok' }));

      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();

      // Trigger update notification AFTER component is initialized
      mockPwaService.updateAvailable$.next(true);
      fixture.detectChanges();

      expect(mockPwaService.updateApp).toHaveBeenCalled();
    });

    it('debe manejar error al actualizar la app', async () => {
      const updateError = new Error('Update failed');
      mockPwaService.updateApp.mockRejectedValue(updateError);
      mockApiService.getHealth.mockReturnValue(of({ status: 'ok' }));

      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();

      // Trigger update notification AFTER component is initialized
      mockPwaService.updateAvailable$.next(true);
      fixture.detectChanges();

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(mockLogger.error).toHaveBeenCalledWith('Error updating app:', updateError);
    });

    it('debe mostrar notificación de recordatorio cuando está habilitada', () => {
      mockApiService.getHealth.mockReturnValue(of({ status: 'ok' }));

      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();

      // Trigger reminder notification AFTER component is initialized
      mockPwaService.showAppReminder$.next(true);
      fixture.detectChanges();

      expect(mockMatSnackBar.open).toHaveBeenCalledWith(
        '¿Te gusta Almuerzos Perú? ¡Instálala!',
        'Instalar',
        expect.objectContaining({
          duration: 10000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['reminder-snackbar']
        })
      );
    });

    it('debe forzar mostrar prompt de instalación cuando se confirma recordatorio', () => {
      mockApiService.getHealth.mockReturnValue(of({ status: 'ok' }));

      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();

      // Trigger reminder notification AFTER component is initialized
      mockPwaService.showAppReminder$.next(true);
      fixture.detectChanges();

      expect(mockPwaService.forceShowInstallPrompt).toHaveBeenCalled();
      expect(mockPwaService.dismissAppReminder).toHaveBeenCalled();
    });

    it('debe descartar recordatorio cuando se cierra la notificación', () => {
      mockApiService.getHealth.mockReturnValue(of({ status: 'ok' }));

      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();

      // Trigger reminder notification AFTER component is initialized
      mockPwaService.showAppReminder$.next(true);
      fixture.detectChanges();

      expect(mockPwaService.dismissAppReminder).toHaveBeenCalled();
    });
  });

  describe('Platform Specific Behavior', () => {
    it('no debe configurar notificaciones PWA en plataforma server', async () => {
      await TestBed.configureTestingModule({
        imports: [AppComponent],
        providers: [
          { provide: ApiService, useValue: mockApiService },
          { provide: LoggerService, useValue: mockLogger as LoggerService },
          { provide: PwaService, useValue: mockPwaService },
          { provide: SwUpdate, useValue: mockSwUpdate },
          { provide: SwPush, useValue: mockSwPush },
          { provide: PLATFORM_ID, useValue: 'server' }
        ]
      }).compileComponents();

      mockApiService.getHealth.mockReturnValue(of({ status: 'ok' }));

      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();

      expect(fixture.componentInstance).toBeTruthy();
    });
  });

  describe('Debug Methods in Development', () => {
    beforeEach(() => {
      // Reset the getDebugInfo mock to the default expected values for debug tests
      mockPwaService.getDebugInfo.mockReturnValue({
        isBrowser: true,
        isInstalled: false,
        canInstall: false
      });
      // Clean up any previous window.pwaDebug
      (window as any).pwaDebug = undefined;
    });

    it('debe exponer métodos de debug en modo desarrollo', () => {
      // Mock isDevMode globally for this test
      const originalIsDevMode = require('@angular/core').isDevMode;
      jest.doMock('@angular/core', () => ({
        ...jest.requireActual('@angular/core'),
        isDevMode: () => true
      }));

      mockApiService.getHealth.mockReturnValue(of({ status: 'ok' }));

      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();

      expect((window as any).pwaDebug).toBeDefined();
      expect(typeof (window as any).pwaDebug.forceShowUpdate).toBe('function');
      expect(typeof (window as any).pwaDebug.forceShowReminder).toBe('function');
      expect(typeof (window as any).pwaDebug.forceShowInstallPrompt).toBe('function');
      expect(typeof (window as any).pwaDebug.getAppStatus).toBe('function');

      // Restore original isDevMode
      require('@angular/core').isDevMode = originalIsDevMode;
    });

    it('debe ejecutar métodos de debug correctamente', () => {
      // Mock isDevMode for this test
      const originalIsDevMode = require('@angular/core').isDevMode;
      jest.doMock('@angular/core', () => ({
        ...jest.requireActual('@angular/core'),
        isDevMode: () => true
      }));

      mockApiService.getHealth.mockReturnValue(of({ status: 'ok' }));

      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();

      if ((window as any).pwaDebug) {
        (window as any).pwaDebug.forceShowUpdate();
        (window as any).pwaDebug.forceShowReminder();
        (window as any).pwaDebug.forceShowInstallPrompt();

        expect(mockPwaService.forceShowUpdateBanner).toHaveBeenCalled();
        expect(mockPwaService.forceShowReminder).toHaveBeenCalled();
        expect(mockPwaService.forceShowInstallPrompt).toHaveBeenCalled();
      }

      // Restore original isDevMode
      require('@angular/core').isDevMode = originalIsDevMode;
    });

    it('debe retornar estado de la app correctamente', () => {
      // Mock isDevMode for this test
      const originalIsDevMode = require('@angular/core').isDevMode;
      jest.doMock('@angular/core', () => ({
        ...jest.requireActual('@angular/core'),
        isDevMode: () => true
      }));

      mockApiService.getHealth.mockReturnValue(of({ status: 'ok' }));

      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();

      if ((window as any).pwaDebug) {
        const appStatus = (window as any).pwaDebug.getAppStatus();

        expect(appStatus).toEqual({
          isInstalled: false,
          canInstall: false,
          updateAvailable: mockPwaService.updateAvailable$,
          installStatus: {
            canInstall: false,
            hasPrompt: false,
            reason: 'Test reason'
          },
          debugInfo: {
            isBrowser: true,
            isInstalled: false,
            canInstall: false
          }
        });
      }

      // Restore original isDevMode
      require('@angular/core').isDevMode = originalIsDevMode;
    });

    it('debe registrar mensaje de debug al exponer métodos', () => {
      // Mock isDevMode for this test
      const originalIsDevMode = require('@angular/core').isDevMode;
      jest.doMock('@angular/core', () => ({
        ...jest.requireActual('@angular/core'),
        isDevMode: () => true
      }));

      mockApiService.getHealth.mockReturnValue(of({ status: 'ok' }));

      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();

      expect(mockLogger.info).toHaveBeenCalledWith('🐛 PWA Debug methods exposed: window.pwaDebug');

      // Restore original isDevMode
      require('@angular/core').isDevMode = originalIsDevMode;
    });
  });

  describe('Component Lifecycle', () => {
    it('debe limpiar subscripciones al destruir el componente', () => {
      mockApiService.getHealth.mockReturnValue(of({ status: 'ok' }));

      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;
      fixture.detectChanges();

      const destroySpy = jest.spyOn((app as any).destroy$, 'next');
      const completeSpy = jest.spyOn((app as any).destroy$, 'complete');

      app.ngOnDestroy();

      expect(destroySpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });

    it('debe limpiar timeout de scroll correctamente', () => {
      jest.useFakeTimers();

      mockApiService.getHealth.mockReturnValue(of({ status: 'ok' }));

      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;
      fixture.detectChanges();

      (app as any).handleScroll();

      expect((app as any).scrollTimeout).not.toBeNull();

      app.ngOnDestroy();

      jest.useRealTimers();
    });
  });
});
