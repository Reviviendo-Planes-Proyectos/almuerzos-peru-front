import { Component } from '@angular/core';
import { BaseTranslatableComponent, MaterialModule } from '../../../../../../shared/modules';

@Component({
  selector: 'app-final-cta-section',
  standalone: true,
  templateUrl: './final-cta-section.component.html',
  styleUrls: ['./final-cta-section.component.scss'],
  imports: [MaterialModule]
})
export class FinalCtaSectionComponent extends BaseTranslatableComponent {
  onStartFree() {}
  onContactExpert() {}
}
