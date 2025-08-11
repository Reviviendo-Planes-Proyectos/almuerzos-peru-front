import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-header-with-steps',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-with-steps.component.html',
  styleUrl: './header-with-steps.component.scss'
})
export class HeaderWithStepsComponent {
  @Input() currentStep = 1;
  @Input() showBackButton = true;
  @Output() backClick = new EventEmitter<void>();

  onBackClick(): void {
    this.backClick.emit();
  }
}
