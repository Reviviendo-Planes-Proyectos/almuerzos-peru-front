import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CoreModule } from '../../modules';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CoreModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  @Input() acceptedTypes = 'image/png,image/jpeg,image/jpg';
  @Input() maxFileSize = 5 * 1024 * 1024; // 5MB por defecto
  @Input() allowedFormats = ['image/jpeg', 'image/jpg', 'image/png'];
  @Input() hasSelectedImage = false;
  @Input() defaultBackgroundImage: string | null = null;

  @Output() fileSelected = new EventEmitter<File>();
  @Output() fileError = new EventEmitter<string>();

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.handleFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer?.files;
    if (files?.[0]) {
      this.handleFile(files[0]);
    }
  }

  private handleFile(file: File): void {
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      this.fileError.emit('Por favor selecciona un archivo de imagen válido.');
      return;
    }

    // Validar tamaño de archivo
    if (file.size > this.maxFileSize) {
      this.fileError.emit('El archivo es demasiado grande. El tamaño máximo permitido es 5MB.');
      return;
    }

    // Validar formato específico
    if (!this.allowedFormats.includes(file.type)) {
      this.fileError.emit('Solo se permiten archivos PNG, JPG y JPEG.');
      return;
    }

    this.fileSelected.emit(file);
  }
}
