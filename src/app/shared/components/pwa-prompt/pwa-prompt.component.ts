import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PwaService } from '../../services/pwa.service';

@Component({
  selector: 'app-pwa-prompt',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  template: `
    <div class="pwa-prompt" *ngIf="showInstallPrompt">
      <div class="prompt-content">
        <mat-icon class="app-icon">restaurant</mat-icon>
        <div class="prompt-text">
          <h3>¡Instala Almuerzos Perú!</h3>
          <p>Accede rápidamente a los mejores menús del día</p>
        </div>
        <div class="prompt-actions">
          <button mat-button (click)="dismissPrompt()">
            Ahora no
          </button>
          <button mat-raised-button color="primary" (click)="installApp()">
            <mat-icon>download</mat-icon>
            Instalar
          </button>
        </div>
      </div>
    </div>

    <!-- Botón flotante para mostrar instalación -->
    <button 
      mat-fab 
      color="primary" 
      class="install-fab"
      *ngIf="canInstall && !showInstallPrompt"
      (click)="showPrompt()"
      matTooltip="Instalar aplicación">
      <mat-icon>download</mat-icon>
    </button>

    <!-- Notificación de actualización disponible -->
    <div class="update-banner" *ngIf="updateAvailable">
      <div class="update-content">
        <mat-icon>system_update</mat-icon>
        <span>Nueva versión disponible</span>
        <button mat-button color="accent" (click)="updateApp()">
          Actualizar
        </button>
        <button mat-icon-button (click)="dismissUpdate()">
          <mat-icon>close</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [
    `
    .pwa-prompt {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: var(--mat-sys-surface-container);
      border-top: 1px solid var(--mat-sys-outline-variant);
      padding: 16px;
      z-index: 1000;
      box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.1);
    }

    .prompt-content {
      display: flex;
      align-items: center;
      gap: 16px;
      max-width: 600px;
      margin: 0 auto;
    }

    .app-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: var(--mat-sys-primary);
    }

    .prompt-text {
      flex: 1;
    }

    .prompt-text h3 {
      margin: 0 0 4px 0;
      font-size: 16px;
      font-weight: 500;
      color: var(--mat-sys-on-surface);
    }

    .prompt-text p {
      margin: 0;
      font-size: 14px;
      color: var(--mat-sys-on-surface-variant);
    }

    .prompt-actions {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .install-fab {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 999;
    }

    .update-banner {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: var(--mat-sys-primary-container);
      color: var(--mat-sys-on-primary-container);
      z-index: 1001;
    }

    .update-content {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      max-width: 600px;
      margin: 0 auto;
    }

    .update-content span {
      flex: 1;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .prompt-content {
        flex-direction: column;
        text-align: center;
        gap: 12px;
      }

      .prompt-actions {
        width: 100%;
        justify-content: center;
      }

      .install-fab {
        bottom: 80px; /* Evitar conflicto con navegación móvil */
      }
    }
  `
  ]
})
export class PwaPromptComponent implements OnInit {
  showInstallPrompt = false;
  canInstall = false;
  updateAvailable = false;

  constructor(
    private readonly pwaService: PwaService,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Suscribirse a los observables del servicio PWA
    this.pwaService.updateAvailable$.subscribe((available) => {
      this.updateAvailable = available;
    });

    // Verificar si se puede instalar la app
    this.checkInstallability();

    // Mostrar prompt de instalación después de un tiempo
    setTimeout(() => {
      if (this.pwaService.canInstallApp()) {
        this.showInstallPrompt = true;
      }
    }, 30000); // Mostrar después de 30 segundos
  }

  private checkInstallability(): void {
    this.canInstall = this.pwaService.canInstallApp();
  }

  showPrompt(): void {
    this.showInstallPrompt = true;
  }

  dismissPrompt(): void {
    this.showInstallPrompt = false;
    // Guardar preferencia del usuario para no molestar por un tiempo
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
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
