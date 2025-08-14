import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BaseTranslatableComponent, CoreModule, SharedComponentsModule } from '../../../../shared/modules';

@Component({
  selector: 'app-restaurant-profile-photo',
  standalone: true,
  imports: [CoreModule, SharedComponentsModule],
  templateUrl: './restaurant-profile-photo.component.html',
  styleUrl: './restaurant-profile-photo.component.scss'
})
export class RestaurantProfilePhotoComponent extends BaseTranslatableComponent {
  @ViewChild('restaurantFileInput') restaurantFileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('logoFileInput') logoFileInput!: ElementRef<HTMLInputElement>;

  currentStep = 4;

  restaurantPhoto: File | null = null;
  restaurantPhotoPreview: string | null = null;
  hasRestaurantPhoto = false;
  logoPhoto: File | null = null;
  logoPhotoPreview: string | null = null;
  hasLogoPhoto = false;

  showWarningModal = true;

  constructor(private router: Router) {
    super();
  }

  onRestaurantPhotoSelected(file: File): void {
    this.restaurantPhoto = file;
    this.hasRestaurantPhoto = true;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.restaurantPhotoPreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  onRestaurantPhotoError(error: string): void {
    console.error('Error en foto del restaurante:', error);
  }

  onLogoPhotoSelected(file: File): void {
    this.logoPhoto = file;
    this.hasLogoPhoto = true;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.logoPhotoPreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  onLogoPhotoError(error: string): void {
    console.error('Error en logo del restaurante:', error);
  }

  removeRestaurantPhoto(): void {
    this.restaurantPhoto = null;
    this.restaurantPhotoPreview = null;
    this.hasRestaurantPhoto = false;
  }

  removeLogo(): void {
    this.logoPhoto = null;
    this.logoPhotoPreview = null;
    this.hasLogoPhoto = false;
  }

  triggerRestaurantFileInput(): void {
    this.restaurantFileInput.nativeElement.click();
  }

  triggerLogoFileInput(): void {
    this.logoFileInput.nativeElement.click();
  }

  onRestaurantFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    if (input?.files?.[0]) {
      this.onRestaurantPhotoSelected(input.files[0]);
    }
  }

  onLogoFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    if (input?.files?.[0]) {
      this.onLogoPhotoSelected(input.files[0]);
    }
  }

  onBackClick(): void {
    this.router.navigate(['/auth/phone-verification']);
  }

  goBack(): void {
    this.router.navigate(['/auth/phone-verification']);
  }

  continue(): void {
    this.router.navigate(['/auth/restaurant-schedule']);
  }

  doLater(): void {
    this.router.navigate(['/auth/next-step']);
  }

  onVerifyPhone(): void {
    this.router.navigate(['/auth/phone-verification']);
  }

  onRemindLater(): void {
    this.showWarningModal = false;
  }

  onCloseWarningModal(): void {
    this.showWarningModal = false;
  }
}
