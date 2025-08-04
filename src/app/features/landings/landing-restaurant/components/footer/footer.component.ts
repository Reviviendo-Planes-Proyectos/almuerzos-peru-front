import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../../../shared/material.module';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [MaterialModule]
})
export class FooterComponent {
  constructor(private router: Router) {}

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

  navigateToTerminos(): void {
    const fromLanding = this.getCurrentLandingType();
    this.router.navigate(['/legal/terminos-condiciones'], {
      queryParams: { from: fromLanding }
    });
  }

  navigateToPoliticaPrivacidad(): void {
    const fromLanding = this.getCurrentLandingType();
    this.router.navigate(['/legal/politica-privacidad'], {
      queryParams: { from: fromLanding }
    });
  }
}
