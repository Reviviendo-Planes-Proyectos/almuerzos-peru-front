import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialModule } from '../../../../shared/material.module';
import { I18nService } from '../../../../shared/translations';
import { HeaderComponent } from '../../../landings/landing-restaurant/components/header/header.component';

@Component({
  selector: 'app-terms-and-conditions',
  standalone: true,
  imports: [MaterialModule, HeaderComponent],
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent {
  fechaActualizacion: string;
  private i18nService = inject(I18nService);

  constructor(private router: Router) {
    this.fechaActualizacion = new Date().toLocaleDateString('es-PE');
  }

  protected t(key: string): string {
    return this.i18nService.t(key);
  }

  volverAlInicio(): void {
    this.router.navigate(['/']);
  }
}
