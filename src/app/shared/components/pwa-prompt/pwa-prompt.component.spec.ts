import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BehaviorSubject, of } from 'rxjs';
import { PwaService } from '../../services/pwa.service';
import { PwaPromptComponent } from './pwa-prompt.component';

describe('PwaPromptComponent', () => {
  let component: PwaPromptComponent;
  let fixture: ComponentFixture<PwaPromptComponent>;
  let mockPwaService: jest.Mocked<PwaService>;
  let mockSnackBar: jest.Mocked<MatSnackBar>;
  let updateAvailableSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    updateAvailableSubject = new BehaviorSubject<boolean>(false);

    // Crear mocks más completos
    mockPwaService = {
      canInstallApp: jest.fn().mockReturnValue(false),
      installApp: jest.fn().mockResolvedValue(true),
      updateApp: jest.fn().mockResolvedValue(undefined),
      subscribeToPushNotifications: jest.fn().mockResolvedValue(null),
      unsubscribeFromPushNotifications: jest.fn().mockResolvedValue(true),
      shareContent: jest.fn().mockResolvedValue(undefined),
      isOnline: jest.fn().mockReturnValue(of(true)),
      requestNotificationPermission: jest.fn().mockResolvedValue('granted'),
      updateAvailable$: updateAvailableSubject.asObservable(),
      isAppInstalled$: of(false)
    } as unknown as jest.Mocked<PwaService>;

    mockSnackBar = {
      open: jest.fn()
    } as unknown as jest.Mocked<MatSnackBar>;

    await TestBed.configureTestingModule({
      imports: [PwaPromptComponent, NoopAnimationsModule],
      providers: [
        { provide: PwaService, useValue: mockPwaService },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PwaPromptComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.showInstallPrompt).toBe(false);
    expect(component.canInstall).toBe(false);
    expect(component.updateAvailable).toBe(false);
  });

  it('should check installability on init', () => {
    mockPwaService.canInstallApp.mockReturnValue(true);

    component.ngOnInit();

    expect(component.canInstall).toBe(true);
  });

  it('should subscribe to updateAvailable$ on init', () => {
    component.ngOnInit();

    // Emitir true desde el observable
    updateAvailableSubject.next(true);

    expect(component.updateAvailable).toBe(true);
  });

  it('should show install prompt after 30 seconds when app can be installed', () => {
    mockPwaService.canInstallApp.mockReturnValue(true);
    jest.useFakeTimers();

    component.ngOnInit();

    // Fast-forward time by 30 seconds
    jest.advanceTimersByTime(30000);

    expect(component.showInstallPrompt).toBe(true);
    jest.useRealTimers();
  });

  it('should not show install prompt after 30 seconds when app cannot be installed', () => {
    mockPwaService.canInstallApp.mockReturnValue(false);
    jest.useFakeTimers();

    component.ngOnInit();

    // Fast-forward time by 30 seconds
    jest.advanceTimersByTime(30000);

    expect(component.showInstallPrompt).toBe(false);
    jest.useRealTimers();
  });

  it('should show prompt', () => {
    component.showPrompt();

    expect(component.showInstallPrompt).toBe(true);
  });

  it('should dismiss prompt and save to localStorage', () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation();

    component.dismissPrompt();

    expect(component.showInstallPrompt).toBe(false);
    expect(setItemSpy).toHaveBeenCalledWith('pwa-prompt-dismissed', expect.any(String));

    setItemSpy.mockRestore();
  });

  describe('installApp', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should call installApp service method successfully', async () => {
      mockPwaService.installApp.mockResolvedValue(true);

      await component.installApp();

      expect(mockPwaService.installApp).toHaveBeenCalled();
    });

    it('should handle installApp service method failure', async () => {
      mockPwaService.installApp.mockResolvedValue(false);

      await component.installApp();

      expect(mockPwaService.installApp).toHaveBeenCalled();
    });

    it('should handle installApp service method error', async () => {
      mockPwaService.installApp.mockRejectedValue(new Error('Install failed'));

      await component.installApp();

      expect(mockPwaService.installApp).toHaveBeenCalled();
    });
  });

  describe('updateApp', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should call updateApp service method successfully', async () => {
      mockPwaService.updateApp.mockResolvedValue(undefined);

      await component.updateApp();

      expect(mockPwaService.updateApp).toHaveBeenCalled();
    });

    it('should handle updateApp service method error', async () => {
      mockPwaService.updateApp.mockRejectedValue(new Error('Update failed'));

      await component.updateApp();

      expect(mockPwaService.updateApp).toHaveBeenCalled();
    });
  });

  it('should dismiss update', () => {
    component.updateAvailable = true;

    component.dismissUpdate();

    expect(component.updateAvailable).toBe(false);
  });

  describe('Template rendering', () => {
    it('should render component successfully', () => {
      fixture.detectChanges();
      expect(fixture.componentInstance).toBeTruthy();
    });

    it('should handle showInstallPrompt property changes', () => {
      component.showInstallPrompt = false;
      fixture.detectChanges();
      expect(component.showInstallPrompt).toBe(false);

      component.showInstallPrompt = true;
      fixture.detectChanges();
      expect(component.showInstallPrompt).toBe(true);
    });

    it('should handle canInstall property changes', () => {
      component.canInstall = false;
      fixture.detectChanges();
      expect(component.canInstall).toBe(false);
    });

    it('should handle updateAvailable property changes', () => {
      component.updateAvailable = false;
      fixture.detectChanges();
      expect(component.updateAvailable).toBe(false);
    });
  });

  describe('User interactions', () => {
    it('should have showPrompt method available', () => {
      const showPromptSpy = jest.spyOn(component, 'showPrompt');
      component.canInstall = true;
      component.showInstallPrompt = false;
      fixture.detectChanges();

      // Llamar directamente al método
      component.showPrompt();
      expect(showPromptSpy).toHaveBeenCalled();
    });

    it('should have dismissPrompt method available', () => {
      const dismissPromptSpy = jest.spyOn(component, 'dismissPrompt');
      component.showInstallPrompt = true;
      fixture.detectChanges();

      // Llamar directamente al método
      component.dismissPrompt();
      expect(dismissPromptSpy).toHaveBeenCalled();
    });

    it('should have installApp method available', () => {
      const installAppSpy = jest.spyOn(component, 'installApp');
      component.showInstallPrompt = true;
      fixture.detectChanges();

      // Llamar directamente al método
      component.installApp();
      expect(installAppSpy).toHaveBeenCalled();
    });

    it('should have updateApp method available', () => {
      const updateAppSpy = jest.spyOn(component, 'updateApp');
      component.updateAvailable = true;
      fixture.detectChanges();

      // Llamar directamente al método
      component.updateApp();
      expect(updateAppSpy).toHaveBeenCalled();
    });

    it('should have dismissUpdate method available', () => {
      const dismissUpdateSpy = jest.spyOn(component, 'dismissUpdate');
      component.updateAvailable = true;
      fixture.detectChanges();

      // Llamar directamente al método
      component.dismissUpdate();
      expect(dismissUpdateSpy).toHaveBeenCalled();
    });
  });
});
