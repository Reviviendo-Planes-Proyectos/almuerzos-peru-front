import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BackButtonComponent } from '../../../../shared/components/back-button/back-button.component';
import { BaseTranslatableComponent } from '../../../../shared/i18n';
import { MaterialModule } from '../../../../shared/material.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MaterialModule, BackButtonComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseTranslatableComponent {
  isGoogleLoading = false;
  isFacebookLoading = false;
  isEmailLoading = false;

  constructor(public router: Router) {
    super();
  }

  showWelcome() {
    alert(this.t('messages.welcome'));
  }

  loginWithGoogle(): void {
    if (this.isGoogleLoading) return;

    this.isGoogleLoading = true;

    setTimeout(() => {
      this.router.navigate(['/auth/customer-basic-info']);
      this.isGoogleLoading = false;
    }, 2000);
  }

  loginWithFacebook(): void {
    if (this.isGoogleLoading || this.isFacebookLoading || this.isEmailLoading) return;

    this.isFacebookLoading = true;
    setTimeout(() => {
      this.isFacebookLoading = false;
    }, 2000);
  }

  iniciarConEmail(): void {
    if (this.isGoogleLoading || this.isFacebookLoading || this.isEmailLoading) return;

    this.isEmailLoading = true;
    setTimeout(() => {
      this.isEmailLoading = false;
    }, 1000);
  }

  forgotPassword(): void {
    this.router.navigate(['auth/forgot-password']);
  }

  goToRegister(): void {
    this.router.navigate(['auth/register']);
  }
}
