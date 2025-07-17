import { Component } from '@angular/core';
// biome-ignore lint/style/useImportType: Regular import required for Angular DI
import { Router, RouterModule } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { MaterialModule } from '../../../../shared/material.module';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MaterialModule, RouterModule, ButtonComponent],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  constructor(public router: Router) {}

  navigateToLogin() {
    this.router.navigate(['auth/login']);
  }
}
