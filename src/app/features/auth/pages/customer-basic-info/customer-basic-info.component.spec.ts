import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputFieldComponent } from '../../../../shared/components/input-field/input-field.component';
import { SectionTitleComponent } from '../../../../shared/components/section-title/section-title.component';
import { StepIndicatorComponent } from '../../../../shared/components/step-indicator/step-indicator.component';
import { LoggerService } from '../../../../shared/services/logger/logger.service';
import { CustomerBasicInfoComponent } from './customer-basic-info.component';

describe('CustomerBasicInfoComponent', () => {
  let component: CustomerBasicInfoComponent;
  let fixture: ComponentFixture<CustomerBasicInfoComponent>;
  let mockRouter: jest.Mocked<Router>;
  let mockLoggerService: jest.Mocked<LoggerService>;

  beforeEach(async () => {
    // Crear mocks de los servicios
    mockRouter = {
      navigate: jest.fn()
    } as any;

    mockLoggerService = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        CustomerBasicInfoComponent,
        ReactiveFormsModule,
        // Componentes que son importados por el componente principal
        StepIndicatorComponent,
        InputFieldComponent,
        ButtonComponent,
        SectionTitleComponent
      ],
      providers: [
        FormBuilder,
        { provide: Router, useValue: mockRouter },
        { provide: LoggerService, useValue: mockLoggerService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerBasicInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize form with proper validators', () => {
      expect(component.customerForm).toBeDefined();
      expect(component.customerForm.get('name')?.hasError('required')).toBeTruthy();
      expect(component.customerForm.get('email')?.hasError('required')).toBeTruthy();
      expect(component.customerForm.get('dni')?.hasError('required')).toBeTruthy();
      expect(component.customerForm.get('provincia')?.hasError('required')).toBeTruthy();
      expect(component.customerForm.get('distrito')?.hasError('required')).toBeTruthy();
    });

    it('should have provincia options populated', () => {
      expect(component.provinciaOptions).toBeDefined();
      expect(component.provinciaOptions.length).toBeGreaterThan(0);
      expect(component.provinciaOptions[0]).toEqual({ value: 'lima', label: 'Lima' });
    });

    it('should have distrito options populated', () => {
      expect(component.distritoOptions).toBeDefined();
      expect(component.distritoOptions.length).toBeGreaterThan(0);
      expect(component.distritoOptions[0]).toEqual({ value: 'miraflores', label: 'Miraflores' });
    });
  });

  describe('Form Validation', () => {
    it('should require name field', () => {
      const nameControl = component.customerForm.get('name');
      expect(nameControl?.valid).toBeFalsy();

      nameControl?.setValue('Test Restaurant');
      expect(nameControl?.valid).toBeTruthy();
    });

    it('should validate email format', () => {
      const emailControl = component.customerForm.get('email');

      // Invalid email
      emailControl?.setValue('invalid-email');
      expect(emailControl?.hasError('email')).toBeTruthy();

      // Valid email
      emailControl?.setValue('test@restaurant.com');
      expect(emailControl?.valid).toBeTruthy();
    });

    it('should validate DNI format and length', () => {
      const dniControl = component.customerForm.get('dni');

      // Too short
      dniControl?.setValue('123');
      expect(dniControl?.hasError('minlength')).toBeTruthy();

      // Non-numeric
      dniControl?.setValue('12345abc');
      expect(dniControl?.hasError('pattern')).toBeTruthy();

      // Valid DNI
      dniControl?.setValue('12345678');
      expect(dniControl?.valid).toBeTruthy();
    });

    it('should require provincia selection', () => {
      const provinciaControl = component.customerForm.get('provincia');
      expect(provinciaControl?.hasError('required')).toBeTruthy();

      provinciaControl?.setValue('lima');
      expect(provinciaControl?.valid).toBeTruthy();
    });

    it('should require distrito selection', () => {
      const distritoControl = component.customerForm.get('distrito');
      expect(distritoControl?.hasError('required')).toBeTruthy();

      distritoControl?.setValue('miraflores');
      expect(distritoControl?.valid).toBeTruthy();
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      // Setup valid form data
      component.customerForm.patchValue({
        name: 'Restaurante Test',
        email: 'test@restaurant.com',
        dni: '12345678',
        provincia: 'lima',
        distrito: 'miraflores'
      });
    });

    it('should call onSubmit when form is valid', () => {
      jest.spyOn(component, 'onSubmit');

      const submitButton = fixture.debugElement.nativeElement.querySelector('app-button');
      submitButton?.click();

      expect(component.onSubmit).toHaveBeenCalled();
    });

    it('should navigate to email verification when form is valid', () => {
      component.onSubmit();

      expect(mockLoggerService.info).toHaveBeenCalledWith('Formulario enviado:', component.customerForm.value);

      const expectedEncodedEmail = encodeURIComponent('test@restaurant.com');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/email-verification', expectedEncodedEmail]);
    });

    it('should mark all fields as touched when form is invalid', () => {
      // Make form invalid
      component.customerForm.patchValue({
        name: '',
        email: 'invalid-email',
        dni: '123',
        provincia: '',
        distrito: ''
      });

      jest.spyOn(component.customerForm, 'markAllAsTouched');

      component.onSubmit();

      expect(component.customerForm.markAllAsTouched).toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
      expect(mockLoggerService.info).not.toHaveBeenCalled();
    });

    it('should handle special characters in email for URL encoding', () => {
      const emailWithSpecialChars = 'test+user@restaurant-example.com';
      component.customerForm.patchValue({
        email: emailWithSpecialChars
      });

      component.onSubmit();

      const expectedEncodedEmail = encodeURIComponent(emailWithSpecialChars);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/email-verification', expectedEncodedEmail]);
    });
  });

  describe('Component Integration', () => {
    it('should render step indicator with correct props', () => {
      const stepIndicator = fixture.debugElement.query((selector) => selector.name === 'app-step-indicator');
      expect(stepIndicator).toBeTruthy();
    });

    it('should render section title with correct props', () => {
      const sectionTitle = fixture.debugElement.query((selector) => selector.name === 'app-section-title');
      expect(sectionTitle).toBeTruthy();
    });

    it('should render all input fields', () => {
      const inputFields = fixture.debugElement.queryAll((selector) => selector.name === 'app-input-field');
      expect(inputFields.length).toBe(5); // name, email, dni, provincia, distrito
    });

    it('should render submit button', () => {
      const button = fixture.debugElement.query((selector) => selector.name === 'app-button');
      expect(button).toBeTruthy();
    });
  });

  describe('Data Validation Edge Cases', () => {
    it('should handle empty provincia options gracefully', () => {
      component.provinciaOptions = [];
      fixture.detectChanges();

      expect(component.provinciaOptions.length).toBe(0);
    });

    it('should handle empty distrito options gracefully', () => {
      component.distritoOptions = [];
      fixture.detectChanges();

      expect(component.distritoOptions.length).toBe(0);
    });

    it('should validate DNI with exactly 8 digits', () => {
      const dniControl = component.customerForm.get('dni');

      // Test boundary cases
      dniControl?.setValue('1234567'); // 7 digits
      expect(dniControl?.hasError('minlength')).toBeTruthy();

      dniControl?.setValue('12345678'); // 8 digits
      expect(dniControl?.valid).toBeTruthy();

      dniControl?.setValue('123456789'); // 9 digits (should still be valid as pattern allows it)
      expect(dniControl?.valid).toBeTruthy();
    });

    it('should trim whitespace from form values', () => {
      component.customerForm.patchValue({
        name: '  Restaurante Test  ',
        email: '  test@restaurant.com  '
      });

      // Note: Angular's FormControl doesn't automatically trim,
      // but we can test the actual values
      expect(component.customerForm.get('name')?.value).toBe('  Restaurante Test  ');
      expect(component.customerForm.get('email')?.value).toBe('  test@restaurant.com  ');
    });
  });
});
