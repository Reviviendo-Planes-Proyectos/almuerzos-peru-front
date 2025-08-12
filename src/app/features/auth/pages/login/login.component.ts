import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { I18nService } from '../../../../shared/i18n';
import { MaterialModule } from '../../../../shared/material.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private i18n = inject(I18nService);

  constructor(
    private readonly location: Location,
    public router: Router
  ) {}

  protected t = (key: string): string => {
    return this.i18n.t(key);
  };

  goBack(): void {
    this.location.back();
  }

  showWelcome() {
    alert(this.i18n.t('messages.welcome'));
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
    // Implementar lógica de recuperar contraseña
  }

  goToRegister(): void {
    this.router.navigate(['auth/register']);
  }
}
