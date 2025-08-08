import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-select-field',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select-field.component.html',
  styleUrl: './select-field.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectFieldComponent),
      multi: true
    }
  ]
})
export class SelectFieldComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() icon = '';
  @Input() placeholder = 'Seleccionar opción';
  @Input() options: SelectOption[] = [];
  @Input() disabled = false;

  control!: FormControl;
  value: string | null = null;
  isOpen = false;
  isTouched = false;

  // ControlValueAccessor
  private onChange = (_: string | null) => {};
  private onTouched = () => {};

  writeValue(value: string | null): void {
    this.value = value;
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggleDropdown(): void {
    if (!this.disabled) {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.markAsTouched();
      }
    }
  }

  selectOption(option: SelectOption): void {
    if (!option.disabled) {
      this.value = option.value;
      this.isOpen = false;
      this.onChange(this.value);
      this.markAsTouched();
    }
  }

  clearSelection(): void {
    this.value = null;
    this.onChange(this.value);
    this.markAsTouched();
  }

  private markAsTouched(): void {
    if (!this.isTouched) {
      this.isTouched = true;
      this.onTouched();
    }
  }

  getSelectedLabel(): string {
    const selectedOption = this.options.find((option) => option.value === this.value);
    return selectedOption ? selectedOption.label : this.placeholder;
  }

  get showError(): boolean {
    return this.control?.invalid && (this.control?.dirty || this.control?.touched);
  }

  onBlur(): void {
    // Delay para permitir clicks en las opciones
    setTimeout(() => {
      this.isOpen = false;
      this.markAsTouched();
    }, 150);
  }
}
