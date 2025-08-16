import { Component } from '@angular/core';
import { ASSET_URLS } from '../../../../../../shared/constants';
import { BaseTranslatableComponent, CoreModule, MaterialModule } from '../../../../../../shared/modules';

@Component({
  selector: 'app-final-cta-section',
  standalone: true,
  imports: [MaterialModule, CoreModule],
  templateUrl: './final-cta-section.component.html',
  styleUrls: ['./final-cta-section.component.scss']
})
export class FinalCtaSectionComponent extends BaseTranslatableComponent {
  readonly assetUrls = ASSET_URLS;

  onStartFree() {
    // Implementar lógica para comenzar gratis
  }
}
