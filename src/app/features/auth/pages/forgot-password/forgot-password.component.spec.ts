import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { I18nService } from '../../../../shared/i18n';
import { ForgotPasswordComponent } from './forgot-password.component';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let mockRouter: any;
  let mockI18nService: any;

  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn()
    };

    mockI18nService = {
      t: jest.fn().mockReturnValue('Mocked Translation')
    };

    await TestBed.configureTestingModule({
      imports: [ForgotPasswordComponent, NoopAnimationsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: I18nService, useValue: mockI18nService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with email control', () => {
    expect(component.forgotPasswordForm).toBeDefined();
    expect(component.forgotPasswordForm.get('email')).toBeTruthy();
  });

  it('should navigate to login when goToLogin is called', () => {
    component.goToLogin();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['auth/login']);
  });

  it('should show form by default', () => {
    const formElement = fixture.debugElement.query(By.css('form'));
    expect(formElement).toBeTruthy();
  });

  it('should require email field', () => {
    const emailControl = component.email;
    expect(emailControl?.valid).toBe(false);

    emailControl?.setValue('test@example.com');
    expect(emailControl?.valid).toBe(true);
  });

  it('should validate email format', () => {
    const emailControl = component.email;

    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBe(true);

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.hasError('email')).toBe(false);
  });

  it('should disable submit button when form is invalid', () => {
    const submitButtonComponent = fixture.debugElement.query(By.css('app-button'));
    expect(submitButtonComponent).toBeTruthy();

    expect(submitButtonComponent.componentInstance.isActive).toBe(false);

    component.forgotPasswordForm.patchValue({ email: 'test@example.com' });
    fixture.detectChanges();

    expect(submitButtonComponent.componentInstance.isActive).toBe(true);
  });

  it('should show loading state during submission', () => {
    component.forgotPasswordForm.patchValue({ email: 'test@example.com' });
    component.onSubmit();

    expect(component.isLoading).toBe(true);
  });

  it('should navigate to email confirmation after successful submission', (done) => {
    component.forgotPasswordForm.patchValue({ email: 'test@example.com' });
    component.onSubmit();

    setTimeout(() => {
      expect(mockRouter.navigate).toHaveBeenCalledWith(['auth/email-sent-confirmation']);
      done();
    }, 2100);
  });

  it('should call translation service for text content', () => {
    expect(mockI18nService.t).toHaveBeenCalled();
  });
});
