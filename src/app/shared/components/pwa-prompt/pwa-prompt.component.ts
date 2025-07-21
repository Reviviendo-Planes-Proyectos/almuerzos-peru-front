import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PwaService } from '../../services/pwa.service';

@Component({
  selector: 'app-pwa-prompt',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatSnackBarModule, MatTooltipModule],
  templateUrl: './pwa-prompt.component.html',
  styleUrl: './pwa-prompt.component.scss'
})
export class PwaPromptComponent implements OnInit {
  showInstallPrompt = false;
  canInstall = false;
  updateAvailable = false;
  isMobile = false;
  showFabAfter30Seconds = false;
  private readonly isBrowser: boolean;

  constructor(
    private readonly pwaService: PwaService,
    private readonly snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // Solo ejecutar lógica PWA en el navegador
    if (!this.isBrowser) {
      return;
    }

    // Detectar si es dispositivo móvil
    this.detectMobileDevice();

    // Suscribirse a los observables del servicio PWA
    this.pwaService.updateAvailable$.subscribe((available) => {
      this.updateAvailable = available;
    });

    // Iniciar temporizador para mostrar el modal automáticamente después de 30 segundos
    this.scheduleInstallPrompt();

    // Mostrar FAB después de 30 segundos (solo en móvil)
    this.scheduleFabDisplay();
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
    // Solo mostrar FAB en dispositivos móviles después de 30 segundos
    if (!this.isMobile) {
      return;
    }

    setTimeout(() => {
      this.showFabAfter30Seconds = true;
    }, 30000); // 30 segundos
  }

  private scheduleInstallPrompt(): void {
    // Verificar si el usuario ya rechazó el prompt recientemente
    if (this.wasPromptRecentlyDismissed()) {
      return;
    }

    // Mostrar el modal después de 30 segundos de navegación
    setTimeout(() => {
      // Solo mostrar si no fue rechazado en el meantime
      if (!this.wasPromptRecentlyDismissed()) {
        this.showInstallPrompt = true;
      }
    }, 30000); // 30 segundos después de cargar la página
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
    this.showInstallPrompt = true;
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
      const installed = await this.pwaService.installApp();
      if (installed) {
        this.showInstallPrompt = false;
        this.canInstall = false;
        this.snackBar.open('¡App instalada exitosamente!', 'Cerrar', {
          duration: 3000
        });
      }
    } catch {
      this.snackBar.open('Error al instalar la aplicación', 'Cerrar', {
        duration: 3000
      });
    }
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
