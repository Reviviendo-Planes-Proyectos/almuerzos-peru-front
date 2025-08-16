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

    // Validar lógica de recordatorios inmediatamente
    setTimeout(() => this.validateReminderLogic(), 1000);

    // Verificar periódicamente el estado de instalación (especialmente útil en móviles)
    const checkInterval = this.isLocalDevelopment() ? 5000 : 30000;
    setInterval(() => {
      this.checkIfAppIsInstalled();
      this.validateReminderLogic(); // Validar en cada intervalo
    }, checkInterval);

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
    // Múltiples métodos de detección para mejor cobertura
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = navigator.standalone === true;
    const isInWebView = this.isInWebView();
    const hasStandaloneParam = window.location.search.includes('standalone=true');
    const isDevelopment = this.isLocalDevelopment();

    // Detección adicional para Android Chrome
    const isAndroidChrome = this.isAndroidChrome();
    const hasMinimalUI = window.matchMedia('(display-mode: minimal-ui)').matches;

    // Verificar si está en fullscreen (indicativo de PWA en algunos dispositivos)
    const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;

    // Verificar user-agent para detectar WebAPK (Android)
    const isWebAPK = navigator.userAgent.includes('wv') && isAndroidChrome;

    // En desarrollo, verificar localStorage para persistir el estado
    let isInstalledInDev = false;
    if (isDevelopment && typeof localStorage !== 'undefined') {
      isInstalledInDev = localStorage.getItem('pwa-dev-installed') === 'true';
    }

    // LÓGICA MEJORADA: Ser más estricto con la detección
    // En desarrollo, solo confiar en localStorage
    let isInstalled = false;

    if (isDevelopment) {
      isInstalled = isInstalledInDev;
    } else {
      // En producción, usar detección más conservadora
      isInstalled = isStandalone || isIOSStandalone || isFullscreen || (hasMinimalUI && !isInWebView);

      // Excluir WebViews a menos que sean claramente PWA instaladas
      if (isInWebView && !isStandalone && !isFullscreen) {
        isInstalled = false;
      }
    }

    // Solo actualizar si hay cambio de estado
    if (this.isAppInstalled.value !== isInstalled) {
      this.isAppInstalled.next(isInstalled);

      if (isDevelopment) {
        this.logger.info(`PWA Installation status changed to: ${isInstalled}`);
        this.logger.info('Detection details:', {
          isStandalone,
          isIOSStandalone,
          isInWebView,
          hasStandaloneParam,
          isInstalledInDev,
          hasMinimalUI,
          isFullscreen,
          isWebAPK
        });
      }

      // Manejar recordatorios basado en estado de instalación
      if (isInstalled) {
        this.showAppReminder.next(false);
      } else {
        // Solo programar recordatorio si es móvil
        if (this.isMobileDevice()) {
          this.scheduleAppReminder();
        }
      }
    }
  }

  private scheduleAppReminder(): void {
    if (!this.isBrowser || typeof localStorage === 'undefined') {
      return;
    }

    // REGLA 1: No mostrar recordatorio si la app ya está instalada
    if (this.isAppInstalled.value) {
      this.showAppReminder.next(false);
      return;
    }

    // REGLA 2: Solo mostrar en dispositivos móviles
    if (!this.isMobileDevice()) {
      this.showAppReminder.next(false);
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

    // En desarrollo, mostrar más rápido SOLO SI ES MÓVIL Y NO ESTÁ INSTALADO
    if (isDevelopment) {
      setTimeout(() => {
        if (!this.isAppInstalled.value && this.isMobileDevice()) {
          this.showAppReminder.next(true);
          this.logger.info('PWA reminder shown in development mode');
        }
      }, 3000);
      return;
    }

    // En producción, solo mostrar en móviles después de varias visitas
    const visitCount = parseInt(localStorage.getItem('pwa-visit-count') || '0', 10) + 1;
    localStorage.setItem('pwa-visit-count', visitCount.toString());

    // REGLA 3: Solo después de múltiples visitas Y si puede instalarse
    if (visitCount >= 2 && this.canInstallApp()) {
      setTimeout(() => {
        // TRIPLE VERIFICACIÓN: móvil + no instalado + puede instalar
        if (!this.isAppInstalled.value && this.isMobileDevice() && this.canInstallApp()) {
          this.showAppReminder.next(true);
          this.logger.info('PWA reminder shown in production mode');
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
    // Triple verificación: debe ser móvil, no instalado, y recordatorio activo
    return this.showAppReminder.value && this.isMobileDevice() && !this.isAppInstalled.value;
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

  public validateReminderLogic(): void {
    // Método para verificar y corregir la lógica de recordatorios
    if (!this.isMobileDevice() || this.isAppInstalled.value) {
      this.showAppReminder.next(false);
      this.logger.info('PWA reminder hidden - not mobile or already installed');
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

    // En desarrollo, permitir instalación siempre
    if (isLocalDev) {
      if (typeof localStorage !== 'undefined') {
        const isInstalledInDev = localStorage.getItem('pwa-dev-installed') === 'true';
        if (isInstalledInDev) {
          return false;
        }
      }
      return true;
    }

    // Para móviles en producción
    if (this.isMobileDevice()) {
      // Si tenemos el prompt nativo, usarlo
      if (this.promptEvent) {
        return true;
      }

      // Para iOS Safari, verificar si puede instalarse manualmente
      if (this.isIOSSafari()) {
        return !navigator.standalone && this.hasServiceWorker();
      }

      // Para Android Chrome y otros navegadores móviles
      if (this.isAndroidChrome()) {
        // Verificar requirements básicos para PWA
        return this.hasServiceWorker() && this.hasValidManifest();
      }

      // Para otros navegadores móviles
      return this.hasServiceWorker() && this.hasValidManifest();
    }

    // Para desktop, también permitir si cumple requisitos
    return this.hasServiceWorker() && this.hasValidManifest() && !!this.promptEvent;
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
      try {
        // Marcar como instalada en localStorage para desarrollo
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('pwa-dev-installed', 'true');
        }

        this.isAppInstalled.next(true);
        this.showAppReminder.next(false);
        this.promptEvent = null;

        // Disparar evento de instalación
        window.dispatchEvent(new CustomEvent('pwa-installed'));

        this.logger.info('PWA installed successfully in development mode');
        return { success: true };
      } catch (error) {
        this.logger.warn('Development installation failed', error);
        return { success: false, reason: 'DEV_INSTALL_ERROR' };
      }
    }

    // En producción, verificar requisitos
    if (!this.isSecureContext()) {
      return { success: false, reason: 'NOT_SECURE_CONTEXT' };
    }

    if (!this.hasServiceWorker()) {
      return { success: false, reason: 'NO_SERVICE_WORKER' };
    }

    if (!this.hasValidManifest()) {
      return { success: false, reason: 'NO_VALID_MANIFEST' };
    }

    // Verificar si es móvil
    if (!this.isMobileDevice() && !this.promptEvent) {
      // Para desktop, verificar si hay prompt
      return { success: false, reason: 'NO_PROMPT_DESKTOP' };
    }

    // Para iOS Safari, intentar instalación manual
    if (this.isIOSSafari()) {
      this.logger.info('iOS Safari detected - manual installation required');
      return { success: false, reason: 'IOS_MANUAL_REQUIRED' };
    }

    // Para Android y otros móviles con prompt
    if (this.promptEvent) {
      try {
        this.logger.info('Attempting PWA installation with prompt');
        await this.promptEvent.prompt();
        const result = await this.promptEvent.userChoice;

        if (result.outcome === 'accepted') {
          this.isAppInstalled.next(true);
          this.showAppReminder.next(false);
          this.promptEvent = null;
          this.logger.info('PWA installation accepted by user');
          return { success: true };
        }
        this.promptEvent = null;
        this.logger.info('PWA installation dismissed by user');
        return { success: false, reason: 'USER_DISMISSED' };
      } catch (error) {
        this.logger.warn('PWA installation prompt failed', error);
        this.promptEvent = null;
        return { success: false, reason: 'PROMPT_ERROR' };
      }
    }

    // Instalación manual para dispositivos sin prompt
    if (this.isMobileDevice()) {
      this.logger.info('Mobile device without prompt - manual installation available');
      return { success: false, reason: 'MANUAL_INSTALL_AVAILABLE' };
    }

    // Fallback
    return { success: false, reason: 'INSTALLATION_NOT_SUPPORTED' };
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
    const debugInfo = this.getDebugInfo();
    this.logger.info('PWA Debug Info:', debugInfo);
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

  private isAndroidChrome(): boolean {
    if (!this.isBrowser) return false;

    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.includes('android') && userAgent.includes('chrome') && !userAgent.includes('edg');
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
      // Simulamos un prompt más realista para desarrollo
      this.promptEvent = {
        prompt: async () => {
          this.logger.info('PWA Install prompt triggered (simulated)');
          return Promise.resolve();
        },
        userChoice: new Promise((resolve) => {
          // En desarrollo, siempre permitimos la instalación
          resolve({ outcome: 'accepted' as const });
        }),
        preventDefault: () => {},
        type: 'beforeinstallprompt'
      } as BeforeInstallPromptEvent;

      // Notificamos inmediatamente que el prompt está disponible
      this.logger.info('PWA Install prompt simulated and available');

      // Disparar el evento después de un pequeño delay
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('pwa-install-available'));
        this.logger.info('PWA install-available event dispatched');
      }, 100);
    }
  }
}
