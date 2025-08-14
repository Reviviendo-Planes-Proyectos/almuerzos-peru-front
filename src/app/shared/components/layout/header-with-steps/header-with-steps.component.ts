import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CoreModule } from '../../../modules';

@Component({
  selector: 'app-header-with-steps',
  standalone: true,
  imports: [CoreModule],
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
