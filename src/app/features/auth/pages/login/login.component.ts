import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BackButtonComponent } from '../../../../shared/components/back-button/back-button.component';
import { BaseTranslatableComponent } from '../../../../shared/i18n';
import { MaterialModule } from '../../../../shared/material.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MaterialModule, BackButtonComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseTranslatableComponent {
  constructor(public router: Router) {
    super();
  }

  showWelcome() {
    alert(this.t('messages.welcome'));
  }

  loginWithGoogle(): void {
    // Implementar lógica de login con Google
  }

  loginWithFacebook(): void {
    // Implementar lógica de login con Facebook
  }

  iniciarConEmail(): void {
    // Implementar lógica de login con email
  }

  forgotPassword(): void {
    this.router.navigate(['auth/forgot-password']);
  }

  goToRegister(): void {
    this.router.navigate(['auth/register']);
  }
}
