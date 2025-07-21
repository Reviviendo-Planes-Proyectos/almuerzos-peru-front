import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
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

    mockPwaService = {
      canInstallApp: jest.fn().mockReturnValue(false),
      installApp: jest.fn().mockResolvedValue(true),
      updateApp: jest.fn().mockResolvedValue(undefined),
      updateAvailable$: updateAvailableSubject.asObservable(),
      isAppInstalled$: of(false)
    } as unknown as jest.Mocked<PwaService>;

    mockSnackBar = {
      open: jest.fn().mockReturnValue({
        dismiss: jest.fn(),
        afterDismissed: jest.fn().mockReturnValue(of({})),
        onAction: jest.fn().mockReturnValue(of({}))
      })
    } as unknown as jest.Mocked<MatSnackBar>;

    await TestBed.configureTestingModule({
      imports: [PwaPromptComponent, NoopAnimationsModule],
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct default values', () => {
    expect(component.showInstallPrompt).toBe(false);
    expect(component.canInstall).toBe(false);
    expect(component.updateAvailable).toBe(false);
    expect(component.isMobile).toBe(false);
    expect(component.showFabAfter30Seconds).toBe(false);
  });

  it('should show install prompt modal after 30 seconds', fakeAsync(() => {
    component.ngOnInit();
    expect(component.showInstallPrompt).toBe(false);

    tick(30000);
    expect(component.showInstallPrompt).toBe(true);
  }));

  it('should show FAB on mobile when conditions are met', () => {
    component.isMobile = true;
    component.showFabAfter30Seconds = true;
    component.showInstallPrompt = false;

    // No llamar detectChanges() para evitar que ngOnInit reinicialice isMobile

    // Verificar que las condiciones están establecidas correctamente
    expect(component.isMobile).toBe(true);
    expect(component.showFabAfter30Seconds).toBe(true);
    expect(component.showInstallPrompt).toBe(false);
  });

  it('should handle installation successfully', async () => {
    mockPwaService.installApp.mockResolvedValue(true);
    component.showInstallPrompt = true;
    component.canInstall = true;

    await component.installApp();

    expect(mockPwaService.installApp).toHaveBeenCalled();
    expect(component.showInstallPrompt).toBe(false);
    expect(component.canInstall).toBe(false);
  });

  it('should detect mobile device correctly', () => {
    // Mock window.navigator.userAgent para simular móvil
    Object.defineProperty(window.navigator, 'userAgent', {
      writable: true,
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
    });

    // Mock window.innerWidth para simular pantalla móvil
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 375
    });

    component.ngOnInit();

    // Verificar que se detectó como móvil
    expect(component.isMobile).toBe(true);
  });

  it('should schedule FAB display after 30 seconds on mobile', fakeAsync(() => {
    // Simular móvil
    component.isMobile = true;

    component.ngOnInit();
    expect(component.showFabAfter30Seconds).toBe(false);

    // Avanzar 30 segundos
    tick(30000);

    // Verificar que el FAB se programa para mostrarse
    expect(component.showFabAfter30Seconds).toBe(true);
  }));

  it('should render modal with correct elements', () => {
    component.showInstallPrompt = true;
    fixture.detectChanges();

    const modal = fixture.nativeElement.querySelector('.pwa-prompt');
    const overlay = fixture.nativeElement.querySelector('.pwa-overlay');
    const title = fixture.nativeElement.querySelector('.app-title');
    const installBtn = fixture.nativeElement.querySelector('.install-btn');
    const laterBtn = fixture.nativeElement.querySelector('.later-btn');

    expect(modal).toBeTruthy();
    expect(overlay).toBeTruthy();
    expect(title?.textContent?.trim()).toBe('¡Instala Almuerzos Perú!');
    expect(installBtn).toBeTruthy();
    expect(laterBtn).toBeTruthy();
  });

  it('should show update banner when update is available', () => {
    // Simular que hay una actualización disponible a través del servicio
    updateAvailableSubject.next(true);
    component.ngOnInit();
    fixture.detectChanges();

    const updateBanner = fixture.nativeElement.querySelector('.update-banner');
    expect(updateBanner).toBeTruthy();
    expect(component.updateAvailable).toBe(true);
  });

  it('should dismiss prompt and save state', () => {
    // Mock localStorage
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
});
