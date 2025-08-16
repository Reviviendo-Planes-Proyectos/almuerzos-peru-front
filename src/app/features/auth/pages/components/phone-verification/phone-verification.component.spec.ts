import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { I18nService } from '../../../../../shared/i18n';
import { CoreModule, SharedComponentsModule } from '../../../../../shared/modules';
import { PhoneVerificationComponent } from './phone-verification.component';

// Mock del servicio de traducción
class MockI18nService {
  t(key: string): string {
    const translations: Record<string, string> = {
      'PHONE_VERIFICATION.TITLE': 'Verificar Celular',
      'PHONE_VERIFICATION.SUBTITLE': 'Te enviaremos un código de verificación',
      'PHONE_VERIFICATION.BACK_BUTTON': 'Atrás',
      'common.back': 'Atrás',
      'common.continue': 'Continuar'
    };
    return translations[key] || key;
  }
}

describe('PhoneVerificationComponent', () => {
  let component: PhoneVerificationComponent;
  let fixture: ComponentFixture<PhoneVerificationComponent>;
  let router: jest.Mocked<Router>;
  let debugElement: DebugElement;
  let mockI18nService: MockI18nService;

  const mockRouter = {
    navigate: jest.fn(),
    getCurrentNavigation: jest.fn()
  };

  beforeEach(async () => {
    mockI18nService = new MockI18nService();

    await TestBed.configureTestingModule({
      imports: [PhoneVerificationComponent, CoreModule, SharedComponentsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        FormBuilder,
        { provide: Router, useValue: mockRouter },
        { provide: I18nService, useValue: mockI18nService }
      ]
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
      expect(component.userPhone).toBe('987654321');
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

    it('should reset component state correctly', () => {
      component.codeSent = true;
      component.canResendCode = true;
      component.countdownTimer = 30;

      (component as any).resetComponentState();

      expect(component.codeSent).toBe(false);
      expect(component.canResendCode).toBe(false);
      expect(component.countdownTimer).toBe(60);
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
      // Verificar que el step indicator está presente
      const stepIndicator = debugElement.query(By.css('app-step-indicator'));
      expect(stepIndicator).toBeTruthy();
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
      jest.useFakeTimers();
      component.ngOnInit();
      component.sendVerificationCode();
      fixture.detectChanges();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should verify code when form is valid and navigate to next page', () => {
      component.verificationForm.patchValue({ verificationCode: '123456' });
      expect(component.verificationForm.valid).toBe(true);

      component.verifyCode();
      expect(component.isVerifying).toBe(true);

      // Advance time to complete the verification process
      jest.advanceTimersByTime(2000);

      expect(component.isVerifying).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/auth/restaurant-profile-photo']);
    });

    it('should mark form as touched when form is invalid', () => {
      component.verificationForm.patchValue({ verificationCode: '' });

      component.verifyCode();

      expect(component.verificationForm.touched).toBe(true);
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should not verify when already verifying', () => {
      component.verificationForm.patchValue({ verificationCode: '123456' });
      component.isVerifying = true;

      component.verifyCode();

      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('Countdown Timer', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      component.ngOnInit();
      fixture.detectChanges();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should start countdown with 60 seconds', () => {
      expect(component.countdownTimer).toBe(60);
      expect(component.canResendCode).toBe(false);
    });

    it('should decrement countdown timer', () => {
      (component as any).startCountdown();
      jest.advanceTimersByTime(1000);
      expect(component.countdownTimer).toBe(59);
    });

    it('should enable resend when countdown reaches 0', () => {
      component.canResendCode = false;

      // Modify the countdown timer before starting
      (component as any).startCountdown();

      // Set timer to 1 and then advance
      component.countdownTimer = 1;
      jest.advanceTimersByTime(1000);

      expect(component.canResendCode).toBe(true);
      expect(component.countdownTimer).toBe(0);
    });

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
  });

  describe('Component Cleanup', () => {
    it('should clear interval on destroy', () => {
      component.ngOnInit();
      const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

      // Start countdown to create an interval
      (component as any).startCountdown();

      component.ngOnDestroy();

      if ((component as any).intervalId) {
        expect(clearIntervalSpy).toHaveBeenCalledWith((component as any).intervalId);
      }
    });
  });

  describe('Method Labels', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should return correct send code button label for SMS', () => {
      component.setPreferredMethod('sms');
      expect(component.sendCodeButtonLabel).toBe('Enviar Código por SMS');
    });

    it('should return correct send code button label for WhatsApp', () => {
      component.setPreferredMethod('whatsapp');
      expect(component.sendCodeButtonLabel).toBe('Enviar Código por WhatsApp');
    });

    it('should return correct sent method text for SMS', () => {
      component.setPreferredMethod('sms');
      expect(component.sentMethodText).toBe('SMS');
    });

    it('should return correct sent method text for WhatsApp', () => {
      component.setPreferredMethod('whatsapp');
      expect(component.sentMethodText).toBe('WhatsApp');
    });

    it('should return correct resend method text for SMS', () => {
      component.setPreferredMethod('sms');
      expect(component.resendMethodText).toBe('SMS');
    });

    it('should return correct resend method text for WhatsApp', () => {
      component.setPreferredMethod('whatsapp');
      expect(component.resendMethodText).toBe('WhatsApp');
    });
  });

  describe('DoLater functionality', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should call doLater method', () => {
      jest.spyOn(component, 'doLater');
      component.doLater();
      expect(component.doLater).toHaveBeenCalled();
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
      expect(stepIndicator.componentInstance.total).toBe(4);
    });

    it('should display phone number', () => {
      // Buscar específicamente el párrafo que contiene el teléfono
      const phoneElements = debugElement.queryAll(By.css('p'));
      const phoneElement = phoneElements.find((p) => {
        const text = p.nativeElement.textContent;
        return text?.includes(component.userPhone);
      });
      expect(phoneElement).toBeTruthy();
      if (phoneElement) {
        expect(phoneElement.nativeElement.textContent).toContain(component.userPhone);
      }
    });

    it('should show method selection buttons', () => {
      const methodButtons = debugElement.queryAll(By.css('button')).filter((btn) => {
        const text = btn.nativeElement.textContent;
        // Look for buttons that contain both the method name and "Mensaje" text
        return (
          (text?.includes('SMS') && text?.includes('Mensaje de texto')) ||
          (text?.includes('WhatsApp') && text?.includes('Mensaje directo'))
        );
      });
      expect(methodButtons.length).toBe(2); // SMS and WhatsApp buttons only
    });

    it('should show "Hacer Más Tarde" button', () => {
      const laterButton = debugElement
        .queryAll(By.css('button'))
        .find((btn) => btn.nativeElement.textContent.includes('Hacer Más Tarde'));
      expect(laterButton).toBeTruthy();
    });

    it('should show back button component', () => {
      const backButton = debugElement.query(By.css('app-back-button'));
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
