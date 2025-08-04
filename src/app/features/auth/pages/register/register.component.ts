import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../../shared/material.module';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  constructor(
    private readonly location: Location,
    public router: Router
  ) {}

  goBack(): void {
    this.location.back();
  }

  // Botón Google
  loginWithGoogle(): void {
    //console.log('Iniciando sesión con Google...');
    // Aquí podrías llamar a tu servicio de autenticación
    // Ejemplo con Firebase:
    // this.authService.loginWithGoogle();
  }

  // Botón Facebook
  loginWithFacebook(): void {
    // console.log('Iniciando sesión con Facebook...');
    // Aquí podrías llamar a tu servicio de autenticación
    // Ejemplo con Firebase:
    // this.authService.loginWithFacebook();
  }

  // Botón Crear cuenta con email
  crearConEmail(): void {
    //console.log('Redirigiendo a formulario de registro con email...');
    //this.router.navigate(['/register/email']);
  }
}
