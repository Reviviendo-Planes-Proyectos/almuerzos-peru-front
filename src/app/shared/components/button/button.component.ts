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
  @Input() imageAlt: string | null = '';
  @Input() iconName: string | null = null;

  constructor() {
    // Initialization logic can go here if needed
  }
}
