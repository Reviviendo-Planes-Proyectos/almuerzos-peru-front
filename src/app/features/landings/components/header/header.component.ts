import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ASSET_URLS } from '../../../../shared/constants';
import {
  BaseTranslatableComponent,
  CoreModule,
  MaterialModule,
  SharedComponentsModule
} from '../../../../shared/modules';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CoreModule, MaterialModule, RouterModule, SharedComponentsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends BaseTranslatableComponent {
  isScrolled = false;
  readonly assetUrls = ASSET_URLS;

  constructor(
    public router: Router,
    private route: ActivatedRoute
  ) {
    super();
  }

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
    const queryParams: { from?: string } = {};

    if (this.isDinerLanding) {
      queryParams.from = 'diner';
    } else if (this.isRestaurantLanding) {
      queryParams.from = 'restaurant';
    }

    this.router.navigate(['auth/profile-selection'], { queryParams });
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
