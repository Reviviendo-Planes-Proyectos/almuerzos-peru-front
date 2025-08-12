import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BackButtonComponent } from '../../../../shared/components/back-button/back-button.component';
import { I18nService } from '../../../../shared/i18n';
import { MaterialModule } from '../../../../shared/material.module';
import { LoggerService } from '../../../../shared/services/logger/logger.service';

@Component({
  selector: 'app-profile-selection',
  standalone: true,
  imports: [MaterialModule, RouterModule, BackButtonComponent],
  templateUrl: './profile-selection.component.html',
  styleUrl: './profile-selection.component.scss'
})
export class ProfileSelectionComponent {
  private i18n = inject(I18nService);

  constructor(
    public router: Router,
    public readonly logger: LoggerService
  ) {}

  protected t = (key: string): string => {
    return this.i18n.t(key);
  };

  goToLogin(tipo: 'restaurante' | 'comensal'): void {
    this.logger.info('Tipo de usuario seleccionado:', tipo);
    this.router.navigate(['auth/login']);
  }
}
