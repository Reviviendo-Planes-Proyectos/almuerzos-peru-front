import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BaseTranslatableComponent, CoreModule, SharedComponentsModule } from '../../../../../shared/modules';
import { VerificationCountdownService } from '../../../../../shared/services/verification-countdown/verification-countdown.service';

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
  codeSent = false;
  verificationForm!: FormGroup;
  private paramsSubscription!: Subscription;
  private countdownSubscription!: Subscription;
  currentStep = 2;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    public countdownService: VerificationCountdownService
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
        this.countdownService.startCountdown();
      }
    });
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
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
    this.countdownService.clearInterval();
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
    this.countdownService.startCountdown();
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
    if (this.countdownService.canResendCode) {
      this.countdownService.startCountdown();
    }
  }

  resendCodeFromVerificationView(): void {
    this.countdownService.startCountdown();
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
}
