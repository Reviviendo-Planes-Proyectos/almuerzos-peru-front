import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, isDevMode, PLATFORM_ID } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { BehaviorSubject } from 'rxjs';
import { LoggerService } from './logger.service';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Extensión global para evitar error de TS en `navigator.standalone`
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
    if (!this.isBrowser || isDevMode()) return;

    this.checkForUpdates();
    this.captureInstallPrompt();
    this.checkIfAppIsInstalled();
  }

  private checkForUpdates(): void {
    if (!this.swUpdate.isEnabled) return;

    this.swUpdate.versionUpdates.subscribe((event) => {
      if (event.type === 'VERSION_READY') {
        this.updateAvailable.next(true);
      }
    });

    setInterval(() => this.swUpdate.checkForUpdate(), 30 * 60 * 1000);
  }

  private captureInstallPrompt(): void {
    window.addEventListener('beforeinstallprompt', (event: Event) => {
      event.preventDefault();
      this.promptEvent = event as BeforeInstallPromptEvent;
    });

    window.addEventListener('appinstalled', () => {
      this.isAppInstalled.next(true);
      this.promptEvent = null;
    });
  }

  private checkIfAppIsInstalled(): void {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
    if (isStandalone) {
      this.isAppInstalled.next(true);
    }
  }

  public canInstallApp(): boolean {
    return this.isBrowser && !!this.promptEvent && !this.isAppInstalled.value;
  }

  public async installApp(): Promise<boolean> {
    if (!this.promptEvent) return false;

    try {
      await this.promptEvent.prompt();
      const result = await this.promptEvent.userChoice;

      if (result.outcome === 'accepted') {
        this.isAppInstalled.next(true);
      }

      this.promptEvent = null;
      return result.outcome === 'accepted';
    } catch {
      this.logger.warn('PWA installation failed');
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
}
