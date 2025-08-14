import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  BaseTranslatableComponent,
  CoreModule,
  MaterialModule,
  SharedComponentsModule
} from '../../../../shared/modules';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CoreModule, MaterialModule, SharedComponentsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent extends BaseTranslatableComponent {
  forgotPasswordForm: FormGroup;
  isLoading = false;

  constructor(
    private router: Router,
    private fb: FormBuilder
  ) {
    super();
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

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
