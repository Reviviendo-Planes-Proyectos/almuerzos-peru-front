import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { BehaviorSubject, Subject } from 'rxjs';
import { LoggerService } from '../logger/logger.service';
import { PwaService } from './pwa.service';

jest.mock('@angular/core', () => ({
  ...jest.requireActual('@angular/core'),
  isDevMode: jest.fn(() => false)
}));

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

describe('PwaService', () => {
  let service: PwaService;
  let swUpdateMock: Partial<SwUpdate>;
  let versionUpdatesSubject: Subject<VersionEvent>;
  let loggerMock: any;

  beforeEach(() => {
    loggerMock = {
      warn: jest.fn(),
      log: jest.fn(),
      info: jest.fn(),
      error: jest.fn(),
      debug: jest.fn()
    };

    jest.clearAllMocks();

    Object.defineProperty(window, 'isSecureContext', {
      writable: true,
      value: true
    });

    Object.defineProperty(navigator, 'serviceWorker', {
      writable: true,
      value: {
        ready: Promise.resolve(),
        register: jest.fn()
      }
    });

    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = '/manifest.webmanifest';
    document.head.appendChild(manifestLink);

    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        search: '',
        href: 'http://localhost:4200',
        protocol: 'http:',
        host: 'localhost:4200'
      }
    });

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

    Object.defineProperty(navigator, 'standalone', {
      writable: true,
      value: false
    });

    const eventListeners: { [key: string]: EventListener[] } = {};

    window.addEventListener = jest.fn().mockImplementation((event: string, listener: EventListener) => {
      if (!eventListeners[event]) {
        eventListeners[event] = [];
      }
      eventListeners[event].push(listener);
    });

    window.dispatchEvent = jest.fn().mockImplementation((event: Event) => {
      const listeners = eventListeners[event.type];
      if (listeners) {
        for (const listener of listeners) {
          listener(event);
        }
      }
      return true;
    });

    versionUpdatesSubject = new Subject<VersionEvent>();

    swUpdateMock = {
      isEnabled: true,
      versionUpdates: versionUpdatesSubject.asObservable(),
      checkForUpdate: jest.fn(),
      activateUpdate: jest.fn().mockResolvedValue(undefined)
    };

    TestBed.configureTestingModule({
      providers: [
        PwaService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: SwUpdate, useValue: swUpdateMock },
        { provide: LoggerService, useValue: loggerMock }
      ]
    });

    service = TestBed.inject(PwaService);
  });

  afterEach(() => {
    versionUpdatesSubject.complete();
  });

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debe emitir updateAvailable como true cuando hay nueva versión', (done) => {
    service.updateAvailable$.subscribe((value) => {
      if (value === true) {
        expect(value).toBe(true);
        done();
      }
    });

    versionUpdatesSubject.next({ type: 'VERSION_READY' } as VersionEvent);
  });

  it('debe retornar false al verificar si puede instalar sin prompt event', () => {
    Object.defineProperty(navigator, 'serviceWorker', {
      value: undefined,
      writable: true
    });

    (service as any).isAppInstalled.next(true);

    const canInstall = service.canInstallApp();
    expect(canInstall).toBe(false);
  });

  it('debe retornar true al verificar si puede instalar con prompt event', () => {
    const promptEvent = {} as BeforeInstallPromptEvent;
    (service as unknown as { promptEvent: BeforeInstallPromptEvent | null }).promptEvent = promptEvent;

    const canInstall = service.canInstallApp();
    expect(canInstall).toBe(true);
  });

  it('debe ejecutar prompt de instalación correctamente', async () => {
    const promptMock = jest.fn().mockResolvedValue(undefined);
    const userChoiceMock = Promise.resolve({ outcome: 'accepted' as const });

    (service as unknown as { promptEvent: BeforeInstallPromptEvent }).promptEvent = {
      prompt: promptMock,
      userChoice: userChoiceMock
    } as unknown as BeforeInstallPromptEvent;

    const installed = await service.installApp();
    expect(installed).toBe(true);
    expect(promptMock).toHaveBeenCalled();
  });

  it('debe retornar false si no hay prompt event al instalar', async () => {
    const installed = await service.installApp();
    expect(installed).toBe(false);
  });

  it('debe ejecutar updateApp sin errores si hay actualización', async () => {
    const reloadSpy = jest.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: reloadSpy },
      writable: true
    });

    const updateAvailable = (service as unknown as { updateAvailable: BehaviorSubject<boolean> }).updateAvailable;
    updateAvailable.next(true);

    await service.updateApp();
    expect(swUpdateMock.activateUpdate).toHaveBeenCalled();
    expect(reloadSpy).toHaveBeenCalled();
  });

  it('no debe hacer nada en updateApp si no hay actualización disponible', async () => {
    const updateAvailable = (service as unknown as { updateAvailable: BehaviorSubject<boolean> }).updateAvailable;
    updateAvailable.next(false);

    await service.updateApp();
    expect(swUpdateMock.activateUpdate).not.toHaveBeenCalled();
  });

  it('debe manejar errores en updateApp', async () => {
    const loggerSpy = jest.spyOn(service.logger, 'warn');
    (swUpdateMock.activateUpdate as jest.Mock).mockRejectedValue(new Error('Update failed'));

    const updateAvailable = (service as unknown as { updateAvailable: BehaviorSubject<boolean> }).updateAvailable;
    updateAvailable.next(true);

    await service.updateApp();
    expect(loggerSpy).toHaveBeenCalledWith('App update failed');
    loggerSpy.mockRestore();
  });

  it('debe manejar errores en installApp', async () => {
    const loggerSpy = jest.spyOn(service.logger, 'warn');
    const promptMock = jest.fn().mockRejectedValue(new Error('Install failed'));

    Object.defineProperty(service, 'promptEvent', {
      value: {
        prompt: promptMock,
        userChoice: Promise.resolve({ outcome: 'accepted' as const })
      },
      writable: true
    });

    const installed = await service.installApp();
    expect(installed).toBe(false);
    expect(loggerSpy).toHaveBeenCalledWith('PWA installation failed', expect.any(Error));
    loggerSpy.mockRestore();
  });

  it('debe detectar app standalone usando matchMedia', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(() => ({
        matches: true,
        media: '(display-mode: standalone)',
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn()
      }))
    });

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        PwaService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: SwUpdate, useValue: swUpdateMock }
      ]
    });

    const newService = TestBed.inject(PwaService);

    newService.isAppInstalled$.subscribe((value) => {
      expect(value).toBe(true);
    });
  });

  it('debe detectar app standalone usando navigator.standalone', () => {
    Object.defineProperty(navigator, 'standalone', {
      writable: true,
      value: true
    });

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        PwaService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: SwUpdate, useValue: swUpdateMock }
      ]
    });

    const newService = TestBed.inject(PwaService);

    newService.isAppInstalled$.subscribe((value) => {
      expect(value).toBe(true);
    });
  });

  it('debe capturar el evento beforeinstallprompt', () => {
    const mockEvent = {
      preventDefault: jest.fn(),
      type: 'beforeinstallprompt'
    } as unknown as BeforeInstallPromptEvent;

    const listeners = (window.addEventListener as jest.Mock).mock.calls
      .filter((call) => call[0] === 'beforeinstallprompt')
      .map((call) => call[1]);

    if (listeners.length > 0) {
      listeners[0](mockEvent);
    }

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect((service as unknown as { promptEvent: BeforeInstallPromptEvent }).promptEvent).toBe(mockEvent);
  });

  it('debe manejar el evento appinstalled', () => {
    const isAppInstalledSubject = (service as unknown as { isAppInstalled: BehaviorSubject<boolean> }).isAppInstalled;

    const appInstalledEvent = new Event('appinstalled');

    const listeners = (window.addEventListener as jest.Mock).mock.calls
      .filter((call) => call[0] === 'appinstalled')
      .map((call) => call[1]);

    if (listeners.length > 0) {
      listeners[0](appInstalledEvent);
    }

    expect(isAppInstalledSubject.value).toBe(true);
    expect((service as unknown as { promptEvent: BeforeInstallPromptEvent | null }).promptEvent).toBe(null);
  });

  it('debe retornar false si el usuario rechaza la instalación', async () => {
    const promptMock = jest.fn().mockResolvedValue(undefined);
    const userChoiceMock = Promise.resolve({ outcome: 'dismissed' as const });

    (service as unknown as { promptEvent: BeforeInstallPromptEvent }).promptEvent = {
      prompt: promptMock,
      userChoice: userChoiceMock
    } as unknown as BeforeInstallPromptEvent;

    const installed = await service.installApp();
    expect(installed).toBe(false);
    expect(promptMock).toHaveBeenCalled();
  });

  it('no debe hacer nada si swUpdate está deshabilitado', () => {
    const disabledSwUpdateMock = {
      isEnabled: false,
      versionUpdates: versionUpdatesSubject.asObservable(),
      checkForUpdate: jest.fn(),
      activateUpdate: jest.fn().mockResolvedValue(undefined)
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        PwaService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: SwUpdate, useValue: disabledSwUpdateMock }
      ]
    });

    const newService = TestBed.inject(PwaService);

    expect(newService).toBeTruthy();
  });

  it('no debe inicializar PWA en modo desarrollo', () => {
    const originalIsDevMode = require('@angular/core').isDevMode;
    require('@angular/core').isDevMode = jest.fn(() => true);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        PwaService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: SwUpdate, useValue: swUpdateMock }
      ]
    });

    const newService = TestBed.inject(PwaService);
    expect(newService).toBeTruthy();

    require('@angular/core').isDevMode = originalIsDevMode;
  });

  it('no debe inicializar PWA en servidor (no browser)', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        PwaService,
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: SwUpdate, useValue: swUpdateMock }
      ]
    });

    const newService = TestBed.inject(PwaService);
    expect(newService).toBeTruthy();
  });

  it('debe emitir isAppInstalled como true cuando se acepta la instalación', async () => {
    const promptMock = jest.fn().mockResolvedValue(undefined);
    const userChoiceMock = Promise.resolve({ outcome: 'accepted' as const });

    (service as unknown as { promptEvent: BeforeInstallPromptEvent }).promptEvent = {
      prompt: promptMock,
      userChoice: userChoiceMock
    } as unknown as BeforeInstallPromptEvent;

    let isInstalledValue = false;
    service.isAppInstalled$.subscribe((value) => {
      isInstalledValue = value;
    });

    await service.installApp();

    expect(isInstalledValue).toBe(true);
  });

  it('debe procesar otros tipos de eventos de versión', (done) => {
    let updateReceived = false;
    service.updateAvailable$.subscribe((value) => {
      if (value === true) {
        updateReceived = true;
      }
      if (!updateReceived) {
        expect(value).toBe(false);
        done();
      }
    });

    versionUpdatesSubject.next({ type: 'VERSION_DETECTED' } as VersionEvent);
  });

  it('debe retornar el estado correcto de isInstalled', () => {
    expect(service.isInstalled()).toBe(false);

    const isAppInstalledSubject = (service as unknown as { isAppInstalled: BehaviorSubject<boolean> }).isAppInstalled;
    isAppInstalledSubject.next(true);

    expect(service.isInstalled()).toBe(true);
  });

  it('debe retornar false en hasInstallPrompt cuando no hay prompt event', () => {
    expect(service.hasInstallPrompt()).toBe(false);
  });

  it('debe retornar true en hasInstallPrompt cuando hay prompt event', () => {
    const promptEvent = {} as BeforeInstallPromptEvent;
    (service as unknown as { promptEvent: BeforeInstallPromptEvent | null }).promptEvent = promptEvent;

    expect(service.hasInstallPrompt()).toBe(true);
  });

  it('debe retornar false en canInstallApp si la app ya está instalada', () => {
    const promptEvent = {} as BeforeInstallPromptEvent;
    (service as unknown as { promptEvent: BeforeInstallPromptEvent | null }).promptEvent = promptEvent;

    const isAppInstalledSubject = (service as unknown as { isAppInstalled: BehaviorSubject<boolean> }).isAppInstalled;
    isAppInstalledSubject.next(true);

    const canInstall = service.canInstallApp();
    expect(canInstall).toBe(false);
  });

  it('debe retornar false en canInstallApp si no está en browser', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        PwaService,
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: SwUpdate, useValue: swUpdateMock }
      ]
    });

    const serverService = TestBed.inject(PwaService);
    const promptEvent = {} as BeforeInstallPromptEvent;
    (serverService as unknown as { promptEvent: BeforeInstallPromptEvent | null }).promptEvent = promptEvent;

    const canInstall = serverService.canInstallApp();
    expect(canInstall).toBe(false);
  });

  it('debe llamar checkForUpdates cuando swUpdate está habilitado', () => {
    TestBed.resetTestingModule();

    const subscribeSpy = jest.fn();
    const mockSwUpdate = {
      isEnabled: true,
      versionUpdates: {
        subscribe: subscribeSpy
      },
      checkForUpdate: jest.fn(),
      activateUpdate: jest.fn().mockResolvedValue(undefined)
    };

    TestBed.configureTestingModule({
      providers: [
        PwaService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: SwUpdate, useValue: mockSwUpdate },
        { provide: LoggerService, useValue: loggerMock }
      ]
    });

    TestBed.inject(PwaService);
    expect(subscribeSpy).toHaveBeenCalled();
  });

  it('debe llamar captureInstallPrompt en initPwa', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        PwaService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: SwUpdate, useValue: swUpdateMock },
        { provide: LoggerService, useValue: loggerMock }
      ]
    });

    TestBed.inject(PwaService);

    expect(addEventListenerSpy).toHaveBeenCalledWith('beforeinstallprompt', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('appinstalled', expect.any(Function));
  });

  it('debe configurar setInterval para checkForUpdate', () => {
    const setIntervalSpy = jest.spyOn(global, 'setInterval');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        PwaService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: SwUpdate, useValue: swUpdateMock },
        { provide: LoggerService, useValue: loggerMock }
      ]
    });

    TestBed.inject(PwaService);

    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 30 * 60 * 1000);

    setIntervalSpy.mockRestore();
  });

  it('debe retornar false y mostrar warning cuando no es secure context', () => {
    Object.defineProperty(window, 'isSecureContext', {
      writable: true,
      value: false
    });

    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        hostname: 'example.com',
        protocol: 'http:',
        search: '',
        href: 'http://example.com'
      }
    });

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        PwaService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: SwUpdate, useValue: swUpdateMock },
        { provide: LoggerService, useValue: loggerMock }
      ]
    });

    TestBed.inject(PwaService);
    expect(loggerMock.warn).toHaveBeenCalledWith('PWA requires HTTPS to work properly');
  });

  it('debe retornar true cuando shouldSimulatePrompt es true', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        hostname: 'localhost',
        protocol: 'http:',
        href: 'http://localhost:4200',
        search: ''
      }
    });

    Object.defineProperty(navigator, 'serviceWorker', {
      writable: true,
      value: { ready: Promise.resolve() }
    });

    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = '/manifest.webmanifest';
    document.head.appendChild(manifestLink);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        PwaService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: SwUpdate, useValue: swUpdateMock },
        { provide: LoggerService, useValue: loggerMock }
      ]
    });

    const newService = TestBed.inject(PwaService);
    const canInstall = newService.canInstallApp();
    expect(canInstall).toBe(true);
  });

  it('debe detectar iOS Safari y verificar instalabilidad', () => {
    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      value:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
    });

    Object.defineProperty(navigator, 'standalone', {
      writable: true,
      value: false
    });

    Object.defineProperty(navigator, 'serviceWorker', {
      writable: true,
      value: { ready: Promise.resolve() }
    });

    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = '/manifest.webmanifest';
    document.head.appendChild(manifestLink);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        PwaService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: SwUpdate, useValue: swUpdateMock },
        { provide: LoggerService, useValue: loggerMock }
      ]
    });

    const newService = TestBed.inject(PwaService);
    const debugInfo = newService.getDebugInfo();
    expect(debugInfo.isIOSSafari).toBe(true);
  });

  it('debe retornar false para iOS Safari cuando está en standalone', () => {
    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      value:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
    });

    Object.defineProperty(navigator, 'standalone', {
      writable: true,
      value: true
    });

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        PwaService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: SwUpdate, useValue: swUpdateMock },
        { provide: LoggerService, useValue: loggerMock }
      ]
    });

    const newService = TestBed.inject(PwaService);
    const canInstall = newService.canInstallApp();
    expect(canInstall).toBe(false);
  });

  it('debe verificar shouldSimulatePrompt en localhost con manifest', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        hostname: 'localhost',
        protocol: 'http:',
        href: 'http://localhost:4200',
        search: ''
      }
    });

    Object.defineProperty(navigator, 'serviceWorker', {
      writable: true,
      value: { ready: Promise.resolve() }
    });

    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = '/manifest.webmanifest';
    document.head.appendChild(manifestLink);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        PwaService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: SwUpdate, useValue: swUpdateMock },
        { provide: LoggerService, useValue: loggerMock }
      ]
    });

    const newService = TestBed.inject(PwaService);
    const debugInfo = newService.getDebugInfo();
    expect(debugInfo.hasServiceWorker).toBe(true);
    expect(debugInfo.hasValidManifest).toBe(true);
  });

  it('debe retornar información de debug completa', () => {
    const debugInfo = service.getDebugInfo();

    expect(debugInfo).toBeDefined();
    expect(debugInfo.isBrowser).toBe(true);
    expect(debugInfo.isSecureContext).toBeDefined();
    expect(debugInfo.hasPromptEvent).toBe(false);
    expect(debugInfo.canInstallApp).toBeDefined();
    expect(debugInfo.userAgent).toBeDefined();
    expect(debugInfo.displayMode).toBeDefined();
    expect(debugInfo.swUpdateEnabled).toBe(true);
  });

  it('debe ejecutar logDebugInfo correctamente', () => {
    service.logDebugInfo();
    expect(loggerMock.info).toHaveBeenCalledWith('PWA Debug Info:', expect.any(Object));
  });

  it('debe obtener registros de service worker exitosamente', async () => {
    const mockRegistrations = [{ scope: '/' }];

    Object.defineProperty(navigator, 'serviceWorker', {
      writable: true,
      value: {
        getRegistrations: jest.fn().mockResolvedValue(mockRegistrations)
      }
    });

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        PwaService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: SwUpdate, useValue: swUpdateMock },
        { provide: LoggerService, useValue: loggerMock }
      ]
    });

    const newService = TestBed.inject(PwaService);
    newService.checkInstallability();

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(loggerMock.info).toHaveBeenCalledWith('Found 1 service worker registrations');
  });

  it('debe manejar errores al obtener registros de service worker', async () => {
    Object.defineProperty(navigator, 'serviceWorker', {
      writable: true,
      value: {
        getRegistrations: jest.fn().mockRejectedValue(new Error('Failed'))
      }
    });

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        PwaService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: SwUpdate, useValue: swUpdateMock },
        { provide: LoggerService, useValue: loggerMock }
      ]
    });

    const newService = TestBed.inject(PwaService);
    newService.checkInstallability();

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(loggerMock.warn).toHaveBeenCalledWith('Failed to get service worker registrations');
  });

  it('debe mostrar mensaje para iOS Safari cuando no está en standalone', () => {
    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      value:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
    });

    Object.defineProperty(navigator, 'standalone', {
      writable: true,
      value: false
    });

    Object.defineProperty(navigator, 'serviceWorker', {
      writable: true,
      value: {
        getRegistrations: jest.fn().mockResolvedValue([])
      }
    });

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        PwaService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: SwUpdate, useValue: swUpdateMock },
        { provide: LoggerService, useValue: loggerMock }
      ]
    });

    const newService = TestBed.inject(PwaService);
    newService.checkInstallability();

    expect(loggerMock.info).toHaveBeenCalledWith('iOS Safari detected - manual installation instructions available');
  });

  it('debe detectar isInWebView correctamente', () => {
    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      value:
        'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/88.0.4324.181 Mobile Safari/537.36; wv'
    });

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        PwaService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: SwUpdate, useValue: swUpdateMock },
        { provide: LoggerService, useValue: loggerMock }
      ]
    });

    const newService = TestBed.inject(PwaService);
    const debugInfo = newService.getDebugInfo();
    expect(debugInfo.isInWebView).toBe(true);
  });

  it('debe detectar iOS Safari correctamente', () => {
    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      value:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
    });

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        PwaService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: SwUpdate, useValue: swUpdateMock },
        { provide: LoggerService, useValue: loggerMock }
      ]
    });

    const newService = TestBed.inject(PwaService);
    const debugInfo = newService.getDebugInfo();
    expect(debugInfo.isIOSSafari).toBe(true);
  });

  it('debe detectar Chrome en iOS correctamente', () => {
    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      value:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/94.0.4606.76 Mobile/15E148 Safari/604.1'
    });

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        PwaService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: SwUpdate, useValue: swUpdateMock },
        { provide: LoggerService, useValue: loggerMock }
      ]
    });

    const newService = TestBed.inject(PwaService);
    const debugInfo = newService.getDebugInfo();
    expect(debugInfo.isIOSSafari).toBe(false);
  });

  it('debe simular install prompt en desarrollo', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        hostname: 'localhost',
        protocol: 'http:',
        href: 'http://localhost:4200',
        search: ''
      }
    });

    Object.defineProperty(navigator, 'serviceWorker', {
      writable: true,
      value: {
        getRegistrations: jest.fn().mockResolvedValue([])
      }
    });

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        PwaService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: SwUpdate, useValue: swUpdateMock },
        { provide: LoggerService, useValue: loggerMock }
      ]
    });

    const newService = TestBed.inject(PwaService);
    newService.checkInstallability();

    expect(loggerMock.info).toHaveBeenCalledWith('Simulating install prompt for development');
  });
});
