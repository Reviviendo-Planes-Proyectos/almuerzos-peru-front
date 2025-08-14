import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { RestaurantSocialNetworksComponent } from './restaurant-social-networks.component';

describe('RestaurantSocialNetworksComponent', () => {
  let component: RestaurantSocialNetworksComponent;
  let fixture: ComponentFixture<RestaurantSocialNetworksComponent>;
  let router: jest.Mocked<Router>;

  beforeEach(async () => {
    const routerSpy = {
      navigate: jest.fn()
    };

    // Clear localStorage before each test
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [RestaurantSocialNetworksComponent, CommonModule, ReactiveFormsModule],
      providers: [{ provide: Router, useValue: routerSpy }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(RestaurantSocialNetworksComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with correct default values', () => {
      expect(component.currentStep).toBe(6);
      expect(component.showSuccessModal).toBe(false);
      expect(component.restaurantName).toBeDefined();
      expect(component.restaurantName.length).toBeGreaterThan(0);
      expect(component.socialNetworksForm).toBeDefined();
      expect(component.socialNetworksForm.get('contactPhone')?.value).toBe('');
      expect(component.socialNetworksForm.get('whatsappPhone')?.value).toBe('');
      expect(component.socialNetworksForm.get('yapesPhone')?.value).toBe('');
      expect(component.socialNetworksForm.get('whatsappBusiness')?.value).toBe('');
    });

    it('should load restaurant name from localStorage when available', () => {
      const testData = { restaurantName: 'Test Restaurant from Storage' };
      localStorage.setItem('restaurantRegistrationData', JSON.stringify(testData));

      // Create new component fixture to test localStorage loading
      const newFixture = TestBed.createComponent(RestaurantSocialNetworksComponent);
      const newComponent = newFixture.componentInstance;

      expect(newComponent.restaurantName).toBe('Test Restaurant from Storage');
    });

    it('should use random restaurant name when localStorage is empty', () => {
      localStorage.clear();

      // Create new component fixture to test with empty localStorage
      const newFixture = TestBed.createComponent(RestaurantSocialNetworksComponent);
      const newComponent = newFixture.componentInstance;

      const expectedNames = [
        'Restaurante El Sabor Criollo',
        'Pollos a la Brasa Don Mario',
        'Chifa Golden Dragon',
        'Cevichería La Mar',
        'Parrillas El Toro'
      ];

      expect(expectedNames).toContain(newComponent.restaurantName);
    });

    it('should handle corrupted localStorage data gracefully', () => {
      localStorage.setItem('restaurantRegistrationData', 'invalid json');

      // Mock console.warn to avoid noise in tests
      jest.spyOn(console, 'warn').mockImplementation(() => {});

      // Create new component fixture to test error handling
      const newFixture = TestBed.createComponent(RestaurantSocialNetworksComponent);
      const newComponent = newFixture.componentInstance;

      expect(newComponent.restaurantName).toBeDefined();
      expect(newComponent.restaurantName.length).toBeGreaterThan(0);

      // Restore console.warn
      (console.warn as jest.Mock).mockRestore();
    });
  });

  describe('Navigation', () => {
    it('should navigate back on onBackClick', () => {
      component.onBackClick();

      expect(router.navigate).toHaveBeenCalledWith(['/auth/restaurant-schedule']);
    });

    it('should navigate back on goBack', () => {
      component.goBack();

      expect(router.navigate).toHaveBeenCalledWith(['/auth/restaurant-schedule']);
    });

    it('should show success modal when finishing registration', () => {
      expect(component.showSuccessModal).toBe(false);

      component.finishRegistration();

      expect(component.showSuccessModal).toBe(true);
    });

    it('should navigate to dashboard and clear localStorage when clicking go to dashboard', () => {
      // Set up localStorage with test data
      localStorage.setItem('restaurantRegistrationData', JSON.stringify({ restaurantName: 'Test Restaurant' }));
      component.showSuccessModal = true;

      component.goToDashboard();

      expect(component.showSuccessModal).toBe(false);
      expect(localStorage.getItem('restaurantRegistrationData')).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    });
  });

  describe('Form Data Binding', () => {
    it('should update contactPhone when form control changes', () => {
      const testPhone = '+51 987 654 321';
      component.socialNetworksForm.get('contactPhone')?.setValue(testPhone);

      expect(component.socialNetworksForm.get('contactPhone')?.value).toBe(testPhone);
    });

    it('should update whatsappPhone when form control changes', () => {
      const testPhone = '+51 987 654 321';
      component.socialNetworksForm.get('whatsappPhone')?.setValue(testPhone);

      expect(component.socialNetworksForm.get('whatsappPhone')?.value).toBe(testPhone);
    });

    it('should update yapesPhone when form control changes', () => {
      const testPhone = '+51 987 654 321';
      component.socialNetworksForm.get('yapesPhone')?.setValue(testPhone);

      expect(component.socialNetworksForm.get('yapesPhone')?.value).toBe(testPhone);
    });

    it('should update whatsappBusiness when form control changes', () => {
      const testUrl = 'https://wa.me/51987654321';
      component.socialNetworksForm.get('whatsappBusiness')?.setValue(testUrl);

      expect(component.socialNetworksForm.get('whatsappBusiness')?.value).toBe(testUrl);
    });

    it('should have valid form when all fields are filled correctly', () => {
      component.socialNetworksForm.patchValue({
        contactPhone: '+51 987 654 321',
        whatsappPhone: '+51 987 654 321',
        yapesPhone: '+51 987 654 321',
        whatsappBusiness: 'https://wa.me/51987654321'
      });

      expect(component.socialNetworksForm.valid).toBe(true);
    });

    it('should be valid even when all fields are empty since they are optional', () => {
      expect(component.socialNetworksForm.valid).toBe(true);
    });
  });

  describe('Restaurant Name and Modal Functionality', () => {
    it('should return correct restaurant initial', () => {
      component.restaurantName = 'Test Restaurant';
      expect(component.getRestaurantInitial()).toBe('T');

      component.restaurantName = 'pollos a la brasa';
      expect(component.getRestaurantInitial()).toBe('P');

      component.restaurantName = '';
      expect(component.getRestaurantInitial()).toBe('R');
    });

    it('should toggle success modal visibility', () => {
      expect(component.showSuccessModal).toBe(false);

      component.finishRegistration();
      expect(component.showSuccessModal).toBe(true);

      component.goToDashboard();
      expect(component.showSuccessModal).toBe(false);
    });

    it('should handle localStorage data correctly in getRestaurantNameFromStorage', () => {
      // Test with valid localStorage data
      const testData = { restaurantName: 'Stored Restaurant Name' };
      localStorage.setItem('restaurantRegistrationData', JSON.stringify(testData));

      const result = (component as any).getRestaurantNameFromStorage();
      expect(result).toBe('Stored Restaurant Name');
    });

    it('should use fallback name when localStorage data has no restaurantName', () => {
      const testData = { otherField: 'someValue' };
      localStorage.setItem('restaurantRegistrationData', JSON.stringify(testData));

      const result = (component as any).getRestaurantNameFromStorage();
      expect(result).toBe('Restaurante El Sabor Criollo');
    });

    it('should handle invalid JSON in localStorage gracefully', () => {
      localStorage.setItem('restaurantRegistrationData', 'invalid json string');

      const result = (component as any).getRestaurantNameFromStorage();

      // Should return one of the example names
      const expectedNames = [
        'Restaurante El Sabor Criollo',
        'Pollos a la Brasa Don Mario',
        'Chifa Golden Dragon',
        'Cevichería La Mar',
        'Parrillas El Toro'
      ];

      expect(expectedNames).toContain(result);
    });

    it('should return random name when localStorage is empty', () => {
      localStorage.clear();

      const result = (component as any).getRestaurantNameFromStorage();

      const expectedNames = [
        'Restaurante El Sabor Criollo',
        'Pollos a la Brasa Don Mario',
        'Chifa Golden Dragon',
        'Cevichería La Mar',
        'Parrillas El Toro'
      ];

      expect(expectedNames).toContain(result);
    });
  });
});
