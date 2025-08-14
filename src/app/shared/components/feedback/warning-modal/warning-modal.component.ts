import { Component, EventEmitter, Input, Output } from '@angular/core';
import { I18nService } from '../../../i18n/services/translation.service';
import { CoreModule } from '../../../modules';

@Component({
  selector: 'app-warning-modal',
  standalone: true,
  imports: [CoreModule],
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

  constructor(private readonly i18n: I18nService) {}

  protected t = (key: string): string => {
    return this.i18n.t(key);
  };

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
