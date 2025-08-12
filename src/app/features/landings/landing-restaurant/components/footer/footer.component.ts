import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../../../shared/material.module';
import { I18nService } from '../../../../../shared/translations';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [MaterialModule]
})
export class FooterComponent {
  private i18n = inject(I18nService);

  constructor(private router: Router) {}

  protected t = (key: string): string => {
    return this.i18n.t(key);
  };

  private getCurrentLandingType(): string {
    const currentUrl = this.router.url;
    if (currentUrl.includes('/home-diner')) {
      return 'diner';
    }
    if (currentUrl.includes('/home-restaurant')) {
      return 'restaurant';
    }
    return 'restaurant';
  }

  navigateToTermsAndConditions(): void {
    const fromLanding = this.getCurrentLandingType();
    this.router.navigate(['/legal/terms-and-conditions'], {
      queryParams: { from: fromLanding }
    });
  }

  navigateToPrivacyPolicy(): void {
    const fromLanding = this.getCurrentLandingType();
    this.router.navigate(['/legal/privacy-policy'], {
      queryParams: { from: fromLanding }
    });
  }
}
