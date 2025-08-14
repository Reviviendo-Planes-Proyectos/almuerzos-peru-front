import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FileUploadComponent } from './file-upload.component';

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;

  // Mock DragEvent para el entorno de tests
  const createMockDragEvent = (type: string, dataTransfer?: { files: File[] }): DragEvent => {
    const event = {
      type,
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
      dataTransfer
    } as unknown as DragEvent;
    return event;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileUploadComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Properties', () => {
    it('should have default acceptedTypes', () => {
      expect(component.acceptedTypes).toBe('image/png,image/jpeg,image/jpg');
    });

    it('should have default maxFileSize of 5MB', () => {
      expect(component.maxFileSize).toBe(5 * 1024 * 1024);
    });

    it('should have default allowedFormats', () => {
      expect(component.allowedFormats).toEqual(['image/jpeg', 'image/jpg', 'image/png']);
    });

    it('should have default hasSelectedImage as false', () => {
      expect(component.hasSelectedImage).toBe(false);
    });
  });

  describe('File Input Functionality', () => {
    it('should trigger file input when triggerFileInput is called', () => {
      const fileInput = fixture.debugElement.query(By.css('input[type="file"]'));
      const clickSpy = jest.spyOn(fileInput.nativeElement, 'click');

      component.triggerFileInput();

      expect(clickSpy).toHaveBeenCalled();
    });

    it('should handle file selection', () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const event = {
        target: {
          files: [mockFile]
        }
      } as any;

      jest.spyOn(component, 'handleFile' as any);
      jest.spyOn(component.fileSelected, 'emit');

      component.onFileSelected(event);

      expect(component.fileSelected.emit).toHaveBeenCalledWith(mockFile);
    });

    it('should not handle file selection when no file is present', () => {
      const event = {
        target: {
          files: []
        }
      } as any;

      jest.spyOn(component.fileSelected, 'emit');

      component.onFileSelected(event);

      expect(component.fileSelected.emit).not.toHaveBeenCalled();
    });
  });

  describe('Drag and Drop Functionality', () => {
    it('should prevent default on drag over', () => {
      const dragEvent = createMockDragEvent('dragover');

      component.onDragOver(dragEvent);

      expect(dragEvent.preventDefault).toHaveBeenCalled();
      expect(dragEvent.stopPropagation).toHaveBeenCalled();
    });

    it('should prevent default on drag leave', () => {
      const dragLeaveEvent = createMockDragEvent('dragleave');

      component.onDragLeave(dragLeaveEvent);

      expect(dragLeaveEvent.preventDefault).toHaveBeenCalled();
      expect(dragLeaveEvent.stopPropagation).toHaveBeenCalled();
    });

    it('should handle file drop', () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const dropEvent = createMockDragEvent('drop', { files: [mockFile] });

      jest.spyOn(component, 'handleFile' as any);

      component.onDrop(dropEvent);

      expect(dropEvent.preventDefault).toHaveBeenCalled();
      expect(dropEvent.stopPropagation).toHaveBeenCalled();
    });

    it('should not handle drop when no files are present', () => {
      const dropEvent = createMockDragEvent('drop', { files: [] });

      jest.spyOn(component.fileSelected, 'emit');

      component.onDrop(dropEvent);

      expect(dropEvent.preventDefault).toHaveBeenCalled();
      expect(dropEvent.stopPropagation).toHaveBeenCalled();
      expect(component.fileSelected.emit).not.toHaveBeenCalled();
    });
  });

  describe('File Validation', () => {
    it('should emit error for non-image files', () => {
      const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      jest.spyOn(component.fileError, 'emit');

      (component as any).handleFile(mockFile);

      expect(component.fileError.emit).toHaveBeenCalledWith('Por favor selecciona un archivo de imagen válido.');
    });

    it('should emit error for files exceeding max size', () => {
      const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
      jest.spyOn(component.fileError, 'emit');

      (component as any).handleFile(largeFile);

      expect(component.fileError.emit).toHaveBeenCalledWith(
        'El archivo es demasiado grande. El tamaño máximo permitido es 5MB.'
      );
    });

    it('should emit error for disallowed file formats', () => {
      const mockFile = new File(['test'], 'test.gif', { type: 'image/gif' });
      jest.spyOn(component.fileError, 'emit');

      (component as any).handleFile(mockFile);

      expect(component.fileError.emit).toHaveBeenCalledWith('Solo se permiten archivos PNG, JPG y JPEG.');
    });

    it('should emit fileSelected for valid files', () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      jest.spyOn(component.fileSelected, 'emit');

      (component as any).handleFile(mockFile);

      expect(component.fileSelected.emit).toHaveBeenCalledWith(mockFile);
    });

    it('should validate PNG files', () => {
      const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
      jest.spyOn(component.fileSelected, 'emit');

      (component as any).handleFile(mockFile);

      expect(component.fileSelected.emit).toHaveBeenCalledWith(mockFile);
    });
  });

  describe('Template Rendering', () => {
    it('should render file input with correct attributes', () => {
      const fileInput = fixture.debugElement.query(By.css('input[type="file"]'));

      expect(fileInput).toBeTruthy();
      expect(fileInput.nativeElement.accept).toBe('image/png,image/jpeg,image/jpg');
      expect(fileInput.nativeElement.classList.contains('hidden')).toBe(true);
    });

    it('should render drag and drop area when no image is selected', () => {
      component.hasSelectedImage = false;
      fixture.detectChanges();

      const dropArea = fixture.debugElement.query(By.css('.border-dashed'));

      expect(dropArea).toBeTruthy();
      expect(dropArea.nativeElement.textContent).toContain('Subir imagen');
      expect(dropArea.nativeElement.textContent).toContain('PNG, JPG hasta 5MB');
    });

    it('should not render drag and drop area when image is selected', () => {
      component.hasSelectedImage = true;
      fixture.detectChanges();

      const dropArea = fixture.debugElement.query(By.css('.border-dashed'));

      expect(dropArea).toBeFalsy();
    });

    it('should render camera icon when no image is selected', () => {
      component.hasSelectedImage = false;
      fixture.detectChanges();

      const cameraIcon = fixture.debugElement.query(By.css('.material-icons'));

      expect(cameraIcon).toBeTruthy();
      expect(cameraIcon.nativeElement.textContent.trim()).toBe('photo_camera');
    });

    it('should not render camera icon when image is selected', () => {
      component.hasSelectedImage = true;
      fixture.detectChanges();

      const cameraIcon = fixture.debugElement.query(By.css('.material-icons'));

      expect(cameraIcon).toBeFalsy();
    });

    it('should trigger file input on drop area click when no image is selected', () => {
      component.hasSelectedImage = false;
      fixture.detectChanges();

      const dropArea = fixture.debugElement.query(By.css('.border-dashed'));
      jest.spyOn(component, 'triggerFileInput');

      dropArea.nativeElement.click();

      expect(component.triggerFileInput).toHaveBeenCalled();
    });
  });

  describe('Input Properties', () => {
    it('should accept custom acceptedTypes', () => {
      component.acceptedTypes = 'image/png';
      fixture.detectChanges();

      const fileInput = fixture.debugElement.query(By.css('input[type="file"]'));
      expect(fileInput.nativeElement.accept).toBe('image/png');
    });

    it('should accept custom maxFileSize', () => {
      component.maxFileSize = 1024 * 1024; // 1MB

      const largeFile = new File(['x'.repeat(2 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
      jest.spyOn(component.fileError, 'emit');

      (component as any).handleFile(largeFile);

      expect(component.fileError.emit).toHaveBeenCalledWith(
        'El archivo es demasiado grande. El tamaño máximo permitido es 5MB.'
      );
    });

    it('should accept custom allowedFormats', () => {
      component.allowedFormats = ['image/png'];

      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      jest.spyOn(component.fileError, 'emit');

      (component as any).handleFile(mockFile);

      expect(component.fileError.emit).toHaveBeenCalledWith('Solo se permiten archivos PNG, JPG y JPEG.');
    });

    it('should accept hasSelectedImage property', () => {
      component.hasSelectedImage = true;
      fixture.detectChanges();

      const dropArea = fixture.debugElement.query(By.css('.border-dashed'));
      expect(dropArea).toBeFalsy();
    });
  });

  describe('Event Emissions', () => {
    it('should emit fileSelected event', () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      let emittedFile: File | undefined;

      component.fileSelected.subscribe((file: File) => {
        emittedFile = file;
      });

      (component as any).handleFile(mockFile);

      expect(emittedFile).toBe(mockFile);
    });

    it('should emit fileError event', () => {
      const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      let emittedError: string | undefined;

      component.fileError.subscribe((error: string) => {
        emittedError = error;
      });

      (component as any).handleFile(mockFile);

      expect(emittedError).toBe('Por favor selecciona un archivo de imagen válido.');
    });
  });
});
