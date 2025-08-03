import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { MaterialModule } from '../../../../../shared/material.module';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MaterialModule, RouterModule, ButtonComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(public router: Router) {}

  get isLegalPage(): boolean {
    return this.router.url.includes('/legal/');
  }

  navigateToLogin() {
    this.router.navigate(['auth/login']);
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }

  scrollToSection(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (el) {
      const yOffset = -80;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }
}
