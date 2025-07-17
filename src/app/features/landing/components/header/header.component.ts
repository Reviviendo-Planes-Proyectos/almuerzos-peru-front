import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// biome-ignore lint/style/useImportType: Regular import required for Angular DI
import { Router, RouterModule } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterModule, ButtonComponent],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  constructor(public router: Router) {}

  navigateToLogin() {
    this.router.navigate(['auth/login']);
  }
}
