import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { I18nService } from '../../../../../shared/i18n/services/translation.service';
import { CoreModule, SharedComponentsModule } from '../../../../../shared/modules';
import { CustomerProfilePhotoComponent } from './customer-profile-photo.component';

class MockI18nService {
  t(key: string): string {
    const translations: Record<string, string> = {
      'auth.customer.profilePhoto.title': 'Foto de Perfil',
      'auth.customer.profilePhoto.subtitle': 'Elige una foto que te represente',
      'auth.customer.profilePhoto.selectFileButton': 'Seleccionar archivo',
      'auth.customer.profilePhoto.removeImageButton': 'Quitar imagen',
      'auth.customer.profilePhoto.verifyEmailButton': 'Verificar email',
      'common.back': 'Volver'
    };
    return translations[key] || key;
  }
}

describe('CustomerProfilePhotoComponent', () => {
  let component: CustomerProfilePhotoComponent;
  let fixture: ComponentFixture<CustomerProfilePhotoComponent>;
  let mockRouter: jest.Mocked<Router>;
  let mockActivatedRoute: Partial<ActivatedRoute>;

  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn()
    } as any;

    mockActivatedRoute = {
      queryParams: of({ email: 'test@example.com' })
    };

    await TestBed.configureTestingModule({
      imports: [CustomerProfilePhotoComponent, CoreModule, SharedComponentsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: I18nService, useClass: MockI18nService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerProfilePhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.selectedImage).toBeNull();
    expect(component.selectedFile).toBeNull();
    expect(component.showWarningModal).toBe(true);
  });

  it('should display page title', () => {
    const titleElement = fixture.debugElement.query(By.css('h1'));
    expect(titleElement).toBeTruthy();
    expect(titleElement.nativeElement.textContent.trim()).toContain('app.name');
  });

  it('should display subtitle', () => {
    const subtitleElement = fixture.debugElement.query(By.css('p'));
    expect(subtitleElement).toBeTruthy();
    expect(subtitleElement.nativeElement.textContent.trim()).toBe('Foto de Perfil');
  });

  it('should display file upload component', () => {
    const fileUpload = fixture.debugElement.query(By.css('app-file-upload'));
    expect(fileUpload).toBeTruthy();
    expect(fileUpload.componentInstance.hasSelectedImage).toBe(false);
    expect(fileUpload.componentInstance.defaultBackgroundImage).toBe('/img/person.png');
  });

  it('should display warning modal when showWarningModal is true', () => {
    const warningModal = fixture.debugElement.query(By.css('app-warning-modal'));
    expect(warningModal).toBeTruthy();
    expect(warningModal.componentInstance.isVisible).toBe(true);
    expect(warningModal.componentInstance.title).toBe('Correo sin verificar');
  });

  describe('File handling', () => {
    it('should handle file selection and create preview', (done) => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      // Mock FileReader
      const mockFileReader = {
        readAsDataURL: jest.fn(),
        onload: null as any,
        result: 'data:image/jpeg;base64,mockdata'
      };

      jest.spyOn(window, 'FileReader').mockImplementation(() => mockFileReader as any);

      component.onFileSelected(mockFile);

      expect(component.selectedFile).toBe(mockFile);
      expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(mockFile);

      mockFileReader.onload({ target: { result: 'data:image/jpeg;base64,mockdata' } } as any);

      setTimeout(() => {
        expect(component.selectedImage).toBe('data:image/jpeg;base64,mockdata');
        done();
      }, 0);
    });

    it('should show image preview when file is selected', () => {
      component.selectedImage = 'data:image/jpeg;base64,mockdata';
      fixture.detectChanges();

      const imagePreview = fixture.debugElement.query(By.css('img[alt="Preview"]'));
      expect(imagePreview).toBeTruthy();
      expect(imagePreview.nativeElement.src).toBe('data:image/jpeg;base64,mockdata');
    });

    it('should show remove button when image is selected', () => {
      component.selectedImage = 'data:image/jpeg;base64,mockdata';
      fixture.detectChanges();

      const removeButton = fixture.debugElement.query(By.css('[aria-label="Eliminar imagen"]'));
      expect(removeButton).toBeTruthy();
    });

    it('should show file upload component', () => {
      const fileUploadComponent = fixture.debugElement.query(By.css('app-file-upload'));
      expect(fileUploadComponent).toBeTruthy();
    });

    it('should remove selected image when remove button is clicked', () => {
      component.selectedImage = 'data:image/jpeg;base64,mockdata';
      component.selectedFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      const mockFileInput = { nativeElement: { value: 'test.jpg' } };
      component.fileUploadComponent = { fileInput: mockFileInput } as any;

      component.removeSelectedImage();

      expect(component.selectedImage).toBeNull();
      expect(component.selectedFile).toBeNull();
      expect(mockFileInput.nativeElement.value).toBe('');
    });

    it('should handle file error', () => {
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

      component.onFileError('Error message');

      expect(alertSpy).toHaveBeenCalledWith('Error message');
      alertSpy.mockRestore();
    });

    it('should trigger file input when triggerFileInput is called', () => {
      const mockTriggerFileInput = jest.fn();
      component.fileUploadComponent = { triggerFileInput: mockTriggerFileInput } as any;

      component.triggerFileInput();

      expect(mockTriggerFileInput).toHaveBeenCalled();
    });
  });

  describe('Navigation', () => {
    it('should navigate to email verification when goBack is called', () => {
      component.goBack();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/email-verification', 'test@example.com']);
    });

    it('should navigate to email verification when onVerifyEmail is called', () => {
      component.onVerifyEmail();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/email-verification']);
    });
  });

  describe('Registration completion', () => {
    it('should show success alert when finishing registration', () => {
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

      component.finishRegistration();

      expect(alertSpy).toHaveBeenCalledWith('¡Registro completado exitosamente!');
      alertSpy.mockRestore();
    });
  });

  describe('Warning modal', () => {
    it('should close warning modal when onRemindLater is called', () => {
      component.showWarningModal = true;

      component.onRemindLater();

      expect(component.showWarningModal).toBe(false);
    });

    it('should close warning modal when onCloseWarningModal is called', () => {
      component.showWarningModal = true;

      component.onCloseWarningModal();

      expect(component.showWarningModal).toBe(false);
    });

    it('should handle warning modal primary action', () => {
      component.onVerifyEmail();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/email-verification']);
    });

    it('should handle warning modal secondary action', () => {
      component.showWarningModal = true;

      component.onRemindLater();

      expect(component.showWarningModal).toBe(false);
    });

    it('should handle warning modal close action', () => {
      component.showWarningModal = true;

      component.onCloseWarningModal();

      expect(component.showWarningModal).toBe(false);
    });
  });

  describe('UI State', () => {
    it('should update file upload hasSelectedImage prop when image is selected', () => {
      component.selectedImage = 'data:image/jpeg;base64,mockdata';
      fixture.detectChanges();

      const fileUpload = fixture.debugElement.query(By.css('app-file-upload'));
      expect(fileUpload.componentInstance.hasSelectedImage).toBe(true);
    });

    it('should hide image preview when no image is selected', () => {
      component.selectedImage = null;
      fixture.detectChanges();

      const imagePreview = fixture.debugElement.query(By.css('img[alt="Preview"]'));
      expect(imagePreview).toBeFalsy();
    });

    it('should hide select file button when no image is selected', () => {
      component.selectedImage = null;
      fixture.detectChanges();

      const selectFileButton = fixture.debugElement.query(By.css('app-button[iconName="upload"]'));
      expect(selectFileButton).toBeFalsy();
    });
  });
});
