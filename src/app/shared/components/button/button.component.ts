import { Component, Input, inject } from '@angular/core';
import { I18nService } from '../../i18n';
import { MaterialModule } from '../../material.module';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() label = '';
  @Input() translateKey: string | null = null;
  @Input() isActive = true;
  @Input() isOutline = false;
  @Input() imageSrc: string | null = null;
  @Input() imgAlt: string | null = '';
  @Input() iconName: string | null = null;

  private i18n = inject(I18nService);

  protected t = (key: string): string => {
    return this.i18n.t(key);
  };

  get buttonClasses(): string {
    if (!this.isActive) {
      return 'bg-gray-300 text-gray-500 opacity-60';
    }

    if (this.isActive && !this.isOutline) {
      return 'bg-yellow-500 text-white hover:bg-yellow-600';
    }

    if (this.isOutline) {
      return 'border-yellow-500 border-2 text-gray-900 bg-transparent hover:bg-yellow-50';
    }

    return 'bg-transparent text-[#ffffff] hover:bg-[#1C212D] hover:text-neutral-light06 focus:border-brand-medium focus:border-0 focus:bg-[#2b303b] focus:text-neutral-light06 active:text-neutral-light06 active:bg-[#2b303b] active:border-0';
  }
}
