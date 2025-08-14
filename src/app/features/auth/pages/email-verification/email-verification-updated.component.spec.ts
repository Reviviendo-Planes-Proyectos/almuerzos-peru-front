import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { I18nService } from '../../../../shared/i18n/services/translation.service';
import { CoreModule } from '../../../../shared/modules';
import { EmailVerificationComponent } from './email-verification.component';

// Mocks
const mockRouter = {
  navigate: jest.fn()
};

const mockActivatedRoute = {
  params: of({ email: 'test%40example.com' }),
  snapshot: {
    queryParams: { email: 'test@example.com' }
  }
};

const mockI18nService = {
  t: jest.fn((key: string) => {
    const translations: { [key: string]: string } = {
      'app.name': 'Almuerza Perú',
      'common.background': 'Fondo'
    };
    return translations[key] || key;
  })
};

const mockChangeDetectorRef = {
  detectChanges: jest.fn()
};

describe('EmailVerificationComponent', () => {
  let component: EmailVerificationComponent;
  let fixture: ComponentFixture<EmailVerificationComponent>;
  let router: jest.Mocked<Router>;
  let activatedRoute: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailVerificationComponent, CoreModule],
      providers: [
        CoreModule,
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: I18nService, useValue: mockI18nService },
        { provide: ChangeDetectorRef, useValue: mockChangeDetectorRef }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(EmailVerificationComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
    activatedRoute = TestBed.inject(ActivatedRoute);

    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize form and subscribe to route params', () => {
      component.ngOnInit();

      expect(component.verificationForm).toBeDefined();
      expect(component.verificationForm.get('verificationCode')).toBeDefined();
    });

    it('should set email from route params', () => {
      component.ngOnInit();

      expect(component.originalEmail).toBe('test@example.com');
      expect(component.userEmail).toBe('t***t@example.com');
    });

    it('should set email from query params when route param is not available', () => {
      activatedRoute.params = of({});

      component.ngOnInit();

      expect(component.originalEmail).toBe('test@example.com');
    });

    it('should set default email when no email is provided', () => {
      activatedRoute.params = of({});
      activatedRoute.snapshot.queryParams = {};

      component.ngOnInit();

      expect(component.userEmail).toBe('s***@gmail.com');
    });

    it('should reset component state when email changes', fakeAsync(() => {
      component.codeSent = true;
      component.canResendCode = true;
      component.countdownTimer = 30;

      component.ngOnInit();
      tick(1);

      component.codeSent = true;
      component.canResendCode = true;
      component.countdownTimer = 30;

      (component as any).resetComponentState();

      expect(component.codeSent).toBe(false);
      expect(component.canResendCode).toBe(false);
      expect(component.countdownTimer).toBe(60);

      tick(60000);
    }));
  });

  describe('maskEmail', () => {
    it('should mask email correctly', () => {
      const maskedEmail = (component as any).maskEmail('john.doe@example.com');
      expect(maskedEmail).toBe('j***e@example.com');
    });

    it('should handle short email local part', () => {
      const maskedEmail = (component as any).maskEmail('a@example.com');
      expect(maskedEmail).toBe('a@example.com');
    });

    it('should handle two character email local part', () => {
      const maskedEmail = (component as any).maskEmail('ab@example.com');
      expect(maskedEmail).toBe('a***@example.com');
    });
  });

  describe('sendVerificationCode', () => {
    it('should set codeSent to true and start countdown', fakeAsync(() => {
      component.sendVerificationCode();

      expect(component.codeSent).toBe(true);
      expect(component.canResendCode).toBe(false);
      expect(component.countdownTimer).toBe(60);

      tick(1000);
      expect(component.countdownTimer).toBe(59);

      tick(60000);
    }));
  });

  describe('verifyCode', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should navigate to customer-profile-photo when form is valid and originalEmail exists', () => {
      component.originalEmail = 'test@example.com';
      component.verificationForm.patchValue({ verificationCode: '123456' });

      component.verifyCode();

      expect(router.navigate).toHaveBeenCalledWith(['/auth/customer-profile-photo'], {
        queryParams: { email: 'test@example.com' }
      });
    });

    it('should navigate to customer-profile-photo without email when originalEmail is null', () => {
      component.originalEmail = null;
      component.verificationForm.patchValue({ verificationCode: '123456' });

      component.verifyCode();

      expect(router.navigate).toHaveBeenCalledWith(['/auth/customer-profile-photo']);
    });

    it('should mark form as touched when form is invalid', () => {
      const markAllAsTouchedSpy = jest.spyOn(component.verificationForm, 'markAllAsTouched');
      component.verificationForm.patchValue({ verificationCode: '' });

      component.verifyCode();

      expect(markAllAsTouchedSpy).toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('resendCode', () => {
    it('should start countdown when canResendCode is true', fakeAsync(() => {
      component.canResendCode = true;

      component.resendCode();

      expect(component.canResendCode).toBe(false);
      expect(component.countdownTimer).toBe(60);

      tick(1000);
      expect(component.countdownTimer).toBe(59);

      tick(60000);
    }));

    it('should not start countdown when canResendCode is false', () => {
      component.canResendCode = false;
      const startCountdownSpy = jest.spyOn(component as any, 'startCountdown');

      component.resendCode();

      expect(startCountdownSpy).not.toHaveBeenCalled();
    });
  });

  describe('resendCodeFromVerificationView', () => {
    it('should always start countdown', fakeAsync(() => {
      component.resendCodeFromVerificationView();

      expect(component.canResendCode).toBe(false);
      expect(component.countdownTimer).toBe(60);

      tick(1000);
      expect(component.countdownTimer).toBe(59);

      tick(60000);
    }));
  });

  describe('doLater', () => {
    it('should navigate to customer-profile-photo with email when originalEmail exists', () => {
      component.originalEmail = 'test@example.com';

      component.doLater();

      expect(router.navigate).toHaveBeenCalledWith(['/auth/customer-profile-photo'], {
        queryParams: { email: 'test@example.com' }
      });
    });

    it('should navigate to customer-profile-photo without email when originalEmail is null', () => {
      component.originalEmail = null;

      component.doLater();

      expect(router.navigate).toHaveBeenCalledWith(['/auth/customer-profile-photo']);
    });
  });

  describe('goBack', () => {
    it('should navigate to customer-basic-info', () => {
      component.goBack();

      expect(router.navigate).toHaveBeenCalledWith(['/auth/customer-basic-info']);
    });
  });

  describe('onBackClick', () => {
    it('should call goBack', () => {
      const goBackSpy = jest.spyOn(component, 'goBack');

      component.onBackClick();

      expect(goBackSpy).toHaveBeenCalled();
    });
  });

  describe('countdown functionality', () => {
    it('should enable resend after countdown completes', fakeAsync(() => {
      (component as any).startCountdown();

      expect(component.canResendCode).toBe(false);
      expect(component.countdownTimer).toBe(60);

      tick(60000);

      expect(component.canResendCode).toBe(true);
      expect(component.countdownTimer).toBe(0);
    }));

    it('should clear previous interval when starting new countdown', fakeAsync(() => {
      const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

      (component as any).startCountdown();

      (component as any).startCountdown();

      expect(clearIntervalSpy).toHaveBeenCalled();

      tick(60000);
    }));
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from params and clear interval', () => {
      component.ngOnInit();
      const unsubscribeSpy = jest.spyOn((component as any).paramsSubscription, 'unsubscribe');
      const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

      component.ngOnDestroy();

      expect(unsubscribeSpy).toHaveBeenCalled();
      expect(clearIntervalSpy).toHaveBeenCalled();
    });

    it('should handle missing subscription gracefully', () => {
      expect(() => component.ngOnDestroy()).not.toThrow();
    });
  });

  describe('form validation', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should require verification code', () => {
      const verificationCodeControl = component.verificationForm.get('verificationCode');

      expect(verificationCodeControl?.hasError('required')).toBe(true);

      verificationCodeControl?.setValue('123456');
      expect(verificationCodeControl?.hasError('required')).toBe(false);
    });

    it('should require minimum length of 6 for verification code', () => {
      const verificationCodeControl = component.verificationForm.get('verificationCode');

      verificationCodeControl?.setValue('123');
      expect(verificationCodeControl?.hasError('minlength')).toBe(true);

      verificationCodeControl?.setValue('123456');
      expect(verificationCodeControl?.hasError('minlength')).toBe(false);
    });

    it('should be valid when verification code has 6 characters', () => {
      component.verificationForm.patchValue({ verificationCode: '123456' });

      expect(component.verificationForm.valid).toBe(true);
    });
  });

  describe('resetComponentState', () => {
    it('should reset all component state', () => {
      component.codeSent = true;
      component.canResendCode = true;
      component.countdownTimer = 30;
      component.ngOnInit();
      component.verificationForm.patchValue({ verificationCode: '123456' });

      (component as any).resetComponentState();

      expect(component.codeSent).toBe(false);
      expect(component.canResendCode).toBe(false);
      expect(component.countdownTimer).toBe(60);
      expect(component.verificationForm.get('verificationCode')?.value).toBe(null);
    });
  });

  describe('template integration', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should display app name', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Almuerza Perú');
    });

    it('should show send code view when codeSent is false', () => {
      component.codeSent = false;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const buttons = compiled.querySelectorAll('button');
      let foundSendButton = false;

      for (const button of buttons) {
        if (button.textContent?.includes('Enviar Código de Verificación')) {
          foundSendButton = true;
          break;
        }
      }

      expect(foundSendButton).toBe(true);
    });

    it('should show verify code view when codeSent is true', () => {
      component.codeSent = true;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Verificar Código');
    });

    it('should display masked email', () => {
      component.userEmail = 't***t@example.com';
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('t***t@example.com');
    });
  });
});
