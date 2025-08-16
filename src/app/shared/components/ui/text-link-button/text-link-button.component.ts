import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseTranslatableComponent, CoreModule } from '../../../modules';

@Component({
  selector: 'app-text-link-button',
  standalone: true,
  imports: [CoreModule],
  templateUrl: './text-link-button.component.html',
  styleUrls: ['./text-link-button.component.scss']
})
export class TextLinkButtonComponent extends BaseTranslatableComponent {
  @Input() label = '';
  @Input() translateKey: string | null = null;
  @Input() isActive = true;
  @Input() variant: 'orange' | 'gray' = 'orange';

  @Output() clicked = new EventEmitter<void>();

  onClick(): void {
    if (this.isActive) {
      this.clicked.emit();
    }
  }

  get buttonClasses(): string {
    const baseClasses = 'font-medium bg-transparent border-none cursor-pointer transition-all duration-200';

    if (!this.isActive) {
      return `${baseClasses} text-gray-400 cursor-not-allowed`;
    }

    switch (this.variant) {
      case 'orange':
        return `${baseClasses} text-orange-500 hover:text-orange-600 hover:underline`;
      case 'gray':
        return `${baseClasses} text-gray-500 hover:text-gray-600 hover:underline`;
      default:
        return `${baseClasses} text-orange-500 hover:text-orange-600 hover:underline`;
    }
  }
}
