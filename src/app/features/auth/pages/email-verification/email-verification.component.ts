import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { SectionTitleComponent } from '../../../../shared/components/section-title/section-title.component';
import { StepIndicatorComponent } from '../../../../shared/components/step-indicator/step-indicator.component';

@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [StepIndicatorComponent, SectionTitleComponent, ButtonComponent, CommonModule],
  templateUrl: './email-verification.component.html',
  styleUrl: './email-verification.component.scss'
})
export class EmailVerificationComponent implements OnInit {
  userEmail = 's***@gmail.com'; // Este valor vendría del paso anterior
  canResendCode = false;
  countdownTimer = 60;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.startCountdown();
  }

  sendVerificationCode(): void {
    // Aquí iría la lógica para enviar el código
    // Por ejemplo: this.authService.sendVerificationCode(this.userEmail)
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
