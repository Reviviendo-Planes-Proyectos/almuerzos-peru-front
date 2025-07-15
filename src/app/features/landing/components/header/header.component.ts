import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterModule, ButtonComponent],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  constructor(
    private readonly router: Router
  ) { }

  navigateToLogin() {
    this.router.navigate(['auth/login']);
  }
}
