import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BackButtonComponent } from '../../../../shared/components/back-button/back-button.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { I18nService } from '../../../../shared/i18n';
import { MaterialModule } from '../../../../shared/material.module';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, ButtonComponent, BackButtonComponent],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  private i18n = inject(I18nService);
  forgotPasswordForm: FormGroup;
  isLoading = false;

  constructor(
    private router: Router,
    private fb: FormBuilder
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  protected t = (key: string): string => {
    return this.i18n.t(key);
  };

  goToLogin(): void {
    this.router.navigate(['auth/login']);
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;

      setTimeout(() => {
        this.isLoading = false;
        this.router.navigate(['auth/email-sent-confirmation']);
      }, 2000);
    }
  }

  get email() {
    return this.forgotPasswordForm.get('email');
  }
}
