import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseTranslatableComponent } from '../../../../../shared/i18n';
import { MaterialModule } from '../../../../../shared/modules';

@Component({
  selector: 'app-final-cta-section',
  standalone: true,
  imports: [MaterialModule, FormsModule],
  templateUrl: './final-cta-section.component.html',
  styleUrls: ['./final-cta-section.component.scss']
})
export class FinalCtaSectionComponent extends BaseTranslatableComponent {
  onStartFree() {
    // Implementar lógica para comenzar gratis
  }
}
