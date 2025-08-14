import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BaseTranslatableComponent, CoreModule, SharedComponentsModule } from '../../../../../shared/modules';

@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [SharedComponentsModule, CoreModule],
  templateUrl: './email-verification.component.html',
  styleUrl: './email-verification.component.scss'
})
export class EmailVerificationComponent extends BaseTranslatableComponent implements OnInit, OnDestroy {
  userEmail!: string;
  originalEmail: string | null = null;
  canResendCode = false;
  countdownTimer = 60;
  codeSent = false;
  verificationForm!: FormGroup;
  private paramsSubscription!: Subscription;
  private intervalId?: number;
  currentStep = 2;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.initializeForm();

    this.paramsSubscription = this.route.params.subscribe((params: Params) => {
      const emailKey = 'email';
      let email = params[emailKey] as string;

      if (!email) {
        email = this.route.snapshot.queryParams[emailKey] as string;
      }

      if (email) {
        const decodedEmail = decodeURIComponent(email);
        this.originalEmail = decodedEmail;
        this.userEmail = this.maskEmail(decodedEmail);

        this.cdr.detectChanges();
        this.resetComponentState();
      } else {
        this.userEmail = 's***@gmail.com';
        this.startCountdown();
      }
    });
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
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private maskEmail(email: string): string {
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 1) {
      return email;
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
    this.codeSent = true;
    this.startCountdown();
  }

  verifyCode(): void {
    if (this.verificationForm.valid) {
      if (this.originalEmail) {
        this.router.navigate(['/auth/customer-profile-photo'], {
          queryParams: { email: this.originalEmail }
        });
      } else {
        this.router.navigate(['/auth/customer-profile-photo']);
      }
    } else {
      this.verificationForm.markAllAsTouched();
    }
  }

  resendCode(): void {
    if (this.canResendCode) {
      this.startCountdown();
    }
  }

  resendCodeFromVerificationView(): void {
    this.startCountdown();
  }

  doLater(): void {
    if (this.originalEmail) {
      this.router.navigate(['/auth/customer-profile-photo'], {
        queryParams: { email: this.originalEmail }
      });
    } else {
      this.router.navigate(['/auth/customer-profile-photo']);
    }
  }

  goBack(): void {
    this.router.navigate(['/auth/customer-basic-info']);
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
