import { Location, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from '../../../../shared/material.module';
import { LoggerService } from '../../../../shared/services/logger/logger.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MaterialModule, NgIf],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  isGoogleLoading = false;
  isFacebookLoading = false;
  isEmailLoading = false;
  tipo!: string | null;

  constructor(
    private readonly location: Location,
    public router: Router,
    private route: ActivatedRoute,
    private loggerService: LoggerService
  ) {}

  ngOnInit() {
    // Opción 1: Usar el estado del router (más confiable)
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      // biome-ignore lint/complexity/useLiteralKeys: accessing router state
      this.tipo = navigation.extras.state['tipo'];
    } else {
      // Fallback: buscar en el historial del router
      const routerState = this.router.routerState;
      const root = routerState.root;
      if (root.firstChild?.snapshot.data) {
        // biome-ignore lint/complexity/useLiteralKeys: accessing router data
        this.tipo = root.firstChild.snapshot.data['tipo'];
      }
    }

    // Opción 2: También verificar queryParams como backup
    if (!this.tipo) {
      this.route.queryParams.subscribe((params) => {
        // biome-ignore lint/complexity/useLiteralKeys: accessing query params
        this.tipo = params['userType'];
        this.loggerService.info('Tipo desde queryParams:', this.tipo);
      });
    }

    // Opción 3: También puedes verificar el estado del window
    if (!this.tipo && window.history.state) {
      this.tipo = window.history.state.tipo;
      this.loggerService.info('Tipo desde window.history.state:', this.tipo);
    }

    this.loggerService.info('Tipo de usuario seleccionado final:', this.tipo || 'No definido');
  }

  goBack(): void {
    this.location.back();
  }

  // Botón Google
  loginWithGoogle(): void {
    if (this.isGoogleLoading) return; // Prevenir múltiples clicks

    this.isGoogleLoading = true;

    // Simular proceso de autenticación
    setTimeout(() => {
      //console.log('Iniciando sesión con Google...');
      // Aquí podrías llamar a tu servicio de autenticación
      // Ejemplo con Firebase:
      // this.authService.loginWithGoogle();

      // Navegar según el tipo de usuario seleccionado
      this.navigateToBasicInfo();
      this.isGoogleLoading = false;
    }, 2000); // 2 segundos de simulación
  }

  // Botón Facebook
  loginWithFacebook(): void {
    if (this.isFacebookLoading) return; // Prevenir múltiples clicks

    this.isFacebookLoading = true;

    // Simular proceso de autenticación
    setTimeout(() => {
      //console.log('Iniciando sesión con Facebook...');
      // Aquí podrías llamar a tu servicio de autenticación
      // Ejemplo con Firebase:
      // this.authService.loginWithFacebook();

      // Navegar según el tipo de usuario seleccionado
      this.navigateToBasicInfo();
      this.isFacebookLoading = false;
    }, 2000); // 2 segundos de simulación
  }

  // Botón Crear cuenta con email
  crearConEmail(): void {
    if (this.isEmailLoading) return; // Prevenir múltiples clicks

    this.isEmailLoading = true;

    setTimeout(() => {
      //console.log('Redirigiendo a formulario de registro con email...');
      this.navigateToBasicInfo();
      this.isEmailLoading = false;
    }, 500); // Más rápido, sin mostrar loading visual
  }

  // Método auxiliar para navegar según el tipo de usuario
  private navigateToBasicInfo(): void {
    if (this.tipo === 'restaurante') {
      this.router.navigate(['/auth/restaurant-basic-info']);
    } else if (this.tipo === 'comensal') {
      this.router.navigate(['/auth/customer-basic-info']);
    } else {
      // Fallback si no se detectó el tipo
      this.loggerService.info('Tipo no detectado, redirigiendo a customer-basic-info');
      this.router.navigate(['/auth/customer-basic-info']);
    }
  }
}
