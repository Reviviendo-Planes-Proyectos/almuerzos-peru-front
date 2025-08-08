import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload.component';
import { SectionTitleComponent } from '../../../../shared/components/section-title/section-title.component';
import { StepIndicatorComponent } from '../../../../shared/components/step-indicator/step-indicator.component';

@Component({
  selector: 'app-customer-profile-photo',
  standalone: true,
  imports: [CommonModule, StepIndicatorComponent, SectionTitleComponent, ButtonComponent, FileUploadComponent],
  templateUrl: './customer-profile-photo.component.html',
  styleUrl: './customer-profile-photo.component.scss'
})
export class CustomerProfilePhotoComponent {
  @ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

  selectedImage: string | null = null;
  selectedFile: File | null = null;

  constructor(private router: Router) {}

  triggerFileInput(): void {
    this.fileUploadComponent.triggerFileInput();
  }

  onFileSelected(file: File): void {
    this.selectedFile = file;

    // Crear preview
    const reader = new FileReader();
    reader.onload = (e) => {
      this.selectedImage = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  onFileError(error: string): void {
    alert(error);
  }

  finishRegistration(): void {
    if (!this.selectedFile) {
      alert('Por favor selecciona una imagen antes de continuar.');
      return;
    }

    // Aquí implementarías la lógica para subir la imagen y finalizar el registro
    // TODO: Implement image upload logic

    // Por ahora, navegar a una página de éxito o dashboard
    // this.router.navigate(['/auth/registration-success']);
    alert('¡Registro completado exitosamente!');
  }

  goBack(): void {
    this.router.navigate(['/auth/email-verification']);
  }
}
