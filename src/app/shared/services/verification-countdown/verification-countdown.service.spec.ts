import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { VerificationCountdownService } from './verification-countdown.service';

describe('VerificationCountdownService', () => {
  let service: VerificationCountdownService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerificationCountdownService);
  });

  afterEach(() => {
    // Limpiar cualquier intervalo que pueda estar corriendo
    service.clearInterval();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initial state', () => {
    it('should have initial canResendCode as false', () => {
      expect(service.canResendCode).toBe(false);
    });

    it('should have initial countdownTimer as 60', () => {
      expect(service.countdownTimer).toBe(60);
    });

    it('should have canResendCode$ observable emit false initially', (done) => {
      service.canResendCode$.subscribe((canResend) => {
        expect(canResend).toBe(false);
        done();
      });
    });

    it('should have countdownTimer$ observable emit 60 initially', (done) => {
      service.countdownTimer$.subscribe((timer) => {
        expect(timer).toBe(60);
        done();
      });
    });
  });

  describe('startCountdown', () => {
    it('should set canResendCode to false when countdown starts', () => {
      service.startCountdown();
      expect(service.canResendCode).toBe(false);
    });

    it('should reset timer to 60 when countdown starts', () => {
      service.startCountdown();
      expect(service.countdownTimer).toBe(60);
    });

    it('should decrement timer every second', fakeAsync(() => {
      service.startCountdown();

      expect(service.countdownTimer).toBe(60);

      tick(1000);
      expect(service.countdownTimer).toBe(59);

      tick(1000);
      expect(service.countdownTimer).toBe(58);

      service.clearInterval();
    }));

    it('should enable resend when countdown reaches 0', fakeAsync(() => {
      service.startCountdown();

      expect(service.canResendCode).toBe(false);

      tick(60000);

      expect(service.countdownTimer).toBe(0);
      expect(service.canResendCode).toBe(true);
    }));

    it('should automatically clear interval when countdown reaches 0', fakeAsync(() => {
      const clearIntervalSpy = jest.spyOn(window, 'clearInterval');

      service.startCountdown();
      tick(60000);

      expect(clearIntervalSpy).toHaveBeenCalled();
    }));
  });

  describe('resetCountdown', () => {
    it('should set canResendCode to false', () => {
      service.resetCountdown();
      expect(service.canResendCode).toBe(false);
    });

    it('should reset timer to 60', () => {
      service.resetCountdown();
      expect(service.countdownTimer).toBe(60);
    });

    it('should clear any existing interval', () => {
      const clearIntervalSpy = jest.spyOn(service, 'clearInterval');

      service.resetCountdown();

      expect(clearIntervalSpy).toHaveBeenCalled();
    });
  });

  describe('clearInterval', () => {
    it('should clear window interval when intervalId exists', fakeAsync(() => {
      const clearIntervalSpy = jest.spyOn(window, 'clearInterval');

      service.startCountdown();
      service.clearInterval();

      expect(clearIntervalSpy).toHaveBeenCalled();
    }));

    it('should not throw error when no interval exists', () => {
      expect(() => service.clearInterval()).not.toThrow();
    });

    it('should stop countdown progression after clearing', fakeAsync(() => {
      service.startCountdown();
      tick(2000);

      const timerAfter2Seconds = service.countdownTimer;
      service.clearInterval();

      tick(5000);
      expect(service.countdownTimer).toBe(timerAfter2Seconds);
    }));
  });

  describe('Multiple countdown scenarios', () => {
    it('should handle multiple startCountdown calls correctly', fakeAsync(() => {
      service.startCountdown();
      tick(5000);

      expect(service.countdownTimer).toBe(55);

      // Iniciar nuevo countdown - debería limpiar automáticamente el anterior
      service.startCountdown();

      // Debería haber reiniciado
      expect(service.countdownTimer).toBe(60);

      service.clearInterval();
    }));

    it('should maintain correct state after reset during countdown', fakeAsync(() => {
      service.startCountdown();
      tick(10000);

      expect(service.countdownTimer).toBe(50);
      expect(service.canResendCode).toBe(false);

      service.resetCountdown();

      expect(service.countdownTimer).toBe(60);
      expect(service.canResendCode).toBe(false);
    }));
  });

  describe('Observable streams', () => {
    it('should emit values to canResendCode$ observable during countdown', fakeAsync(() => {
      const emittedValues: boolean[] = [];

      service.canResendCode$.subscribe((value) => {
        emittedValues.push(value);
      });

      service.startCountdown();
      tick(60000);

      expect(emittedValues).toContain(false);
      expect(emittedValues).toContain(true);
    }));

    it('should emit values to countdownTimer$ observable during countdown', fakeAsync(() => {
      const emittedValues: number[] = [];

      service.countdownTimer$.subscribe((value) => {
        emittedValues.push(value);
      });

      service.startCountdown();
      tick(3000);

      expect(emittedValues).toContain(60);
      expect(emittedValues).toContain(59);
      expect(emittedValues).toContain(58);
      expect(emittedValues).toContain(57);

      service.clearInterval();
    }));
  });

  describe('Edge cases', () => {
    it('should handle rapid successive calls to startCountdown', fakeAsync(() => {
      service.startCountdown();
      service.startCountdown();
      service.startCountdown();

      expect(service.countdownTimer).toBe(60);
      expect(service.canResendCode).toBe(false);

      service.clearInterval();
    }));

    it('should handle clearInterval being called multiple times', () => {
      service.clearInterval();
      service.clearInterval();
      service.clearInterval();

      expect(() => service.clearInterval()).not.toThrow();
    });

    it('should handle resetCountdown being called multiple times', () => {
      service.resetCountdown();
      service.resetCountdown();
      service.resetCountdown();

      expect(service.countdownTimer).toBe(60);
      expect(service.canResendCode).toBe(false);
    });
  });
});
