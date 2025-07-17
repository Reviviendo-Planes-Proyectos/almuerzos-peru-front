// biome-ignore lint/style/useImportType: Regular import required for Angular DI
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { MaterialModule } from '../../../../shared/material.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MaterialModule, ButtonComponent, MatIconModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(private readonly location: Location) {}

  goBack(): void {
    this.location.back();
  }
}
