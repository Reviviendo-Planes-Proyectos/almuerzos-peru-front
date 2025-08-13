import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-step-indicator',
  standalone: true,
  imports: [],
  templateUrl: './step-indicator.component.html',
  styleUrl: './step-indicator.component.scss'
})
export class StepIndicatorComponent {
  @Input() step = 1;
  @Input() total = 4;

  get progressPercentage(): number {
    return (this.step / this.total) * 100;
  }
}
