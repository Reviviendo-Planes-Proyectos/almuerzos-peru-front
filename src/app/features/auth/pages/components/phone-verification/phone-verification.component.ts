import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BaseTranslatableComponent, CoreModule, SharedComponentsModule } from '../../../../../shared/modules';
import { VerificationCountdownService } from '../../../../../shared/services/verification-countdown/verification-countdown.service';

@Component({
  selector: 'app-phone-verification',
  standalone: true,
  imports: [CoreModule, SharedComponentsModule],
  templateUrl: './phone-verification.component.html',
  styleUrl: './phone-verification.component.scss'
})
export class PhoneVerificationComponent extends BaseTranslatableComponent implements OnInit, OnDestroy {
  userPhone!: string;
  codeSent = false;
  verificationForm!: FormGroup;
  preferredMethod: 'sms' | 'whatsapp' = 'sms';
  isVerifying = false;
  private countdownSubscription!: Subscription;
  currentStep = 2;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public countdownService: VerificationCountdownService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initializeForm();

    const phone = history.state.phone;

    if (phone) {
      this.userPhone = this.maskPhone(phone);
      this.resetComponentState();
    } else {
      this.userPhone = '+51 9***';
      this.countdownService.startCountdown();
    }
  }

  private resetComponentState(): void {
    this.codeSent = false;

    if (this.verificationForm) {
      this.verificationForm.reset();
    }

    this.countdownService.resetCountdown();
    this.countdownService.startCountdown();
  }

  ngOnDestroy(): void {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
    this.countdownService.clearInterval();
  }

  private maskPhone(phone: string): string {
    // Ejemplo: 987654321 -> +51 9***
    if (phone.length >= 9) {
      return `+51 ${phone.substring(0, 1)}***`;
    }
    return phone;
  }

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

      setTimeout(() => {
        this.isVerifying = false;
        this.router.navigate(['/auth/restaurant-profile-photo']);
      }, 2000);
    } else {
      this.verificationForm.markAllAsTouched();
    }
  }

  resendCode(): void {
    if (this.countdownService.canResendCode) {
      this.countdownService.startCountdown();
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
}
