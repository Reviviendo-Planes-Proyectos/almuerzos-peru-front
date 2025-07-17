import { Component, Input } from '@angular/core';
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
  @Input() isActive = true;
  @Input() isOutline = false;
  @Input() imageSrc: string | null = null;
  @Input() imgAlt: string | null = '';
  @Input() iconName: string | null = null;

  get buttonClasses(): string {
    if (this.isActive && !this.isOutline) {
      return 'bg-yellow-500 text-white';
    }
    if (this.isOutline) {
      return 'border-yellow-500 border-2 text-gray-900 bg-transparent';
    }
    return 'bg-transparent text-[#ffffff] hover:bg-[#1C212D] hover:text-neutral-light06 focus:border-brand-medium focus:border-0 focus:bg-[#2b303b] focus:text-neutral-light06 active:text-neutral-light06 active:bg-[#2b303b] active:border-0';
  }
}
