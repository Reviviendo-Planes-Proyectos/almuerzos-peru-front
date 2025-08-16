import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ASSET_URLS } from '../../../../../shared/constants';
import { BaseTranslatableComponent, SharedComponentsModule } from '../../../../../shared/modules';

@Component({
  selector: 'app-restaurant-social-networks',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedComponentsModule],
  templateUrl: './restaurant-social-networks.component.html',
  styleUrl: './restaurant-social-networks.component.scss'
})
export class RestaurantSocialNetworksComponent extends BaseTranslatableComponent {
  assetUrls = ASSET_URLS;

  currentStep = 6;
  showSuccessModal = false;
  restaurantName = '';
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

    this.restaurantName = 'El charrua';
  }

  onBackClick(): void {
    this.router.navigate(['/auth/restaurant-schedule']);
  }

  goBack(): void {
    this.router.navigate(['/auth/restaurant-schedule']);
  }

  finishRegistration(): void {
    this.showSuccessModal = true;
  }

  getRestaurantInitial(): string {
    return this.restaurantName ? this.restaurantName.charAt(0).toUpperCase() : 'R';
  }

  goToDashboard(): void {
    this.showSuccessModal = false;
    localStorage.removeItem('restaurantRegistrationData');
    this.router.navigate(['/dashboard']);
  }
}
