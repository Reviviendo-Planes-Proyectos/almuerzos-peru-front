import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BackButtonComponent } from '../../../../shared/components/back-button/back-button.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputFieldComponent } from '../../../../shared/components/input-field/input-field.component';
import { StepIndicatorComponent } from '../../../../shared/components/step-indicator/step-indicator.component';
import { BaseTranslatableComponent } from '../../../../shared/i18n';

@Component({
  selector: 'app-restaurant-social-networks',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StepIndicatorComponent,
    ButtonComponent,
    InputFieldComponent,
    BackButtonComponent
  ],
  templateUrl: './restaurant-social-networks.component.html',
  styleUrl: './restaurant-social-networks.component.scss'
})
export class RestaurantSocialNetworksComponent extends BaseTranslatableComponent {
  currentStep = 6;
  showSuccessModal = false;
  restaurantName = ''; // Se llenará con los datos del formulario de registro

  // Reactive form
  socialNetworksForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder
  ) {
    super();
    this.socialNetworksForm = this.fb.group({
      contactPhone: [''],
      whatsappPhone: [''],
      yapesPhone: [''],
      whatsappBusiness: ['']
    });

    // Obtener el nombre del restaurante del localStorage o servicio de estado
    this.restaurantName = 'El charrua';
  }

  // Navegación
  onBackClick(): void {
    this.router.navigate(['/auth/restaurant-schedule']);
  }

  goBack(): void {
    this.router.navigate(['/auth/restaurant-schedule']);
  }

  finishRegistration(): void {
    // Aquí guardarías toda la información del restaurante
    // const formData = this.socialNetworksForm.value;

    // Mostrar el modal de éxito en lugar del alert
    this.showSuccessModal = true;
  }

  // Método para obtener la inicial del restaurante
  getRestaurantInitial(): string {
    return this.restaurantName ? this.restaurantName.charAt(0).toUpperCase() : 'R';
  }

  // Método para obtener el nombre del restaurante desde localStorage
  /*  private getRestaurantNameFromStorage(): string {
    // Simular obtener el nombre del restaurante desde localStorage o servicio
    // En una implementación real, obtendrías esto del servicio de estado o localStorage
    const storedData = localStorage.getItem('restaurantRegistrationData');
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        return data.restaurantName || 'Restaurante El Sabor Criollo';
      } catch (error) {
        console.warn('Error parsing restaurant data from localStorage:', error);
      }
    }
    // Nombres de restaurante de ejemplo para simular
    const exampleNames = [
      'Restaurante El Sabor Criollo',
      'Pollos a la Brasa Don Mario',
      'Chifa Golden Dragon',
      'Cevichería La Mar',
      'Parrillas El Toro'
    ];
    // Usar el primer nombre como ejemplo fijo (más predecible para desarrollo)
    return exampleNames[0];
  }
 */
  // Método para ir al dashboard
  goToDashboard(): void {
    this.showSuccessModal = false;
    // Limpiar datos de registro del localStorage
    localStorage.removeItem('restaurantRegistrationData');
    // Navegar al dashboard
    this.router.navigate(['/dashboard']);
  }
}
