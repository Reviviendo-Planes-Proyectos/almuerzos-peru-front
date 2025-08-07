import { Component } from '@angular/core';
import { MaterialModule } from '../../../../../shared/material.module';

@Component({
  selector: 'app-final-cta-section',
  standalone: true,
  templateUrl: './final-cta-section.component.html',
  styleUrls: ['./final-cta-section.component.scss'],
  imports: [MaterialModule]
})
export class FinalCtaSectionComponent {
  onStartFree() {}
  onContactExpert() {}
}
