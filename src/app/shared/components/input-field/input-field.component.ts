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

  // 👇 Nuevos inputs
  @Input() variant: 'input' | 'select' = 'input';
  @Input() options: { label: string; value: any }[] = [];

  control!: FormControl;
  value: any = '';
  disabled = false;
  inputId = this.generateUniqueId();
  isFocused = false;

  private onChange = (_value: any) => {};
  private onTouched = () => {};

  private generateUniqueId(): string {
    const timestamp = Date.now();
    const randomBytes = new Uint32Array(1);
    crypto.getRandomValues(randomBytes);
    return `input-${timestamp}-${randomBytes[0]}`;
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
    const target = event.target as HTMLInputElement | HTMLSelectElement;
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
