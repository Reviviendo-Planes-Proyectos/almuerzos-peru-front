import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

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
      imports: [EmailVerificationComponent, NoopAnimationsModule],
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

    // MEJORADO: Usar clase específica
    const laterButton = debugElement.query(By.css('.btn-do-later'));
    laterButton.triggerEventHandler('click', null);

    expect(spy).toHaveBeenCalled();
  });

  it('should call goBack when "Atrás" button is clicked', () => {
    const spy = jest.spyOn(component, 'goBack');

    // MEJORADO: Usar clase específica
    const backButton = debugElement.query(By.css('.btn-go-back'));
    backButton.triggerEventHandler('click', null);

    expect(spy).toHaveBeenCalled();
  });

  it('should navigate to customer-basic-info when goBack is called', () => {
    component.goBack();

    expect(router.navigate).toHaveBeenCalledWith(['/auth/customer-basic-info']);
  });

  it('should display verification message', () => {
    // MEJORADO: Usar clase específica
    const messageElement = debugElement.query(By.css('.verification-message'));
    expect(messageElement.nativeElement.textContent.trim()).toBe('Enviaremos un código de verificación a:');
  });

  it('should display email icon', () => {
    const emailIcon = debugElement.query(By.css('.material-icons'));
    expect(emailIcon.nativeElement.textContent.trim()).toBe('email');
  });

  it('should display schedule icon in "Hacer Más Tarde" button', () => {
    // MEJORADO: Usar clase específica
    const laterButton = debugElement.query(By.css('.btn-do-later'));
    const scheduleIcon = laterButton.query(By.css('.material-icons'));

    expect(scheduleIcon.nativeElement.textContent.trim()).toBe('schedule');
  });

  it('should have correct step indicator properties', () => {
    const stepIndicator = debugElement.query(By.css('app-step-indicator'));
    expect(stepIndicator.componentInstance.step).toBe(2);
    expect(stepIndicator.componentInstance.total).toBe(5);
  });

  it('should have correct section title properties', () => {
    const sectionTitle = debugElement.query(By.css('app-section-title'));
    expect(sectionTitle.componentInstance.icon).toBe('email');
    expect(sectionTitle.componentInstance.title).toBe('Verificar Correo');
    expect(sectionTitle.componentInstance.subtitle).toBe('Confirma tu correo electrónico para continuar');
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

  it('should display verification button with correct properties', () => {
    const button = debugElement.query(By.css('app-button'));
    expect(button.componentInstance.label).toBe('Enviar Código de Verificación');
    expect(button.componentInstance.isActive).toBe(true);
    expect(button.componentInstance.isOutline).toBe(false);
    expect(button.componentInstance.iconName).toBe('send');
  });
});
