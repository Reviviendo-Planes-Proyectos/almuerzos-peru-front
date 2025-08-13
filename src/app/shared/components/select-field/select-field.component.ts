import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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
  styleUrls: ['./select-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SelectFieldComponent,
      multi: true
    }
  ]
})
export class SelectFieldComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() icon = 'expand_more';
  @Input() options: SelectOption[] = [];
  @Input() disabled = false;
  @Input() errorMessage = '';
  @Input() helpText = '';

  value = '';
  isFocused = false;
  isOpen = false;
  touched = false;
  valid = true;
  invalid = false;
  fieldId = '';

  private onChange = (_value: string) => {};
  private onTouched = () => {};

  constructor() {
    this.fieldId = `select-field-${Math.random().toString(36).substr(2, 9)}`;
  }

  get hasValue(): boolean {
    return this.value !== '' && this.value !== null && this.value !== undefined;
  }

  onFocus(): void {
    this.isFocused = true;
    this.isOpen = true;
  }

  onBlur(): void {
    this.isFocused = false;
    this.isOpen = false;
    this.touched = true;
    this.onTouched();
  }

  onClick(): void {
    this.isOpen = !this.isOpen;
  }

  onSelectionChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.value = target.value;
    this.onChange(this.value);
    // Cerrar el dropdown después de seleccionar
    this.isOpen = false;
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
