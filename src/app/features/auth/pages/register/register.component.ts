import { Location, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../../shared/material.module';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MaterialModule, NgIf],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  isGoogleLoading = false;
  isFacebookLoading = false;
  isEmailLoading = false;

  constructor(
    private readonly location: Location,
    public router: Router
  ) {}

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

      // Simular fin del proceso (remover esto cuando tengas la implementación real)
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

      // Simular fin del proceso (remover esto cuando tengas la implementación real)
      this.isFacebookLoading = false;
    }, 2000); // 2 segundos de simulación
  }

  // Botón Crear cuenta con email
  crearConEmail(): void {
    if (this.isEmailLoading) return; // Prevenir múltiples clicks

    this.isEmailLoading = true;

    setTimeout(() => {
      //console.log('Redirigiendo a formulario de registro con email...');
      //this.router.navigate(['/register/email']);
      this.isEmailLoading = false;
    }, 500); // Más rápido, sin mostrar loading visual
  }
}
