import { Component } from '@angular/core';
import { MaterialModule } from '../../../../shared/material.module';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Location } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MaterialModule, ButtonComponent, MatIconModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(
    private readonly location: Location
  ) {}

  goBack(): void {
    this.location.back();
  }
}
