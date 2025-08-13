import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { SelectFieldComponent, SelectOption } from './select-field.component';

describe('SelectFieldComponent', () => {
  let component: SelectFieldComponent;
  let fixture: ComponentFixture<SelectFieldComponent>;
  let debugElement: DebugElement;

  const mockOptions: SelectOption[] = [
    { value: 'option1', label: 'Opción 1' },
    { value: 'option2', label: 'Opción 2' },
    { value: 'option3', label: 'Opción 3', disabled: true },
    { value: 'option4', label: 'Opción 4' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectFieldComponent, FormsModule, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectFieldComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    component.label = 'Test Label';
    component.options = mockOptions;
    component.icon = 'location_on';

    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should render label correctly', () => {
      const labelElement = debugElement.query(By.css('label'));
      expect(labelElement.nativeElement.textContent.trim()).toBe('Test Label');
    });

    it('should render icon correctly', () => {
      const iconElement = debugElement.query(By.css('.material-icons-outlined'));
      expect(iconElement.nativeElement.textContent.trim()).toBe('location_on');
    });

    it('should render all options', () => {
      const optionElements = debugElement.queryAll(By.css('option:not([value=""])'));
      expect(optionElements.length).toBe(mockOptions.length);
    });

    it('should render dropdown icon', () => {
      const dropdownSpan = debugElement.query(By.css('span.absolute.inset-y-0.right-0.flex.items-center.pr-3'));
      const dropdownIcon = dropdownSpan.query(By.css('.material-icons-outlined'));
      expect(dropdownIcon).toBeTruthy();
      expect(dropdownIcon.nativeElement.textContent.trim()).toBe('expand_more');
    });
  });

  describe('Component State', () => {
    it('should initialize with empty value', () => {
      expect(component.value).toBe('');
      expect(component.hasValue).toBeFalsy();
    });

    it('should update hasValue when value is set', () => {
      component.value = 'option1';
      expect(component.hasValue).toBeTruthy();
    });

    it('should initialize as not focused', () => {
      expect(component.isFocused).toBeFalsy();
    });

    it('should initialize as not touched', () => {
      expect(component.touched).toBeFalsy();
    });

    it('should initialize as valid', () => {
      expect(component.valid).toBeTruthy();
      expect(component.invalid).toBeFalsy();
    });
  });

  describe('User Interactions', () => {
    let selectElement: HTMLSelectElement;

    beforeEach(() => {
      selectElement = debugElement.query(By.css('select')).nativeElement;
    });

    it('should set focused state on focus', () => {
      selectElement.focus();
      selectElement.dispatchEvent(new Event('focus'));

      expect(component.isFocused).toBeTruthy();
    });

    it('should set touched state on blur', () => {
      selectElement.focus();
      selectElement.dispatchEvent(new Event('focus'));
      selectElement.blur();
      selectElement.dispatchEvent(new Event('blur'));

      expect(component.isFocused).toBeFalsy();
      expect(component.touched).toBeTruthy();
    });

    it('should update value on selection change', () => {
      const onChangeSpy = jest.spyOn(component, 'onSelectionChange');

      selectElement.value = 'option2';
      selectElement.dispatchEvent(new Event('change'));

      expect(onChangeSpy).toHaveBeenCalled();
      expect(component.value).toBe('option2');
    });

    it('should rotate dropdown icon when focused', () => {
      component.isFocused = true;
      component.isOpen = true;
      fixture.detectChanges();

      const dropdownSpan = debugElement.query(By.css('span.absolute.inset-y-0.right-0.flex.items-center.pr-3'));
      const dropdownIcon = dropdownSpan.query(By.css('.material-icons-outlined'));
      expect(dropdownIcon.nativeElement.textContent.trim()).toBe('expand_less');
    });
  });

  describe('ControlValueAccessor Implementation', () => {
    it('should implement writeValue', () => {
      component.writeValue('option1');
      expect(component.value).toBe('option1');
    });

    it('should implement writeValue with null/undefined', () => {
      component.writeValue(null as any);
      expect(component.value).toBe('');

      component.writeValue(undefined as any);
      expect(component.value).toBe('');
    });

    it('should register onChange callback', () => {
      const mockOnChange = jest.fn();
      component.registerOnChange(mockOnChange);

      component.onSelectionChange({ target: { value: 'option1' } } as any);

      expect(mockOnChange).toHaveBeenCalledWith('option1');
    });

    it('should register onTouched callback', () => {
      const mockOnTouched = jest.fn();
      component.registerOnTouched(mockOnTouched);

      component.onBlur();

      expect(mockOnTouched).toHaveBeenCalled();
    });

    it('should handle disabled state', () => {
      component.setDisabledState(true);
      expect(component.disabled).toBeTruthy();

      component.setDisabledState(false);
      expect(component.disabled).toBeFalsy();
    });
  });

  describe('Visual States', () => {
    it('should apply correct classes for untouched state', () => {
      const selectElement = debugElement.query(By.css('select'));
      expect(selectElement.nativeElement.classList).toContain('border-gray-200');
    });

    it('should apply correct classes for valid touched state', () => {
      component.valid = true;
      component.touched = true;
      fixture.detectChanges();

      const selectElement = debugElement.query(By.css('select'));
      expect(selectElement.nativeElement.classList).toContain('border-green-500');
    });

    it('should apply correct classes for invalid touched state', () => {
      component.invalid = true;
      component.touched = true;
      fixture.detectChanges();

      const selectElement = debugElement.query(By.css('select'));
      expect(selectElement.nativeElement.classList).toContain('border-red-500');
    });

    it('should apply disabled classes when disabled', () => {
      component.disabled = true;
      fixture.detectChanges();

      const selectElement = debugElement.query(By.css('select'));
      expect(selectElement.nativeElement.classList).toContain('bg-gray-50');
      expect(selectElement.nativeElement.classList).toContain('cursor-not-allowed');
    });
  });

  describe('Label Positioning', () => {
    it('should position label correctly when no value and not focused', () => {
      component.value = '';
      component.isFocused = false;
      fixture.detectChanges();

      const labelElement = debugElement.query(By.css('label'));
      expect(labelElement.nativeElement.classList).toContain('top-3');
      expect(labelElement.nativeElement.classList).toContain('scale-100');
    });

    it('should position label correctly when has value', () => {
      component.value = 'option1';
      fixture.detectChanges();

      const labelElement = debugElement.query(By.css('label'));
      expect(labelElement.nativeElement.classList).toContain('-top-2');
      expect(labelElement.nativeElement.classList).toContain('scale-90');
    });

    it('should position label correctly when focused', () => {
      component.isFocused = true;
      fixture.detectChanges();

      const labelElement = debugElement.query(By.css('label'));
      expect(labelElement.nativeElement.classList).toContain('-top-2');
      expect(labelElement.nativeElement.classList).toContain('scale-90');
    });
  });

  describe('Error and Help Messages', () => {
    it('should display error message when invalid and touched', () => {
      component.invalid = true;
      component.touched = true;
      component.errorMessage = 'Test error message';
      fixture.detectChanges();

      const errorElement = debugElement.query(By.css('div.text-red-500.text-xs'));
      expect(errorElement).toBeTruthy();
      expect(errorElement.nativeElement.textContent.trim()).toBe('Test error message');
    });

    it('should not display error message when valid', () => {
      component.invalid = false;
      component.touched = true;
      component.errorMessage = 'Test error message';
      fixture.detectChanges();

      const errorElement = debugElement.query(By.css('.text-red-500'));
      expect(errorElement).toBeFalsy();
    });

    it('should display help text when provided and no error', () => {
      component.invalid = false;
      component.helpText = 'Test help text';
      fixture.detectChanges();

      const helpElement = debugElement.query(By.css('div.text-gray-500.text-xs'));
      expect(helpElement).toBeTruthy();
      expect(helpElement.nativeElement.textContent.trim()).toBe('Test help text');
    });

    it('should not display help text when there is an error', () => {
      component.invalid = true;
      component.touched = true;
      component.helpText = 'Test help text';
      component.errorMessage = 'Test error';
      fixture.detectChanges();

      const helpElements = debugElement.queryAll(By.css('.text-gray-500'));
      const helpTextElement = helpElements.find((el) => el.nativeElement.textContent.includes('Test help text'));
      expect(helpTextElement).toBeFalsy();
    });
  });

  describe('Option Rendering', () => {
    it('should render disabled options correctly', () => {
      const optionElements = debugElement.queryAll(By.css('option'));
      const disabledOption = optionElements.find((el) => el.nativeElement.value === 'option3');

      expect(disabledOption?.nativeElement.disabled).toBeTruthy();
    });

    it('should render option labels correctly', () => {
      const optionElements = debugElement.queryAll(By.css('option:not([value=""])'));

      optionElements.forEach((element, index) => {
        expect(element.nativeElement.textContent.trim()).toBe(mockOptions[index].label);
        expect(element.nativeElement.value).toBe(mockOptions[index].value);
      });
    });
  });
});
