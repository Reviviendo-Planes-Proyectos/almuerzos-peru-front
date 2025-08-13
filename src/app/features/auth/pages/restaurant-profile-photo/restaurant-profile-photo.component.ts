import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BackButtonComponent } from '../../../../shared/components/back-button/back-button.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload.component';
import { StepIndicatorComponent } from '../../../../shared/components/step-indicator/step-indicator.component';
import { WarningModalComponent } from '../../../../shared/components/warning-modal/warning-modal.component';
import { BaseTranslatableComponent } from '../../../../shared/i18n';
import { CoreModule } from '../../../../shared/modules';

@Component({
  selector: 'app-restaurant-profile-photo',
  standalone: true,
  imports: [
    CoreModule,
    BackButtonComponent,
    StepIndicatorComponent,
    FileUploadComponent,
    ButtonComponent,
    WarningModalComponent
  ],
  templateUrl: './restaurant-profile-photo.component.html',
  styleUrl: './restaurant-profile-photo.component.scss'
})
export class RestaurantProfilePhotoComponent extends BaseTranslatableComponent {
  @ViewChild('restaurantFileInput') restaurantFileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('logoFileInput') logoFileInput!: ElementRef<HTMLInputElement>;

  currentStep = 4;

  // Estados para las imágenes
  restaurantPhoto: File | null = null;
  restaurantPhotoPreview: string | null = null;
  hasRestaurantPhoto = false;

  logoPhoto: File | null = null;
  logoPhotoPreview: string | null = null;
  hasLogoPhoto = false;

  // Estado del modal de advertencia
  showWarningModal = true;

  constructor(private router: Router) {
    super();
  }

  // Manejo de foto del restaurante
  onRestaurantPhotoSelected(file: File): void {
    this.restaurantPhoto = file;
    this.hasRestaurantPhoto = true;

    // Crear preview
    const reader = new FileReader();
    reader.onload = (e) => {
      this.restaurantPhotoPreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  onRestaurantPhotoError(error: string): void {
    console.error('Error en foto del restaurante:', error);
    // Aquí podrías mostrar un toast o mensaje de error
  }

  // Manejo de logo del restaurante
  onLogoPhotoSelected(file: File): void {
    this.logoPhoto = file;
    this.hasLogoPhoto = true;

    // Crear preview
    const reader = new FileReader();
    reader.onload = (e) => {
      this.logoPhotoPreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  onLogoPhotoError(error: string): void {
    console.error('Error en logo del restaurante:', error);
    // Aquí podrías mostrar un toast o mensaje de error
  }

  // Remover fotos
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

  // Métodos para activar el explorador de archivos
  triggerRestaurantFileInput(): void {
    this.restaurantFileInput.nativeElement.click();
  }

  triggerLogoFileInput(): void {
    this.logoFileInput.nativeElement.click();
  }

  // Manejar selección de archivos desde inputs ocultos
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

  // Navegación
  onBackClick(): void {
    this.router.navigate(['/auth/phone-verification']);
  }

  goBack(): void {
    this.router.navigate(['/auth/phone-verification']);
  }

  continue(): void {
    // Las imágenes son opcionales, no validamos si están seleccionadas
    // Aquí guardarías las imágenes en el servicio/estado (si las hay)
    // Navegar al siguiente paso - restaurant-schedule
    this.router.navigate(['/auth/restaurant-schedule']);
  }

  doLater(): void {
    // Lógica para postergar
    this.router.navigate(['/auth/next-step']);
  }

  // Métodos para el modal de advertencia
  onVerifyPhone(): void {
    // Navegar a verificación de teléfono
    this.router.navigate(['/auth/phone-verification']);
  }

  onRemindLater(): void {
    // Cerrar el modal por ahora
    this.showWarningModal = false;
  }

  onCloseWarningModal(): void {
    this.showWarningModal = false;
  }
}
