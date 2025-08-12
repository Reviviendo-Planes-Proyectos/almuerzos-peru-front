import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { I18nService } from '../../../../shared/i18n';
import { MaterialModule } from '../../../../shared/material.module';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
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
