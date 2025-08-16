import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CoreModule } from '../../../../../shared/modules';
import { LoggerService } from '../../../../../shared/services/logger/logger.service';
import { RestaurantBasicInfoComponent } from './restaurant-basic-info.component';

describe('RestaurantBasicInfoComponent', () => {
  let component: RestaurantBasicInfoComponent;
  let fixture: ComponentFixture<RestaurantBasicInfoComponent>;
  let mockRouter: Router;
  let mockLoggerService: LoggerService;

  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn().mockResolvedValue(true)
    } as any;

    mockLoggerService = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [CoreModule, RestaurantBasicInfoComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        CoreModule,
        { provide: Router, useValue: mockRouter },
        { provide: LoggerService, useValue: mockLoggerService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(RestaurantBasicInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize form with correct structure', () => {
      expect(component.restaurantForm).toBeDefined();
      expect(component.restaurantForm.get('restaurantName')).toBeTruthy();
      expect(component.restaurantForm.get('email')).toBeTruthy();
      expect(component.restaurantForm.get('ownerDni')).toBeTruthy();
      expect(component.restaurantForm.get('ownerFirstName')).toBeTruthy();
      expect(component.restaurantForm.get('ownerLastName')).toBeTruthy();
      expect(component.restaurantForm.get('phoneNumber')).toBeTruthy();
      expect(component.restaurantForm.get('address')).toBeTruthy();
      expect(component.restaurantForm.get('provincia')).toBeTruthy();
      expect(component.restaurantForm.get('distrito')).toBeTruthy();
      expect(component.restaurantForm.get('ruc')).toBeTruthy();
      expect(component.restaurantForm.get('razonSocial')).toBeTruthy();
    });

    it('should initialize with correct default values', () => {
      expect(component.isRazonSocialEnabled).toBe(false);
      expect(component.isLocationModalVisible).toBe(false);
      expect(component.locationSearchQuery).toBe('');
      expect(component.isRucValid).toBe(false);
    });

    it('should have razonSocial field disabled initially', () => {
      const razonSocialControl = component.restaurantForm.get('razonSocial');
      expect(razonSocialControl?.disabled).toBe(true);
    });

    it('should have ownerFirstName and ownerLastName fields disabled initially', () => {
      const firstNameControl = component.restaurantForm.get('ownerFirstName');
      const lastNameControl = component.restaurantForm.get('ownerLastName');
      expect(firstNameControl?.disabled).toBe(true);
      expect(lastNameControl?.disabled).toBe(true);
    });

    it('should have provincia options defined', () => {
      expect(component.provinciaOptions).toBeDefined();
      expect(component.provinciaOptions.length).toBeGreaterThan(0);
      expect(component.provinciaOptions[0]).toEqual({ value: 'lima', label: 'Lima' });
    });

    it('should have distrito options defined', () => {
      expect(component.distritoOptions).toBeDefined();
      expect(component.distritoOptions.length).toBeGreaterThan(0);
      expect(component.distritoOptions[0]).toEqual({ value: 'miraflores', label: 'Miraflores' });
    });
  });

  describe('Form Validation', () => {
    it('should be invalid when empty', () => {
      expect(component.restaurantForm.valid).toBeFalsy();
    });

    it('should validate required fields', () => {
      const requiredFields = ['restaurantName', 'email', 'ownerDni', 'phoneNumber', 'address', 'provincia', 'distrito'];

      for (const field of requiredFields) {
        const control = component.restaurantForm.get(field);
        expect(control?.valid).toBeFalsy();
        expect(control?.hasError('required')).toBeTruthy();
      }
    });

    it('should validate email format', () => {
      const emailControl = component.restaurantForm.get('email');

      emailControl?.setValue('invalid-email');
      expect(emailControl?.hasError('email')).toBeTruthy();

      emailControl?.setValue('test@example.com');
      expect(emailControl?.hasError('email')).toBeFalsy();
    });

    it('should validate DNI pattern (8 digits)', () => {
      const dniControl = component.restaurantForm.get('ownerDni');

      dniControl?.setValue('1234567');
      expect(dniControl?.hasError('minlength')).toBeTruthy();

      dniControl?.setValue('123456789');

      dniControl?.setValue('1234567a');
      expect(dniControl?.hasError('pattern')).toBeTruthy();

      dniControl?.setValue('12345678');
      expect(dniControl?.hasError('pattern')).toBeFalsy();
    });

    it('should validate phone number pattern (9 digits)', () => {
      const phoneControl = component.restaurantForm.get('phoneNumber');

      phoneControl?.setValue('12345678');
      expect(phoneControl?.hasError('minlength')).toBeTruthy();

      phoneControl?.setValue('1234567890');

      phoneControl?.setValue('987654321');
      expect(phoneControl?.hasError('pattern')).toBeFalsy();
    });

    it('should validate RUC pattern when provided (11 digits)', () => {
      const rucControl = component.restaurantForm.get('ruc');

      rucControl?.setValue('');
      expect(rucControl?.valid).toBeTruthy();

      rucControl?.setValue('2012345678');
      expect(rucControl?.hasError('pattern')).toBeTruthy();

      rucControl?.setValue('201234567890');
      expect(rucControl?.hasError('pattern')).toBeTruthy();

      rucControl?.setValue('20123456789');
      expect(rucControl?.hasError('pattern')).toBeFalsy();
    });

    it('should be valid when all required fields are properly filled', () => {
      component.restaurantForm.patchValue({
        restaurantName: 'Test Restaurant',
        email: 'test@example.com',
        ownerDni: '12345678',
        phoneNumber: '987654321',
        address: 'Test Address',
        provincia: 'lima',
        distrito: 'miraflores'
      });

      expect(component.restaurantForm.valid).toBeTruthy();
    });
  });

  describe('RUC Functionality', () => {
    it('should set isRucValid to true when valid RUC is entered', () => {
      const rucControl = component.restaurantForm.get('ruc');
      jest.spyOn(component as any, 'fetchCompanyDataFromSunat');

      rucControl?.setValue('20123456789');

      expect(component.isRucValid).toBe(true);
      expect((component as any).fetchCompanyDataFromSunat).toHaveBeenCalledWith('20123456789');
    });

    it('should set isRucValid to false and clear razonSocial when invalid RUC is entered', () => {
      const rucControl = component.restaurantForm.get('ruc');
      const razonSocialControl = component.restaurantForm.get('razonSocial');

      // First set a value
      razonSocialControl?.setValue('Test Company');

      // Then enter invalid RUC
      rucControl?.setValue('123');

      expect(component.isRucValid).toBe(false);
      expect(razonSocialControl?.value).toBe('');
    });

    it('should clear razonSocial when RUC is cleared', () => {
      const rucControl = component.restaurantForm.get('ruc');
      const razonSocialControl = component.restaurantForm.get('razonSocial');

      // Set a value first
      razonSocialControl?.setValue('Test Company');

      rucControl?.setValue('');

      expect(component.isRucValid).toBe(false);
      expect(razonSocialControl?.value).toBe('');
    });

    it('should call fetchCompanyDataFromSunat with valid RUC', () => {
      jest.spyOn(component as any, 'fetchCompanyDataFromSunat');
      const rucControl = component.restaurantForm.get('ruc');

      rucControl?.setValue('20123456789');

      expect((component as any).fetchCompanyDataFromSunat).toHaveBeenCalledWith('20123456789');
    });
  });

  describe('DNI Functionality', () => {
    it('should call fetchOwnerDataFromReniec when valid DNI is entered', () => {
      jest.spyOn(component as any, 'fetchOwnerDataFromReniec');
      const dniControl = component.restaurantForm.get('ownerDni');

      dniControl?.setValue('12345678');

      expect((component as any).fetchOwnerDataFromReniec).toHaveBeenCalledWith('12345678');
    });

    it('should clear owner names when invalid DNI is entered', () => {
      const dniControl = component.restaurantForm.get('ownerDni');
      const firstNameControl = component.restaurantForm.get('ownerFirstName');
      const lastNameControl = component.restaurantForm.get('ownerLastName');

      // First set some values
      firstNameControl?.setValue('Juan Carlos');
      lastNameControl?.setValue('Pérez García');

      // Then enter invalid DNI
      dniControl?.setValue('123');

      expect(firstNameControl?.value).toBe('');
      expect(lastNameControl?.value).toBe('');
    });

    it('should clear owner names when DNI is cleared', () => {
      const dniControl = component.restaurantForm.get('ownerDni');
      const firstNameControl = component.restaurantForm.get('ownerFirstName');
      const lastNameControl = component.restaurantForm.get('ownerLastName');

      // Set values first
      firstNameControl?.setValue('Juan Carlos');
      lastNameControl?.setValue('Pérez García');

      // Clear DNI
      dniControl?.setValue('');

      expect(firstNameControl?.value).toBe('');
      expect(lastNameControl?.value).toBe('');
    });

    it('should not call fetchOwnerDataFromReniec with invalid DNI', () => {
      jest.spyOn(component as any, 'fetchOwnerDataFromReniec');
      const dniControl = component.restaurantForm.get('ownerDni');

      dniControl?.setValue('123');

      expect((component as any).fetchOwnerDataFromReniec).not.toHaveBeenCalled();
    });
  });

  describe('Form Submission', () => {
    it('should navigate to phone verification when form is valid', () => {
      component.restaurantForm.patchValue({
        restaurantName: 'Test Restaurant',
        email: 'test@example.com',
        ownerDni: '12345678',
        phoneNumber: '987654321',
        address: 'Test Address',
        provincia: 'lima',
        distrito: 'miraflores'
      });

      component.onSubmit();

      expect(mockLoggerService.info).toHaveBeenCalledWith(
        'Formulario de restaurante enviado:',
        expect.objectContaining({
          restaurantName: 'Test Restaurant',
          phoneNumber: '987654321'
        })
      );

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/phone-verification'], { state: { phone: '987654321' } });
    });

    it('should mark all fields as touched when form is invalid', () => {
      jest.spyOn(component.restaurantForm, 'markAllAsTouched');

      component.onSubmit();

      expect(component.restaurantForm.markAllAsTouched).toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('Navigation', () => {
    it('should navigate back to register on back click', () => {
      component.onBackClick();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/register']);
    });
  });

  describe('Location Modal', () => {
    it('should open location modal', () => {
      component.restaurantForm.get('address')?.setValue('Current Address');

      component.openLocationModal();

      expect(component.isLocationModalVisible).toBe(true);
      expect(component.locationSearchQuery).toBe('Current Address');
    });

    it('should open location modal with empty query when no address', () => {
      component.openLocationModal();

      expect(component.isLocationModalVisible).toBe(true);
      expect(component.locationSearchQuery).toBe('');
    });

    it('should close location modal', () => {
      component.isLocationModalVisible = true;

      component.closeLocationModal();

      expect(component.isLocationModalVisible).toBe(false);
    });

    it('should confirm location and update address field', () => {
      const selectedLocation = 'Selected Address';
      jest.spyOn(component, 'closeLocationModal');

      component.onLocationConfirmed(selectedLocation);

      expect(component.restaurantForm.get('address')?.value).toBe(selectedLocation);
      expect(component.closeLocationModal).toHaveBeenCalled();
    });

    it('should update location search query', () => {
      const searchQuery = 'New Search Query';

      component.onLocationSearchChange(searchQuery);

      expect(component.locationSearchQuery).toBe(searchQuery);
    });
  });

  describe('RUC Change Handler', () => {
    it('should call onRucChange when RUC value changes', () => {
      jest.spyOn(component, 'onRucChange');

      const rucControl = component.restaurantForm.get('ruc');
      rucControl?.setValue('20123456789');

      expect(component.onRucChange).toHaveBeenCalledWith('20123456789');
    });

    it('should handle empty RUC value', () => {
      component.onRucChange('');

      expect(component.isRucValid).toBe(false);
      expect(component.restaurantForm.get('razonSocial')?.value).toBe('');
    });

    it('should handle invalid RUC format', () => {
      component.onRucChange('123abc');

      expect(component.isRucValid).toBe(false);
      expect(component.restaurantForm.get('razonSocial')?.value).toBe('');
    });
  });

  describe('API Mock Functions', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should simulate RENIEC API call and update owner names', () => {
      const firstNameControl = component.restaurantForm.get('ownerFirstName');
      const lastNameControl = component.restaurantForm.get('ownerLastName');

      (component as any).fetchOwnerDataFromReniec('12345678');

      // Fast-forward time to trigger setTimeout
      jest.advanceTimersByTime(1000);

      expect(mockLoggerService.info).toHaveBeenCalledWith('Consultando DNI en RENIEC:', '12345678');
      expect(firstNameControl?.value).toBe('Juan Carlos');
      expect(lastNameControl?.value).toBe('Pérez García');
    });

    it('should simulate SUNAT API call and update razon social', () => {
      const razonSocialControl = component.restaurantForm.get('razonSocial');

      (component as any).fetchCompanyDataFromSunat('20123456789');

      // Fast-forward time to trigger setTimeout
      jest.advanceTimersByTime(1000);

      expect(mockLoggerService.info).toHaveBeenCalledWith('Consultando RUC en SUNAT:', '20123456789');
      expect(razonSocialControl?.value).toBe('RESTAURANTE EL SABOR CRIOLLO S.A.C.');
    });
  });

  describe('DNI Change Handler', () => {
    it('should call onDniChange when DNI value changes', () => {
      jest.spyOn(component, 'onDniChange');

      const dniControl = component.restaurantForm.get('ownerDni');
      dniControl?.setValue('12345678');

      expect(component.onDniChange).toHaveBeenCalledWith('12345678');
    });

    it('should handle empty DNI value', () => {
      const firstNameControl = component.restaurantForm.get('ownerFirstName');
      const lastNameControl = component.restaurantForm.get('ownerLastName');

      // Set values first
      firstNameControl?.setValue('Juan');
      lastNameControl?.setValue('Pérez');

      component.onDniChange('');

      expect(firstNameControl?.value).toBe('');
      expect(lastNameControl?.value).toBe('');
    });

    it('should handle invalid DNI format', () => {
      const firstNameControl = component.restaurantForm.get('ownerFirstName');
      const lastNameControl = component.restaurantForm.get('ownerLastName');

      // Set values first
      firstNameControl?.setValue('Juan');
      lastNameControl?.setValue('Pérez');

      component.onDniChange('123abc');

      expect(firstNameControl?.value).toBe('');
      expect(lastNameControl?.value).toBe('');
    });
  });
});
