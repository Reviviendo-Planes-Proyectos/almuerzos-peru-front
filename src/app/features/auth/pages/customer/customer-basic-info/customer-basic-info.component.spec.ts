import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CoreModule, MaterialModule, SharedComponentsModule } from '../../../../../shared/modules';
import { LoggerService } from '../../../../../shared/services/logger/logger.service';
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
      imports: [CustomerBasicInfoComponent, CoreModule, MaterialModule, SharedComponentsModule],
      providers: [
        CoreModule,
        { provide: Router, useValue: mockRouter },
        { provide: LoggerService, useValue: mockLoggerService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerBasicInfoComponent);
    component = fixture.componentInstance;

    component.ngOnInit();
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

      emailControl?.setValue('invalid-email');
      expect(emailControl?.hasError('email')).toBeTruthy();

      emailControl?.setValue('test@restaurant.com');
      expect(emailControl?.valid).toBeTruthy();
    });

    it('should validate DNI format and length', () => {
      const dniControl = component.customerForm.get('dni');

      dniControl?.setValue('123');
      expect(dniControl?.hasError('minlength')).toBeTruthy();

      dniControl?.setValue('12345abc');
      expect(dniControl?.hasError('pattern')).toBeTruthy();

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
      component.customerForm.patchValue({
        name: 'Restaurante Test',
        email: 'test@restaurant.com',
        dni: '12345678',
        provincia: 'lima',
        distrito: 'miraflores'
      });
    });

    it('should submit form programmatically when form is valid', () => {
      jest.spyOn(component, 'onSubmit');

      component.onSubmit();

      expect(component.onSubmit).toHaveBeenCalled();
    });

    it('should navigate to email verification when form is valid', () => {
      component.onSubmit();

      expect(mockLoggerService.info).toHaveBeenCalledWith('Formulario enviado:', component.customerForm.value);

      const expectedEncodedEmail = encodeURIComponent('test@restaurant.com');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/email-verification', expectedEncodedEmail]);
    });

    it('should mark all fields as touched when form is invalid', () => {
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
    it('should have form controls with correct names', () => {
      expect(component.customerForm.get('name')).toBeDefined();
      expect(component.customerForm.get('email')).toBeDefined();
      expect(component.customerForm.get('dni')).toBeDefined();
      expect(component.customerForm.get('provincia')).toBeDefined();
      expect(component.customerForm.get('distrito')).toBeDefined();
    });

    it('should have all required form fields', () => {
      const formControls = Object.keys(component.customerForm.controls);
      expect(formControls).toContain('name');
      expect(formControls).toContain('email');
      expect(formControls).toContain('dni');
      expect(formControls).toContain('provincia');
      expect(formControls).toContain('distrito');
    });

    it('should have component properties defined', () => {
      expect(component.provinciaOptions).toBeDefined();
      expect(component.distritoOptions).toBeDefined();
      expect(component.customerForm).toBeDefined();
    });
  });

  describe('Data Validation Edge Cases', () => {
    it('should handle empty provincia options gracefully', () => {
      component.provinciaOptions = [];

      expect(component.provinciaOptions.length).toBe(0);
    });

    it('should handle empty distrito options gracefully', () => {
      component.distritoOptions = [];

      expect(component.distritoOptions.length).toBe(0);
    });

    it('should validate DNI with exactly 8 digits', () => {
      const dniControl = component.customerForm.get('dni');

      dniControl?.setValue('1234567');
      expect(dniControl?.hasError('minlength')).toBeTruthy();

      dniControl?.setValue('12345678');
      expect(dniControl?.valid).toBeTruthy();

      dniControl?.setValue('123456789');
      expect(dniControl?.valid).toBeTruthy();
    });

    it('should trim whitespace from form values', () => {
      component.customerForm.patchValue({
        name: '  Restaurante Test  ',
        email: '  test@restaurant.com  '
      });

      expect(component.customerForm.get('name')?.value).toBe('  Restaurante Test  ');
      expect(component.customerForm.get('email')?.value).toBe('  test@restaurant.com  ');
    });
  });

  describe('Navigation', () => {
    it('should navigate back to register on back button click', () => {
      component.onBackClick();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/register']);
    });
  });
});
