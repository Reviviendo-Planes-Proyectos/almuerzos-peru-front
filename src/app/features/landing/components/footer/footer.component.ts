import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../../shared/material.module';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [MaterialModule]
})
export class FooterComponent {
  constructor(private router: Router) {}

  navigateToTerminos(): void {
    this.router.navigate(['/legal/terminos-condiciones']);
  }

  navigateToPoliticaPrivacidad(): void {
    this.router.navigate(['/legal/politica-privacidad']);
  }
}
