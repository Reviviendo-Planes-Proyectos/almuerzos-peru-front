import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { HeaderWithStepsComponent } from '../../../../shared/components/header-with-steps/header-with-steps.component';
import { InputFieldComponent } from '../../../../shared/components/input-field/input-field.component';
import { LocationSelectorModalComponent } from '../../../../shared/components/location-selector-modal/location-selector-modal.component';
import { SectionTitleComponent } from '../../../../shared/components/section-title/section-title.component';
import { StepIndicatorComponent } from '../../../../shared/components/step-indicator/step-indicator.component';
import { LoggerService } from '../../../../shared/services/logger/logger.service';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-restaurant-basic-info',
  standalone: true,
  imports: [
    HeaderWithStepsComponent,
    StepIndicatorComponent,
    InputFieldComponent,
    ButtonComponent,
    ReactiveFormsModule,
    SectionTitleComponent,
    LocationSelectorModalComponent
  ],
  templateUrl: './restaurant-basic-info.component.html',
  styleUrl: './restaurant-basic-info.component.scss'
})
export class RestaurantBasicInfoComponent implements OnInit {
  restaurantForm!: FormGroup;
  isRazonSocialEnabled = false;
  isLocationModalVisible = false;
  locationSearchQuery = '';

  // Opciones para selects
  departamentoOptions: SelectOption[] = [
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
    this.restaurantForm = this.fb.group({
      restaurantName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      ownerDni: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^[0-9]+$/)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      address: ['', Validators.required],
      departamento: ['', Validators.required],
      distrito: ['', Validators.required],
      ruc: ['', [Validators.pattern(/^[0-9]{11}$/)]], // RUC es opcional pero si se ingresa debe tener 11 dígitos
      razonSocial: [{ value: '', disabled: true }] // Inicialmente deshabilitado
    });

    // Escuchar cambios en el campo RUC
    this.restaurantForm.get('ruc')?.valueChanges.subscribe((value) => {
      this.onRucChange(value);
    });
  }

  onSubmit(): void {
    if (this.restaurantForm.valid) {
      this.logger.info('Formulario de restaurante enviado:', this.restaurantForm.value);

      // Obtener el email del formulario
      const email = this.restaurantForm.get('email')?.value;

      // Codificar el email para usarlo en la URL
      const encodedEmail = encodeURIComponent(email);

      // Navegar al siguiente paso de verificación de email
      this.router.navigate(['/auth/email-verification', encodedEmail]);
    } else {
      this.restaurantForm.markAllAsTouched(); // muestra errores
    }
  }

  onBackClick(): void {
    // Navegar hacia atrás o a la página anterior
    this.router.navigate(['/auth/login']); // Ajusta la ruta según tu flujo
  }

  onRucChange(rucValue: string): void {
    const razonSocialControl = this.restaurantForm.get('razonSocial');

    if (rucValue && rucValue.length === 11 && /^[0-9]{11}$/.test(rucValue)) {
      // RUC válido: habilitar el campo de razón social
      this.isRazonSocialEnabled = true;
      razonSocialControl?.enable();
    } else {
      // RUC inválido: deshabilitar y limpiar el campo de razón social
      this.isRazonSocialEnabled = false;
      razonSocialControl?.disable();
      razonSocialControl?.setValue('');
    }
  }

  // Métodos para el modal de ubicación
  openLocationModal(): void {
    this.isLocationModalVisible = true;
    // Inicializar con la dirección actual si existe
    const currentAddress = this.restaurantForm.get('address')?.value;
    this.locationSearchQuery = currentAddress || '';
  }

  closeLocationModal(): void {
    this.isLocationModalVisible = false;
  }

  onLocationConfirmed(selectedLocation: string): void {
    // Actualizar el campo de dirección con la ubicación seleccionada
    this.restaurantForm.patchValue({ address: selectedLocation });
    this.closeLocationModal();
  }

  onLocationSearchChange(searchQuery: string): void {
    this.locationSearchQuery = searchQuery;
  }
}
