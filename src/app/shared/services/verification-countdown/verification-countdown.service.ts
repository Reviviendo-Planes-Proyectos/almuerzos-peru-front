import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VerificationCountdownService {
  private readonly COUNTDOWN_DURATION = 60;
  private intervalId?: number;

  private canResendCodeSubject = new BehaviorSubject<boolean>(false);
  private countdownTimerSubject = new BehaviorSubject<number>(this.COUNTDOWN_DURATION);

  public canResendCode$: Observable<boolean> = this.canResendCodeSubject.asObservable();
  public countdownTimer$: Observable<number> = this.countdownTimerSubject.asObservable();

  startCountdown(): void {
    this.clearInterval(); // Limpiar cualquier intervalo anterior
    this.canResendCodeSubject.next(false);
    this.countdownTimerSubject.next(this.COUNTDOWN_DURATION);

    this.intervalId = window.setInterval(() => {
      const currentTimer = this.countdownTimerSubject.value;
      const newTimer = currentTimer - 1;
      this.countdownTimerSubject.next(newTimer);

      if (newTimer <= 0) {
        this.canResendCodeSubject.next(true);
        this.clearInterval();
      }
    }, 1000);
  }

  resetCountdown(): void {
    this.canResendCodeSubject.next(false);
    this.countdownTimerSubject.next(this.COUNTDOWN_DURATION);
    this.clearInterval();
  }

  clearInterval(): void {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  get canResendCode(): boolean {
    return this.canResendCodeSubject.value;
  }

  get countdownTimer(): number {
    return this.countdownTimerSubject.value;
  }
}
