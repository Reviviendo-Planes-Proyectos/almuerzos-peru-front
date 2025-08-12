import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BackButtonComponent } from '../../../../shared/components/back-button/back-button.component';
import { BaseTranslatableComponent } from '../../../../shared/i18n';
import { MaterialModule } from '../../../../shared/material.module';
import { LoggerService } from '../../../../shared/services/logger/logger.service';

@Component({
  selector: 'app-profile-selection',
  standalone: true,
  imports: [MaterialModule, RouterModule, BackButtonComponent],
  templateUrl: './profile-selection.component.html',
  styleUrl: './profile-selection.component.scss'
})
export class ProfileSelectionComponent extends BaseTranslatableComponent {
  selectedType: 'restaurante' | 'comensal' | null = null;
  isNavigating = false;

  constructor(
    public router: Router,
    public readonly logger: LoggerService
  ) {
    super();
  }

  elegirTipoUsuario(tipo: 'restaurante' | 'comensal') {
    if (this.isNavigating) return;

    this.selectedType = tipo;
    this.isNavigating = true;

    // Delay para mostrar la animación antes de navegar
    setTimeout(() => {
      this.logger.info('Tipo de usuario seleccionado:', tipo);
      this.router.navigate(['auth/login']);
    }, 800);
  }
}
