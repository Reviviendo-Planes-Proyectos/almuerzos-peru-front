import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseTranslatableComponent, MaterialModule } from '../../../../../../shared/modules';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [MaterialModule]
})
export class FooterComponent extends BaseTranslatableComponent {
  constructor(private router: Router) {
    super();
  }

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

  get isDinerLanding(): boolean {
    return this.getCurrentLandingType() === 'diner';
  }

  get isRestaurantLanding(): boolean {
    return this.getCurrentLandingType() === 'restaurant';
  }
}
