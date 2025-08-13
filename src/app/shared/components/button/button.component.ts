import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseTranslatableComponent } from '../../i18n';
import { MaterialModule } from '../../material.module';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent extends BaseTranslatableComponent {
  @Input() label = '';
  @Input() translateKey: string | null = null;
  @Input() isActive = true;
  @Input() isOutline = false;
  @Input() outlineGray = false;
  @Input() imageSrc: string | null = null;
  @Input() imgAlt: string | null = '';
  @Input() iconName: string | null = null;

  @Output() clicked = new EventEmitter<void>();

  onClick(): void {
    if (this.isActive) {
      this.clicked.emit();
    }
  }

  get buttonClasses(): string {
    if (!this.isActive) {
      return 'bg-gray-300 text-gray-500 opacity-60 cursor-not-allowed';
    }

    if (this.isActive && !this.isOutline) {
      return 'bg-yellow-500 text-white hover:shadow-lg focus:ring-2 focus:ring-yellow-300 focus:outline-none';
    }

    if (this.isOutline) {
      return 'border-yellow-500 border-2 text-gray-900 bg-transparent hover:bg-yellow-50 focus:ring-2 focus:ring-yellow-200 focus:outline-none';
    }

    return 'bg-transparent text-white hover:bg-gray-800 hover:text-gray-100 focus:ring-2 focus:ring-gray-300 focus:outline-none active:bg-gray-900';
  }
}
