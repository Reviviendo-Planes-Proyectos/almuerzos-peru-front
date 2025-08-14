import { Component } from '@angular/core';
import { BaseTranslatableComponent } from '../../../../../shared/i18n';
import { CoreModule, MaterialModule } from '../../../../../shared/modules';

@Component({
  selector: 'app-final-cta-section',
  standalone: true,
  imports: [MaterialModule, CoreModule],
  templateUrl: './final-cta-section.component.html',
  styleUrls: ['./final-cta-section.component.scss']
})
export class FinalCtaSectionComponent extends BaseTranslatableComponent {
  onStartFree() {
    // Implementar lógica para comenzar gratis
  }
}
