import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BackButtonComponent } from '../../../../shared/components/back-button/back-button.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload.component';
import { WarningModalComponent } from '../../../../shared/components/warning-modal/warning-modal.component';
import { BaseTranslatableComponent } from '../../../../shared/i18n';
import { CoreModule } from '../../../../shared/modules';

@Component({
  selector: 'app-customer-profile-photo',
  standalone: true,
  imports: [CoreModule, BackButtonComponent, ButtonComponent, FileUploadComponent, WarningModalComponent],
  templateUrl: './customer-profile-photo.component.html',
  styleUrl: './customer-profile-photo.component.scss'
})
export class CustomerProfilePhotoComponent extends BaseTranslatableComponent implements OnInit {
  @ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

  selectedImage: string | null = null;
  selectedFile: File | null = null;
  showWarningModal = true;
  private emailParam: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      const emailKey = 'email';
      const email = params[emailKey] as string;
      this.emailParam = email || null;
    });
  }

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

  removeSelectedImage(): void {
    this.selectedImage = null;
    this.selectedFile = null;

    // Limpiar el input file
    if (this.fileUploadComponent?.fileInput?.nativeElement) {
      this.fileUploadComponent.fileInput.nativeElement.value = '';
    }
  }

  finishRegistration(): void {
    alert('¡Registro completado exitosamente!');
  }

  skipForNow(): void {
    this.router.navigate(['/']);
  }

  goBack(): void {
    if (this.emailParam) {
      this.router.navigate(['/auth/email-verification', this.emailParam]);
    } else {
      this.router.navigate(['/auth/email-verification']);
    }
  }

  onVerifyEmail(): void {
    this.router.navigate(['/auth/email-verification']);
  }

  onRemindLater(): void {
    this.showWarningModal = false;
  }

  onCloseWarningModal(): void {
    this.showWarningModal = false;
  }

  onBackClick(): void {
    this.goBack();
  }
}
