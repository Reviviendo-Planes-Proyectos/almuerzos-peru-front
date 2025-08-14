import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CoreModule } from '../../../../shared/modules';
import { LoggerService } from '../../../../shared/services/logger/logger.service';
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
    });

    it('should have razonSocial field disabled initially', () => {
      const razonSocialControl = component.restaurantForm.get('razonSocial');
      expect(razonSocialControl?.disabled).toBe(true);
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
    it('should enable razonSocial when valid RUC is entered', () => {
      const rucControl = component.restaurantForm.get('ruc');
      const razonSocialControl = component.restaurantForm.get('razonSocial');

      rucControl?.setValue('20123456789');

      expect(component.isRazonSocialEnabled).toBe(true);
      expect(razonSocialControl?.disabled).toBe(false);
    });

    it('should disable and clear razonSocial when invalid RUC is entered', () => {
      const rucControl = component.restaurantForm.get('ruc');
      const razonSocialControl = component.restaurantForm.get('razonSocial');

      rucControl?.setValue('20123456789');
      razonSocialControl?.setValue('Test Company');

      rucControl?.setValue('123');

      expect(component.isRazonSocialEnabled).toBe(false);
      expect(razonSocialControl?.disabled).toBe(true);
      expect(razonSocialControl?.value).toBe('');
    });

    it('should disable razonSocial when RUC is cleared', () => {
      const rucControl = component.restaurantForm.get('ruc');
      const razonSocialControl = component.restaurantForm.get('razonSocial');

      rucControl?.setValue('20123456789');
      razonSocialControl?.setValue('Test Company');

      rucControl?.setValue('');

      expect(component.isRazonSocialEnabled).toBe(false);
      expect(razonSocialControl?.disabled).toBe(true);
      expect(razonSocialControl?.value).toBe('');
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

      expect(component.isRazonSocialEnabled).toBe(false);
      expect(component.restaurantForm.get('razonSocial')?.disabled).toBe(true);
    });

    it('should handle invalid RUC format', () => {
      component.onRucChange('123abc');

      expect(component.isRazonSocialEnabled).toBe(false);
      expect(component.restaurantForm.get('razonSocial')?.disabled).toBe(true);
    });
  });
});
