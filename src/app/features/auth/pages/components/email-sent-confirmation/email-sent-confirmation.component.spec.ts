import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { I18nService } from '../../../../../shared/i18n';
import { CoreModule, MaterialModule, SharedComponentsModule } from '../../../../../shared/modules';
import { EmailSentConfirmationComponent } from './email-sent-confirmation.component';

class MockI18nService {
  t(key: string): string {
    const translations: Record<string, string> = {
      'app.name': 'ALMUERZOS PERU',
      'auth.forgot.emailSent.title': 'Email Enviado',
      'auth.forgot.emailSent.description': 'Te hemos enviado un enlace de recuperación',
      'auth.forgot.emailSent.checkSpam': 'Revisa tu carpeta de spam',
      'auth.forgot.resendButton': 'Reenviar Email',
      'auth.forgot.backToLogin': 'Volver al Login',
      'auth.forgot.sending': 'Enviando...',
      'common.background': 'Fondo'
    };
    return translations[key] || key;
  }
}

describe('EmailSentConfirmationComponent', () => {
  let component: EmailSentConfirmationComponent;
  let fixture: ComponentFixture<EmailSentConfirmationComponent>;
  let mockRouter: any;
  let mockI18nService: MockI18nService;

  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn()
    };

    const mockActivatedRoute = {
      params: of({}),
      queryParams: of({}),
      snapshot: { params: {}, queryParams: {} }
    };

    mockI18nService = new MockI18nService();

    await TestBed.configureTestingModule({
      imports: [
        EmailSentConfirmationComponent,
        CoreModule,
        MaterialModule,
        SharedComponentsModule,
        NoopAnimationsModule
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: I18nService, useValue: mockI18nService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmailSentConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display confirmation message', () => {
    const titleElement = fixture.debugElement.query(By.css('h2'));
    expect(titleElement.nativeElement.textContent.trim()).toBe('Email Enviado');
  });

  it('should display success icon', () => {
    const iconElement = fixture.debugElement.query(By.css('.text-green-500'));
    expect(iconElement.nativeElement.textContent.trim()).toBe('mark_email_read');
  });

  it('should navigate to login when goToLogin is called', () => {
    component.goToLogin();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['auth/login']);
  });

  it('should show resend button when not loading', () => {
    component.isLoading = false;
    fixture.detectChanges();

    const resendButton = fixture.debugElement.query(By.css('app-button'));
    expect(resendButton).toBeTruthy();
  });

  it('should show loading spinner when resending', () => {
    component.isLoading = true;
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(By.css('mat-spinner'));
    expect(spinner).toBeTruthy();
  });

  it('should call resendEmail when resend button is clicked', () => {
    jest.spyOn(component, 'resendEmail');
    component.isLoading = false;
    fixture.detectChanges();

    const resendButton = fixture.debugElement.query(By.css('app-button'));
    resendButton.triggerEventHandler('click', null);

    expect(component.resendEmail).toHaveBeenCalled();
  });

  it('should handle resend email process', (done) => {
    component.resendEmail();

    expect(component.isLoading).toBe(true);

    setTimeout(() => {
      expect(component.isLoading).toBe(false);
      done();
    }, 2100);
  });
});
