import { Component } from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { MaterialModule } from '../../../../shared/material.module';

@Component({
  selector: 'app-final-cta-section',
  standalone: true,
  templateUrl: './final-cta-section.component.html',
  styleUrls: ['./final-cta-section.component.scss'],
  imports: [MaterialModule, ButtonComponent],
})
export class FinalCtaSectionComponent {
  onStartFree() {}

  onContactExpert() {}
}
