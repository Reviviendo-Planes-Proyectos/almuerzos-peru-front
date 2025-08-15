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
      window.dispatchEvent(new CustomEvent('pwa-install-available'));
    });

    window.addEventListener('appinstalled', () => {
      this.isAppInstalled.next(true);
      this.showAppReminder.next(false);
      this.promptEvent = null;
      window.dispatchEvent(new CustomEvent('pwa-installed'));
    });
  }

  private checkIfAppIsInstalled(): void {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = navigator.standalone === true;
    const isInWebView = this.isInWebView();
    const hasStandaloneParam = window.location.search.includes('standalone=true');
    const isDevelopment = this.isLocalDevelopment();

    // En desarrollo, verificar localStorage para persistir el estado
    let isInstalledInDev = false;
    if (isDevelopment && typeof localStorage !== 'undefined') {
      isInstalledInDev = localStorage.getItem('pwa-dev-installed') === 'true';
    }

    // Lógica unificada para detectar instalación
    const isInstalled = isStandalone || isIOSStandalone || isInWebView || hasStandaloneParam || isInstalledInDev;

    // Solo actualizar si hay cambio de estado
    if (this.isAppInstalled.value !== isInstalled) {
      this.isAppInstalled.next(isInstalled);

      if (isInstalled) {
        this.showAppReminder.next(false);
      } else {
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
      return;
    }

    const isDevelopment = this.isLocalDevelopment();

    // Verificar si ya se mostró un recordatorio recientemente
    const lastReminderTime = localStorage.getItem('pwa-reminder-shown');
    if (lastReminderTime) {
      const timeSinceLastReminder = Date.now() - parseInt(lastReminderTime, 10);
      const cooldownTime = isDevelopment ? 5000 : 24 * 60 * 60 * 1000; // 5 seg dev, 24h prod

      if (timeSinceLastReminder < cooldownTime) {
        return;
      }
    }

    // En desarrollo, mostrar más rápido
    if (isDevelopment) {
      setTimeout(() => {
        if (!this.isAppInstalled.value) {
          this.showAppReminder.next(true);
        }
      }, 3000);
      return;
    }

    // En producción, solo mostrar en móviles después de varias visitas
    if (!this.isMobileDevice()) {
      return;
    }

    const visitCount = parseInt(localStorage.getItem('pwa-visit-count') || '0', 10) + 1;
    localStorage.setItem('pwa-visit-count', visitCount.toString());

    if (visitCount >= 2 && this.canInstallApp()) {
      setTimeout(() => {
        if (!this.isAppInstalled.value && this.isMobileDevice()) {
          this.showAppReminder.next(true);
        }
      }, 15000);
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
      localStorage.removeItem('pwa-dev-installed');

      // Reinicializar estado
      this.isAppInstalled.next(false);
      this.showAppReminder.next(false);
      this.checkIfAppIsInstalled();
    }
  }

  public simulateInstallation(): void {
    if (this.isBrowser && typeof localStorage !== 'undefined') {
      localStorage.setItem('pwa-dev-installed', 'true');
      this.isAppInstalled.next(true);
      this.showAppReminder.next(false);
      this.promptEvent = null;
      window.dispatchEvent(new CustomEvent('pwa-installed'));
    }
  }

  public simulateUninstallation(): void {
    if (this.isBrowser && typeof localStorage !== 'undefined') {
      localStorage.removeItem('pwa-dev-installed');
      this.isAppInstalled.next(false);
      this.checkIfAppIsInstalled();
    }
  }

  public forceShowReminder(): void {
    if (this.isLocalDevelopment()) {
      this.logger.info('🐛 DEBUG: Forcing reminder banner to show');
      this.showAppReminder.next(true);
    }
  }

  public forceShowInstallPrompt(): void {
    if (this.isLocalDevelopment()) {
      this.logger.info('🐛 DEBUG: Forcing install prompt to show');
      this.isAppInstalled.next(false);
    }
  }

  public forceShowUpdateBanner(): void {
    if (this.isLocalDevelopment()) {
      this.logger.info('🐛 DEBUG: Forcing update banner to show');
      this.updateAvailable.next(true);
    }
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

    // En desarrollo, permitir instalación
    if (isLocalDev) {
      if (typeof localStorage !== 'undefined') {
        const isInstalledInDev = localStorage.getItem('pwa-dev-installed') === 'true';
        if (isInstalledInDev) {
          return false;
        }
      }
      return true;
    }

    // En producción, verificar si es móvil y tiene los requisitos
    if (!this.isMobileDevice()) {
      return false;
    }

    if (this.promptEvent) {
      return true;
    }

    if (this.isIOSSafari()) {
      return !navigator.standalone && this.hasServiceWorker();
    }

    return this.hasServiceWorker() && this.hasValidManifest();
  }

  public async installApp(): Promise<{ success: boolean; reason?: string }> {
    if (!this.isBrowser) {
      return { success: false, reason: 'NOT_BROWSER' };
    }

    // Verificar si ya está instalada
    if (this.isAppInstalled.value) {
      return { success: false, reason: 'ALREADY_INSTALLED' };
    }

    const isLocalDev = this.isLocalDevelopment();

    // En desarrollo, simular instalación
    if (isLocalDev) {
      // Marcar como instalada en localStorage para desarrollo
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('pwa-dev-installed', 'true');
      }

      this.isAppInstalled.next(true);
      this.showAppReminder.next(false);
      this.promptEvent = null;

      // Disparar evento de instalación
      window.dispatchEvent(new CustomEvent('pwa-installed'));

      return { success: true };
    }

    // En producción, verificar si es móvil
    if (!this.isMobileDevice()) {
      return { success: false, reason: 'NOT_MOBILE' };
    }

    if (!this.promptEvent) {
      return { success: false, reason: 'NO_PROMPT' };
    }

    try {
      await this.promptEvent.prompt();
      const result = await this.promptEvent.userChoice;

      if (result.outcome === 'accepted') {
        this.isAppInstalled.next(true);
        this.showAppReminder.next(false);
        this.promptEvent = null;
        return { success: true };
      }
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

    // En desarrollo, verificar localStorage
    if (isLocalDev && typeof localStorage !== 'undefined') {
      const isInstalledInDev = localStorage.getItem('pwa-dev-installed') === 'true';
      if (isInstalledInDev) {
        return { canInstall: false, hasPrompt: false, reason: 'Already installed in development' };
      }
    }

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

    if (this.shouldSimulatePrompt()) {
      this.simulateInstallPrompt();
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

  private isMobileDevice(): boolean {
    if (!this.isBrowser) return false;

    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone', 'mobile'];

    return (
      mobileKeywords.some((keyword) => userAgent.includes(keyword)) ||
      window.innerWidth <= 768 ||
      'ontouchstart' in window
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
      // Simulamos un prompt más realista que permite tanto aceptar como rechazar
      this.promptEvent = {
        prompt: async () => {
          return Promise.resolve();
        },
        userChoice: new Promise((resolve) => {
          // Simulamos una decisión del usuario después de un breve delay
          setTimeout(() => {
            // En desarrollo, simulamos que el usuario acepta la instalación
            const outcome = Math.random() > 0.2 ? 'accepted' : 'dismissed'; // 80% probabilidad de aceptar
            resolve({ outcome: outcome as 'accepted' | 'dismissed' });
          }, 500);
        })
      } as BeforeInstallPromptEvent;

      // Notificamos que el prompt está disponible
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('pwa-install-available'));
      }, 100);
    }
  }
}
