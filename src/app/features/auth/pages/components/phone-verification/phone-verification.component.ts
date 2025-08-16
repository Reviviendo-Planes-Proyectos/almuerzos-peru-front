import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ASSET_URLS } from '../../../../../shared/constants';
import { BaseTranslatableComponent, CoreModule, SharedComponentsModule } from '../../../../../shared/modules';

@Component({
  selector: 'app-phone-verification',
  standalone: true,
  imports: [CoreModule, SharedComponentsModule],
  templateUrl: './phone-verification.component.html',
  styleUrl: './phone-verification.component.scss'
})
export class PhoneVerificationComponent extends BaseTranslatableComponent implements OnInit, OnDestroy {
  assetUrls = ASSET_URLS;
  userPhone!: string;
  canResendCode = false;
  countdownTimer = 60;
  codeSent = false;
  verificationForm!: FormGroup;
  preferredMethod: 'sms' | 'whatsapp' = 'sms';
  isVerifying = false;
  private intervalId?: number;
  currentStep = 2;

  constructor(
    private router: Router,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    this.initializeForm();

    // Obtener el teléfono desde el state de la navegación
    const phone = history.state.phone;

    if (phone) {
      //this.userPhone = this.maskPhone(phone);
      this.userPhone = phone;
      this.resetComponentState();
    } else {
      // Fallback si no hay teléfono en el state
      this.userPhone = '+51 9***';
      this.startCountdown();
    }
  }

  private resetComponentState(): void {
    this.codeSent = false;
    this.canResendCode = false;
    this.countdownTimer = 60;

    if (this.verificationForm) {
      this.verificationForm.reset();
    }

    this.startCountdown();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  /*  private maskPhone(phone: string): string {
    // Ejemplo: 987654321 -> +51 9***
    if (phone.length >= 9) {
      return `+51 ${phone.substring(0, 1)}***`;
    }
    return phone;
  } */

  private initializeForm(): void {
    this.verificationForm = this.fb.group({
      verificationCode: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  setPreferredMethod(method: 'sms' | 'whatsapp'): void {
    this.preferredMethod = method;
  }

  get sendCodeButtonLabel(): string {
    return this.preferredMethod === 'whatsapp' ? 'Enviar Código por WhatsApp' : 'Enviar Código por SMS';
  }

  get sentMethodText(): string {
    return this.preferredMethod === 'whatsapp' ? 'WhatsApp' : 'SMS';
  }

  get resendMethodText(): string {
    return this.preferredMethod === 'whatsapp' ? 'WhatsApp' : 'SMS';
  }

  sendVerificationCode(): void {
    this.currentStep = 3;
    this.codeSent = true;
  }

  verifyCode(): void {
    if (this.verificationForm.valid && !this.isVerifying) {
      this.isVerifying = true;

      // Simular proceso de verificación (reemplazar con llamada real al API)
      setTimeout(() => {
        this.isVerifying = false;
        // Navegar al siguiente paso - restaurant-profile-photo
        this.router.navigate(['/auth/restaurant-profile-photo']);
      }, 2000); // 2 segundos de simulación
    } else {
      this.verificationForm.markAllAsTouched();
    }
  }

  resendCode(): void {
    if (this.canResendCode) {
      this.startCountdown();
    }
  }

  doLater(): void {
    // Lógica para postergar
  }

  goBack(): void {
    this.router.navigate(['/auth/restaurant-basic-info']);
  }

  onBackClick(): void {
    this.goBack();
  }

  private startCountdown(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

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
