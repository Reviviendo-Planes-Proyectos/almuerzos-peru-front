import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputFieldComponent } from '../../../../shared/components/input-field/input-field.component';
import { SectionTitleComponent } from '../../../../shared/components/section-title/section-title.component';
import { StepIndicatorComponent } from '../../../../shared/components/step-indicator/step-indicator.component';

@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [
    StepIndicatorComponent,
    SectionTitleComponent,
    ButtonComponent,
    InputFieldComponent,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './email-verification.component.html',
  styleUrl: './email-verification.component.scss'
})
export class EmailVerificationComponent implements OnInit {
  userEmail = 's***@gmail.com'; // Este valor vendría del paso anterior
  canResendCode = false;
  countdownTimer = 60;
  codeSent = false; // Nueva propiedad para controlar la vista
  verificationForm!: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.startCountdown();
    this.initializeForm();
  }

  private initializeForm(): void {
    this.verificationForm = this.fb.group({
      verificationCode: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  sendVerificationCode(): void {
    // Aquí iría la lógica para enviar el código
    // Por ejemplo: this.authService.sendVerificationCode(this.userEmail)
    this.codeSent = true; // Cambiar a la vista de ingreso de código
  }

  verifyCode(): void {
    if (this.verificationForm.valid) {
      // Aquí iría la lógica para verificar el código
      // const code = this.verificationForm.get('verificationCode')?.value;
      // Por ejemplo: this.authService.verifyCode(code)
      // Navegar al siguiente paso después de verificación exitosa
      // this.router.navigate(['/next-step']);
    } else {
      this.verificationForm.markAllAsTouched();
    }
  }

  resendCode(): void {
    if (this.canResendCode) {
      this.canResendCode = false;
      this.countdownTimer = 60;
      this.startCountdown();
      // Lógica para reenviar código
      // Por ejemplo: this.authService.resendVerificationCode()
    }
  }

  resendCodeFromVerificationView(): void {
    // Reenviar código desde la vista de verificación
    this.canResendCode = false;
    this.countdownTimer = 60;
    this.startCountdown();
    // Lógica para reenviar código
    // Por ejemplo: this.authService.resendVerificationCode()
  }

  doLater(): void {
    // Navegación o lógica para postergar
    // Por ejemplo: this.router.navigate(['/dashboard']);
  }

  goBack(): void {
    this.router.navigate(['/auth/customer-basic-info']);
  }

  private startCountdown(): void {
    const interval = setInterval(() => {
      this.countdownTimer--;
      if (this.countdownTimer <= 0) {
        this.canResendCode = true;
        clearInterval(interval);
      }
    }, 1000);
  }
}
