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

  beforeEach(() => {
    const loggerMock = {
      warn: jest.fn(),
      log: jest.fn()
    };

    jest.clearAllMocks();

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

    window.dispatchEvent(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect((service as unknown as { promptEvent: BeforeInstallPromptEvent }).promptEvent).toBe(mockEvent);
  });

  it('debe manejar el evento appinstalled', () => {
    const isAppInstalledSubject = (service as unknown as { isAppInstalled: BehaviorSubject<boolean> }).isAppInstalled;

    const appInstalledEvent = new Event('appinstalled');
    window.dispatchEvent(appInstalledEvent);

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
    const subscribeSpy = jest.spyOn(versionUpdatesSubject, 'subscribe');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        PwaService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: SwUpdate, useValue: swUpdateMock }
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
        { provide: SwUpdate, useValue: swUpdateMock }
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
        { provide: SwUpdate, useValue: swUpdateMock }
      ]
    });

    TestBed.inject(PwaService);

    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 30 * 60 * 1000);

    setIntervalSpy.mockRestore();
  });
});
