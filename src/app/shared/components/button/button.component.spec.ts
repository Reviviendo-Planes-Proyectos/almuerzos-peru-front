import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { I18nService, TranslatePipe } from '../../i18n';
import { MaterialModule } from '../../material.module';
import { ButtonComponent } from './button.component';

// Mock del servicio de traducción
class MockI18nService {
  t(key: string): string {
    const translations: Record<string, string> = {
      'auth.login.button': 'Iniciar Sesión',
      'auth.register.button': 'Registrarse',
      'common.continue': 'Continuar',
      'common.cancel': 'Cancelar'
    };
    return translations[key] || key;
  }
}

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;
  let debugElement: DebugElement;
  let buttonElement: HTMLButtonElement;
  let mockI18nService: MockI18nService;

  beforeEach(async () => {
    mockI18nService = new MockI18nService();

    await TestBed.configureTestingModule({
      imports: [ButtonComponent, MaterialModule, NoopAnimationsModule, TranslatePipe],
      providers: [{ provide: I18nService, useValue: mockI18nService }]
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    buttonElement = debugElement.query(By.css('button')).nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default properties', () => {
    expect(component.label).toBe('');
    expect(component.translateKey).toBe(null);
    expect(component.isActive).toBe(true);
    expect(component.isOutline).toBe(false);
    expect(component.imageSrc).toBeNull();
    expect(component.imgAlt).toBe('');
    expect(component.iconName).toBeNull();
  });

  it('should display the label text', () => {
    component.label = 'Test Button';
    fixture.detectChanges();

    const labelSpan = debugElement.query(By.css('span:last-child'));
    expect(labelSpan.nativeElement.textContent.trim()).toBe('Test Button');
  });

  it('should apply active primary button styles when isActive=true and isOutline=false', () => {
    component.isActive = true;
    component.isOutline = false;
    fixture.detectChanges();

    expect(buttonElement.classList).toContain('bg-yellow-500');
    expect(buttonElement.classList).toContain('text-white');
    expect(buttonElement.disabled).toBe(false);
  });

  it('should apply outline button styles when isOutline=true', () => {
    component.isActive = true;
    component.isOutline = true;
    fixture.detectChanges();

    expect(buttonElement.classList).toContain('border-yellow-500');
    expect(buttonElement.classList).toContain('border-2');
    expect(buttonElement.classList.toString()).toMatch(/border-yellow-500|border-2/);
  });

  it('should apply inactive button styles when isActive=false', () => {
    component.isActive = false;
    component.isOutline = false;
    fixture.detectChanges();

    expect(buttonElement.disabled).toBe(true);
    expect(component.buttonClasses).toBe('bg-gray-300 text-gray-500 opacity-60');
  });

  it('should display icon when iconName is provided', () => {
    component.iconName = 'facebook';
    fixture.detectChanges();

    const iconSpan = debugElement.query(By.css('span.material-icons'));
    expect(iconSpan).toBeTruthy();
    expect(iconSpan.nativeElement.textContent.trim()).toBe('facebook');
  });

  it('should not display icon when iconName is null', () => {
    component.iconName = null;
    fixture.detectChanges();

    const iconSpan = debugElement.query(By.css('span.material-icons'));
    expect(iconSpan).toBeFalsy();
  });

  it('should display image when imageSrc is provided', () => {
    component.imageSrc = 'test-image.png';
    component.imgAlt = 'Test Image';
    fixture.detectChanges();

    const imageElement = debugElement.query(By.css('img'));
    expect(imageElement).toBeTruthy();
    expect(imageElement.nativeElement.src).toContain('test-image.png');
    expect(imageElement.nativeElement.alt).toBe('Test Image');
  });

  it('should not display image when imageSrc is null', () => {
    component.imageSrc = null;
    fixture.detectChanges();

    const imageElement = debugElement.query(By.css('img'));
    expect(imageElement).toBeFalsy();
  });

  it('should have proper button classes for layout and responsiveness', () => {
    fixture.detectChanges();

    expect(buttonElement.classList).toContain('text-lg');
    expect(buttonElement.classList).toContain('font-bold');
    expect(buttonElement.classList).toContain('rounded-lg');
    expect(buttonElement.classList).toContain('w-full');
    expect(buttonElement.classList).toContain('h-auto');
    expect(buttonElement.classList).toContain('flex');
    expect(buttonElement.classList).toContain('items-center');
    expect(buttonElement.classList).toContain('justify-center');
    expect(buttonElement.classList).toContain('gap-2');
    expect(buttonElement.classList).toContain('cursor-pointer');
  });

  it('should have responsive padding classes', () => {
    fixture.detectChanges();

    expect(buttonElement.classList).toContain('p-3');
    expect(buttonElement.classList).toContain('sm:p-4');
  });

  it('should display both icon and label when both are provided', () => {
    component.label = 'Test Label';
    component.iconName = 'gmail';
    fixture.detectChanges();

    const iconSpan = debugElement.query(By.css('span.material-icons'));
    const labelSpan = debugElement.query(By.css('span:last-child'));

    expect(iconSpan).toBeTruthy();
    expect(iconSpan.nativeElement.textContent.trim()).toBe('gmail');
    expect(labelSpan).toBeTruthy();
    expect(labelSpan.nativeElement.textContent.trim()).toBe('Test Label');
  });

  it('should have responsive text sizing on label', () => {
    component.label = 'Test';
    fixture.detectChanges();

    const labelSpan = debugElement.query(By.css('span:last-child'));
    expect(labelSpan.nativeElement.classList).toContain('text-base');
    expect(labelSpan.nativeElement.classList).toContain('sm:text-sm');
    expect(labelSpan.nativeElement.classList).toContain('md:text-base');
    expect(labelSpan.nativeElement.classList).toContain('lg:text-lg');
  });

  it('should be enabled when isActive is true', () => {
    component.isActive = true;
    fixture.detectChanges();

    expect(buttonElement.disabled).toBe(false);
  });

  it('should be disabled when isActive is false', () => {
    component.isActive = false;
    fixture.detectChanges();

    expect(buttonElement.disabled).toBe(true);
  });

  it('should display both image and icon when both are provided', () => {
    component.imageSrc = 'test-image.png';
    component.imgAlt = 'Test Image';
    component.iconName = 'email';
    fixture.detectChanges();

    const imageElement = debugElement.query(By.css('img'));
    const iconSpan = debugElement.query(By.css('span.material-icons'));

    expect(imageElement).toBeTruthy();
    expect(iconSpan).toBeTruthy();
    expect(iconSpan.nativeElement.textContent.trim()).toBe('email');
  });

  it('should have correct image dimensions', () => {
    component.imageSrc = 'test-image.png';
    fixture.detectChanges();

    const imageElement = debugElement.query(By.css('img'));
    expect(imageElement.nativeElement.classList).toContain('w-5');
    expect(imageElement.nativeElement.classList).toContain('h-5');
  });

  it('should have correct icon styling', () => {
    component.iconName = 'facebook';
    fixture.detectChanges();

    const iconSpan = debugElement.query(By.css('span.material-icons'));
    expect(iconSpan.nativeElement.classList).toContain('text-lg');
    expect(iconSpan.nativeElement.classList).toContain('mr-2');
  });

  it('should handle empty label gracefully', () => {
    component.label = '';
    fixture.detectChanges();

    const labelSpan = debugElement.query(By.css('span:last-child'));
    expect(labelSpan.nativeElement.textContent.trim()).toBe('');
  });

  it('should apply correct button classes for different states', () => {
    component.isActive = true;
    component.isOutline = false;
    fixture.detectChanges();
    expect(component.buttonClasses).toBe('bg-yellow-500 text-white hover:bg-yellow-600');

    component.isOutline = true;
    fixture.detectChanges();
    expect(component.buttonClasses).toBe('border-yellow-500 border-2 text-gray-900 bg-transparent hover:bg-yellow-50');

    component.isActive = false;
    component.isOutline = false;
    fixture.detectChanges();
    expect(component.buttonClasses).toBe('bg-gray-300 text-gray-500 opacity-60');
  });

  describe('Internationalization', () => {
    it('should display translated text when translateKey is provided', () => {
      component.translateKey = 'auth.login.button';
      fixture.detectChanges();

      const labelSpan = debugElement.query(By.css('span:last-child'));
      expect(labelSpan.nativeElement.textContent.trim()).toBe('Iniciar Sesión');
    });

    it('should display label text when translateKey is null', () => {
      component.label = 'Custom Label';
      component.translateKey = null;
      fixture.detectChanges();

      const labelSpan = debugElement.query(By.css('span:last-child'));
      expect(labelSpan.nativeElement.textContent.trim()).toBe('Custom Label');
    });

    it('should prioritize translateKey over label when both are provided', () => {
      component.label = 'Custom Label';
      component.translateKey = 'auth.register.button';
      fixture.detectChanges();

      const labelSpan = debugElement.query(By.css('span:last-child'));
      expect(labelSpan.nativeElement.textContent.trim()).toBe('Registrarse');
    });

    it('should display the key itself when translation is not found', () => {
      component.translateKey = 'nonexistent.key';
      fixture.detectChanges();

      const labelSpan = debugElement.query(By.css('span:last-child'));
      expect(labelSpan.nativeElement.textContent.trim()).toBe('nonexistent.key');
    });

    it('should handle empty translateKey and fall back to label', () => {
      component.translateKey = '';
      component.label = 'Fallback Label';
      fixture.detectChanges();

      const labelSpan = debugElement.query(By.css('span:last-child'));
      expect(labelSpan.nativeElement.textContent.trim()).toBe('Fallback Label');
    });
  });
});
