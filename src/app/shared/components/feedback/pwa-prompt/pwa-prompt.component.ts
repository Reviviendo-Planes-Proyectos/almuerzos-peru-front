import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { I18nService } from '../../../i18n/services/translation.service';
import { CoreModule, MaterialModule } from '../../../modules';
import { LoggerService } from '../../../services/logger/logger.service';
import { PwaService } from '../../../services/pwa/pwa.service';

@Component({
  selector: 'app-pwa-prompt',
  standalone: true,
  imports: [MaterialModule, CoreModule],
  templateUrl: './pwa-prompt.component.html',
  styleUrl: './pwa-prompt.component.scss'
})
export class PwaPromptComponent implements OnInit, OnDestroy {
  showInstallPrompt = false;
  canInstall = false;
  isMobile = false;
  showFabAfter30Seconds = false;
  public isBrowser: boolean;
  private canInstallInterval?: ReturnType<typeof setInterval>;

  constructor(
    public readonly pwaService: PwaService,
    private readonly snackBar: MatSnackBar,
    private readonly i18n: I18nService,
    private readonly logger: LoggerService,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  protected t = (key: string): string => {
    return this.i18n.t(key);
  };

  ngOnInit(): void {
    if (!this.isBrowser) {
      return;
    }

    this.detectMobileDevice();

    this.checkCanInstall();
    this.canInstallInterval = setInterval(() => {
      this.checkCanInstall();
    }, 5000);

    if (this.isBrowser) {
      window.addEventListener('pwa-install-available', () => {
        this.checkCanInstall();
      });

      window.addEventListener('pwa-installed', () => {
        this.canInstall = false;
        this.showInstallPrompt = false;
        this.checkCanInstall();
      });
    }

    this.scheduleInstallPrompt();
    this.scheduleFabDisplay();
  }

  private checkCanInstall(): void {
    if (!this.isBrowser) {
      return;
    }

    const isInstalled = this.pwaService.isInstalled();

    // Si la app está instalada, ocultar todo
    if (isInstalled) {
      this.canInstall = false;
      this.showInstallPrompt = false;
      return;
    }

    // Verificar si se puede instalar
    this.canInstall = this.pwaService.canInstallApp();

    // Para iOS Safari, permitir instalación manual
    if (this.isIOSSafari() && !isInstalled) {
      this.canInstall = true;
    }

    // Para Android Chrome, verificar con delay
    if (this.isAndroidChrome() && !this.pwaService.hasInstallPrompt() && !isInstalled) {
      const isDevelopment = window.location.hostname === 'localhost';
      const delay = isDevelopment ? 1000 : 3000;

      setTimeout(() => {
        if (!this.pwaService.isInstalled()) {
          this.canInstall = this.pwaService.canInstallApp();
        }
      }, delay);
    }
  }

  private isAndroidChrome(): boolean {
    if (!this.isBrowser) return false;

    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.includes('android') && userAgent.includes('chrome') && !userAgent.includes('edg');
  }

  ngOnDestroy(): void {
    if (this.canInstallInterval) {
      clearInterval(this.canInstallInterval);
    }
  }

  private detectMobileDevice(): void {
    if (!this.isBrowser || typeof window === 'undefined') {
      return;
    }

    this.isMobile = this.isMobileUserAgent() || window.innerWidth <= 768;
  }

  private isMobileUserAgent(): boolean {
    if (!this.isBrowser) return false;

    const userAgent = window.navigator.userAgent.toLowerCase();
    const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone', 'mobile'];

    return mobileKeywords.some((keyword) => userAgent.includes(keyword));
  }

  private scheduleFabDisplay(): void {
    if (!this.isMobile) {
      return;
    }

    const isDevelopment = window.location.hostname === 'localhost';
    const delay = isDevelopment ? 8000 : 30000; // 8 segundos en desarrollo, 30 en producción

    setTimeout(() => {
      this.showFabAfter30Seconds = true;
    }, delay);
  }

  private scheduleInstallPrompt(): void {
    // No programar prompt si ya está instalada o no es móvil
    if (this.pwaService.isInstalled() || !this.isMobile) {
      return;
    }

    if (this.wasPromptRecentlyDismissed()) {
      return;
    }

    const isDevelopment = window.location.hostname === 'localhost';
    const delay = isDevelopment ? 5000 : 20000;

    setTimeout(() => {
      // Verificar nuevamente antes de mostrar
      if (!this.wasPromptRecentlyDismissed() && this.pwaService.canInstallApp() && !this.pwaService.isInstalled()) {
        this.showInstallPrompt = true;
      }
    }, delay);
  }

  private wasPromptRecentlyDismissed(): boolean {
    if (!this.isBrowser || typeof localStorage === 'undefined') {
      return false;
    }

    const dismissedTime = localStorage.getItem('pwa-prompt-dismissed');
    if (!dismissedTime) {
      return false;
    }

    const now = Date.now();
    const timeDiff = now - parseInt(dismissedTime, 10);
    const hoursSinceDismissed = timeDiff / (1000 * 60 * 60);

    return hoursSinceDismissed < 24;
  }

  showPrompt(): void {
    // Solo mostrar si no está instalada y se puede instalar
    if (!this.pwaService.isInstalled() && this.pwaService.canInstallApp()) {
      this.showInstallPrompt = true;
    }
  }

  dismissPrompt(): void {
    this.showInstallPrompt = false;
    if (this.isBrowser && typeof localStorage !== 'undefined') {
      localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
    }
  }

  showPromptManually(): void {
    // Solo mostrar si no está instalada
    if (!this.pwaService.isInstalled()) {
      this.showInstallPrompt = true;
    } else {
      this.showAlreadyInstalledMessage();
    }
  }

  private showAlreadyInstalledMessage(): void {
    this.logger.info('App is already installed - showing reminder message');

    const isDevelopment = window.location.hostname === 'localhost';
    const message = isDevelopment
      ? '¡La aplicación ya está instalada! Puedes usar pwaDebug.simulateUninstall() para simular la desinstalación.'
      : '¡La aplicación ya está instalada! Búscala en tu pantalla de inicio o en el menú de aplicaciones.';

    const actionText = isDevelopment ? 'Debug' : 'Entendido';

    const snackBarRef = this.snackBar.open(message, actionText, {
      duration: isDevelopment ? 8000 : 5000,
      panelClass: ['app-installed-snackbar']
    });

    if (isDevelopment) {
      snackBarRef.onAction().subscribe(() => {
        // Debug hint for development - use pwaDebug.simulateUninstall()
      });
    }
  }

  public checkInstallStatusAndNotify(): void {
    if (this.pwaService.isInstalled()) {
      this.showAlreadyInstalledMessage();
    } else if (this.pwaService.canInstallApp()) {
      this.showPromptManually();
    } else {
      this.snackBar.open('La aplicación no se puede instalar en este momento desde este navegador.', 'Cerrar', {
        duration: 3000
      });
    }
  }

  async installApp(): Promise<void> {
    try {
      // Verificar primero si la app ya está instalada
      if (this.pwaService.isInstalled()) {
        this.showAlreadyInstalledMessage();
        this.hideInstallUI();
        return;
      }

      // Para iOS Safari sin prompt nativo
      if (this.isIOSSafari() && !this.pwaService.hasInstallPrompt()) {
        this.showIOSInstallInstructions();
        return;
      }

      const installStatus = this.pwaService.getInstallStatus();

      if (!installStatus.canInstall) {
        if (installStatus.reason?.includes('Already installed')) {
          this.showAlreadyInstalledMessage();
          this.hideInstallUI();
          return;
        }

        this.snackBar.open(installStatus.reason || 'La aplicación no se puede instalar en este momento', 'Cerrar', {
          duration: 3000
        });
        return;
      }

      if (!installStatus.hasPrompt) {
        this.snackBar.open(
          'El prompt de instalación no está disponible. Intenta desde el menú del navegador (⋮ → Instalar aplicación)',
          'Cerrar',
          { duration: 5000 }
        );
        return;
      }

      // Intentar instalación
      const result = await this.pwaService.installApp();

      if (result.success) {
        this.hideInstallUI();
        this.snackBar.open('¡App instalada exitosamente!', 'Cerrar', { duration: 3000 });
      } else {
        this.handleInstallError(result.reason);
      }
    } catch (error) {
      this.logger.error('Error al instalar la aplicación', error);
      this.snackBar.open('Error al instalar la aplicación', 'Cerrar', { duration: 3000 });
    }
  }

  private hideInstallUI(): void {
    this.canInstall = false;
    this.showInstallPrompt = false;
  }

  private handleInstallError(reason?: string): void {
    switch (reason) {
      case 'ALREADY_INSTALLED':
        this.showAlreadyInstalledMessage();
        this.hideInstallUI();
        break;
      case 'USER_DISMISSED':
        this.snackBar.open('Instalación cancelada por el usuario', 'Cerrar', { duration: 3000 });
        break;
      case 'NO_PROMPT':
        this.snackBar.open('Prompt de instalación no disponible', 'Cerrar', { duration: 3000 });
        break;
      case 'NOT_MOBILE':
        this.snackBar.open('La instalación solo está disponible en dispositivos móviles', 'Cerrar', { duration: 3000 });
        break;
      case 'ERROR':
        this.snackBar.open('Error durante la instalación', 'Cerrar', { duration: 3000 });
        break;
      default:
        this.snackBar.open('No se pudo completar la instalación', 'Cerrar', { duration: 3000 });
    }
  }

  private showIOSInstallInstructions(): void {
    const message =
      'Para instalar la app en iOS: toca el botón "Compartir" en Safari y selecciona "Añadir a la pantalla de inicio"';
    this.snackBar.open(message, 'Entendido', {
      duration: 8000,
      panelClass: ['ios-install-snackbar']
    });
    this.dismissPrompt();
  }

  private isIOSSafari(): boolean {
    if (!this.isBrowser) return false;

    const userAgent = navigator.userAgent.toLowerCase();
    return (
      userAgent.includes('safari') &&
      userAgent.includes('mobile') &&
      !userAgent.includes('chrome') &&
      !userAgent.includes('crios') &&
      !userAgent.includes('fxios')
    );
  }
}
