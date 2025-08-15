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
  private readonly isBrowser: boolean;

  public readonly updateAvailable$ = this.updateAvailable.asObservable();
  public readonly isAppInstalled$ = this.isAppInstalled.asObservable();

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

    if (isStandalone || isIOSStandalone || isInWebView || hasStandaloneParam) {
      this.isAppInstalled.next(true);
      this.logger.info('App is running in standalone mode or installed', {
        isStandalone,
        isIOSStandalone,
        isInWebView,
        hasStandaloneParam
      });
    } else {
      this.logger.info('App is running in browser mode');
    }
  }

  public canInstallApp(): boolean {
    if (!this.isBrowser) {
      return false;
    }

    if (this.isAppInstalled.value) {
      return false;
    }

    if (this.promptEvent) {
      return true;
    }

    if (this.isIOSSafari()) {
      return !navigator.standalone && this.hasServiceWorker();
    }

    if (this.shouldSimulatePrompt()) {
      return true;
    }

    const canInstallManually = this.hasServiceWorker() && this.hasValidManifest();

    this.logger.info('canInstallApp check:', {
      hasPrompt: !!this.promptEvent,
      isInstalled: this.isAppInstalled.value,
      isIOSSafari: this.isIOSSafari(),
      hasServiceWorker: this.hasServiceWorker(),
      canInstallManually,
      shouldSimulate: this.shouldSimulatePrompt()
    });

    return canInstallManually;
  }

  public async installApp(): Promise<boolean> {
    if (!this.promptEvent) {
      this.logger.warn('No install prompt available');
      return false;
    }

    try {
      this.logger.info('Showing install prompt');
      await this.promptEvent.prompt();
      const result = await this.promptEvent.userChoice;

      this.logger.info('Install prompt result:', result.outcome);

      if (result.outcome === 'accepted') {
        this.isAppInstalled.next(true);
        this.logger.info('PWA installation accepted by user');
      } else {
        this.logger.info('PWA installation dismissed by user');
      }

      this.promptEvent = null;
      return result.outcome === 'accepted';
    } catch (error) {
      this.logger.warn('PWA installation failed', error);
      this.promptEvent = null;
      return false;
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

    if (this.isAppInstalled.value) {
      return { canInstall: false, hasPrompt: false, reason: 'Already installed' };
    }

    const hasPrompt = !!this.promptEvent;

    if (hasPrompt) {
      return { canInstall: true, hasPrompt: true };
    }

    if (this.isIOSSafari()) {
      return { canInstall: true, hasPrompt: false, reason: 'iOS Safari - manual installation' };
    }

    if (this.shouldSimulatePrompt()) {
      return { canInstall: true, hasPrompt: false, reason: 'Development mode simulation' };
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

  private shouldSimulatePrompt(): boolean {
    return (
      (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.protocol === 'file:') &&
      !this.promptEvent
    );
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
      this.promptEvent = {
        prompt: async () => {
          this.logger.info('Simulated prompt shown');
          return Promise.resolve();
        },
        userChoice: Promise.resolve({ outcome: 'accepted' as 'accepted' | 'dismissed' })
      } as BeforeInstallPromptEvent;
    }
  }
}
