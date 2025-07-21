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
  template: `
    <!-- Overlay de fondo para el modal -->
    <div class="pwa-overlay" *ngIf="showInstallPrompt" (click)="dismissPrompt()"></div>

    <!-- Banner para actualizaciones disponibles -->
    <div class="update-banner" *ngIf="updateAvailable">
      <div class="update-content">
        <mat-icon>system_update</mat-icon>
        <span>Nueva versión disponible</span>
        <button mat-button (click)="updateApp()">
          Actualizar
        </button>
        <button mat-icon-button (click)="dismissUpdate()">
          <mat-icon>close</mat-icon>
        </button>
      </div>
    </div>

    <!-- Prompt de instalación automático -->
    <div class="pwa-prompt" *ngIf="showInstallPrompt">
      <div class="prompt-header">
        <div class="header-gradient"></div>
        <div class="app-logo">
          <mat-icon class="app-icon">restaurant_menu</mat-icon>
          <div class="logo-rings">
            <div class="ring ring-1"></div>
            <div class="ring ring-2"></div>
            <div class="ring ring-3"></div>
          </div>
        </div>
        <button class="close-btn" (click)="dismissPrompt()">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      
      <div class="prompt-content">
        <div class="content-main">
          <h2 class="app-title">¡Instala Almuerzos Perú!</h2>
          <p class="app-subtitle">La mejor experiencia gastronómica peruana</p>
          
          <div class="features-list">
            <div class="feature-item">
              <mat-icon>notifications_active</mat-icon>
              <span>Notificaciones de ofertas</span>
            </div>
            <div class="feature-item">
              <mat-icon>offline_bolt</mat-icon>
              <span>Funciona sin internet</span>
            </div>
            <div class="feature-item">
              <mat-icon>speed</mat-icon>
              <span>Acceso ultra rápido</span>
            </div>
          </div>
          
          <div class="action-buttons">
            <button class="install-btn" (click)="installApp()" mat-raised-button>
              <mat-icon>get_app</mat-icon>
              <span>Instalar App</span>
              <div class="btn-shine"></div>
            </button>
            <button class="later-btn" (click)="dismissPrompt()" mat-button>
              Más tarde
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- FAB principal para instalación PWA -->
    <button 
      mat-fab 
      class="install-fab" 
      color="primary"
      *ngIf="!showInstallPrompt && isMobile && showFabAfter30Seconds"
      (click)="showPrompt()"
      matTooltip="Instalar Almuerzos Perú"
      matTooltipPosition="left">
      <mat-icon>restaurant_menu</mat-icon>
    </button>
  `,
  styles: [
    `
    /* Overlay de fondo para el modal */
    .pwa-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(8px);
      z-index: 9998;
      animation: fadeIn 0.4s ease-out;
    }

    /* Modal principal mejorado */
    .pwa-prompt {
      position: fixed;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
      z-index: 10000 !important;
      width: 420px;
      max-width: 90vw;
      background: linear-gradient(145deg, 
        rgba(255, 255, 255, 0.95) 0%,
        rgba(255, 255, 255, 0.9) 100%
      );
      backdrop-filter: blur(30px) saturate(150%);
      border: 1px solid rgba(255, 255, 255, 0.4);
      border-radius: 24px;
      box-shadow: 
        0 32px 64px rgba(0, 0, 0, 0.25),
        0 16px 32px rgba(0, 0, 0, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.7),
        0 0 0 1px rgba(255, 255, 255, 0.1);
      animation: modalAppear 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
      overflow: hidden;
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
    }

    /* Header del modal */
    .prompt-header {
      position: relative;
      height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .header-gradient {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, 
        #FF6B35 0%, 
        #FF8E53 25%, 
        #F7931E 50%, 
        #FF5722 75%, 
        #E64A19 100%
      );
      background-size: 400% 400%;
      animation: gradientShift 4s ease infinite;
    }

    .header-gradient::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, 
        transparent 30%, 
        rgba(255, 255, 255, 0.1) 50%, 
        transparent 70%
      );
      animation: shine 3s ease-in-out infinite;
    }

    .app-logo {
      position: relative;
      z-index: 2;
    }

    .app-icon {
      font-size: 48px !important;
      width: 48px !important;
      height: 48px !important;
      color: white;
      filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
      animation: iconPulse 2s ease-in-out infinite;
    }

    .logo-rings {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
    }

    .ring {
      position: absolute;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .ring-1 {
      width: 80px;
      height: 80px;
      animation: ringPulse 2s ease-in-out infinite;
    }

    .ring-2 {
      width: 100px;
      height: 100px;
      animation: ringPulse 2s ease-in-out infinite 0.3s;
    }

    .ring-3 {
      width: 120px;
      height: 120px;
      animation: ringPulse 2s ease-in-out infinite 0.6s;
    }

    .close-btn {
      position: absolute !important;
      top: 12px !important;
      right: 12px !important;
      color: white !important;
      background: none !important;
      border: none !important;
      padding: 8px !important;
      cursor: pointer !important;
      z-index: 10 !important;
      width: 32px !important;
      height: 32px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      border-radius: 4px !important;
      transition: all 0.2s ease !important;
    }

    .close-btn:hover {
      background: rgba(255, 255, 255, 0.2) !important;
    }

    .close-btn mat-icon {
      font-size: 20px !important;
      width: 20px !important;
      height: 20px !important;
    }

    /* Contenido del modal */
    .prompt-content {
      position: relative;
      padding: 32px 28px 28px;
    }

    .content-main {
      text-align: center;
      position: relative;
      z-index: 2;
    }

    .app-title {
      margin: 0 0 8px 0;
      font-size: 28px;
      font-weight: 800;
      background: linear-gradient(135deg, #FF6B35, #F7931E, #FF5722);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      animation: titleGlow 3s ease-in-out infinite alternate;
    }

    .app-subtitle {
      margin: 0 0 24px 0;
      color: #666;
      font-size: 16px;
      font-weight: 500;
      opacity: 0.9;
    }

    .features-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 28px;
      text-align: left;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.8);
      border-radius: 12px;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
      font-weight: 500;
      color: #444;
    }

    .feature-item:hover {
      background: rgba(255, 255, 255, 0.8);
      transform: translateX(4px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .feature-item mat-icon {
      color: #FF6B35;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .action-buttons {
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .install-btn {
      position: relative !important;
      background: linear-gradient(135deg, #FF6B35, #FF5722, #E64A19) !important;
      color: white !important;
      border: none !important;
      border-radius: 16px !important;
      padding: 16px 32px !important;
      font-size: 16px !important;
      font-weight: 700 !important;
      text-transform: none !important;
      box-shadow: 
        0 8px 24px rgba(255, 107, 53, 0.4),
        0 4px 12px rgba(0, 0, 0, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
      overflow: hidden !important;
      min-width: 180px !important;
      animation: buttonPulse 3s ease-in-out infinite;
      transform-style: preserve-3d !important;
    }

    .install-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, 
        rgba(255, 255, 255, 0.3) 0%,
        rgba(255, 255, 255, 0.1) 50%,
        rgba(255, 255, 255, 0.3) 100%
      );
      opacity: 0;
      transition: opacity 0.3s ease;
      border-radius: 16px;
    }

    .install-btn:hover::before {
      opacity: 1;
    }

    .install-btn:hover {
      transform: translateY(-5px) scale(1.05) rotateX(5deg) !important;
      box-shadow: 
        0 15px 40px rgba(255, 107, 53, 0.6),
        0 8px 20px rgba(0, 0, 0, 0.25),
        inset 0 2px 0 rgba(255, 255, 255, 0.3) !important;
      animation: buttonHover 0.6s ease-out forwards;
    }

    .install-btn:active {
      transform: translateY(-2px) scale(1.02) !important;
      transition: all 0.1s ease !important;
    }

    .install-btn mat-icon {
      margin-right: 8px !important;
    }

    .btn-shine {
      position: absolute;
      top: 0;
      left: -150%;
      width: 50%;
      height: 100%;
      background: linear-gradient(120deg, 
        transparent 0%,
        rgba(255, 255, 255, 0.1) 20%,
        rgba(255, 255, 255, 0.8) 50%,
        rgba(255, 255, 255, 0.1) 80%,
        transparent 100%
      );
      transform: skewX(-25deg);
      transition: left 1.2s cubic-bezier(0.4, 0, 0.2, 1);
      border-radius: 16px;
      filter: blur(0.5px);
      animation: autoShine 4s ease-in-out infinite;
    }

    .install-btn:hover .btn-shine {
      left: 150%;
      transition: left 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      animation: none;
    }

    @keyframes autoShine {
      0%, 85% {
        left: -150%;
        opacity: 0;
      }
      90% {
        opacity: 1;
      }
      95% {
        left: 150%;
        opacity: 1;
      }
      100% {
        left: 150%;
        opacity: 0;
      }
    }

    /* Nuevas animaciones para el botón */
    @keyframes buttonPulse {
      0%, 100% {
        box-shadow: 
          0 8px 24px rgba(255, 107, 53, 0.4),
          0 4px 12px rgba(0, 0, 0, 0.15),
          0 0 0 0 rgba(255, 107, 53, 0.4);
      }
      50% {
        box-shadow: 
          0 10px 28px rgba(255, 107, 53, 0.5),
          0 5px 14px rgba(0, 0, 0, 0.18),
          0 0 0 8px rgba(255, 107, 53, 0.1);
      }
    }

    @keyframes buttonHover {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }

    /* Animaciones específicas para móvil */
    @keyframes buttonPulseMobile {
      0%, 100% {
        box-shadow: 
          0 6px 18px rgba(255, 107, 53, 0.4),
          0 3px 8px rgba(0, 0, 0, 0.15);
      }
      50% {
        box-shadow: 
          0 8px 22px rgba(255, 107, 53, 0.5),
          0 4px 10px rgba(0, 0, 0, 0.18);
      }
    }

    @keyframes buttonHoverMobile {
      0% {
        background-position: 0% 50%;
      }
      100% {
        background-position: 100% 50%;
      }
    }

    .later-btn {
      color: #888 !important;
      border: 2px solid rgba(136, 136, 136, 0.2) !important;
      border-radius: 16px !important;
      padding: 16px 24px !important;
      font-weight: 600 !important;
      text-transform: none !important;
      transition: all 0.3s ease !important;
      background: rgba(255, 255, 255, 0.5) !important;
    }

    .later-btn:hover {
      background: rgba(255, 255, 255, 0.8) !important;
      border-color: rgba(136, 136, 136, 0.4) !important;
      transform: translateY(-1px) !important;
    }

    /* Animaciones */
    @keyframes modalAppear {
      0% {
        transform: translate(-50%, -50%) scale(0.8) rotateY(-15deg);
        opacity: 0;
      }
      50% {
        transform: translate(-50%, -50%) scale(1.03) rotateY(5deg);
      }
      100% {
        transform: translate(-50%, -50%) scale(1) rotateY(0deg);
        opacity: 1;
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes gradientShift {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    @keyframes shine {
      0%, 100% { transform: translateX(-100%) skewX(-15deg); }
      50% { transform: translateX(400%) skewX(-15deg); }
    }

    @keyframes iconPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    @keyframes ringPulse {
      0%, 100% { 
        transform: translate(-50%, -50%) scale(1);
        opacity: 0.3;
      }
      50% { 
        transform: translate(-50%, -50%) scale(1.1);
        opacity: 0.6;
      }
    }

    @keyframes titleGlow {
      0% { text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
      100% { text-shadow: 0 4px 8px rgba(255, 107, 53, 0.3); }
    }

    /* Responsive mejorado */
    @media (max-width: 768px) {
      .pwa-prompt {
        width: 95vw;
        max-width: 380px;
      }
      
      .prompt-header {
        height: 100px;
      }
      
      .app-icon {
        font-size: 40px !important;
        width: 40px !important;
        height: 40px !important;
      }
      
      .ring-1 {
        width: 70px;
        height: 70px;
      }

      .ring-2 {
        width: 85px;
        height: 85px;
      }

      .ring-3 {
        width: 100px;
        height: 100px;
      }
      
      .prompt-content {
        padding: 24px 20px 20px;
      }
      
      .app-title {
        font-size: 24px;
      }
      
      .app-subtitle {
        font-size: 14px;
        margin-bottom: 20px;
      }
      
      .features-list {
        gap: 10px;
        margin-bottom: 24px;
      }
      
      .feature-item {
        padding: 10px 14px;
        font-size: 14px;
      }
      
      .feature-item mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
      
      .action-buttons {
        flex-direction: column;
        gap: 10px;
      }
      
      .install-btn {
        width: 100% !important;
        min-width: auto !important;
        padding: 14px 24px !important;
        font-size: 15px !important;
        animation: buttonPulseMobile 4s ease-in-out infinite;
      }

      .install-btn:hover {
        transform: translateY(-3px) scale(1.02) !important;
        animation: buttonHoverMobile 0.4s ease-out forwards;
      }
      
      .later-btn {
        width: 100% !important;
        padding: 12px 20px !important;
        font-size: 14px !important;
      }
    }

    @media (max-width: 480px) {
      .pwa-prompt {
        width: 96vw;
        max-width: 340px;
        border-radius: 20px;
      }
      
      .prompt-header {
        height: 90px;
      }
      
      .app-icon {
        font-size: 36px !important;
        width: 36px !important;
        height: 36px !important;
      }
      
      .ring-1 {
        width: 60px;
        height: 60px;
      }

      .ring-2 {
        width: 75px;
        height: 75px;
      }

      .ring-3 {
        width: 90px;
        height: 90px;
      }
      
      .close-btn {
        top: 8px !important;
        right: 8px !important;
        width: 28px !important;
        height: 28px !important;
      }
      
      .close-btn mat-icon {
        font-size: 18px !important;
        width: 18px !important;
        height: 18px !important;
      }
      
      .prompt-content {
        padding: 20px 16px 16px;
      }
      
      .app-title {
        font-size: 22px;
      }
      
      .app-subtitle {
        font-size: 13px;
        margin-bottom: 16px;
      }
      
      .features-list {
        gap: 8px;
        margin-bottom: 20px;
      }
      
      .feature-item {
        padding: 8px 12px;
        font-size: 13px;
        border-radius: 10px;
      }
      
      .feature-item mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }
      
      .install-btn {
        padding: 12px 20px !important;
        font-size: 14px !important;
        border-radius: 14px !important;
        animation: buttonPulseMobile 3s ease-in-out infinite;
      }

      .install-btn:hover {
        transform: translateY(-2px) scale(1.01) !important;
      }
      
      .later-btn {
        padding: 10px 16px !important;
        font-size: 13px !important;
        border-radius: 14px !important;
      }
    }

    @media (max-width: 360px) {
      .pwa-prompt {
        width: 98vw;
        max-width: 320px;
      }
      
      .prompt-header {
        height: 80px;
      }
      
      .app-icon {
        font-size: 32px !important;
        width: 32px !important;
        height: 32px !important;
      }
      
      .ring-1 {
        width: 55px;
        height: 55px;
      }

      .ring-2 {
        width: 68px;
        height: 68px;
      }

      .ring-3 {
        width: 80px;
        height: 80px;
      }
      
      .prompt-content {
        padding: 16px 12px 12px;
      }
      
      .app-title {
        font-size: 20px;
      }
      
      .app-subtitle {
        font-size: 12px;
      }
      
      .features-list {
        margin-bottom: 16px;
      }
      
      .feature-item {
        padding: 6px 10px;
        font-size: 12px;
      }
      
      .install-btn {
        padding: 10px 16px !important;
        font-size: 13px !important;
        animation: buttonPulseMobile 2.5s ease-in-out infinite;
      }

      .install-btn:hover {
        transform: translateY(-1px) scale(1.01) !important;
      }
      
      .later-btn {
        padding: 8px 14px !important;
        font-size: 12px !important;
      }
    }

    /* Banner de actualización */
    .update-banner {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, #f39c12, #e67e22);
      color: white;
      z-index: 1000;
      animation: slideUp 0.3s ease-out;
    }

    .update-content {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      gap: 12px;
    }

    .update-content mat-icon {
      color: white;
    }

    @keyframes slideUp {
      from { transform: translateY(100%); }
      to { transform: translateY(0); }
    }

    /* FAB para instalación PWA */
    .install-fab {
      position: fixed !important;
      bottom: 20px !important;
      right: 20px !important;
      z-index: 1000 !important;
      background: linear-gradient(135deg, #FF6B35, #FF5722) !important;
      box-shadow: 
        0 8px 24px rgba(255, 107, 53, 0.4),
        0 4px 12px rgba(0, 0, 0, 0.15) !important;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
      animation: fabPulse 3s ease-in-out infinite;
    }

    .install-fab:hover {
      transform: translateY(-3px) scale(1.1) !important;
      box-shadow: 
        0 12px 32px rgba(255, 107, 53, 0.6),
        0 6px 16px rgba(0, 0, 0, 0.2) !important;
    }

    .install-fab mat-icon {
      color: white !important;
      font-size: 24px !important;
      width: 24px !important;
      height: 24px !important;
    }

    @keyframes fabPulse {
      0%, 100% {
        box-shadow: 
          0 8px 24px rgba(255, 107, 53, 0.4),
          0 4px 12px rgba(0, 0, 0, 0.15),
          0 0 0 0 rgba(255, 107, 53, 0.4);
      }
      50% {
        box-shadow: 
          0 10px 28px rgba(255, 107, 53, 0.5),
          0 5px 14px rgba(0, 0, 0, 0.18),
          0 0 0 8px rgba(255, 107, 53, 0.2);
      }
    }

    /* Responsive para el FAB */
    @media (max-width: 768px) {
      .install-fab {
        bottom: 16px !important;
        right: 16px !important;
        width: 48px !important;
        height: 48px !important;
      }

      .install-fab mat-icon {
        font-size: 20px !important;
        width: 20px !important;
        height: 20px !important;
      }
    }

    @media (max-width: 480px) {
      .install-fab {
        bottom: 12px !important;
        right: 12px !important;
        width: 44px !important;
        height: 44px !important;
      }

      .install-fab mat-icon {
        font-size: 18px !important;
        width: 18px !important;
        height: 18px !important;
      }
    }
  `
  ]
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
