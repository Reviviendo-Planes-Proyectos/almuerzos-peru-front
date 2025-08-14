import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { CoreModule } from '../../modules';
import { InputFieldComponent } from './input-field.component';

describe('InputFieldComponent', () => {
  let component: InputFieldComponent;
  let fixture: ComponentFixture<InputFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputFieldComponent, CoreModule]
    }).compileComponents();

    fixture = TestBed.createComponent(InputFieldComponent);
    component = fixture.componentInstance;

    component.label = 'Test Label';
    component.control = new FormControl('', [Validators.required]);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component initialization', () => {
    it('should initialize with default values', () => {
      expect(component.label).toBe('Test Label');
      expect(component.placeholder).toBe('');
      expect(component.type).toBe('text');
      expect(component.icon).toBe('person');
      expect(component.required).toBe(false);
      expect(component.value).toBe('');
      expect(component.disabled).toBe(false);
      expect(component.isFocused).toBe(false);
    });

    it('should generate unique input ID', () => {
      const fixture2 = TestBed.createComponent(InputFieldComponent);
      const component2 = fixture2.componentInstance;

      expect(component.inputId).toBeDefined();
      expect(component2.inputId).toBeDefined();
      expect(component.inputId).not.toBe(component2.inputId);
    });

    it('should accept input properties', () => {
      component.label = 'Custom Label';
      component.placeholder = 'Custom Placeholder';
      component.type = 'email';
      component.icon = 'email';
      component.required = true;

      expect(component.label).toBe('Custom Label');
      expect(component.placeholder).toBe('Custom Placeholder');
      expect(component.type).toBe('email');
      expect(component.icon).toBe('email');
      expect(component.required).toBe(true);
    });
  });

  describe('Template rendering', () => {
    it('should display the correct label', () => {
      component.label = 'Email Address';
      fixture.detectChanges();

      const label = fixture.debugElement.query(By.css('label'));
      expect(label.nativeElement.textContent.trim()).toBe('Email Address');
    });

    it('should display the correct icon', () => {
      component.icon = 'email';
      fixture.detectChanges();

      const icon = fixture.debugElement.query(By.css('.material-icons-outlined'));
      expect(icon.nativeElement.textContent.trim()).toBe('email');
    });

    it('should set correct input type', () => {
      component.type = 'password';
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input'));
      expect(input.nativeElement.type).toBe('password');
    });

    it('should set required attribute when required is true', () => {
      component.required = true;
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input'));
      expect(input.nativeElement.required).toBe(true);
    });

    it('should link label to input with correct id', () => {
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input'));
      const label = fixture.debugElement.query(By.css('label'));

      expect(input.nativeElement.id).toBe(component.inputId);
      expect(label.nativeElement.getAttribute('for')).toBe(component.inputId);
    });
  });

  describe('Value handling', () => {
    it('should update value on input', () => {
      const input = fixture.debugElement.query(By.css('input'));

      input.nativeElement.value = 'test value';
      input.nativeElement.dispatchEvent(new Event('input'));

      expect(component.value).toBe('test value');
    });

    it('should call onChange when value changes', () => {
      const onChangeSpy = jest.spyOn(component as any, 'onChange');

      const input = fixture.debugElement.query(By.css('input'));
      input.nativeElement.value = 'new value';
      input.nativeElement.dispatchEvent(new Event('input'));

      expect(onChangeSpy).toHaveBeenCalledWith('new value');
    });

    it('should have hasValue return true when value exists', () => {
      component.value = 'some value';
      expect(component.hasValue).toBe(true);

      component.value = '0';
      expect(component.hasValue).toBe(true);

      component.value = 'false';
      expect(component.hasValue).toBe(true);
    });

    it('should have hasValue return false for empty string', () => {
      component.value = '';
      expect(component.hasValue).toBe(false);
    });

    it('should have hasValue return false for null', () => {
      component.value = null;
      expect(component.hasValue).toBe(false);
    });
  });

  describe('Focus and blur handling', () => {
    it('should set isFocused to true on focus', () => {
      const input = fixture.debugElement.query(By.css('input'));

      input.nativeElement.dispatchEvent(new Event('focus'));

      expect(component.isFocused).toBe(true);
    });

    it('should set isFocused to false on blur', () => {
      component.isFocused = true;
      const input = fixture.debugElement.query(By.css('input'));

      input.nativeElement.dispatchEvent(new Event('blur'));

      expect(component.isFocused).toBe(false);
    });

    it('should call onTouched on blur', () => {
      const onTouchedSpy = jest.spyOn(component as any, 'onTouched');

      const input = fixture.debugElement.query(By.css('input'));
      input.nativeElement.dispatchEvent(new Event('blur'));

      expect(onTouchedSpy).toHaveBeenCalled();
    });
  });

  describe('Label positioning', () => {
    it('should position label normally when not focused and no value', () => {
      component.isFocused = false;
      component.value = '';
      fixture.detectChanges();

      const label = fixture.debugElement.query(By.css('label'));
      expect(label.nativeElement.classList.contains('top-3')).toBe(true);
      expect(label.nativeElement.classList.contains('scale-100')).toBe(true);
    });

    it('should position label up when focused', () => {
      component.isFocused = true;
      fixture.detectChanges();

      const label = fixture.debugElement.query(By.css('label'));
      expect(label.nativeElement.classList.contains('top-1')).toBe(true);
      expect(label.nativeElement.classList.contains('scale-90')).toBe(true);
    });

    it('should position label up when has value', () => {
      component.value = 'test';
      fixture.detectChanges();

      const label = fixture.debugElement.query(By.css('label'));
      expect(label.nativeElement.classList.contains('top-1')).toBe(true);
      expect(label.nativeElement.classList.contains('scale-90')).toBe(true);
    });
  });

  describe('Validation states', () => {
    it('should show valid state when form control is valid and touched', () => {
      component.control = new FormControl('valid@email.com', [Validators.required, Validators.email]);
      component.control.markAsTouched();
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input'));
      expect(input.nativeElement.classList.contains('border-green-500')).toBe(true);

      const label = fixture.debugElement.query(By.css('label'));
      expect(label.nativeElement.classList.contains('text-green-500')).toBe(true);
    });

    it('should show invalid state when form control is invalid and touched', () => {
      component.control = new FormControl('', [Validators.required]);
      component.control.markAsTouched();
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input'));
      expect(input.nativeElement.classList.contains('border-red-500')).toBe(true);

      const label = fixture.debugElement.query(By.css('label'));
      expect(label.nativeElement.classList.contains('text-red-500')).toBe(true);
    });

    it('should show default state when form control is not touched', () => {
      component.control = new FormControl('');
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input'));
      expect(input.nativeElement.classList.contains('border-gray-200')).toBe(true);
    });
  });

  describe('Validation icons', () => {
    it('should show check icon when valid and touched', () => {
      component.control = new FormControl('valid@email.com', [Validators.required, Validators.email]);
      component.control.markAsTouched();
      fixture.detectChanges();

      const validationIcon = fixture.debugElement.query(By.css('.absolute.inset-y-0.right-0 i'));
      expect(validationIcon.nativeElement.textContent.trim()).toBe('check');

      const iconContainer = fixture.debugElement.query(By.css('.bg-green-500'));
      expect(iconContainer).toBeTruthy();
    });

    it('should show close icon when invalid and touched', () => {
      component.control = new FormControl('', [Validators.required]);
      component.control.markAsTouched();
      fixture.detectChanges();

      const validationIcon = fixture.debugElement.query(By.css('.absolute.inset-y-0.right-0 i'));
      expect(validationIcon.nativeElement.textContent.trim()).toBe('close');

      const iconContainer = fixture.debugElement.query(By.css('.bg-red-500'));
      expect(iconContainer).toBeTruthy();
    });

    it('should not show validation icon when not touched', () => {
      component.control = new FormControl('', [Validators.required]);
      fixture.detectChanges();

      const validationSection = fixture.debugElement.query(By.css('.absolute.inset-y-0.right-0'));
      expect(validationSection).toBeFalsy();
    });
  });

  describe('Error messages', () => {
    it('should show required error message', () => {
      component.control = new FormControl('', [Validators.required]);
      component.control.markAsTouched();
      component.control.markAsDirty();
      fixture.detectChanges();

      expect(component.showError).toBe(true);

      const errorDiv = fixture.debugElement.query(By.css('.text-sm.text-red-500.mt-1'));
      expect(errorDiv).toBeTruthy();

      const errorMessage = errorDiv.nativeElement.textContent.trim();
      expect(errorMessage).toContain('Este campo es obligatorio.');
    });

    it('should show email error message', () => {
      component.control = new FormControl('invalid-email', [Validators.email]);
      component.control.markAsTouched();
      component.control.markAsDirty();
      fixture.detectChanges();

      expect(component.showError).toBe(true);

      const errorDiv = fixture.debugElement.query(By.css('.text-sm.text-red-500.mt-1'));
      expect(errorDiv).toBeTruthy();

      const errorMessage = errorDiv.nativeElement.textContent.trim();
      expect(errorMessage).toContain('Ingresa un correo válido.');
    });

    /* it('should show minlength error message', () => {
      component.control = new FormControl('ab', [Validators.minLength(5)]);
      component.control.markAsTouched();
      component.control.markAsDirty();
      fixture.detectChanges();

      expect(component.showError).toBe(true);

      const errorDiv = fixture.debugElement.query(By.css('.text-sm.text-red-500.mt-1'));
      expect(errorDiv).toBeTruthy();

      const errorMessage = errorDiv.nativeElement.textContent.trim();
      expect(errorMessage).toContain('Mínimo 5 caracteres.');
    }); */

    it('should not show error message when valid', () => {
      component.control = new FormControl('valid@email.com', [Validators.required, Validators.email]);
      component.control.markAsTouched();
      fixture.detectChanges();

      const errorMessage = fixture.debugElement.query(By.css('.text-red-500'));
      expect(errorMessage).toBeFalsy();
    });

    it('should not show error message when not touched', () => {
      component.control = new FormControl('', [Validators.required]);
      fixture.detectChanges();

      const errorMessage = fixture.debugElement.query(By.css('.text-red-500'));
      expect(errorMessage).toBeFalsy();
    });
  });

  describe('ControlValueAccessor implementation', () => {
    it('should implement writeValue', () => {
      component.writeValue('test value');
      expect(component.value).toBe('test value');
    });

    it('should implement registerOnChange', () => {
      const mockFn = jest.fn();
      component.registerOnChange(mockFn);

      component.onInput({ target: { value: 'new value' } } as any);

      expect(mockFn).toHaveBeenCalledWith('new value');
    });

    it('should implement registerOnTouched', () => {
      const mockFn = jest.fn();
      component.registerOnTouched(mockFn);

      component.onBlur();

      expect(mockFn).toHaveBeenCalled();
    });

    it('should implement setDisabledState', () => {
      component.setDisabledState(true);
      expect(component.disabled).toBe(true);

      component.setDisabledState(false);
      expect(component.disabled).toBe(false);
    });
  });

  describe('showError getter', () => {
    it('should return true when control is invalid and dirty', () => {
      component.control = new FormControl('', [Validators.required]);
      component.control.markAsDirty();
      expect(component.showError).toBe(true);
    });

    it('should return true when control is invalid and touched', () => {
      component.control = new FormControl('', [Validators.required]);
      component.control.markAsTouched();
      expect(component.showError).toBe(true);
    });

    it('should return false when control is valid', () => {
      component.control = new FormControl('valid value', [Validators.required]);
      component.control.markAsTouched();
      expect(component.showError).toBe(false);
    });

    it('should return false when control is invalid but not touched or dirty', () => {
      component.control = new FormControl('', [Validators.required]);
      expect(component.showError).toBe(false);
    });
  });

  describe('Disabled state', () => {
    it('should disable input when disabled is true', () => {
      component.disabled = true;
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input'));
      expect(input.nativeElement.disabled).toBe(true);
    });

    it('should enable input when disabled is false', () => {
      component.disabled = false;
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input'));
      expect(input.nativeElement.disabled).toBe(false);
    });
  });
});
