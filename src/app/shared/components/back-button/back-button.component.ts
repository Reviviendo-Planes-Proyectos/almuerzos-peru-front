import { Location } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BaseTranslatableComponent } from '../../i18n';
import { MaterialModule } from '../../modules';

@Component({
  selector: 'app-back-button',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss']
})
export class BackButtonComponent extends BaseTranslatableComponent {
  @Input() position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' = 'top-left';
  @Input() customClass = '';
  @Input() ariaLabel = '';
  @Input() routerLink: string | string[] = '';

  private location = inject(Location);
  private router = inject(Router);

  get positionClasses(): string {
    const positions = {
      'top-left': 'top-4 left-4',
      'top-right': 'top-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-right': 'bottom-4 right-4'
    };
    return positions[this.position];
  }

  get buttonAriaLabel(): string {
    return this.ariaLabel || this.t('common.back');
  }

  goBack(): void {
    if (this.routerLink) {
      if (Array.isArray(this.routerLink)) {
        this.router.navigate(this.routerLink);
      } else {
        this.router.navigate([this.routerLink]);
      }
    } else {
      this.location.back();
    }
  }
}
