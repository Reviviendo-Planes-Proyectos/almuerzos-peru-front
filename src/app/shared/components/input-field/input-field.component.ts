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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private onChange = (_value: any) => {};
  private onTouched = () => {};

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

  // ControlValueAccessor implementation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  writeValue(_value: any): void {
    this.value = _value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setDisabledState(_isDisabled: boolean): void {
    this.disabled = _isDisabled;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }

  get showError(): boolean {
    return this.control?.invalid && (this.control?.dirty || this.control?.touched);
  }
}
