import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { ASSET_URLS } from '../../../../../../shared/constants';
import { BaseTranslatableComponent, MaterialModule, SharedComponentsModule } from '../../../../../../shared/modules';
import { LoggerService } from '../../../../../../shared/services/logger/logger.service';

@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss'],
  standalone: true,
  imports: [MaterialModule, SharedComponentsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HeroSectionComponent extends BaseTranslatableComponent {
  readonly assetUrls = ASSET_URLS;

  constructor(
    private router: Router,
    private logger: LoggerService
  ) {
    super();
  }

  handleFeatureClick(feature: string) {
    this.logger.log(`Feature clicked: ${feature}`);
    this.router.navigate(['/home-diner']);
  }
}
