import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Optional, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './input-field.component.html',
  styleUrl: './input-field.component.scss'
})
export class InputFieldComponent implements OnInit, ControlValueAccessor {
  @Input() label!: string;
  @Input() placeholder = '';
  @Input() type = 'text';
  @Input() icon = 'person';
  @Input() required = false;

  control!: FormControl;
  value: any = '';
  disabled = false;
  inputId = `input-${Date.now()}-${this.generateRandomId()}`;
  isFocused = false;

  private onChange = (_value: any) => {};
  private onTouched = () => {};

  private generateRandomId(): string {
    // Genera un ID único usando crypto.getRandomValues si está disponible,
    // o fallback a un método alternativo
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const array = new Uint32Array(1);
      crypto.getRandomValues(array);
      return array[0].toString(36);
    }
    // Fallback para entornos donde crypto no está disponible
    return Math.floor(Math.random() * 1000000).toString(36);
  }

  constructor(@Optional() @Self() private ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit(): void {
    if (this.ngControl) {
      this.control = this.ngControl.control as FormControl;
    }
  }

  writeValue(_value: any): void {
    this.value = _value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(_isDisabled: boolean): void {
    this.disabled = _isDisabled;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  onFocus(): void {
    this.isFocused = true;
  }

  onBlur(): void {
    this.isFocused = false;
    this.onTouched();
  }

  get showError(): boolean {
    return this.control?.invalid && (this.control?.dirty || this.control?.touched);
  }

  get hasValue(): boolean {
    return this.value != null && this.value !== '' && this.value.toString().length > 0;
  }
}
