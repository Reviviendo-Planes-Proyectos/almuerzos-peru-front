import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { I18nService } from '../../../../shared/i18n';
import { MaterialModule } from '../../../../shared/material.module';
import { LoggerService } from '../../../../shared/services/logger/logger.service';

@Component({
  selector: 'app-profile-selection',
  standalone: true,
  imports: [MaterialModule, RouterModule],
  templateUrl: './profile-selection.component.html',
  styleUrl: './profile-selection.component.scss'
})
export class ProfileSelectionComponent {
  private i18n = inject(I18nService);

  constructor(
    private readonly location: Location,
    public router: Router,
    public readonly logger: LoggerService
  ) {}

  protected t = (key: string): string => {
    return this.i18n.t(key);
  };

  goBack(): void {
    this.location.back();
  }

  goToLogin(tipo: 'restaurante' | 'comensal'): void {
    this.logger.info('Tipo de usuario seleccionado:', tipo);
    this.router.navigate(['auth/login']);
  }
}
