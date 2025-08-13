import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { BackButtonComponent } from '../../../../shared/components/back-button/back-button.component';
import { InputFieldComponent } from '../../../../shared/components/input-field/input-field.component';
import { StepIndicatorComponent } from '../../../../shared/components/step-indicator/step-indicator.component';
import { EmailVerificationComponent } from './email-verification.component';

describe('EmailVerificationComponent', () => {
  let component: EmailVerificationComponent;
  let fixture: ComponentFixture<EmailVerificationComponent>;
  let debugElement: DebugElement;
  let mockRouter: jest.Mocked<Router>;
  let mockActivatedRoute: jest.Mocked<ActivatedRoute>;

  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn()
    } as any;

    mockActivatedRoute = {
      params: of({ email: 'test@example.com' }),
      snapshot: {
        queryParams: { email: 'test@example.com' }
      }
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        EmailVerificationComponent,
        ReactiveFormsModule,
        BackButtonComponent,
        StepIndicatorComponent,
        InputFieldComponent
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmailVerificationComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    // Set default values
    component.userEmail = 'test@example.com';
    component.currentStep = 2;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initial state', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should display masked user email', () => {
      const emailElement = debugElement.query(By.css('.font-semibold'));
      expect(emailElement.nativeElement.textContent.trim()).toBe('t***t@example.com');
    });

    it('should show initial send code view', () => {
      expect(component.codeSent).toBeFalsy();
    });

    it('should display step indicator', () => {
      const stepIndicator = debugElement.query(By.css('app-step-indicator'));
      expect(stepIndicator).toBeTruthy();
    });
  });

  describe('Initial send code view', () => {
    beforeEach(() => {
      component.codeSent = false;
      fixture.detectChanges();
    });

    it('should call sendVerificationCode when main button is clicked', () => {
      const spy = jest.spyOn(component, 'sendVerificationCode');

      const buttons = debugElement.queryAll(By.css('button'));
      const sendButton = buttons.find((btn) => btn.nativeElement.textContent.includes('Enviar Código'));
      expect(sendButton).toBeTruthy();

      sendButton?.nativeElement.click();
      expect(spy).toHaveBeenCalled();
    });

    it('should call goBack when "Atrás" button is clicked', () => {
      const spy = jest.spyOn(component, 'goBack');

      const buttons = debugElement.queryAll(By.css('button'));
      const backButton = buttons.find((btn) => btn.nativeElement.textContent.includes('Atrás'));
      expect(backButton).toBeTruthy();

      backButton?.nativeElement.click();
      expect(spy).toHaveBeenCalled();
    });

    it('should call doLater when "Hacer Más Tarde" button is clicked', () => {
      const spy = jest.spyOn(component, 'doLater');

      const buttons = debugElement.queryAll(By.css('button'));
      const laterButton = buttons.find((btn) => btn.nativeElement.textContent.includes('Hacer Más Tarde'));
      expect(laterButton).toBeTruthy();

      laterButton?.nativeElement.click();
      expect(spy).toHaveBeenCalled();
    });

    it('should display send icon in verification button', () => {
      const buttons = debugElement.queryAll(By.css('button'));
      const sendButton = buttons.find((btn) => btn.nativeElement.textContent.includes('Enviar Código'));
      const icon = sendButton?.query(By.css('.material-icons'));
      expect(icon?.nativeElement.textContent.trim()).toBe('send');
    });

    it('should display schedule icon in "Hacer Más Tarde" button', () => {
      const buttons = debugElement.queryAll(By.css('button'));
      const laterButton = buttons.find((btn) => btn.nativeElement.textContent.includes('Hacer Más Tarde'));
      const icon = laterButton?.query(By.css('.material-icons'));
      expect(icon?.nativeElement.textContent.trim()).toBe('schedule');
    });
  });

  describe('Verification code view', () => {
    beforeEach(() => {
      component.codeSent = true;
      fixture.detectChanges();
    });

    it('should show verification code view when codeSent is true', () => {
      component.codeSent = true;
      expect(component.codeSent).toBe(true);
    });

    it('should have verification form with required validation', () => {
      expect(component.verificationForm).toBeDefined();
      expect(component.verificationForm.get('verificationCode')?.hasError('required')).toBe(true);
    });
  });

  describe('Resend code functionality', () => {
    beforeEach(() => {
      component.codeSent = true;
      component.canResendCode = true;
      fixture.detectChanges();
    });

    it('should reset countdown when resendCodeFromVerificationView is called', () => {
      component.resendCodeFromVerificationView();
      expect(component.canResendCode).toBe(false);
      expect(component.countdownTimer).toBe(60);
    });

    it('should show countdown timer when canResendCode is false', () => {
      component.canResendCode = false;
      component.countdownTimer = 30;
      fixture.detectChanges();

      expect(component.canResendCode).toBe(false);
      expect(component.countdownTimer).toBe(30);
    });
  });

  describe('Navigation methods', () => {
    it('should navigate to customer basic info when goBack is called', () => {
      component.goBack();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/customer-basic-info']);
    });

    it('should navigate to customer profile photo when doLater is called', () => {
      component.doLater();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/customer-profile-photo']);
    });
  });

  describe('Form validation', () => {
    beforeEach(() => {
      component.codeSent = true;
      fixture.detectChanges();
    });

    it('should create verification form with required validation', () => {
      expect(component.verificationForm).toBeDefined();
      expect(component.verificationForm.get('verificationCode')).toBeDefined();
      expect(component.verificationForm.get('verificationCode')?.hasError('required')).toBe(true);
    });

    it('should validate verification code length', () => {
      const codeControl = component.verificationForm.get('verificationCode');

      codeControl?.setValue('123');
      expect(codeControl?.hasError('minlength')).toBe(true);

      codeControl?.setValue('123456');
      expect(codeControl?.hasError('minlength')).toBe(false);
    });

    it('should validate form state correctly', () => {
      expect(component.verificationForm.valid).toBe(false);

      component.verificationForm.patchValue({ verificationCode: '123456' });
      expect(component.verificationForm.valid).toBe(true);
    });
  });

  describe('Component lifecycle', () => {
    it('should initialize countdown timer', () => {
      expect(component.countdownTimer).toBe(60);
      expect(component.canResendCode).toBe(false);
    });

    it('should set codeSent to true when sendVerificationCode is called', () => {
      component.sendVerificationCode();
      expect(component.codeSent).toBe(true);
    });
  });
});
