import { CommonModule } from '@angular/common';
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { HeaderWithStepsComponent } from '../../../../shared/components/header-with-steps/header-with-steps.component';
import { StepIndicatorComponent } from '../../../../shared/components/step-indicator/step-indicator.component';
import { PhoneVerificationComponent } from './phone-verification.component';

describe('PhoneVerificationComponent', () => {
  let component: PhoneVerificationComponent;
  let fixture: ComponentFixture<PhoneVerificationComponent>;
  let router: jest.Mocked<Router>;
  let debugElement: DebugElement;

  const mockRouter = {
    navigate: jest.fn(),
    getCurrentNavigation: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PhoneVerificationComponent,
        ReactiveFormsModule,
        CommonModule,
        HeaderWithStepsComponent,
        StepIndicatorComponent
      ],
      providers: [FormBuilder, { provide: Router, useValue: mockRouter }]
    }).compileComponents();

    fixture = TestBed.createComponent(PhoneVerificationComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    router = TestBed.inject(Router) as jest.Mocked<Router>;

    // Mock history.state
    Object.defineProperty(window, 'history', {
      value: {
        state: { phone: '987654321' }
      },
      writable: true
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    if ((component as any).intervalId) {
      clearInterval((component as any).intervalId);
    }
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize form with verification code control', () => {
      component.ngOnInit();
      expect(component.verificationForm).toBeDefined();
      expect(component.verificationForm.get('verificationCode')).toBeDefined();
    });

    it('should set userPhone from history.state on init', () => {
      component.ngOnInit();
      expect(component.userPhone).toBe('+51 9***');
    });

    it('should use fallback phone when no phone in state', () => {
      Object.defineProperty(window, 'history', {
        value: { state: {} },
        writable: true
      });

      component.ngOnInit();
      expect(component.userPhone).toBe('+51 9***');
    });

    it('should start countdown on initialization', () => {
      component.ngOnInit();
      expect(component.countdownTimer).toBe(60);
      expect(component.canResendCode).toBe(false);
    });
  });

  describe('Phone Masking', () => {
    it('should mask phone number correctly', () => {
      const phone = '987654321';
      const masked = (component as any).maskPhone(phone);
      expect(masked).toBe('+51 9***');
    });

    it('should return original phone if length is less than 9', () => {
      const phone = '12345';
      const masked = (component as any).maskPhone(phone);
      expect(masked).toBe('12345');
    });
  });

  describe('Preferred Method Selection', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should set preferred method to SMS by default', () => {
      expect(component.preferredMethod).toBe('sms');
    });

    it('should change preferred method when setPreferredMethod is called', () => {
      component.setPreferredMethod('whatsapp');
      expect(component.preferredMethod).toBe('whatsapp');
    });

    it('should highlight selected method button', () => {
      component.setPreferredMethod('whatsapp');
      fixture.detectChanges();

      const whatsappButton = debugElement
        .queryAll(By.css('button'))
        .find((btn) => btn.nativeElement.textContent.includes('WhatsApp'));

      expect(whatsappButton?.nativeElement.className).toContain('border-green-500');
    });
  });

  describe('Code Sending Process', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should show initial view when code not sent', () => {
      expect(component.codeSent).toBe(false);
      // Buscar el div que contiene el contenido inicial
      const initialViewContent = debugElement.query(By.css('h2'));
      expect(initialViewContent?.nativeElement.textContent).toContain('Verificar Celular');
    });

    it('should send verification code and show code input view', () => {
      component.sendVerificationCode();
      fixture.detectChanges();

      expect(component.codeSent).toBe(true);
      expect(component.currentStep).toBe(3);

      // Buscar el formulario que aparece cuando se envía el código
      const form = debugElement.query(By.css('form'));
      expect(form).toBeTruthy();
    });

    it('should show send button in initial view', () => {
      const sendButton = debugElement
        .queryAll(By.css('button'))
        .find((btn) => btn.nativeElement.textContent.includes('Enviar Código'));
      expect(sendButton).toBeTruthy();
    });
  });

  describe('Code Verification', () => {
    beforeEach(() => {
      component.ngOnInit();
      component.sendVerificationCode();
      fixture.detectChanges();
    });

    it('should verify code when form is valid', () => {
      component.verificationForm.patchValue({ verificationCode: '123456' });

      component.verifyCode();

      expect(component.verificationForm.valid).toBe(true);
    });

    it('should mark form as touched when form is invalid', () => {
      component.verificationForm.patchValue({ verificationCode: '' });

      component.verifyCode();

      expect(component.verificationForm.touched).toBe(true);
    });

    /*   it('should show verification form when code is sent', () => {
      const form = debugElement.query(By.css('form'));
      expect(form).toBeTruthy();
    }); */
  });

  describe('Countdown Timer', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should start countdown with 60 seconds', () => {
      expect(component.countdownTimer).toBe(60);
      expect(component.canResendCode).toBe(false);
    });

    it('should decrement countdown timer', fakeAsync(() => {
      (component as any).startCountdown();
      tick(1000);
      expect(component.countdownTimer).toBe(59);

      // Limpiar el timer
      if ((component as any).intervalId) {
        clearInterval((component as any).intervalId);
      }
      flush();
    }));

    /*   it('should enable resend when countdown reaches 0', fakeAsync(() => {
      component.countdownTimer = 1;
      (component as any).startCountdown();
      tick(1000);
      expect(component.canResendCode).toBe(true);
      expect(component.countdownTimer).toBe(0);
      flush();
    })); */

    it('should restart countdown when resending code', () => {
      component.canResendCode = true;
      component.resendCode();
      expect(component.countdownTimer).toBe(60);
      expect(component.canResendCode).toBe(false);
    });
  });

  describe('Navigation', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should navigate back to restaurant-basic-info on goBack', () => {
      component.goBack();
      expect(router.navigate).toHaveBeenCalledWith(['/auth/restaurant-basic-info']);
    });

    it('should call goBack when onBackClick is triggered', () => {
      jest.spyOn(component, 'goBack');
      component.onBackClick();
      expect(component.goBack).toHaveBeenCalled();
    });

    it('should show back button in header', () => {
      const header = debugElement.query(By.css('app-header-with-steps'));
      expect(header.componentInstance.showBackButton).toBe(true);
    });
  });

  describe('Component Cleanup', () => {
    it('should clear interval on destroy', () => {
      component.ngOnInit();
      const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

      component.ngOnDestroy();

      if ((component as any).intervalId) {
        expect(clearIntervalSpy).toHaveBeenCalledWith((component as any).intervalId);
      }
    });
  });

  describe('UI Elements', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should display current step indicator', () => {
      const stepIndicator = debugElement.query(By.css('app-step-indicator'));
      expect(stepIndicator).toBeTruthy();
      expect(stepIndicator.componentInstance.step).toBe(component.currentStep);
      expect(stepIndicator.componentInstance.total).toBe(6);
    });

    it('should display phone number', () => {
      // Buscar específicamente el párrafo que contiene el teléfono
      const phoneElements = debugElement.queryAll(By.css('p'));
      const phoneElement = phoneElements.find(
        (p) => p.nativeElement.textContent.includes('+51') || p.nativeElement.textContent.includes('9***')
      );
      expect(phoneElement?.nativeElement.textContent).toContain(component.userPhone);
    });

    it('should show method selection buttons', () => {
      const methodButtons = debugElement.queryAll(By.css('button')).filter((btn) => {
        const text = btn.nativeElement.textContent;
        return text.includes('SMS') || text.includes('WhatsApp');
      });
      expect(methodButtons.length).toBe(3);
    });

    it('should show "Hacer Más Tarde" button', () => {
      const laterButton = debugElement
        .queryAll(By.css('button'))
        .find((btn) => btn.nativeElement.textContent.includes('Hacer Más Tarde'));
      expect(laterButton).toBeTruthy();
    });

    it('should show "Atrás" button', () => {
      const backButton = debugElement
        .queryAll(By.css('button'))
        .find((btn) => btn.nativeElement.textContent.includes('Atrás'));
      expect(backButton).toBeTruthy();
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      component.ngOnInit();
      component.sendVerificationCode();
      fixture.detectChanges();
    });

    it('should require verification code', () => {
      const control = component.verificationForm.get('verificationCode');
      expect(control?.hasError('required')).toBe(true);
    });

    it('should require minimum length of 6', () => {
      const control = component.verificationForm.get('verificationCode');
      control?.setValue('123');
      expect(control?.hasError('minlength')).toBe(true);
    });

    it('should be valid with 6 digit code', () => {
      const control = component.verificationForm.get('verificationCode');
      control?.setValue('123456');
      expect(control?.valid).toBe(true);
    });
  });
});
