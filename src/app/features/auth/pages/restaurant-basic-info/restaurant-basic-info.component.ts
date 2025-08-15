import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BackButtonComponent } from '../../../../shared/components/back-button/back-button.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputFieldComponent } from '../../../../shared/components/input-field/input-field.component';
import { LocationSelectorModalComponent } from '../../../../shared/components/location-selector-modal/location-selector-modal.component';
import { SelectFieldComponent, SelectOption } from '../../../../shared/components/select-field/select-field.component';
import { StepIndicatorComponent } from '../../../../shared/components/step-indicator/step-indicator.component';
import { BaseTranslatableComponent } from '../../../../shared/i18n';
import { CoreModule } from '../../../../shared/modules';
import { LoggerService } from '../../../../shared/services/logger/logger.service';

@Component({
  selector: 'app-restaurant-basic-info',
  standalone: true,
  imports: [
    CoreModule,
    InputFieldComponent,
    SelectFieldComponent,
    ButtonComponent,
    StepIndicatorComponent,
    BackButtonComponent,
    LocationSelectorModalComponent
  ],
  templateUrl: './restaurant-basic-info.component.html',
  styleUrls: ['./restaurant-basic-info.component.scss']
})
export class RestaurantBasicInfoComponent extends BaseTranslatableComponent implements OnInit {
  restaurantForm!: FormGroup;
  isRazonSocialEnabled = false;
  isLocationModalVisible = false;
  locationSearchQuery = '';
  isRucValid = false;

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
  ) {
    super();
  }

  ngOnInit(): void {
    this.restaurantForm = this.fb.group({
      restaurantName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      ownerDni: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^[0-9]+$/)]],
      ownerFirstName: [{ value: '', disabled: true }],
      ownerLastName: [{ value: '', disabled: true }],
      phoneNumber: ['', [Validators.required, Validators.minLength(9), Validators.pattern(/^[0-9]+$/)]],
      provincia: ['', Validators.required],
      distrito: ['', Validators.required],
      address: ['', Validators.required],
      ruc: ['', [Validators.pattern(/^[0-9]{11}$/)]],
      razonSocial: [{ value: '', disabled: true }]
    });

    this.restaurantForm.get('ruc')?.valueChanges.subscribe((value) => {
      this.onRucChange(value);
    });

    this.restaurantForm.get('ownerDni')?.valueChanges.subscribe((value) => {
      this.onDniChange(value);
    });
  }

  onSubmit(): void {
    if (this.restaurantForm.valid) {
      this.logger.info('Formulario de restaurante enviado:', this.restaurantForm.value);

      const phoneNumber = this.restaurantForm.get('phoneNumber')?.value;

      this.router.navigate(['/auth/phone-verification'], {
        state: { phone: phoneNumber }
      });
    } else {
      this.restaurantForm.markAllAsTouched();
    }
  }

  onBackClick(): void {
    this.router.navigate(['/auth/register']);
  }

  onRucChange(rucValue: string): void {
    const razonSocialControl = this.restaurantForm.get('razonSocial');

    if (rucValue && rucValue.length === 11 && /^[0-9]{11}$/.test(rucValue)) {
      this.isRucValid = true;
      // Consultar SUNAT para obtener la razón social
      this.fetchCompanyDataFromSunat(rucValue);
    } else {
      this.isRucValid = false;
      // Limpiar el campo cuando el RUC no es válido
      razonSocialControl?.setValue('');
    }
  }

  onDniChange(dniValue: string): void {
    const firstNameControl = this.restaurantForm.get('ownerFirstName');
    const lastNameControl = this.restaurantForm.get('ownerLastName');

    if (dniValue && dniValue.length === 8 && /^[0-9]{8}$/.test(dniValue)) {
      // Aquí más adelante ejecutarás la llamada a la API de RENIEC
      this.fetchOwnerDataFromReniec(dniValue);
    } else {
      // Limpiar los campos cuando el DNI no es válido
      firstNameControl?.setValue('');
      lastNameControl?.setValue('');
    }
  }

  private fetchOwnerDataFromReniec(dni: string): void {
    // TODO: Implementar llamada a la API de RENIEC
    // Por ahora, simulamos datos para mostrar la funcionalidad
    this.logger.info('Consultando DNI en RENIEC:', dni);

    // Simulación de respuesta de la API (reemplazar más adelante)
    setTimeout(() => {
      const mockData = {
        firstName: 'Juan Carlos',
        lastName: 'Pérez García'
      };

      this.restaurantForm.patchValue({
        ownerFirstName: mockData.firstName,
        ownerLastName: mockData.lastName
      });

      this.logger.info('Datos obtenidos de RENIEC:', mockData);
    }, 1000);
  }

  private fetchCompanyDataFromSunat(ruc: string): void {
    // TODO: Implementar llamada a la API de SUNAT
    // Por ahora, simulamos datos para mostrar la funcionalidad
    this.logger.info('Consultando RUC en SUNAT:', ruc);

    // Simulación de respuesta de la API (reemplazar más adelante)
    setTimeout(() => {
      const mockData = {
        razonSocial: 'RESTAURANTE EL SABOR CRIOLLO S.A.C.'
      };

      this.restaurantForm.patchValue({
        razonSocial: mockData.razonSocial
      });

      this.logger.info('Datos obtenidos de SUNAT:', mockData);
    }, 1000);
  }

  openLocationModal(): void {
    this.isLocationModalVisible = true;
    const currentAddress = this.restaurantForm.get('address')?.value;
    this.locationSearchQuery = currentAddress || '';
  }

  closeLocationModal(): void {
    this.isLocationModalVisible = false;
  }

  onLocationConfirmed(selectedLocation: string): void {
    this.restaurantForm.patchValue({ address: selectedLocation });
    this.closeLocationModal();
  }

  onLocationSearchChange(searchQuery: string): void {
    this.locationSearchQuery = searchQuery;
  }
}
