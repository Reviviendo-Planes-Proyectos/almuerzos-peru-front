import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { EmailVerificationComponent } from './email-verification.component';

describe('EmailVerificationComponent', () => {
  let component: EmailVerificationComponent;
  let fixture: ComponentFixture<EmailVerificationComponent>;
  let router: Router;
  let debugElement: DebugElement;

  beforeEach(async () => {
    const routerSpy = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [EmailVerificationComponent, NoopAnimationsModule, ReactiveFormsModule],
      providers: [{ provide: Router, useValue: routerSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(EmailVerificationComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default properties', () => {
    expect(component.userEmail).toBe('s***@gmail.com');
    expect(component.canResendCode).toBe(false);
    expect(component.countdownTimer).toBeLessThanOrEqual(60);
    expect(component.codeSent).toBe(false);
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

      const emailElement = debugElement.query(By.css('.font-semibold'));
      expect(emailElement.nativeElement.textContent.trim()).toBe('test@example.com');
    });

    it('should call sendVerificationCode when main button is clicked', () => {
      const spy = jest.spyOn(component, 'sendVerificationCode');

      const button = debugElement.query(By.css('app-button'));
      button.triggerEventHandler('click', null);

      expect(spy).toHaveBeenCalled();
    });

    it('should call doLater when "Hacer Más Tarde" button is clicked', () => {
      const spy = jest.spyOn(component, 'doLater');

      const laterButton = debugElement.query(By.css('.btn-do-later'));
      laterButton.triggerEventHandler('click', null);

      expect(spy).toHaveBeenCalled();
    });

    it('should call goBack when "Atrás" button is clicked', () => {
      const spy = jest.spyOn(component, 'goBack');

      const backButton = debugElement.query(By.css('.btn-go-back'));
      backButton.triggerEventHandler('click', null);

      expect(spy).toHaveBeenCalled();
    });

    it('should display verification message', () => {
      const messageElement = debugElement.query(By.css('.verification-message'));
      expect(messageElement.nativeElement.textContent.trim()).toBe('Enviaremos un código de verificación a:');
    });

    it('should display email icon', () => {
      const emailIcon = debugElement.query(By.css('.material-icons'));
      expect(emailIcon.nativeElement.textContent.trim()).toBe('email');
    });

    it('should display schedule icon in "Hacer Más Tarde" button', () => {
      const laterButton = debugElement.query(By.css('.btn-do-later'));
      const scheduleIcon = laterButton.query(By.css('.material-icons'));

      expect(scheduleIcon.nativeElement.textContent.trim()).toBe('schedule');
    });

    it('should have correct step indicator properties', () => {
      const stepIndicator = debugElement.query(By.css('app-step-indicator'));
      expect(stepIndicator.componentInstance.step).toBe(2);
      expect(stepIndicator.componentInstance.total).toBe(5);
    });

    it('should have correct section title properties for initial view', () => {
      const sectionTitle = debugElement.query(By.css('app-section-title'));
      expect(sectionTitle.componentInstance.icon).toBe('email');
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
      expect(sectionTitle.componentInstance.icon).toBe('check_circle');
      expect(sectionTitle.componentInstance.title).toBe('Código de Verificación');
      expect(sectionTitle.componentInstance.subtitle).toBe('Revisa tu bandeja de entrada y confirma el código');
    });

    it('should display input field in verification view', () => {
      const inputField = debugElement.query(By.css('app-input-field'));
      expect(inputField).toBeTruthy();
      expect(inputField.componentInstance.label).toBe('Código de Verificación');
      expect(inputField.componentInstance.icon).toBe('verified_user');
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
});
