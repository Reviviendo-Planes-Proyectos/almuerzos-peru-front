import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CoreModule } from '../../../../../shared/modules';
import { RestaurantScheduleComponent } from './restaurant-schedule.component';

describe('RestaurantScheduleComponent', () => {
  let component: RestaurantScheduleComponent;
  let fixture: ComponentFixture<RestaurantScheduleComponent>;
  let router: jest.Mocked<Router>;

  beforeEach(async () => {
    const routerSpy = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [RestaurantScheduleComponent, CoreModule, FormsModule],
      providers: [{ provide: Router, useValue: routerSpy }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(RestaurantScheduleComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with correct default values', () => {
      expect(component.currentStep).toBe(5);
      expect(component.isLocalService).toBe(true);
      expect(component.isDeliveryService).toBe(false);
      expect(component.showTimeModal).toBe(false);
      expect(component.schedule).toHaveLength(7);
    });

    it('should initialize schedule with correct default structure', () => {
      const firstDay = component.schedule[0];
      expect(firstDay).toEqual({
        day: 'Lunes',
        isActive: false,
        openTime: '11:00',
        closeTime: '22:00',
        isConfigured: false
      });
    });
  });

  describe('Service Type Toggle', () => {
    it('should toggle local service', () => {
      const initialValue = component.isLocalService;
      component.toggleLocalService();
      expect(component.isLocalService).toBe(!initialValue);
    });

    it('should toggle delivery service', () => {
      const initialValue = component.isDeliveryService;
      component.toggleDeliveryService();
      expect(component.isDeliveryService).toBe(!initialValue);
    });
  });

  describe('Day Schedule Management', () => {
    it('should toggle day active status', () => {
      const dayIndex = 0;
      const initialStatus = component.schedule[dayIndex].isActive;

      component.toggleDay(dayIndex);

      expect(component.schedule[dayIndex].isActive).toBe(!initialStatus);
    });

    it('should configure day and open modal', () => {
      const dayIndex = 1;

      component.configureDay(dayIndex);

      expect(component.showTimeModal).toBe(true);
      expect(component.selectedDay).toBe(component.schedule[dayIndex]);
      expect(component.selectedDayIndex).toBe(dayIndex);
      expect(component.tempOpenTime).toBe(component.schedule[dayIndex].openTime);
      expect(component.tempCloseTime).toBe(component.schedule[dayIndex].closeTime);
      expect(component.timeValidationError).toBe('');
    });

    it('should close time modal and reset values', () => {
      // First open the modal
      component.configureDay(1);

      // Then close it
      component.closeTimeModal();

      expect(component.showTimeModal).toBe(false);
      expect(component.selectedDay).toBe(null);
      expect(component.selectedDayIndex).toBe(-1);
      expect(component.tempOpenTime).toBe('');
      expect(component.tempCloseTime).toBe('');
      expect(component.timeValidationError).toBe('');
    });
  });

  describe('Time Configuration Validation', () => {
    beforeEach(() => {
      component.configureDay(0);
    });

    it('should validate empty times', () => {
      component.tempOpenTime = '';
      component.tempCloseTime = '22:00';

      component.saveTimeConfiguration();

      expect(component.timeValidationError).toBe('Por favor, completa ambos horarios');
      expect(component.showTimeModal).toBe(true);
    });

    it('should validate that open time is before close time', () => {
      component.tempOpenTime = '23:00';
      component.tempCloseTime = '22:00';

      component.saveTimeConfiguration();

      expect(component.timeValidationError).toBe('La hora de apertura debe ser menor que la de cierre');
      expect(component.showTimeModal).toBe(true);
    });

    it('should save valid time configuration', () => {
      const dayIndex = 0;
      component.tempOpenTime = '09:00';
      component.tempCloseTime = '18:00';

      component.saveTimeConfiguration();

      expect(component.schedule[dayIndex].openTime).toBe('09:00');
      expect(component.schedule[dayIndex].closeTime).toBe('18:00');
      expect(component.schedule[dayIndex].isConfigured).toBe(true);
      expect(component.showTimeModal).toBe(false);
    });
  });

  describe('Quick Actions', () => {
    it('should select all days', () => {
      component.selectAllDays();

      for (const day of component.schedule) {
        expect(day.isActive).toBe(true);
      }
    });

    it('should select only weekdays', () => {
      component.selectOnlyWeekdays();

      // Monday to Friday should be active (indices 0-4)
      for (let i = 0; i < 5; i++) {
        expect(component.schedule[i].isActive).toBe(true);
      }

      // Saturday and Sunday should be inactive (indices 5-6)
      for (let i = 5; i < 7; i++) {
        expect(component.schedule[i].isActive).toBe(false);
      }
    });
  });

  describe('Navigation', () => {
    it('should navigate back on onBackClick', () => {
      component.onBackClick();

      expect(router.navigate).toHaveBeenCalledWith(['/auth/restaurant-profile-photo']);
    });

    it('should navigate back on goBack', () => {
      component.goBack();

      expect(router.navigate).toHaveBeenCalledWith(['/auth/restaurant-profile-photo']);
    });

    it('should show alert when continuing without active days', () => {
      // Mock alert
      window.alert = jest.fn();

      // Set all days to inactive
      for (const day of component.schedule) {
        day.isActive = false;
      }

      component.continue();

      expect(window.alert).toHaveBeenCalledWith(
        'Debes seleccionar al menos un día de atención y una modalidad de servicio'
      );
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should show alert when continuing without service type', () => {
      // Mock alert
      window.alert = jest.fn();

      // Set service types to false
      component.isLocalService = false;
      component.isDeliveryService = false;

      component.continue();

      expect(window.alert).toHaveBeenCalledWith(
        'Debes seleccionar al menos un día de atención y una modalidad de servicio'
      );
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should navigate to next step when all requirements are met', () => {
      // Set at least one day active
      component.schedule[0].isActive = true;
      // Local service is already true by default

      component.continue();

      expect(router.navigate).toHaveBeenCalledWith(['/auth/restaurant-social-networks']);
    });
  });

  describe('Template Integration', () => {
    it('should show modal when showTimeModal is true', () => {
      component.showTimeModal = false;
      fixture.detectChanges();

      let modal = fixture.debugElement.query(By.css('.fixed.inset-0'));
      expect(modal).toBeFalsy();

      component.showTimeModal = true;
      fixture.detectChanges();

      modal = fixture.debugElement.query(By.css('.fixed.inset-0'));
      expect(modal).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle saveTimeConfiguration with invalid selectedDayIndex', () => {
      component.selectedDayIndex = -1;
      component.tempOpenTime = '09:00';
      component.tempCloseTime = '18:00';

      const originalSchedule = [...component.schedule];
      component.saveTimeConfiguration();

      expect(component.schedule).toEqual(originalSchedule);
      expect(component.showTimeModal).toBe(false);
    });

    it('should handle equal open and close times', () => {
      component.configureDay(0);
      component.tempOpenTime = '12:00';
      component.tempCloseTime = '12:00';

      component.saveTimeConfiguration();

      expect(component.timeValidationError).toBe('La hora de apertura debe ser menor que la de cierre');
    });
  });
});
