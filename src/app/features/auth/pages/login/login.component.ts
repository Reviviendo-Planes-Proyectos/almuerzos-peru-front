// biome-ignore lint/style/useImportType: Regular import required for Angular DI
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { MaterialModule } from '../../../../shared/material.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MaterialModule, ButtonComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(private readonly location: Location) {}

  goBack(): void {
    this.location.back();
  }
}
