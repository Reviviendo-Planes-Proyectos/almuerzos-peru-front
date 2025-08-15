import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SelectOption } from '../../../../../shared/components';
import { DISTRITO_OPTIONS, PROVINCIA_OPTIONS } from '../../../../../shared/constants/location-options';
import { BaseTranslatableComponent, CoreModule, SharedComponentsModule } from '../../../../../shared/modules';
import { LoggerService } from '../../../../../shared/services/logger/logger.service';

@Component({
  selector: 'app-restaurant-basic-info',
  standalone: true,
  imports: [CoreModule, SharedComponentsModule],
  templateUrl: './restaurant-basic-info.component.html',
  styleUrls: ['./restaurant-basic-info.component.scss']
})
export class RestaurantBasicInfoComponent extends BaseTranslatableComponent implements OnInit {
  restaurantForm!: FormGroup;
  isRazonSocialEnabled = false;
  isLocationModalVisible = false;
  locationSearchQuery = '';

  provinciaOptions: SelectOption[] = PROVINCIA_OPTIONS;
  distritoOptions: SelectOption[] = DISTRITO_OPTIONS;

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
      this.isRazonSocialEnabled = true;
      razonSocialControl?.enable();
    } else {
      this.isRazonSocialEnabled = false;
      razonSocialControl?.disable();
      razonSocialControl?.setValue('');
    }
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
