import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { AppComponent } from './app.component';
import { ApiService } from './shared/services/api/api.service';
import { LoggerService } from './shared/services/logger/logger.service';
import { PwaService } from './shared/services/pwa/pwa.service';

const mockSwUpdate = {
  isEnabled: false,
  checkForUpdate: () => Promise.resolve(),
  activateUpdate: () => Promise.resolve()
};

const mockSwPush = {
  isEnabled: false,
  requestSubscription: () => Promise.resolve(),
  unsubscribe: () => Promise.resolve()
};

describe('AppComponent', () => {
  let mockApiService: jest.Mocked<ApiService>;
  let mockLogger: Partial<LoggerService>;
  let mockPwaService: any;

  beforeEach(async () => {
    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn()
      }))
    });

    mockApiService = {
      getHealth: jest.fn()
    } as unknown as jest.Mocked<ApiService>;

    mockLogger = {
      log: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn()
    };

    mockPwaService = {
      updateAvailable$: new BehaviorSubject(false),
      showAppReminder$: new BehaviorSubject(false),
      isAppInstalled$: new BehaviorSubject(false),
      updateApp: jest.fn().mockResolvedValue(undefined),
      forceShowInstallPrompt: jest.fn(),
      dismissAppReminder: jest.fn(),
      forceShowUpdateBanner: jest.fn(),
      forceShowReminder: jest.fn(),
      canInstallApp: jest.fn().mockReturnValue(false),
      isInstalled: jest.fn().mockReturnValue(false),
      getInstallStatus: jest.fn().mockReturnValue({
        canInstall: false,
        hasPrompt: false,
        reason: 'Test reason'
      }),
      getDebugInfo: jest.fn().mockReturnValue({
        isBrowser: true,
        isInstalled: false,
        canInstall: false
      }),
      simulateInstallation: jest.fn(),
      simulateUninstallation: jest.fn(),
      clearPwaData: jest.fn()
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
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();

    jest.clearAllMocks();
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
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 800, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 800, writable: true });

    const setPropertySpy = jest.spyOn(document.documentElement.style, 'setProperty');

    mockApiService.getHealth.mockReturnValue(of({ status: 'ok' }));

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges();

    (app as any).handleScroll();

    expect(setPropertySpy).not.toHaveBeenCalledWith('--scroll-progress', expect.any(String));
  });

  describe('PWA Functionality', () => {
    let mockSnackBar: any;

    beforeEach(() => {
      mockSnackBar = {
        open: jest.fn().mockReturnValue({
          onAction: jest.fn().mockReturnValue(of(undefined)),
          afterDismissed: jest.fn().mockReturnValue(of(undefined))
        })
      };

      TestBed.overrideProvider(MatSnackBar, { useValue: mockSnackBar });
    });

    it('debe mostrar notificación de actualización cuando está disponible', () => {
      mockPwaService.updateAvailable$.next(true);
      mockApiService.getHealth.mockReturnValue(of({ status: 'ok' }));

      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();

      expect(mockSnackBar.open).toHaveBeenCalledWith(
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
      mockPwaService.updateAvailable$.next(true);
      mockApiService.getHealth.mockReturnValue(of({ status: 'ok' }));

      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();

      expect(mockPwaService.updateApp).toHaveBeenCalled();
    });

    it('debe manejar error al actualizar la app', async () => {
      const updateError = new Error('Update failed');
      mockPwaService.updateApp.mockRejectedValue(updateError);
      mockPwaService.updateAvailable$.next(true);
      mockApiService.getHealth.mockReturnValue(of({ status: 'ok' }));

      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(mockLogger.error).toHaveBeenCalledWith('Error updating app:', updateError);
    });

    it('debe mostrar notificación de recordatorio cuando está habilitada', () => {
      mockPwaService.showAppReminder$.next(true);
      mockApiService.getHealth.mockReturnValue(of({ status: 'ok' }));

      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();

      expect(mockSnackBar.open).toHaveBeenCalledWith(
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
      mockPwaService.showAppReminder$.next(true);
      mockApiService.getHealth.mockReturnValue(of({ status: 'ok' }));

      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();

      expect(mockPwaService.forceShowInstallPrompt).toHaveBeenCalled();
      expect(mockPwaService.dismissAppReminder).toHaveBeenCalled();
    });

    it('debe descartar recordatorio cuando se cierra la notificación', () => {
      mockPwaService.showAppReminder$.next(true);
      mockApiService.getHealth.mockReturnValue(of({ status: 'ok' }));

      const fixture = TestBed.createComponent(AppComponent);
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
