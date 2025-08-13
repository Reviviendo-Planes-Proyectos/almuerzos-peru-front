import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { I18nService } from '../../../../shared/i18n';
import { MaterialModule } from '../../../../shared/modules';
import { HeaderComponent } from '../../../landings/landing-restaurant/components/header/header.component';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [MaterialModule, HeaderComponent],
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent {
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
