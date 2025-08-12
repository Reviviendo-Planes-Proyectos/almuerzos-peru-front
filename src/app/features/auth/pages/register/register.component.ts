import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BackButtonComponent } from '../../../../shared/components/back-button/back-button.component';
import { I18nService } from '../../../../shared/i18n';
import { MaterialModule } from '../../../../shared/material.module';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MaterialModule, BackButtonComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  private i18n = inject(I18nService);

  constructor(public router: Router) {}

  protected t = (key: string): string => {
    return this.i18n.t(key);
  };

  loginWithGoogle(): void {
    // Implementar lógica de login con Google
  }

  loginWithFacebook(): void {
    // Implementar lógica de login con Facebook
  }

  crearConEmail(): void {
    // Implementar lógica de registro con email
  }
}
