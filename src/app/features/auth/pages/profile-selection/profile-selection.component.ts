import { Location, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../shared/material.module';

@Component({
  selector: 'app-profile-selection',
  standalone: true,
  imports: [MaterialModule, RouterModule, NgIf],
  templateUrl: './profile-selection.component.html',
  styleUrl: './profile-selection.component.scss'
})
export class ProfileSelectionComponent {
  selectedType: 'restaurante' | 'comensal' | null = null;
  isNavigating = false;

  constructor(
    private readonly location: Location,
    public router: Router
    // private loggerService: LoggerService
  ) {}

  goBack(): void {
    this.location.back();
  }

  elegirTipoUsuario(tipo: 'restaurante' | 'comensal') {
    if (this.isNavigating) return; // Prevenir múltiples clicks

    this.selectedType = tipo;
    this.isNavigating = true;

    // Delay para mostrar la animación antes de navegar
    setTimeout(() => {
      // this.loggerService.info('Navegando a registro como:', tipo);

      // Opción más robusta: usar tanto state como queryParams
      this.router.navigate(['auth/register'], {
        state: { tipo },
        queryParams: { userType: tipo } // Backup en queryParams
      });
    }, 800); // 800ms para mostrar la animación
  }
}
