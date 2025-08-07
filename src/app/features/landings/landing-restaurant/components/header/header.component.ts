import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
  isScrolled = false;

  constructor(
    public router: Router,
    private route: ActivatedRoute
  ) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  get isLegalPage(): boolean {
    return this.router.url.includes('/legal/');
  }

  get isDinerLanding(): boolean {
    return this.router.url.includes('/home-diner');
  }

  get isRestaurantLanding(): boolean {
    return this.router.url.includes('/home-restaurant');
  }

  navigateToLogin() {
    this.router.navigate(['auth/profile-selection']);
  }

  navigateToHome() {
    if (this.isDinerLanding) {
      this.router.navigate(['/home-diner']);
    } else if (this.isRestaurantLanding) {
      this.router.navigate(['/home-restaurant']);
    } else if (this.isLegalPage) {
      const { from: fromParam } = this.route.snapshot.queryParams;
      if (fromParam === 'diner') {
        this.router.navigate(['/home-diner']);
      } else {
        this.router.navigate(['/home-restaurant']);
      }
    } else {
      this.router.navigate(['/home-restaurant']);
    }
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
