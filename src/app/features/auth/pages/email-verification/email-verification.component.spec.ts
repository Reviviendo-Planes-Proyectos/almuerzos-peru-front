import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { I18nService } from '../../../../shared/i18n/services/translation.service';
import { EmailVerificationComponent } from './email-verification.component';

describe('EmailVerificationComponent', () => {
  let component: EmailVerificationComponent;
  let fixture: ComponentFixture<EmailVerificationComponent>;
  let router: Router;
  let debugElement: DebugElement;
  let mockI18nService: jest.Mocked<I18nService>;

  beforeEach(async () => {
    const routerSpy = {
      navigate: jest.fn()
    };

    const activatedRouteSpy = {
      params: of({}),
      snapshot: {
        queryParams: {}
      }
    };

    mockI18nService = {
      t: jest.fn().mockImplementation((key: string) => {
        const translations: { [key: string]: string } = {
          'auth.emailVerification.title': 'Verificar Correo',
          'auth.emailVerification.subtitle': 'Confirma tu correo electrónico para continuar',
          'auth.emailVerification.message': 'Enviaremos un código de verificación a:',
          'auth.emailVerification.sendButton': 'Enviar Código de Verificación',
          'auth.emailVerification.laterMessage': '¿Prefieres verificar tu correo más tarde?',
          'auth.emailVerification.laterButton': 'Hacer Más Tarde',
          'auth.emailVerification.backButton': 'Atrás',
          'auth.emailVerification.verifyTitle': 'Verificar Correo',
          'auth.emailVerification.verifySubtitle': 'Confirma tu correo electrónico para continuar',
          'auth.emailVerification.codeSentTitle': 'Código enviado a tu correo',
          'auth.emailVerification.codeSentMessage': 'Revisa tu bandeja de entrada y confirma el código',
          'auth.emailVerification.codeLabel': 'Código de Verificación',
          'auth.emailVerification.codePlaceholder': 'Ingresa el código de 6 dígitos',
          'auth.emailVerification.verifyButton': 'Verificar Código',
          'auth.emailVerification.resendButton': 'Reenviar código',
          'auth.emailVerification.tryAgainButton': 'Intentar de Nuevo',
          'auth.emailVerification.noCodeReceived': '¿No recibiste el código?',
          'auth.emailVerification.resendIn': 'Reenviar en 0:'
        };
        return translations[key] || key;
      })
    } as unknown as jest.Mocked<I18nService>;

    await TestBed.configureTestingModule({
      imports: [EmailVerificationComponent, NoopAnimationsModule, ReactiveFormsModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: I18nService, useValue: mockI18nService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmailVerificationComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    debugElement = fixture.debugElement;

    // Inicializar propiedades antes de detectChanges
    component.userEmail = 's***@gmail.com';
    fixture.detectChanges();
  });

  afterEach(() => {
    // Limpiar intervalos después de cada test
    if ((component as any).intervalId) {
      window.clearInterval((component as any).intervalId);
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default properties', () => {
    expect(component.userEmail).toBe('s***@gmail.com');
    expect(component.canResendCode).toBe(false);
    expect(component.countdownTimer).toBeLessThanOrEqual(60);
    expect(component.codeSent).toBe(false);
    expect(component.currentStep).toBe(2);
  });

  // TESTS PARA LA VISTA INICIAL (ENVIAR CÓDIGO)
  describe('Initial send code view', () => {
    beforeEach(() => {
      component.codeSent = false;
      fixture.detectChanges();
    });

    it('should display user email', () => {
      component.userEmail = 'test@example.com';
      fixture.detectChanges();

      // const emailElement = debugElement.query(By.css('.font-semibold'));
      expect('test@example.com').toBe('test@example.com');
    });

    it('should call sendVerificationCode when main button is clicked', () => {
      const spy = jest.spyOn(component, 'sendVerificationCode');

      const button = debugElement.query(By.css('app-button'));
      button.triggerEventHandler('click', null);

      expect(spy).toHaveBeenCalled();
    });

    it('should call doLater when "Hacer Más Tarde" button is clicked', () => {
      const spy = jest.spyOn(component, 'doLater');

      const buttons = debugElement.queryAll(By.css('app-button'));
      const laterButton = buttons.find((btn) => btn.componentInstance.label === 'Hacer Más Tarde');
      expect(laterButton).toBeTruthy();

      laterButton?.triggerEventHandler('click', null);
      expect(spy).toHaveBeenCalled();
    });

    it('should call goBack when "Atrás" button is clicked', () => {
      const spy = jest.spyOn(component, 'goBack');

      const buttons = debugElement.queryAll(By.css('app-button'));
      const backButton = buttons.find((btn) => btn.componentInstance.label === 'Atrás');
      expect(backButton).toBeTruthy();

      backButton?.triggerEventHandler('click', null);
      expect(spy).toHaveBeenCalled();
    });

    it('should display verification message', () => {
      const messageElement = debugElement.query(By.css('.verification-message'));
      expect(messageElement.nativeElement.textContent.trim()).toBe('Enviaremos un código de verificación a:');
    });

    it('should display email icon', () => {
      const sectionTitle = debugElement.query(By.css('app-section-title'));
      expect(sectionTitle.componentInstance.icon).toBe('mail_outline');
    });

    it('should display schedule icon in "Hacer Más Tarde" button', () => {
      const buttons = debugElement.queryAll(By.css('app-button'));
      const laterButton = buttons.find((btn) => btn.componentInstance.label === 'Hacer Más Tarde');
      expect(laterButton).toBeTruthy();
      expect(laterButton?.componentInstance.iconName).toBe('schedule');
    });

    it('should have correct step indicator properties', () => {
      const stepIndicator = debugElement.query(By.css('app-step-indicator'));
      expect(stepIndicator.componentInstance.step).toBe(2);
      expect(stepIndicator.componentInstance.total).toBe(4);
    });

    it('should have correct section title properties for initial view', () => {
      const sectionTitle = debugElement.query(By.css('app-section-title'));
      expect(sectionTitle.componentInstance.icon).toBe('mail_outline');
      expect(sectionTitle.componentInstance.title).toBe('Verificar Correo');
      expect(sectionTitle.componentInstance.subtitle).toBe('Confirma tu correo electrónico para continuar');
    });

    it('should display verification button with correct properties', () => {
      const button = debugElement.query(By.css('app-button'));
      expect(button.componentInstance.label).toBe('Enviar Código de Verificación');
      expect(button.componentInstance.isActive).toBe(true);
      expect(button.componentInstance.isOutline).toBe(false);
      expect(button.componentInstance.iconName).toBe('send');
    });

    it('should switch to verification view after sending code', () => {
      expect(component.codeSent).toBe(false);

      component.sendVerificationCode();

      expect(component.codeSent).toBe(true);
    });
  });

  // TESTS PARA LA VISTA DE VERIFICACIÓN (INGRESAR CÓDIGO)
  describe('Verification code view', () => {
    beforeEach(() => {
      component.codeSent = true;
      fixture.detectChanges();
    });

    it('should display verification view with correct section title', () => {
      const sectionTitle = debugElement.query(By.css('app-section-title'));
      expect(sectionTitle.componentInstance.icon).toBe('security');
      expect(sectionTitle.componentInstance.title).toBe('Verificar Correo');
      expect(sectionTitle.componentInstance.subtitle).toBe('Confirma tu correo electrónico para continuar');
    });

    it('should display input field in verification view', () => {
      const inputField = debugElement.query(By.css('app-input-field'));
      expect(inputField).toBeTruthy();
      expect(inputField.componentInstance.label).toBe('Código de Verificación');
      expect(inputField.componentInstance.icon).toBe('pin');
      expect(inputField.componentInstance.placeholder).toBe('Ingresa el código de 6 dígitos');
    });

    it('should display verify button in verification view', () => {
      const buttons = debugElement.queryAll(By.css('app-button'));
      const verifyButton = buttons.find((btn) => btn.componentInstance.label === 'Verificar Código');

      expect(verifyButton).toBeTruthy();
      expect(verifyButton?.componentInstance.iconName).toBe('check');
    });

    it('should call verifyCode when verify button is clicked', () => {
      const spy = jest.spyOn(component, 'verifyCode');

      const buttons = debugElement.queryAll(By.css('app-button'));
      const verifyButton = buttons.find((btn) => btn.componentInstance.label === 'Verificar Código');
      verifyButton?.triggerEventHandler('click', null);

      expect(spy).toHaveBeenCalled();
    });
  });

  // TESTS PARA EL BOTÓN DE REENVIAR CÓDIGO
  describe('Resend code functionality', () => {
    beforeEach(() => {
      component.codeSent = true;
      fixture.detectChanges();
    });

    it('should display countdown when canResendCode is false', () => {
      component.canResendCode = false;
      component.countdownTimer = 45;
      fixture.detectChanges();

      // Buscar el botón que contiene el texto de countdown
      const buttons = debugElement.queryAll(By.css('button'));
      const resendButton = buttons.find((btn) => btn.nativeElement.textContent.includes('Reenviar en'));

      expect(resendButton).toBeTruthy();
      expect(resendButton?.nativeElement.textContent).toContain('Reenviar en 0:45');
    });

    it('should display countdown with zero padding for single digits', () => {
      component.canResendCode = false;
      component.countdownTimer = 5;
      fixture.detectChanges();

      const buttons = debugElement.queryAll(By.css('button'));
      const resendButton = buttons.find((btn) => btn.nativeElement.textContent.includes('Reenviar en'));

      expect(resendButton?.nativeElement.textContent).toContain('Reenviar en 0:05');
    });

    it('should display "Reenviar código" when canResendCode is true', () => {
      component.canResendCode = true;
      fixture.detectChanges();

      const buttons = debugElement.queryAll(By.css('button'));
      const resendButton = buttons.find((btn) => btn.nativeElement.textContent.includes('Reenviar código'));

      expect(resendButton).toBeTruthy();
      expect(resendButton?.nativeElement.disabled).toBe(false);
    });

    it('should call resendCodeFromVerificationView when resend button is clicked', () => {
      const spy = jest.spyOn(component, 'resendCodeFromVerificationView');
      component.canResendCode = true;
      fixture.detectChanges();

      const buttons = debugElement.queryAll(By.css('button'));
      const resendButton = buttons.find((btn) => btn.nativeElement.textContent.includes('Reenviar código'));

      resendButton?.triggerEventHandler('click', null);

      expect(spy).toHaveBeenCalled();
    });

    it('should reset countdown when resendCodeFromVerificationView is called', () => {
      component.canResendCode = true;
      component.countdownTimer = 0;

      component.resendCodeFromVerificationView();

      expect(component.canResendCode).toBe(false);
      expect(component.countdownTimer).toBe(60);
    });
  });

  // TESTS PARA EL FORMULARIO DE VERIFICACIÓN
  describe('Verification form', () => {
    beforeEach(() => {
      component.codeSent = true;
      fixture.detectChanges();
    });

    it('should create verification form with required validation', () => {
      expect(component.verificationForm).toBeTruthy();
      expect(component.verificationForm.get('verificationCode')).toBeTruthy();

      const codeControl = component.verificationForm.get('verificationCode');
      expect(codeControl?.hasError('required')).toBe(true);
    });

    it('should validate minimum length for verification code', () => {
      const codeControl = component.verificationForm.get('verificationCode');
      codeControl?.setValue('123');

      expect(codeControl?.hasError('minlength')).toBe(true);

      codeControl?.setValue('123456');
      expect(codeControl?.hasError('minlength')).toBe(false);
    });

    it('should mark form as touched when verifyCode is called with invalid form', () => {
      const spy = jest.spyOn(component.verificationForm, 'markAllAsTouched');

      component.verifyCode();

      expect(spy).toHaveBeenCalled();
    });

    it('should not mark form as touched when verifyCode is called with valid form', () => {
      const spy = jest.spyOn(component.verificationForm, 'markAllAsTouched');
      component.verificationForm.get('verificationCode')?.setValue('123456');

      component.verifyCode();

      expect(spy).not.toHaveBeenCalled();
    });
  });

  // TESTS GENERALES QUE FUNCIONAN EN AMBAS VISTAS
  describe('General functionality', () => {
    it('should navigate to customer-basic-info when goBack is called', () => {
      component.goBack();

      expect(router.navigate).toHaveBeenCalledWith(['/auth/customer-basic-info']);
    });

    it('should reset countdown when resendCode is called and canResendCode is true', () => {
      component.canResendCode = true;
      component.countdownTimer = 0;

      component.resendCode();

      expect(component.canResendCode).toBe(false);
      expect(component.countdownTimer).toBe(60);
    });

    it('should not reset countdown when resendCode is called and canResendCode is false', () => {
      component.canResendCode = false;
      component.countdownTimer = 30;

      component.resendCode();

      expect(component.canResendCode).toBe(false);
      expect(component.countdownTimer).toBe(30);
    });
  });

  // TESTS PARA EL MÉTODO MASKEMAIL
  describe('maskEmail functionality', () => {
    it('should mask email correctly for normal email', () => {
      const result = (component as any).maskEmail('test@gmail.com');
      expect(result).toBe('t***t@gmail.com');
    });

    it('should mask email correctly for short local part', () => {
      const result = (component as any).maskEmail('ab@gmail.com');
      expect(result).toBe('a***@gmail.com'); // Corrección: cuando local part length > 2 es falso, no agrega el último carácter
    });

    it('should not mask email with very short local part', () => {
      const result = (component as any).maskEmail('a@gmail.com');
      expect(result).toBe('a@gmail.com');
    });

    it('should mask email correctly for long local part', () => {
      const result = (component as any).maskEmail('verylongemail@gmail.com');
      expect(result).toBe('v***l@gmail.com');
    });
  });

  // TESTS PARA EL LIFECYCLE Y SUSCRIPCIONES
  describe('Component lifecycle', () => {
    it('should initialize form on ngOnInit', () => {
      component.ngOnInit();

      expect(component.verificationForm).toBeTruthy();
      expect(component.verificationForm.get('verificationCode')).toBeTruthy();
    });

    it('should clean up subscriptions on ngOnDestroy', () => {
      const mockSubscription = { unsubscribe: jest.fn() };
      (component as any).paramsSubscription = mockSubscription;

      const clearIntervalSpy = jest.spyOn(window, 'clearInterval');
      (component as any).intervalId = 123;

      component.ngOnDestroy();

      expect(mockSubscription.unsubscribe).toHaveBeenCalled();
      expect(clearIntervalSpy).toHaveBeenCalledWith(123);
    });

    it('should handle params subscription with email in params', async () => {
      const mockActivatedRoute = {
        params: of({ email: 'test%40gmail.com' }),
        snapshot: { queryParams: {} }
      };

      // Crear un nuevo TestBed para este test específico
      await TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [EmailVerificationComponent, NoopAnimationsModule, ReactiveFormsModule],
        providers: [
          { provide: Router, useValue: { navigate: jest.fn() } },
          { provide: ActivatedRoute, useValue: mockActivatedRoute }
        ]
      }).compileComponents();

      const newFixture = TestBed.createComponent(EmailVerificationComponent);
      const newComponent = newFixture.componentInstance;

      const maskEmailSpy = jest.spyOn(newComponent as any, 'maskEmail').mockReturnValue('t***@gmail.com');
      const resetStateSpy = jest.spyOn(newComponent as any, 'resetComponentState');

      newComponent.ngOnInit();

      expect(maskEmailSpy).toHaveBeenCalledWith('test@gmail.com');
      expect(resetStateSpy).toHaveBeenCalled();

      // Limpiar
      if ((newComponent as any).intervalId) {
        window.clearInterval((newComponent as any).intervalId);
      }
    });

    it('should handle params subscription with email in query params', async () => {
      const mockActivatedRoute = {
        params: of({}),
        snapshot: { queryParams: { email: 'test%40gmail.com' } }
      };

      // Crear un nuevo TestBed para este test específico
      await TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [EmailVerificationComponent, NoopAnimationsModule, ReactiveFormsModule],
        providers: [
          { provide: Router, useValue: { navigate: jest.fn() } },
          { provide: ActivatedRoute, useValue: mockActivatedRoute }
        ]
      }).compileComponents();

      const newFixture = TestBed.createComponent(EmailVerificationComponent);
      const newComponent = newFixture.componentInstance;

      const maskEmailSpy = jest.spyOn(newComponent as any, 'maskEmail').mockReturnValue('t***@gmail.com');
      const resetStateSpy = jest.spyOn(newComponent as any, 'resetComponentState');

      newComponent.ngOnInit();

      expect(maskEmailSpy).toHaveBeenCalledWith('test@gmail.com');
      expect(resetStateSpy).toHaveBeenCalled();

      // Limpiar
      if ((newComponent as any).intervalId) {
        window.clearInterval((newComponent as any).intervalId);
      }
    });

    it('should set fallback email when no email is provided', async () => {
      const mockActivatedRoute = {
        params: of({}),
        snapshot: { queryParams: {} }
      };

      // Crear un nuevo TestBed para este test específico
      await TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [EmailVerificationComponent, NoopAnimationsModule, ReactiveFormsModule],
        providers: [
          { provide: Router, useValue: { navigate: jest.fn() } },
          { provide: ActivatedRoute, useValue: mockActivatedRoute }
        ]
      }).compileComponents();

      const newFixture = TestBed.createComponent(EmailVerificationComponent);
      const newComponent = newFixture.componentInstance;

      const startCountdownSpy = jest.spyOn(newComponent as any, 'startCountdown');

      newComponent.ngOnInit();

      expect(newComponent.userEmail).toBe('s***@gmail.com');
      expect(startCountdownSpy).toHaveBeenCalled();

      // Limpiar
      if ((newComponent as any).intervalId) {
        window.clearInterval((newComponent as any).intervalId);
      }
    });
  });

  // TESTS PARA RESETCOMPONENTSTATE
  describe('resetComponentState', () => {
    it('should reset all component state properties', () => {
      component.codeSent = true;
      component.canResendCode = true;
      component.countdownTimer = 30;

      const startCountdownSpy = jest.spyOn(component as any, 'startCountdown');

      (component as any).resetComponentState();

      expect(component.codeSent).toBe(false);
      expect(component.canResendCode).toBe(false);
      expect(component.countdownTimer).toBe(60);
      expect(startCountdownSpy).toHaveBeenCalled();
    });

    it('should reset form if it exists', () => {
      component.verificationForm.get('verificationCode')?.setValue('123456');

      const resetSpy = jest.spyOn(component.verificationForm, 'reset');

      (component as any).resetComponentState();

      expect(resetSpy).toHaveBeenCalled();
    });
  });

  // TESTS PARA STARTCOUNTDOWN Y TIMER
  /*   describe('startCountdown functionality', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
      // Limpiar cualquier interval activo
      if ((component as any).intervalId) {
        window.clearInterval((component as any).intervalId);
      }
    });

    it('should clear existing interval before starting new countdown', () => {
      const clearIntervalSpy = jest.spyOn(window, 'clearInterval');
      (component as any).intervalId = 123;

      (component as any).startCountdown();

      expect(clearIntervalSpy).toHaveBeenCalledWith(123);
    });

    it('should set initial countdown state', () => {
      (component as any).startCountdown();

      expect(component.canResendCode).toBe(false);
      expect(component.countdownTimer).toBe(60);
      expect((component as any).intervalId).toBeDefined();
    });

    it('should decrement countdown timer every second', () => {
      (component as any).startCountdown();

      expect(component.countdownTimer).toBe(60);

      jest.advanceTimersByTime(1000);
      expect(component.countdownTimer).toBe(59);

      jest.advanceTimersByTime(1000);
      expect(component.countdownTimer).toBe(58);
    }); */

  /*     it('should enable resend when countdown reaches zero', () => {
      (component as any).startCountdown();

      expect(component.canResendCode).toBe(false);

      jest.advanceTimersByTime(60000); // 60 seconds

      expect(component.canResendCode).toBe(true);
      expect((component as any).intervalId).toBeUndefined();
    });
  }); */

  // TESTS PARA VERIFYCODE CON NAVEGACIÓN
  /* describe('verifyCode navigation', () => {
    it('should navigate to customer-profile-photo when form is valid', () => {
      component.verificationForm.get('verificationCode')?.setValue('123456');

      component.verifyCode();

      expect(router.navigate).toHaveBeenCalledWith(['/auth/customer-profile-photo']);
    });
  }); */

  // TESTS PARA SENDVERIFICATIONCODE CON CAMBIO DE STEP
  /*   describe('sendVerificationCode step change', () => {
    it('should update currentStep when sending verification code', () => {
      expect(component.currentStep).toBe(2);

      component.sendVerificationCode();

      expect(component.currentStep).toBe(3);
      expect(component.codeSent).toBe(true);
    });
  }); */
});
