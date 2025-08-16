import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CoreModule } from '../../modules';
import { PwaService } from '../../services/pwa/pwa.service';

@Component({
  selector: 'app-pwa-debug',
  standalone: true,
  imports: [CoreModule, JsonPipe],
  templateUrl: './pwa-debug.component.html',
  styleUrls: ['./pwa-debug.component.scss']
})
export class PwaDebugComponent implements OnInit {
  debugInfo: any = {};
  installStatus: any = {};
  installResult: { success: boolean; reason?: string; message?: string } | null = null;
  showInstructions = false;

  constructor(private pwaService: PwaService) {}

  ngOnInit(): void {
    this.refreshDebugInfo();
  }

  refreshDebugInfo(): void {
    this.debugInfo = this.pwaService.getDebugInfo();
    this.installStatus = this.pwaService.getInstallStatus();
    this.installResult = null;
  }

  async tryInstall(): Promise<void> {
    try {
      this.installResult = { success: false, message: 'Intentando instalar...' };

      const result = await this.pwaService.installApp();

      // Mapear razones de error a mensajes claros
      const errorMessages: { [key: string]: string } = {
        ALREADY_INSTALLED: '✅ La app ya está instalada. Búscala en tu pantalla de inicio.',
        NOT_BROWSER: '❌ No es un navegador válido.',
        NOT_SECURE_CONTEXT: '❌ Contexto no seguro. Usa HTTPS o localhost.',
        NO_SERVICE_WORKER: '❌ Service Worker no disponible. Recarga la página.',
        NO_VALID_MANIFEST: '❌ Manifest no válido. Verifica la configuración.',
        NO_PROMPT_DESKTOP: '⚠️ Sin prompt en desktop. Usa Chrome > ⋮ > "Instalar app".',
        IOS_MANUAL_REQUIRED: '📱 iOS Safari: Usa Share > "Añadir a pantalla de inicio".',
        USER_DISMISSED: '👤 Instalación cancelada por el usuario.',
        PROMPT_ERROR: '❌ Error en el prompt. Intenta desde Chrome > ⋮ > "Instalar app".',
        MANUAL_INSTALL_AVAILABLE: '📱 Instalación manual: Chrome > ⋮ > "Añadir a pantalla de inicio".',
        INSTALLATION_NOT_SUPPORTED: '❌ Instalación no soportada en este dispositivo.',
        DEV_INSTALL_ERROR: '❌ Error en modo desarrollo.'
      };

      this.installResult = {
        success: result.success,
        message: result.success
          ? '🎉 ¡App instalada correctamente! Búscala en tu pantalla de inicio.'
          : errorMessages[result.reason || ''] || `Error: ${result.reason}`,
        reason: result.reason
      };

      if (result.success) {
        setTimeout(() => this.refreshDebugInfo(), 1000);
      }
    } catch (error) {
      this.installResult = {
        success: false,
        message: `❌ Error inesperado: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
    }
  }

  clearPwaData(): void {
    this.pwaService.clearPwaData();
    this.refreshDebugInfo();
  }

  clearAllPwaData(): void {
    try {
      // Limpiar datos del servicio PWA
      this.pwaService.clearPwaData();

      // Limpiar localStorage adicional
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('pwa-dev-installed');
        localStorage.removeItem('pwa-prompt-dismissed');
        localStorage.removeItem('pwa-reminder-shown');
        localStorage.removeItem('pwa-visit-count');
      }

      // Limpiar sessionStorage
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.clear();
      }

      this.installResult = {
        success: true,
        message: 'Datos PWA limpiados. Recarga la página para reinstalar.'
      };

      setTimeout(() => this.refreshDebugInfo(), 1000);
    } catch (_error) {
      this.installResult = {
        success: false,
        message: 'Error al limpiar datos PWA'
      };
    }
  }

  forceUninstallSimulation(): void {
    this.pwaService.simulateUninstallation();
    this.installResult = {
      success: true,
      message: 'Simulación de desinstalación completada. Recarga la página.'
    };
    setTimeout(() => this.refreshDebugInfo(), 1000);
  }

  openInstalledApp(): void {
    // Intentar abrir en modo standalone si es posible
    if (window.navigator && 'share' in window.navigator) {
      this.installResult = {
        success: true,
        message: 'Busca "Almuerzos Perú" en tu pantalla de inicio o cajón de apps.'
      };
    } else {
      window.location.href = '/';
    }
  }

  showInstallInstructions(): void {
    this.showInstructions = true;
  }

  checkInstallability(): void {
    this.pwaService.checkInstallability();
    setTimeout(() => this.refreshDebugInfo(), 1000);
  }

  isAndroidChrome(): boolean {
    if (!this.debugInfo.userAgent) return false;
    const userAgent = this.debugInfo.userAgent.toLowerCase();
    return userAgent.includes('android') && userAgent.includes('chrome') && !userAgent.includes('edg');
  }

  copyUrl(): void {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        this.installResult = {
          success: true,
          message: '📋 URL copiada. Pégala en Chrome o Safari para instalar la PWA.'
        };
      });
    } else {
      // Fallback para navegadores sin clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);

      this.installResult = {
        success: true,
        message: '📋 URL copiada. Pégala en Chrome o Safari para instalar la PWA.'
      };
    }
  }
}
