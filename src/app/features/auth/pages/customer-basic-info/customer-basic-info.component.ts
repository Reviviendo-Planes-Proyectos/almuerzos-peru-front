import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputFieldComponent } from '../../../../shared/components/input-field/input-field.component';
import { SectionTitleComponent } from '../../../../shared/components/section-title/section-title.component';
import { StepIndicatorComponent } from '../../../../shared/components/step-indicator/step-indicator.component';
import { LoggerService } from '../../../../shared/services/logger/logger.service';

@Component({
  selector: 'app-customer-basic-info',
  standalone: true,
  imports: [StepIndicatorComponent, InputFieldComponent, ButtonComponent, ReactiveFormsModule, SectionTitleComponent],
  templateUrl: './customer-basic-info.component.html',
  styleUrl: './customer-basic-info.component.scss'
})
export class CustomerBasicInfoComponent implements OnInit {
  customerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public readonly logger: LoggerService
  ) {}

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dni: ['', [Validators.required, Validators.minLength(8)]],
      address: ['', Validators.required],
      ruc: ['']
    });
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      this.logger.info('Formulario enviado:', this.customerForm.value);
      // Guardar datos y navegar al siguiente paso
      this.router.navigate(['/auth/email-verification']);
    } else {
      this.customerForm.markAllAsTouched(); // muestra errores
    }
  }
}
