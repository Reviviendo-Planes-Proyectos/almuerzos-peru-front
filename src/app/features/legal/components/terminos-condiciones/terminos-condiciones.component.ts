import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../../shared/material.module';
import { HeaderComponent } from '../../../landing/components/header/header.component';

@Component({
  selector: 'app-terminos-condiciones',
  standalone: true,
  imports: [MaterialModule, HeaderComponent],
  templateUrl: './terminos-condiciones.component.html',
  styleUrls: ['./terminos-condiciones.component.scss']
})
export class TerminosCondicionesComponent {
  fechaActualizacion: string;

  constructor(private router: Router) {
    this.fechaActualizacion = new Date().toLocaleDateString('es-PE');
  }

  volverAlInicio(): void {
    this.router.navigate(['/']);
  }
}
