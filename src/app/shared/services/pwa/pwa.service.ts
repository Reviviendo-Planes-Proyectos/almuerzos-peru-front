import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { BehaviorSubject } from 'rxjs';
import { LoggerService } from '../logger/logger.service';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

declare global {
  interface Navigator {
    standalone?: boolean;
  }
}

@Injectable({ providedIn: 'root' })
export class PwaService {
  private promptEvent: BeforeInstallPromptEvent | null = null;
  private readonly updateAvailable = new BehaviorSubject<boolean>(false);
  private readonly isAppInstalled = new BehaviorSubject<boolean>(false);
  private readonly showAppReminder = new BehaviorSubject<boolean>(false);
  private readonly isBrowser: boolean;

  public readonly updateAvailable$ = this.updateAvailable.asObservable();
  public readonly isAppInstalled$ = this.isAppInstalled.asObservable();
  public readonly showAppReminder$ = this.showAppReminder.asObservable();

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private readonly swUpdate: SwUpdate,
    public readonly logger: LoggerService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.initPwa();
  }

  private initPwa(): void {
    if (!this.isBrowser) {
      return;
    }

    if (!this.isSecureContext()) {
      this.logger.warn('PWA requires HTTPS to work properly');
      return;
    }

    this.checkForUpdates();
    this.captureInstallPrompt();
    this.checkIfAppIsInstalled();

    setTimeout(() => {
      this.checkInstallability();
      this.logDebugInfo();
    }, 2000);
  }

  private checkForUpdates(): void {
    if (!this.swUpdate.isEnabled) return;

    this.swUpdate.versionUpdates.subscribe((event) => {
      if (event.type === 'VERSION_READY') {
        this.updateAvailable.next(true);
        this.logger.info('New app version is available');
      }
    });

    setInterval(
      () => {
        if (!document.hidden) {
          this.swUpdate.checkForUpdate().catch(() => {
            this.logger.warn('Failed to check for updates');
          });
        }
      },
      30 * 60 * 1000
    );
  }

  private captureInstallPrompt(): void {
    window.addEventListener('beforeinstallprompt', (event: Event) => {
      event.preventDefault();
      this.promptEvent = event as BeforeInstallPromptEvent;
      this.logger.info('Install prompt captured - PWA can be installed');
      window.dispatchEvent(new CustomEvent('pwa-install-available'));
    });

    window.addEventListener('appinstalled', () => {
      this.isAppInstalled.next(true);
      this.promptEvent = null;
      this.logger.info('App was installed successfully');

      window.dispatchEvent(new CustomEvent('pwa-installed'));
    });
  }

  private checkIfAppIsInstalled(): void {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = navigator.standalone === true;
    const isInWebView = this.isInWebView();
    const hasStandaloneParam = window.location.search.includes('standalone=true');
    const isDevelopment = this.isLocalDevelopment();

    this.logger.info('Checking if app is installed:', {
      isStandalone,
      isIOSStandalone,
      isInWebView,
      hasStandaloneParam,
      isDevelopment,
      hostname: window.location.hostname
    });

    // Lógica normal para todos los entornos
    const isInstalled = isStandalone || isIOSStandalone || isInWebView || hasStandaloneParam;

    if (isInstalled) {
      this.isAppInstalled.next(true);
      this.logger.info('App is running in standalone mode or installed');
    } else {
      this.isAppInstalled.next(false);
      this.logger.info('App is running in browser mode');

      // Solo programar recordatorio si no está instalada y no es localhost
      if (!isDevelopment || window.location.hostname !== 'localhost') {
        this.scheduleAppReminder();
      }
    }
  }

  private scheduleAppReminder(): void {
    if (!this.isBrowser || typeof localStorage === 'undefined') {
      return;
    }

    // No mostrar recordatorio si la app ya está instalada
    if (this.isAppInstalled.value) {
      this.logger.info('App is installed - not scheduling reminder');
      return;
    }

    // Verificar si ya se mostró un recordatorio recientemente
    const lastReminderTime = localStorage.getItem('pwa-reminder-shown');
    if (lastReminderTime) {
      const timeSinceLastReminder = Date.now() - parseInt(lastReminderTime, 10);
      const secondsSinceLastReminder = timeSinceLastReminder / 1000;

      // Solo mostrar recordatorio si han pasado más de 10 segundos (para testing rápido)
      if (secondsSinceLastReminder < 10) {
        return;
      }
    }

    // Verificar si el usuario ha visitado varias veces
    const visitCount = parseInt(localStorage.getItem('pwa-visit-count') || '0', 10) + 1;
    localStorage.setItem('pwa-visit-count', visitCount.toString());

    // Mostrar recordatorio después de 1 visita (para testing rápido)
    if (visitCount >= 1 && this.canInstallApp()) {
      setTimeout(() => {
        // Verificar nuevamente si la app no está instalada antes de mostrar
        if (!this.isAppInstalled.value) {
          this.showAppReminder.next(true);
          this.logger.info('Showing app installation reminder');
        }
      }, 8000); // 8 segundos - balance entre inmediatez y paciencia
    }
  }

  public dismissAppReminder(): void {
    this.showAppReminder.next(false);
    if (this.isBrowser && typeof localStorage !== 'undefined') {
      localStorage.setItem('pwa-reminder-shown', Date.now().toString());
    }
  }

  public shouldShowReminder(): boolean {
    return this.showAppReminder.value;
  }

  public clearPwaData(): void {
    if (this.isBrowser && typeof localStorage !== 'undefined') {
      localStorage.removeItem('pwa-prompt-dismissed');
      localStorage.removeItem('pwa-reminder-shown');
      localStorage.removeItem('pwa-visit-count');
      this.logger.info('PWA localStorage data cleared for testing');
    }
  }

  public forceShowReminder(): void {
    this.logger.info('🐛 DEBUG: Forcing reminder banner to show');
    this.showAppReminder.next(true);
  }

  public forceShowInstallPrompt(): void {
    this.logger.info('🐛 DEBUG: Forcing install prompt to show');
    // Simular que no está instalada y que puede instalarse
    this.isAppInstalled.next(false);
  }

  public forceShowUpdateBanner(): void {
    this.logger.info('🐛 DEBUG: Forcing update banner to show');
    this.updateAvailable.next(true);
  }

  public canInstallApp(): boolean {
    if (!this.isBrowser) {
      return false;
    }

    // Si la app ya está instalada, no se puede instalar
    if (this.isAppInstalled.value) {
      return false;
    }

    const isLocalDev = this.isLocalDevelopment();

    // En localhost permitimos instalar para testing solo si no está ya instalada
    if (isLocalDev && window.location.hostname === 'localhost') {
      return !this.isAppInstalled.value; // Solo si no está instalada
    }

    if (this.promptEvent) {
      return true;
    }

    if (this.isIOSSafari()) {
      return !navigator.standalone && this.hasServiceWorker();
    }

    const canInstallManually = this.hasServiceWorker() && this.hasValidManifest();

    this.logger.info('canInstallApp check:', {
      hasPrompt: !!this.promptEvent,
      isInstalled: this.isAppInstalled.value,
      isIOSSafari: this.isIOSSafari(),
      hasServiceWorker: this.hasServiceWorker(),
      hasValidManifest: this.hasValidManifest(),
      canInstallManually,
      isLocalDev,
      hostname: window.location.hostname,
      isBrowser: this.isBrowser
    });

    return canInstallManually;
  }

  public async installApp(): Promise<{ success: boolean; reason?: string }> {
    if (!this.promptEvent) {
      this.logger.warn('No install prompt available');
      return { success: false, reason: 'NO_PROMPT' };
    }

    try {
      this.logger.info('Showing install prompt');
      await this.promptEvent.prompt();
      const result = await this.promptEvent.userChoice;

      this.logger.info('Install prompt result:', result.outcome);

      if (result.outcome === 'accepted') {
        this.isAppInstalled.next(true);
        this.logger.info('PWA installation accepted by user');
        this.promptEvent = null;
        return { success: true };
      }
      this.logger.info('PWA installation dismissed by user');
      this.promptEvent = null;
      return { success: false, reason: 'USER_DISMISSED' };
    } catch (error) {
      this.logger.warn('PWA installation failed', error);
      this.promptEvent = null;
      return { success: false, reason: 'ERROR' };
    }
  }

  public async updateApp(): Promise<void> {
    if (this.swUpdate.isEnabled && this.updateAvailable.value) {
      try {
        await this.swUpdate.activateUpdate();
        window.location.reload();
      } catch {
        this.logger.warn('App update failed');
      }
    }
  }

  public isInstalled(): boolean {
    return this.isAppInstalled.value;
  }

  public hasInstallPrompt(): boolean {
    return !!this.promptEvent;
  }

  public getInstallStatus(): { canInstall: boolean; hasPrompt: boolean; reason?: string } {
    if (!this.isBrowser) {
      return { canInstall: false, hasPrompt: false, reason: 'Not in browser' };
    }

    // Si la app ya está instalada, no se puede instalar
    if (this.isAppInstalled.value) {
      return { canInstall: false, hasPrompt: false, reason: 'Already installed' };
    }

    const isLocalDev = this.isLocalDevelopment();
    const hasPrompt = !!this.promptEvent;

    if (hasPrompt) {
      return { canInstall: true, hasPrompt: true };
    }

    if (this.isIOSSafari()) {
      return { canInstall: true, hasPrompt: false, reason: 'iOS Safari - manual installation' };
    }

    if (isLocalDev) {
      // En modo desarrollo, simulamos que tenemos un prompt disponible
      if (!this.promptEvent) {
        this.simulateInstallPrompt();
      }
      return { canInstall: true, hasPrompt: true, reason: 'Development mode simulation' };
    }

    const canInstallManually = this.hasServiceWorker() && this.hasValidManifest();
    return {
      canInstall: canInstallManually,
      hasPrompt: false,
      reason: canInstallManually ? 'Manual installation available' : 'Not installable'
    };
  }

  public getDebugInfo(): any {
    return {
      isBrowser: this.isBrowser,
      isSecureContext: this.isSecureContext(),
      hasPromptEvent: !!this.promptEvent,
      isAppInstalled: this.isAppInstalled.value,
      canInstallApp: this.canInstallApp(),
      isIOSSafari: this.isIOSSafari(),
      isInWebView: this.isInWebView(),
      hasServiceWorker: this.hasServiceWorker(),
      hasValidManifest: this.hasValidManifest(),
      userAgent: this.isBrowser ? navigator.userAgent : 'N/A',
      displayMode: this.isBrowser ? window.matchMedia('(display-mode: standalone)').matches : false,
      navigatorStandalone: this.isBrowser ? navigator.standalone : false,
      swUpdateEnabled: this.swUpdate.isEnabled,
      url: this.isBrowser ? window.location.href : 'N/A',
      referrer: this.isBrowser ? document.referrer : 'N/A'
    };
  }

  public logDebugInfo(): void {
    this.logger.info('PWA Debug Info:', this.getDebugInfo());
  }

  public checkInstallability(): void {
    if (!this.isBrowser) {
      return;
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) => {
          this.logger.info(`Found ${registrations.length} service worker registrations`);
        })
        .catch(() => {
          this.logger.warn('Failed to get service worker registrations');
        });
    }

    if (this.shouldSimulatePrompt()) {
      this.simulateInstallPrompt();
    }

    if (this.isIOSSafari() && !navigator.standalone) {
      this.logger.info('iOS Safari detected - manual installation instructions available');
    }
  }

  private isLocalDevelopment(): boolean {
    return (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.port === '4200'
    );
  }

  private shouldSimulatePrompt(): boolean {
    const isDevelopment = this.isLocalDevelopment();

    this.logger.info('shouldSimulatePrompt check:', {
      isDevelopment,
      hostname: window.location.hostname,
      protocol: window.location.protocol,
      port: window.location.port,
      hasPromptEvent: !!this.promptEvent
    });

    return isDevelopment;
  }

  private isSecureContext(): boolean {
    return (
      window.isSecureContext ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.protocol === 'file:'
    );
  }

  private isInWebView(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.includes('wv') || (userAgent.includes('version') && userAgent.includes('mobile'));
  }

  private isIOSSafari(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    return (
      userAgent.includes('safari') &&
      userAgent.includes('mobile') &&
      !userAgent.includes('chrome') &&
      !userAgent.includes('crios') &&
      !userAgent.includes('fxios')
    );
  }

  private hasServiceWorker(): boolean {
    return 'serviceWorker' in navigator;
  }

  private hasValidManifest(): boolean {
    const manifestLink = document.querySelector('link[rel="manifest"]');
    return !!manifestLink;
  }

  private simulateInstallPrompt(): void {
    if (this.shouldSimulatePrompt() && !this.promptEvent) {
      this.logger.info('Simulating install prompt for development');

      // Simulamos un prompt más realista que permite tanto aceptar como rechazar
      this.promptEvent = {
        prompt: async () => {
          this.logger.info('Simulated prompt shown');
          return Promise.resolve();
        },
        userChoice: new Promise((resolve) => {
          // Simulamos una decisión del usuario después de un breve delay
          setTimeout(() => {
            // En desarrollo, simulamos que el usuario acepta la instalación
            const outcome = Math.random() > 0.2 ? 'accepted' : 'dismissed'; // 80% probabilidad de aceptar
            this.logger.info(`Simulated user choice: ${outcome}`);
            resolve({ outcome: outcome as 'accepted' | 'dismissed' });
          }, 500);
        })
      } as BeforeInstallPromptEvent;

      // Notificamos que el prompt está disponible
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('pwa-install-available'));
        this.logger.info('Simulated install prompt event dispatched');
      }, 100);
    }
  }
}
