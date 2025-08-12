import { Location, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BackButtonComponent } from '../../../../shared/components/back-button/back-button.component';
import { BaseTranslatableComponent } from '../../../../shared/i18n';
import { MaterialModule } from '../../../../shared/material.module';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MaterialModule, NgIf, BackButtonComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends BaseTranslatableComponent {
  isGoogleLoading = false;
  isFacebookLoading = false;
  isEmailLoading = false;

  constructor(
    private readonly location: Location,
    public router: Router
  ) {
    super();
  }

  goBack(): void {
    this.location.back();
  }

  loginWithGoogle(): void {
    if (this.isGoogleLoading) return;

    this.isGoogleLoading = true;

    // Simular proceso de autenticación
    setTimeout(() => {
      // Navegar al componente customer-basic-info después del login exitoso
      this.router.navigate(['/auth/customer-basic-info']);
      this.isGoogleLoading = false;
    }, 2000); // 2 segundos de simulación
  }

  loginWithFacebook(): void {
    if (this.isFacebookLoading) return;

    this.isFacebookLoading = true;

    // Simular proceso de autenticación
    setTimeout(() => {
      // Simular fin del proceso (remover esto cuando tengas la implementación real)
      this.isFacebookLoading = false;
    }, 2000); // 2 segundos de simulación
  }

  crearConEmail(): void {
    if (this.isEmailLoading) return;

    this.isEmailLoading = true;

    setTimeout(() => {
      this.isEmailLoading = false;
    }, 500);
  }
}
