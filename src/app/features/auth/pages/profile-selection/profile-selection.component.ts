import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BackButtonComponent } from '../../../../shared/components/back-button/back-button.component';
import { BaseTranslatableComponent } from '../../../../shared/i18n';
import { MaterialModule } from '../../../../shared/modules';

@Component({
  selector: 'app-profile-selection',
  standalone: true,
  imports: [MaterialModule, BackButtonComponent],
  templateUrl: './profile-selection.component.html',
  styleUrl: './profile-selection.component.scss'
})
export class ProfileSelectionComponent extends BaseTranslatableComponent {
  selectedType: 'restaurante' | 'comensal' | null = null;
  isNavigating = false;

  constructor(
    public router: Router,
    private route: ActivatedRoute
  ) {
    super();
  }

  elegirTipoUsuario(tipo: 'restaurante' | 'comensal') {
    if (this.isNavigating) return;

    this.selectedType = tipo;
    this.isNavigating = true;

    setTimeout(() => {
      this.router.navigate(['auth/login'], {
        queryParams: { userType: tipo }
      });
    }, 800);
  }

  goBackToLanding(): void {
    const { from } = this.route.snapshot.queryParams;

    if (from === 'diner') {
      this.router.navigate(['/home-diner']);
    } else if (from === 'restaurant') {
      this.router.navigate(['/home-restaurant']);
    } else {
      this.router.navigate(['/home-restaurant']);
    }
  }
}
