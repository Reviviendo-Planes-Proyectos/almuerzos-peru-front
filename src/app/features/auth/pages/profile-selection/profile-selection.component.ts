import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
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
  constructor(
    private readonly location: Location,
    public router: Router,
    public readonly logger: LoggerService
  ) {}

  goBack(): void {
    this.location.back();
  }

  elegirTipoUsuario(tipo: 'restaurante' | 'comensal') {
    this.logger.info('Tipo de usuario seleccionado:', tipo);
    this.router.navigate(['auth/register']);
  }
}
