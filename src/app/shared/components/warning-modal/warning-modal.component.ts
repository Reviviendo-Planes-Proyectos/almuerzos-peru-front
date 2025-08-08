import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-warning-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './warning-modal.component.html',
  styleUrl: './warning-modal.component.scss'
})
export class WarningModalComponent {
  @Input() isVisible = true;
  @Input() title = 'Correo sin verificar';
  @Input() message = 'Tu correo aún no está verificado. Verifícalo para recibir notificaciones importantes.';
  @Input() primaryButtonText = 'Verificar ahora';
  @Input() secondaryButtonText = 'Recordar después';

  @Output() primaryAction = new EventEmitter<void>();
  @Output() secondaryAction = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();

  onPrimaryAction(): void {
    this.primaryAction.emit();
  }

  onSecondaryAction(): void {
    this.secondaryAction.emit();
  }

  onClose(): void {
    this.closeModal.emit();
  }
}
