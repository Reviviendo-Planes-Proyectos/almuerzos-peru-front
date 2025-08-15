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
  updateAvailable = false;
  isMobile = false;
  showFabAfter30Seconds = false;
  public isBrowser: boolean;
  private canInstallInterval?: ReturnType<typeof setInterval>;

  constructor(
    private readonly pwaService: PwaService,
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

    this.pwaService.updateAvailable$.subscribe((available) => {
      this.updateAvailable = available;
    });

    if (this.isBrowser) {
      window.addEventListener('pwa-install-available', () => {
        this.logger.info('PWA install event received');
        this.checkCanInstall();
      });

      window.addEventListener('pwa-installed', () => {
        this.logger.info('PWA installed event received');
        this.canInstall = false;
        this.showInstallPrompt = false;
      });
    }

    this.scheduleInstallPrompt();
    this.scheduleFabDisplay();

    setTimeout(() => {
      this.pwaService.logDebugInfo();
      this.logger.info('PWA Component state:', {
        canInstall: this.canInstall,
        showInstallPrompt: this.showInstallPrompt,
        isMobile: this.isMobile,
        isInstalled: this.pwaService.isInstalled()
      });
    }, 3000);
  }

  private checkCanInstall(): void {
    if (!this.isBrowser) {
      return;
    }

    const previousCanInstall = this.canInstall;

    if (this.pwaService.isInstalled()) {
      this.canInstall = false;
      this.showInstallPrompt = false;
      return;
    }

    this.canInstall = this.pwaService.canInstallApp();
    this.pwaService.checkInstallability();

    if (this.isIOSSafari() && !this.isAppInstalled()) {
      this.canInstall = true;
    }

    if (this.isAndroidChrome() && !this.pwaService.hasInstallPrompt()) {
      setTimeout(() => {
        this.canInstall = this.pwaService.canInstallApp();
      }, 2000);
    }

    if (previousCanInstall !== this.canInstall) {
      this.logger.info('PWA install capability changed:', {
        canInstall: this.canInstall,
        hasPrompt: this.pwaService.hasInstallPrompt(),
        isInstalled: this.pwaService.isInstalled(),
        isIOSSafari: this.isIOSSafari(),
        isAndroidChrome: this.isAndroidChrome()
      });
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

    const userAgent = window.navigator.userAgent.toLowerCase();
    const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone', 'mobile'];

    this.isMobile = mobileKeywords.some((keyword) => userAgent.includes(keyword)) || window.innerWidth <= 768;
  }

  private scheduleFabDisplay(): void {
    if (!this.isMobile) {
      return;
    }

    setTimeout(() => {
      this.showFabAfter30Seconds = true;
    }, 30000);
  }

  private scheduleInstallPrompt(): void {
    if (this.wasPromptRecentlyDismissed()) {
      return;
    }

    if (!this.isMobile) {
      return;
    }

    setTimeout(() => {
      if (!this.wasPromptRecentlyDismissed() && this.pwaService.canInstallApp()) {
        this.showInstallPrompt = true;
      }
    }, 45000);
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

    // No mostrar el prompt si fue rechazado en las últimas 24 horas
    return hoursSinceDismissed < 24;
  }

  showPrompt(): void {
    if (this.pwaService.canInstallApp()) {
      this.showInstallPrompt = true;
    }
  }

  dismissPrompt(): void {
    this.showInstallPrompt = false;
    // Guardar preferencia del usuario para no molestar por un tiempo
    if (this.isBrowser && typeof localStorage !== 'undefined') {
      localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
    }
  }

  // Método público para mostrar el prompt manualmente
  showPromptManually(): void {
    this.showInstallPrompt = true;
  }

  async installApp(): Promise<void> {
    try {
      if (this.isIOSSafari() && !this.pwaService.hasInstallPrompt()) {
        this.showIOSInstallInstructions();
        return;
      }

      if (!this.pwaService.canInstallApp()) {
        this.snackBar.open('La aplicación no se puede instalar en este momento', 'Cerrar', { duration: 3000 });
        return;
      }

      const installed = await this.pwaService.installApp();
      if (installed) {
        this.showInstallPrompt = false;
        this.canInstall = false;
        this.snackBar.open('¡App instalada exitosamente!', 'Cerrar', { duration: 3000 });
      } else {
        this.snackBar.open('Instalación cancelada por el usuario', 'Cerrar', { duration: 3000 });
      }
    } catch (error) {
      this.logger.error('Error al instalar la aplicación', error);
      this.snackBar.open('Error al instalar la aplicación', 'Cerrar', { duration: 3000 });
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

  private isAppInstalled(): boolean {
    return this.pwaService.isInstalled();
  }

  async updateApp(): Promise<void> {
    try {
      await this.pwaService.updateApp();
    } catch {
      this.snackBar.open('Error al actualizar la aplicación', 'Cerrar', {
        duration: 3000
      });
    }
  }

  dismissUpdate(): void {
    this.updateAvailable = false;
  }
}
