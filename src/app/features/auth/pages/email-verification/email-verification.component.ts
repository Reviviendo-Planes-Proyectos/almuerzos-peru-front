import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
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
export class EmailVerificationComponent implements OnInit, OnDestroy {
  userEmail!: string; // Valor por defecto
  canResendCode = false;
  countdownTimer = 60;
  codeSent = false; // Nueva propiedad para controlar la vista
  verificationForm!: FormGroup;
  private paramsSubscription!: Subscription;
  private intervalId?: number;
  currentStep = 2;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Inicializar formulario primero
    this.initializeForm();

    // Suscribirse a los parámetros de ruta Y query parameters para máxima compatibilidad
    this.paramsSubscription = this.route.params.subscribe((params: Params) => {
      const emailKey = 'email';
      let email = params[emailKey] as string;

      // Si no hay email en params, buscar en queryParams
      if (!email) {
        email = this.route.snapshot.queryParams[emailKey] as string;
      }

      if (email) {
        // Decodificar el email si viene de la URL
        const decodedEmail = decodeURIComponent(email);
        this.userEmail = this.maskEmail(decodedEmail);

        // Forzar la detección de cambios y reset del estado
        this.cdr.detectChanges();
        this.resetComponentState();
      } else {
        this.userEmail = 's***@gmail.com'; // Fallback
        this.startCountdown();
      }
    });
  }

  private resetComponentState(): void {
    // Reiniciar el estado del componente
    this.codeSent = false;
    this.canResendCode = false;
    this.countdownTimer = 60;

    // Reinicializar el formulario
    if (this.verificationForm) {
      this.verificationForm.reset();
    }

    // Reiniciar el countdown
    this.startCountdown();
  }

  ngOnDestroy(): void {
    // Limpiar suscripciones y timers
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  /**
   * Enmascara el email para mostrar solo parte del mismo
   * Ejemplo: test@gmail.com -> t***@gmail.com
   */
  private maskEmail(email: string): string {
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 1) {
      return email; // Si es muy corto, no enmascarar
    }
    const maskedLocal = `${localPart[0]}***${localPart.length > 2 ? localPart.slice(-1) : ''}`;
    return `${maskedLocal}@${domain}`;
  }

  private initializeForm(): void {
    this.verificationForm = this.fb.group({
      verificationCode: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  sendVerificationCode(): void {
    // Aquí iría la lógica para enviar el código
    // Por ejemplo: this.authService.sendVerificationCode(this.userEmail)
    this.currentStep = 3;
    this.codeSent = true; // Cambiar a la vista de ingreso de código
  }

  verifyCode(): void {
    if (this.verificationForm.valid) {
      // Aquí iría la lógica para verificar el código
      // const code = this.verificationForm.get('verificationCode')?.value;

      // Simulamos una verificación exitosa por ahora
      // En el futuro: this.authService.verifyCode(code).subscribe(...)

      // Navegar al siguiente paso: subir foto de perfil
      // Cambiar al paso 3

      this.router.navigate(['/auth/customer-profile-photo']);
    } else {
      this.verificationForm.markAllAsTouched();
    }
  }

  resendCode(): void {
    if (this.canResendCode) {
      this.startCountdown();
      // Lógica para reenviar código
      // Por ejemplo: this.authService.resendVerificationCode()
    }
  }

  resendCodeFromVerificationView(): void {
    // Reenviar código desde la vista de verificación
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
    // Limpiar cualquier timer anterior
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // Reiniciar el estado del countdown
    this.canResendCode = false;
    this.countdownTimer = 60;

    this.intervalId = setInterval(() => {
      this.countdownTimer--;
      if (this.countdownTimer <= 0) {
        this.canResendCode = true;
        if (this.intervalId) {
          clearInterval(this.intervalId);
          this.intervalId = undefined;
        }
      }
    }, 1000) as unknown as number;
  }
}
