import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputFieldComponent } from '../../../../shared/components/input-field/input-field.component';
import { SectionTitleComponent } from '../../../../shared/components/section-title/section-title.component';
import { StepIndicatorComponent } from '../../../../shared/components/step-indicator/step-indicator.component';
import { LoggerService } from '../../../../shared/services/logger/logger.service';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-customer-basic-info',
  standalone: true,
  imports: [StepIndicatorComponent, InputFieldComponent, ButtonComponent, ReactiveFormsModule, SectionTitleComponent],
  templateUrl: './customer-basic-info.component.html',
  styleUrl: './customer-basic-info.component.scss'
})
export class CustomerBasicInfoComponent implements OnInit {
  customerForm!: FormGroup;

  // Opciones para selects
  provinciaOptions: SelectOption[] = [
    { value: 'lima', label: 'Lima' },
    { value: 'arequipa', label: 'Arequipa' },
    { value: 'cusco', label: 'Cusco' },
    { value: 'trujillo', label: 'La Libertad' },
    { value: 'piura', label: 'Piura' },
    { value: 'lambayeque', label: 'Lambayeque' },
    { value: 'callao', label: 'Callao' },
    { value: 'ica', label: 'Ica' },
    { value: 'junin', label: 'Junín' },
    { value: 'ancash', label: 'Áncash' }
  ];

  distritoOptions: SelectOption[] = [
    // Lima
    { value: 'miraflores', label: 'Miraflores' },
    { value: 'san_isidro', label: 'San Isidro' },
    { value: 'barranco', label: 'Barranco' },
    { value: 'surco', label: 'Santiago de Surco' },
    { value: 'san_borja', label: 'San Borja' },
    { value: 'la_molina', label: 'La Molina' },
    { value: 'pueblo_libre', label: 'Pueblo Libre' },
    { value: 'magdalena', label: 'Magdalena del Mar' },
    { value: 'jesus_maria', label: 'Jesús María' },
    { value: 'lince', label: 'Lince' },
    { value: 'breña', label: 'Breña' },
    { value: 'cercado_lima', label: 'Cercado de Lima' },
    { value: 'rimac', label: 'Rímac' },
    { value: 'los_olivos', label: 'Los Olivos' },
    { value: 'san_martin_porres', label: 'San Martín de Porres' },
    { value: 'independencia', label: 'Independencia' },
    { value: 'comas', label: 'Comas' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public readonly logger: LoggerService
  ) {}

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dni: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^[0-9]+$/)]],
      provincia: ['', Validators.required], // Cambió de address a provincia
      distrito: ['', Validators.required] // Cambió de ruc a distrito
    });
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      this.logger.info('Formulario enviado:', this.customerForm.value);

      // Obtener el email del formulario
      const email = this.customerForm.get('email')?.value;

      // Codificar el email para usarlo en la URL
      const encodedEmail = encodeURIComponent(email);

      // Navegar usando parámetros de ruta (esto fuerza la recreación del componente)
      this.router.navigate(['/auth/email-verification', encodedEmail]);
    } else {
      this.customerForm.markAllAsTouched(); // muestra errores
    }
  }
}
