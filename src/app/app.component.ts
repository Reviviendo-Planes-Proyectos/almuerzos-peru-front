import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Injector, isDevMode, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MaterialModule, SharedComponentsModule } from './shared/modules';
import { ApiService } from './shared/services/api/api.service';
import { ImagePreloadService } from './shared/services/image-preload/image-preload.service';
import { LoggerService } from './shared/services/logger/logger.service';
import { PwaService } from './shared/services/pwa/pwa.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MaterialModule, SharedComponentsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  apiStatus: any;
  private scrollTimeout: ReturnType<typeof setTimeout> | null = null;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly apiService: ApiService,
    public readonly logger: LoggerService,
    private readonly pwaService: PwaService,
    private readonly imagePreloadService: ImagePreloadService,
    private readonly injector: Injector,
    @Inject(PLATFORM_ID) private platformId: string
  ) {}

  ngOnInit(): void {
    this.apiService.getHealth().subscribe({
      next: (data) => {
        this.apiStatus = data;
        this.logger.info('API status fetched successfully:', this.apiStatus);
      },
      error: (err) => {
        this.apiStatus = err;
        this.logger.error('Error fetching API status:', this.apiStatus);
      }
    });

    // Preload critical images
    if (isPlatformBrowser(this.platformId)) {
      this.imagePreloadService.preloadCriticalImages();
    }

    this.initCustomScrollIndicator();
    this.setupUpdateNotifications();
    this.setupReminderNotifications();
    this.exposeDebugMethods();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupUpdateNotifications(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.pwaService.updateAvailable$.pipe(takeUntil(this.destroy$)).subscribe((updateAvailable) => {
      if (updateAvailable) {
        this.showUpdateNotification();
      }
    });
  }

  private setupReminderNotifications(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.pwaService.showAppReminder$.pipe(takeUntil(this.destroy$)).subscribe((showReminder) => {
      if (showReminder) {
        this.showReminderNotification();
      }
    });
  }

  private showUpdateNotification(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      const snackBar = this.injector.get(MatSnackBar);
      const snackBarRef = snackBar.open('Nueva versión disponible. ¿Actualizar ahora?', 'Actualizar', {
        duration: 0,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['update-snackbar']
      });

      snackBarRef.onAction().subscribe(() => {
        this.pwaService
          .updateApp()
          .then(() => {
            this.logger.info('App updated successfully');
          })
          .catch((error) => {
            this.logger.error('Error updating app:', error);
          });
      });
    } catch (error) {
      this.logger.error('Error showing update notification:', error);
    }
  }

  private showReminderNotification(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // No mostrar recordatorio si la app ya está instalada
    if (this.pwaService.isInstalled()) {
      return;
    }

    try {
      const snackBar = this.injector.get(MatSnackBar);
      const snackBarRef = snackBar.open('¿Te gusta Almuerzos Perú? ¡Instálala!', 'Instalar', {
        duration: 10000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['reminder-snackbar']
      });

      snackBarRef.onAction().subscribe(() => {
        // Verificar nuevamente antes de mostrar el prompt
        if (!this.pwaService.isInstalled()) {
          this.pwaService.forceShowInstallPrompt();
        }
        this.pwaService.dismissAppReminder();
      });

      snackBarRef.afterDismissed().subscribe(() => {
        this.pwaService.dismissAppReminder();
      });
    } catch (error) {
      this.logger.error('Error showing reminder notification:', error);
    }
  }

  private exposeDebugMethods(): void {
    if (isDevMode() && isPlatformBrowser(this.platformId)) {
      (window as any).pwaDebug = {
        forceShowUpdate: () => this.pwaService.forceShowUpdateBanner(),
        forceShowReminder: () => this.pwaService.forceShowReminder(),
        forceShowInstallPrompt: () => this.pwaService.forceShowInstallPrompt(),
        simulateInstall: () => this.pwaService.simulateInstallation(),
        simulateUninstall: () => this.pwaService.simulateUninstallation(),
        clearData: () => this.pwaService.clearPwaData(),
        getAppStatus: () => ({
          isInstalled: this.pwaService.isInstalled(),
          canInstall: this.pwaService.canInstallApp(),
          updateAvailable: this.pwaService.updateAvailable$,
          installStatus: this.pwaService.getInstallStatus(),
          debugInfo: this.pwaService.getDebugInfo()
        }),
        help: () => {
          this.logger.info(`
🐛 PWA Debug Commands:
- pwaDebug.getAppStatus() - Ver estado actual
- pwaDebug.simulateInstall() - Simular instalación
- pwaDebug.simulateUninstall() - Simular desinstalación
- pwaDebug.clearData() - Limpiar datos localStorage
- pwaDebug.forceShowReminder() - Forzar recordatorio
- pwaDebug.forceShowInstallPrompt() - Forzar prompt instalación
- pwaDebug.forceShowUpdate() - Forzar banner actualización
- pwaDebug.help() - Mostrar esta ayuda
          `);
        }
      };
      this.logger.info('🐛 PWA Debug methods exposed: window.pwaDebug');
      this.logger.info('🐛 Type pwaDebug.help() for available commands');
    }
  }

  private initCustomScrollIndicator(): void {
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  private handleScroll(): void {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (scrollHeight > 0) {
      const viewportHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const indicatorHeight = Math.max((viewportHeight / documentHeight) * 100, 3);

      const scrollProgress = (scrollTop / scrollHeight) * (100 - indicatorHeight);

      document.documentElement.style.setProperty('--scroll-progress', `${indicatorHeight}%`);
      document.documentElement.style.setProperty('--scroll-position', `${scrollProgress}%`);
    }

    document.body.classList.add('scrolling');

    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    this.scrollTimeout = setTimeout(() => {
      document.body.classList.remove('scrolling');
    }, 1500);
  }
}
