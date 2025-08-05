import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BehaviorSubject, of } from 'rxjs';
import { PwaService } from '../../services/pwa/pwa.service';
import { PwaPromptComponent } from './pwa-prompt.component';

describe('PwaPromptComponent', () => {
  let component: PwaPromptComponent;
  let fixture: ComponentFixture<PwaPromptComponent>;
  let mockPwaService: jest.Mocked<PwaService>;
  let mockSnackBar: jest.Mocked<MatSnackBar>;
  let updateAvailableSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    updateAvailableSubject = new BehaviorSubject<boolean>(false);

    mockPwaService = {
      installApp: jest.fn().mockResolvedValue(true),
      updateApp: jest.fn().mockResolvedValue(undefined),
      updateAvailable$: updateAvailableSubject.asObservable()
    } as unknown as jest.Mocked<PwaService>;

    const snackBarRef = {
      dismiss: jest.fn(),
      afterDismissed: jest.fn().mockReturnValue(of({})),
      onAction: jest.fn().mockReturnValue(of({}))
    };

    mockSnackBar = {
      open: jest.fn().mockReturnValue(snackBarRef)
    } as unknown as jest.Mocked<MatSnackBar>;

    await TestBed.configureTestingModule({
      imports: [PwaPromptComponent, NoopAnimationsModule, MatSnackBarModule],
      providers: [
        { provide: PwaService, useValue: mockPwaService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PwaPromptComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
    Object.defineProperty(window, 'localStorage', {
      value: undefined,
      writable: true
    });
    Object.defineProperty(window.navigator, 'userAgent', {
      writable: true,
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    });
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1024
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle installation successfully', async () => {
    mockPwaService.installApp.mockResolvedValue(true);
    component.showInstallPrompt = true;

    await component.installApp();

    expect(mockPwaService.installApp).toHaveBeenCalled();
    expect(component.showInstallPrompt).toBe(false);
  });

  it('should detect mobile device correctly', () => {
    Object.defineProperty(window.navigator, 'userAgent', {
      writable: true,
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
    });
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 375
    });

    component.ngOnInit();

    expect(component.isMobile).toBe(true);
  });

  it('should schedule FAB display on mobile after 30 seconds', fakeAsync(() => {
    component.isMobile = true;
    (component as unknown as { scheduleFabDisplay: () => void }).scheduleFabDisplay();

    tick(30000);
    expect(component.showFabAfter30Seconds).toBe(true);
  }));

  it('should dismiss prompt and save state', () => {
    const localStorageMock = {
      setItem: jest.fn()
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });

    component.showInstallPrompt = true;
    component.dismissPrompt();

    expect(component.showInstallPrompt).toBe(false);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('pwa-prompt-dismissed', expect.any(String));
  });

  it('should show prompt manually', () => {
    component.showInstallPrompt = false;
    component.showPrompt();
    expect(component.showInstallPrompt).toBe(true);
  });

  it('should dismiss update correctly', () => {
    component.updateAvailable = true;
    component.dismissUpdate();
    expect(component.updateAvailable).toBe(false);
  });

  it('should not show prompt if recently dismissed', fakeAsync(() => {
    const recentTime = Date.now() - 12 * 60 * 60 * 1000;
    const localStorageMock = {
      getItem: jest.fn().mockReturnValue(recentTime.toString()),
      setItem: jest.fn()
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });

    component.ngOnInit();
    tick(30000);

    expect(component.showInstallPrompt).toBe(false);
  }));

  it('should handle server-side rendering', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [PwaPromptComponent, NoopAnimationsModule],
      providers: [
        { provide: PwaService, useValue: mockPwaService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: PLATFORM_ID, useValue: 'server' }
      ]
    });

    const serverFixture = TestBed.createComponent(PwaPromptComponent);
    const serverComponent = serverFixture.componentInstance;

    serverComponent.ngOnInit();

    expect(serverComponent.isMobile).toBe(false);
    expect(serverComponent.showInstallPrompt).toBe(false);
  });

  it('should handle undefined localStorage gracefully', () => {
    Object.defineProperty(window, 'localStorage', {
      value: undefined,
      writable: true
    });

    expect(() => {
      component.dismissPrompt();
    }).not.toThrow();
  });

  it('should handle installation error', async () => {
    mockPwaService.installApp.mockRejectedValue(new Error('Installation failed'));

    await component.installApp();

    expect(mockPwaService.installApp).toHaveBeenCalled();
  });

  it('should handle update error', async () => {
    mockPwaService.updateApp.mockRejectedValue(new Error('Update failed'));

    await component.updateApp();

    expect(mockPwaService.updateApp).toHaveBeenCalled();
  });

  it('should use showPromptManually method', () => {
    component.showInstallPrompt = false;
    component.showPromptManually();
    expect(component.showInstallPrompt).toBe(true);
  });

  it('should detect mobile by screen width', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 500
    });

    component.ngOnInit();

    expect(component.isMobile).toBe(true);
  });

  it('should handle non-browser environment in detectMobileDevice', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [PwaPromptComponent, NoopAnimationsModule, MatSnackBarModule],
      providers: [
        { provide: PwaService, useValue: mockPwaService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: PLATFORM_ID, useValue: 'server' }
      ]
    });

    const serverFixture = TestBed.createComponent(PwaPromptComponent);
    const serverComponent = serverFixture.componentInstance;

    serverComponent.ngOnInit();

    expect(serverComponent.isMobile).toBe(false);
  });

  it('should not schedule FAB display when not mobile', fakeAsync(() => {
    component.isMobile = false;
    component.showFabAfter30Seconds = false;

    component.ngOnInit();

    tick(30000);

    expect(component.showFabAfter30Seconds).toBe(false);
  }));

  it('should show prompt if no dismissed time in localStorage', fakeAsync(() => {
    const localStorageMock = {
      getItem: jest.fn().mockReturnValue(null),
      setItem: jest.fn()
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });

    // Simular dispositivo móvil
    Object.defineProperty(window.navigator, 'userAgent', {
      writable: true,
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
    });
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 375
    });

    component.ngOnInit();
    tick(30000);

    expect(component.showInstallPrompt).toBe(true);
  }));

  it('should handle undefined window in detectMobileDevice', () => {
    const originalWindow = global.window;

    Object.defineProperty(global, 'window', {
      value: undefined,
      writable: true
    });

    const mockComponent = new PwaPromptComponent(mockPwaService, mockSnackBar, { toString: () => 'browser' });

    expect(() => {
      (mockComponent as unknown as { detectMobileDevice: () => void }).detectMobileDevice();
    }).not.toThrow();

    expect(mockComponent.isMobile).toBe(false);

    Object.defineProperty(global, 'window', {
      value: originalWindow,
      writable: true
    });
  });

  it('should not execute scheduleFabDisplay when not mobile', () => {
    const spy = jest.spyOn(global, 'setTimeout');
    component.isMobile = false;

    (component as unknown as { scheduleFabDisplay: () => void }).scheduleFabDisplay();

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should return early in scheduleFabDisplay when isMobile is false', () => {
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

    component.isMobile = false;
    component.showFabAfter30Seconds = false;

    (component as unknown as { scheduleFabDisplay: () => void }).scheduleFabDisplay();

    expect(setTimeoutSpy).not.toHaveBeenCalled();
    expect(component.showFabAfter30Seconds).toBe(false);

    setTimeoutSpy.mockRestore();
  });

  it('should execute setTimeout in scheduleFabDisplay when isMobile is true', () => {
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

    component.isMobile = true;
    component.showFabAfter30Seconds = false;

    (component as unknown as { scheduleFabDisplay: () => void }).scheduleFabDisplay();

    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 30000);

    setTimeoutSpy.mockRestore();
  });
});
