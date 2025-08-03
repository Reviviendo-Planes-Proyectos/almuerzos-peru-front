import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../../shared/material.module';
import { HeaderComponent } from '../../../landing/components/header/header.component';

@Component({
  selector: 'app-politica-privacidad',
  standalone: true,
  imports: [MaterialModule, HeaderComponent],
  templateUrl: './politica-privacidad.component.html',
  styleUrls: ['./politica-privacidad.component.scss']
})
export class PoliticaPrivacidadComponent {
  fechaActualizacion: string;

  constructor(private router: Router) {
    this.fechaActualizacion = new Date().toLocaleDateString('es-PE');
  }

  volverAlInicio(): void {
    this.router.navigate(['/']);
  }
}
