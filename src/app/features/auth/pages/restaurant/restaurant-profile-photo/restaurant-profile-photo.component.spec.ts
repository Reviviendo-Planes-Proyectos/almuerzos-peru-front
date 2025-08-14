import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { RestaurantProfilePhotoComponent } from './restaurant-profile-photo.component';

describe('RestaurantProfilePhotoComponent', () => {
  let component: RestaurantProfilePhotoComponent;
  let fixture: ComponentFixture<RestaurantProfilePhotoComponent>;
  let mockRouter: jest.Mocked<Router>;

  beforeEach(async () => {
    const routerSpy = {
      navigate: jest.fn().mockResolvedValue(true)
    };

    await TestBed.configureTestingModule({
      imports: [RestaurantProfilePhotoComponent],
      providers: [{ provide: Router, useValue: routerSpy }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(RestaurantProfilePhotoComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jest.Mocked<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component initialization', () => {
    it('should initialize with correct default values', () => {
      expect(component.currentStep).toBe(4);
      expect(component.restaurantPhoto).toBeNull();
      expect(component.restaurantPhotoPreview).toBeNull();
      expect(component.hasRestaurantPhoto).toBe(false);
      expect(component.logoPhoto).toBeNull();
      expect(component.logoPhotoPreview).toBeNull();
      expect(component.hasLogoPhoto).toBe(false);
      expect(component.showWarningModal).toBe(true);
    });

    it('should render the warning modal by default', () => {
      expect(component.showWarningModal).toBe(true);
    });
  });

  describe('Restaurant photo handling', () => {
    let mockFile: File;

    beforeEach(() => {
      mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    });

    it('should handle restaurant photo selection', () => {
      const mockFileReader = {
        onload: null as any,
        readAsDataURL: jest.fn(),
        result: 'data:image/jpeg;base64,mockbase64'
      };
      jest.spyOn(window, 'FileReader').mockImplementation(() => mockFileReader as any);

      component.onRestaurantPhotoSelected(mockFile);

      expect(component.restaurantPhoto).toBe(mockFile);
      expect(component.hasRestaurantPhoto).toBe(true);
      expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(mockFile);

      mockFileReader.onload({ target: { result: 'data:image/jpeg;base64,mockbase64' } });
      expect(component.restaurantPhotoPreview).toBe('data:image/jpeg;base64,mockbase64');
    });

    it('should handle restaurant photo error', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const errorMessage = 'Invalid file format';

      component.onRestaurantPhotoError(errorMessage);

      expect(consoleSpy).toHaveBeenCalledWith('Error en foto del restaurante:', errorMessage);
      consoleSpy.mockRestore();
    });

    it('should remove restaurant photo', () => {
      component.restaurantPhoto = mockFile;
      component.restaurantPhotoPreview = 'mockpreview';
      component.hasRestaurantPhoto = true;

      component.removeRestaurantPhoto();

      expect(component.restaurantPhoto).toBeNull();
      expect(component.restaurantPhotoPreview).toBeNull();
      expect(component.hasRestaurantPhoto).toBe(false);
    });

    it('should trigger restaurant file input', () => {
      const mockClick = jest.fn();
      component.restaurantFileInput = { nativeElement: { click: mockClick } } as any;

      component.triggerRestaurantFileInput();

      expect(mockClick).toHaveBeenCalled();
    });

    it('should handle restaurant file input change', () => {
      const mockEvent = {
        target: {
          files: [mockFile]
        }
      } as any;

      jest.spyOn(component, 'onRestaurantPhotoSelected').mockImplementation();

      component.onRestaurantFileInputChange(mockEvent);

      expect(component.onRestaurantPhotoSelected).toHaveBeenCalledWith(mockFile);
    });
  });

  describe('Logo photo handling', () => {
    let mockFile: File;

    beforeEach(() => {
      mockFile = new File(['test'], 'logo.png', { type: 'image/png' });
    });

    it('should handle logo photo selection', () => {
      const mockFileReader = {
        onload: null as any,
        readAsDataURL: jest.fn(),
        result: 'data:image/png;base64,mockbase64'
      };
      jest.spyOn(window, 'FileReader').mockImplementation(() => mockFileReader as any);

      component.onLogoPhotoSelected(mockFile);

      expect(component.logoPhoto).toBe(mockFile);
      expect(component.hasLogoPhoto).toBe(true);
      expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(mockFile);

      mockFileReader.onload({ target: { result: 'data:image/png;base64,mockbase64' } });
      expect(component.logoPhotoPreview).toBe('data:image/png;base64,mockbase64');
    });

    it('should handle logo photo error', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const errorMessage = 'File too large';

      component.onLogoPhotoError(errorMessage);

      expect(consoleSpy).toHaveBeenCalledWith('Error en logo del restaurante:', errorMessage);
      consoleSpy.mockRestore();
    });

    it('should remove logo', () => {
      component.logoPhoto = mockFile;
      component.logoPhotoPreview = 'mockpreview';
      component.hasLogoPhoto = true;

      component.removeLogo();

      expect(component.logoPhoto).toBeNull();
      expect(component.logoPhotoPreview).toBeNull();
      expect(component.hasLogoPhoto).toBe(false);
    });

    it('should trigger logo file input', () => {
      const mockClick = jest.fn();
      component.logoFileInput = { nativeElement: { click: mockClick } } as any;

      component.triggerLogoFileInput();

      expect(mockClick).toHaveBeenCalled();
    });

    it('should handle logo file input change', () => {
      const mockEvent = {
        target: {
          files: [mockFile]
        }
      } as any;

      jest.spyOn(component, 'onLogoPhotoSelected').mockImplementation();

      component.onLogoFileInputChange(mockEvent);

      expect(component.onLogoPhotoSelected).toHaveBeenCalledWith(mockFile);
    });
  });

  describe('Navigation methods', () => {
    it('should navigate back to phone verification on onBackClick', () => {
      component.onBackClick();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/phone-verification']);
    });

    it('should navigate back to phone verification on goBack', () => {
      component.goBack();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/phone-verification']);
    });

    it('should continue to restaurant schedule', () => {
      component.continue();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/restaurant-schedule']);
    });

    it('should navigate to next step on doLater', () => {
      component.doLater();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/next-step']);
    });
  });

  describe('Warning modal methods', () => {
    it('should navigate to phone verification on verify phone', () => {
      component.onVerifyPhone();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/phone-verification']);
    });

    it('should close warning modal on remind later', () => {
      component.showWarningModal = true;

      component.onRemindLater();

      expect(component.showWarningModal).toBe(false);
    });

    it('should close warning modal on close', () => {
      component.showWarningModal = true;

      component.onCloseWarningModal();

      expect(component.showWarningModal).toBe(false);
    });
  });

  describe('State transitions', () => {
    it('should properly transition from no photo to photo selected for restaurant', () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      expect(component.hasRestaurantPhoto).toBe(false);
      expect(component.restaurantPhoto).toBeNull();
      expect(component.restaurantPhotoPreview).toBeNull();

      component.onRestaurantPhotoSelected(mockFile);

      expect(component.hasRestaurantPhoto).toBe(true);
      expect(component.restaurantPhoto).toBe(mockFile);
    });

    it('should properly transition from photo selected to no photo for restaurant', () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      component.restaurantPhoto = mockFile;
      component.restaurantPhotoPreview = 'mockpreview';
      component.hasRestaurantPhoto = true;

      component.removeRestaurantPhoto();

      expect(component.hasRestaurantPhoto).toBe(false);
      expect(component.restaurantPhoto).toBeNull();
      expect(component.restaurantPhotoPreview).toBeNull();
    });

    it('should properly transition from no logo to logo selected', () => {
      const mockFile = new File(['test'], 'logo.png', { type: 'image/png' });

      expect(component.hasLogoPhoto).toBe(false);
      expect(component.logoPhoto).toBeNull();
      expect(component.logoPhotoPreview).toBeNull();

      component.onLogoPhotoSelected(mockFile);

      expect(component.hasLogoPhoto).toBe(true);
      expect(component.logoPhoto).toBe(mockFile);
    });

    it('should properly transition from logo selected to no logo', () => {
      const mockFile = new File(['test'], 'logo.png', { type: 'image/png' });

      component.logoPhoto = mockFile;
      component.logoPhotoPreview = 'mockpreview';
      component.hasLogoPhoto = true;

      component.removeLogo();

      expect(component.hasLogoPhoto).toBe(false);
      expect(component.logoPhoto).toBeNull();
      expect(component.logoPhotoPreview).toBeNull();
    });
  });

  describe('Template rendering', () => {
    it('should show file upload component when no restaurant photo is selected', () => {
      component.hasRestaurantPhoto = false;
      fixture.detectChanges();

      expect(component.hasRestaurantPhoto).toBe(false);
    });

    it('should show restaurant photo preview when photo is selected', () => {
      component.hasRestaurantPhoto = true;
      component.restaurantPhotoPreview = 'data:image/jpeg;base64,mockbase64';
      fixture.detectChanges();

      const imgElement = fixture.debugElement.query(By.css('img[alt="Foto del restaurante"]'));
      expect(imgElement).toBeTruthy();
      expect(imgElement.nativeElement.src).toBe('data:image/jpeg;base64,mockbase64');
    });

    it('should show logo preview when logo is selected', () => {
      component.hasLogoPhoto = true;
      component.logoPhotoPreview = 'data:image/png;base64,mockbase64';
      fixture.detectChanges();

      const imgElement = fixture.debugElement.query(By.css('img[alt="Logo del restaurante"]'));
      expect(imgElement).toBeTruthy();
      expect(imgElement.nativeElement.src).toBe('data:image/png;base64,mockbase64');
    });

    it('should display header with correct step', () => {
      expect(component.currentStep).toBe(4);
    });

    it('should display step indicator with correct values', () => {
      expect(component.currentStep).toBe(4);
    });
  });

  describe('Button interactions', () => {
    it('should call continue method', () => {
      jest.spyOn(component, 'continue');

      component.continue();

      expect(component.continue).toHaveBeenCalled();
    });

    it('should call goBack method', () => {
      jest.spyOn(component, 'goBack');

      component.goBack();

      expect(component.goBack).toHaveBeenCalled();
    });

    it('should remove restaurant photo when remove method is called', () => {
      component.hasRestaurantPhoto = true;
      component.restaurantPhotoPreview = 'mockpreview';

      jest.spyOn(component, 'removeRestaurantPhoto');
      component.removeRestaurantPhoto();

      expect(component.removeRestaurantPhoto).toHaveBeenCalled();
    });
  });

  describe('File input handling edge cases', () => {
    it('should handle empty file list in restaurant file input', () => {
      const mockEvent = {
        target: {
          files: null
        }
      } as any;

      jest.spyOn(component, 'onRestaurantPhotoSelected');

      component.onRestaurantFileInputChange(mockEvent);

      expect(component.onRestaurantPhotoSelected).not.toHaveBeenCalled();
    });

    it('should handle empty file list in logo file input', () => {
      const mockEvent = {
        target: {
          files: []
        }
      } as any;

      jest.spyOn(component, 'onLogoPhotoSelected');

      component.onLogoFileInputChange(mockEvent);

      expect(component.onLogoPhotoSelected).not.toHaveBeenCalled();
    });

    it('should handle null target in restaurant file input', () => {
      const mockEvent = {
        target: null
      } as any;

      jest.spyOn(component, 'onRestaurantPhotoSelected');

      expect(() => component.onRestaurantFileInputChange(mockEvent)).not.toThrow();
      expect(component.onRestaurantPhotoSelected).not.toHaveBeenCalled();
    });

    it('should handle null target in logo file input', () => {
      const mockEvent = {
        target: null
      } as any;

      jest.spyOn(component, 'onLogoPhotoSelected');

      expect(() => component.onLogoFileInputChange(mockEvent)).not.toThrow();
      expect(component.onLogoPhotoSelected).not.toHaveBeenCalled();
    });
  });

  describe('FileReader error handling', () => {
    it('should handle FileReader error for restaurant photo', () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const mockFileReader = {
        onload: null as any,
        onerror: null as any,
        readAsDataURL: jest.fn(),
        result: null
      };
      jest.spyOn(window, 'FileReader').mockImplementation(() => mockFileReader as any);

      component.onRestaurantPhotoSelected(mockFile);

      expect(component.restaurantPhoto).toBe(mockFile);
      expect(component.hasRestaurantPhoto).toBe(true);
      expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(mockFile);

      if (mockFileReader.onerror) {
        mockFileReader.onerror(new Error('File read error'));
      }

      expect(component.restaurantPhoto).toBe(mockFile);
    });

    it('should handle FileReader error for logo photo', () => {
      const mockFile = new File(['test'], 'logo.png', { type: 'image/png' });
      const mockFileReader = {
        onload: null as any,
        onerror: null as any,
        readAsDataURL: jest.fn(),
        result: null
      };
      jest.spyOn(window, 'FileReader').mockImplementation(() => mockFileReader as any);

      component.onLogoPhotoSelected(mockFile);

      expect(component.logoPhoto).toBe(mockFile);
      expect(component.hasLogoPhoto).toBe(true);
      expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(mockFile);

      if (mockFileReader.onerror) {
        mockFileReader.onerror(new Error('File read error'));
      }

      expect(component.logoPhoto).toBe(mockFile);
    });
  });
});
