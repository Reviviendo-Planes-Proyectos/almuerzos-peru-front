import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SelectFieldComponent, SelectOption } from './select-field.component';

describe('SelectFieldComponent', () => {
  let component: SelectFieldComponent;
  let fixture: ComponentFixture<SelectFieldComponent>;

  const mockOptions: SelectOption[] = [
    { value: 'option1', label: 'Opción 1' },
    { value: 'option2', label: 'Opción 2' },
    { value: 'option3', label: 'Opción 3', disabled: true }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectFieldComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectFieldComponent);
    component = fixture.componentInstance;
    component.options = mockOptions;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Properties', () => {
    it('should have default properties', () => {
      expect(component.label).toBe('');
      expect(component.icon).toBe('');
      expect(component.placeholder).toBe('Seleccionar opción');
      expect(component.disabled).toBe(false);
      expect(component.value).toBeNull();
      expect(component.isOpen).toBe(false);
      expect(component.isTouched).toBe(false);
    });

    it('should accept custom properties', () => {
      component.label = 'Test Label';
      component.icon = 'test_icon';
      component.placeholder = 'Custom Placeholder';
      component.disabled = true;

      expect(component.label).toBe('Test Label');
      expect(component.icon).toBe('test_icon');
      expect(component.placeholder).toBe('Custom Placeholder');
      expect(component.disabled).toBe(true);
    });
  });

  describe('ControlValueAccessor', () => {
    it('should write value', () => {
      component.writeValue('option1');
      expect(component.value).toBe('option1');
    });

    it('should register onChange callback', () => {
      const mockFn = jest.fn();
      component.registerOnChange(mockFn);

      component.selectOption(mockOptions[0]);
      expect(mockFn).toHaveBeenCalledWith('option1');
    });

    it('should register onTouched callback', () => {
      const mockFn = jest.fn();
      component.registerOnTouched(mockFn);

      component.toggleDropdown();
      expect(mockFn).toHaveBeenCalled();
    });

    it('should set disabled state', () => {
      component.setDisabledState(true);
      expect(component.disabled).toBe(true);
    });
  });

  describe('Dropdown Functionality', () => {
    it('should toggle dropdown when not disabled', () => {
      expect(component.isOpen).toBe(false);

      component.toggleDropdown();
      expect(component.isOpen).toBe(true);

      component.toggleDropdown();
      expect(component.isOpen).toBe(false);
    });

    it('should not toggle dropdown when disabled', () => {
      component.disabled = true;

      component.toggleDropdown();
      expect(component.isOpen).toBe(false);
    });

    it('should mark as touched when opening dropdown', () => {
      const mockOnTouched = jest.fn();
      component.registerOnTouched(mockOnTouched);

      component.toggleDropdown();
      expect(component.isTouched).toBe(true);
      expect(mockOnTouched).toHaveBeenCalled();
    });

    it('should close dropdown on blur', () => {
      component.isOpen = true;

      jest.useFakeTimers();
      component.onBlur();
      jest.advanceTimersByTime(150);

      expect(component.isOpen).toBe(false);
      jest.useRealTimers();
    });
  });

  describe('Option Selection', () => {
    it('should select option when not disabled', () => {
      const mockOnChange = jest.fn();
      component.registerOnChange(mockOnChange);

      component.selectOption(mockOptions[0]);

      expect(component.value).toBe('option1');
      expect(component.isOpen).toBe(false);
      expect(mockOnChange).toHaveBeenCalledWith('option1');
    });

    it('should not select disabled option', () => {
      const mockOnChange = jest.fn();
      component.registerOnChange(mockOnChange);

      component.selectOption(mockOptions[2]); // disabled option

      expect(component.value).toBeNull();
      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('should clear selection', () => {
      const mockOnChange = jest.fn();
      component.registerOnChange(mockOnChange);
      component.value = 'option1';

      component.clearSelection();

      expect(component.value).toBeNull();
      expect(mockOnChange).toHaveBeenCalledWith(null);
    });
  });

  describe('Label Methods', () => {
    it('should return selected label when value exists', () => {
      component.value = 'option1';
      expect(component.getSelectedLabel()).toBe('Opción 1');
    });

    it('should return placeholder when no value selected', () => {
      component.value = null;
      component.placeholder = 'Test Placeholder';
      expect(component.getSelectedLabel()).toBe('Test Placeholder');
    });

    it('should return placeholder when value not found in options', () => {
      component.value = 'nonexistent';
      component.placeholder = 'Test Placeholder';
      expect(component.getSelectedLabel()).toBe('Test Placeholder');
    });
  });

  describe('Template Rendering', () => {
    it('should not render label (currently commented out)', () => {
      component.label = 'Test Label';
      fixture.detectChanges();

      const label = fixture.debugElement.query(By.css('label'));
      expect(label).toBeFalsy(); // Label is commented out in template
    });

    it('should not render label when not provided', () => {
      component.label = '';
      fixture.detectChanges();

      const label = fixture.debugElement.query(By.css('label'));
      expect(label).toBeFalsy();
    });

    it('should render icon when provided', () => {
      component.icon = 'test_icon';
      fixture.detectChanges();

      const icon = fixture.debugElement.query(By.css('i.material-icons'));
      expect(icon).toBeTruthy();
      expect(icon.nativeElement.textContent.trim()).toBe('test_icon');
    });

    it('should render placeholder by default', () => {
      const selectInput = fixture.debugElement.query(By.css('span.flex-1'));
      expect(selectInput.nativeElement.textContent.trim()).toBe('Seleccionar opción');
    });

    it('should render selected option label', () => {
      component.value = 'option1';
      fixture.detectChanges();

      const selectInput = fixture.debugElement.query(By.css('span.flex-1'));
      expect(selectInput.nativeElement.textContent.trim()).toBe('Opción 1');
    });

    it('should show dropdown when isOpen is true', () => {
      component.isOpen = true;
      fixture.detectChanges();

      const dropdown = fixture.debugElement.query(By.css('.absolute.top-full'));
      expect(dropdown).toBeTruthy();
    });

    it('should hide dropdown when isOpen is false', () => {
      component.isOpen = false;
      fixture.detectChanges();

      const dropdown = fixture.debugElement.query(By.css('.absolute.top-full'));
      expect(dropdown).toBeFalsy();
    });

    it('should render all options in dropdown', () => {
      component.isOpen = true;
      fixture.detectChanges();

      const options = fixture.debugElement.queryAll(By.css('div[class*="hover:bg-gray-50"]'));
      expect(options.length).toBe(3);
    });

    it('should show clear button when value exists and not disabled', () => {
      component.value = 'option1';
      component.disabled = false;
      fixture.detectChanges();

      const clearButton = fixture.debugElement.query(By.css('button'));
      expect(clearButton).toBeTruthy();
    });

    it('should not show clear button when disabled', () => {
      component.value = 'option1';
      component.disabled = true;
      fixture.detectChanges();

      const clearButton = fixture.debugElement.query(By.css('button'));
      expect(clearButton).toBeFalsy();
    });

    it('should show arrow icon', () => {
      const arrowIcons = fixture.debugElement.queryAll(By.css('i.material-icons'));
      const arrow = arrowIcons.find((icon) => icon.nativeElement.textContent.trim() === 'keyboard_arrow_down');
      expect(arrow).toBeTruthy();
    });

    it('should rotate arrow when dropdown is open', () => {
      component.isOpen = true;
      fixture.detectChanges();

      const arrowIcons = fixture.debugElement.queryAll(By.css('i.material-icons'));
      const arrowIcon = arrowIcons.find((icon) => icon.nativeElement.textContent.trim() === 'keyboard_arrow_down');
      expect(arrowIcon).toBeTruthy();
      if (arrowIcon) {
        expect(arrowIcon.nativeElement.classList.contains('rotate-180')).toBe(true);
      }
    });
  });

  describe('User Interactions', () => {
    it('should toggle dropdown on click', () => {
      const selectContainer = fixture.debugElement.query(By.css('div.cursor-pointer'));

      selectContainer.nativeElement.click();
      expect(component.isOpen).toBe(true);
    });

    it('should select option on click', () => {
      component.isOpen = true;
      fixture.detectChanges();

      const firstOption = fixture.debugElement.queryAll(By.css('div[class*="hover:bg-gray-50"]'))[0];
      firstOption.nativeElement.click();

      expect(component.value).toBe('option1');
      expect(component.isOpen).toBe(false);
    });

    it('should clear selection on clear button click', () => {
      component.value = 'option1';
      fixture.detectChanges();

      const clearButton = fixture.debugElement.query(By.css('button'));
      clearButton.nativeElement.click();

      expect(component.value).toBeNull();
    });

    it('should close dropdown on overlay click', () => {
      component.isOpen = true;
      fixture.detectChanges();

      const overlay = fixture.debugElement.query(By.css('.fixed.inset-0'));
      overlay.nativeElement.click();

      expect(component.isOpen).toBe(false);
    });
  });

  describe('Disabled State', () => {
    beforeEach(() => {
      component.disabled = true;
      fixture.detectChanges();
    });

    it('should apply disabled styles', () => {
      const selectContainer = fixture.debugElement.query(By.css('div.cursor-pointer'));
      expect(selectContainer.nativeElement.classList.contains('opacity-50')).toBe(true);
      expect(selectContainer.nativeElement.classList.contains('cursor-not-allowed')).toBe(true);
    });

    it('should not open dropdown when disabled', () => {
      const selectContainer = fixture.debugElement.query(By.css('div.cursor-pointer'));
      selectContainer.nativeElement.click();

      expect(component.isOpen).toBe(false);
    });

    it('should not show dropdown in template when disabled', () => {
      component.isOpen = true;
      fixture.detectChanges();

      const dropdown = fixture.debugElement.query(By.css('.absolute.top-full'));
      expect(dropdown).toBeFalsy();
    });
  });

  describe('Empty Options', () => {
    beforeEach(() => {
      component.options = [];
      component.isOpen = true;
      fixture.detectChanges();
    });

    it('should show no options message when options array is empty', () => {
      const noOptionsMessage = fixture.debugElement.query(By.css('div[class*="text-center"]'));
      expect(noOptionsMessage).toBeTruthy();
      expect(noOptionsMessage.nativeElement.textContent.trim()).toBe('No hay opciones disponibles');
    });
  });
});
