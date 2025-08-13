import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { BaseTranslatableComponent } from '../../../../../shared/i18n';
import { MaterialModule } from '../../../../../shared/modules';
import { LoggerService } from '../../../../../shared/services/logger/logger.service';

@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss'],
  standalone: true,
  imports: [MaterialModule, ButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HeroSectionComponent extends BaseTranslatableComponent {
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
