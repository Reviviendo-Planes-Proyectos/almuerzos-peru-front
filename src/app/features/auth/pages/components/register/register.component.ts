import { Location, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseTranslatableComponent, MaterialModule, SharedComponentsModule } from '../../../../../shared/modules';
import { LoggerService } from '../../../../../shared/services/logger/logger.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MaterialModule, NgIf, SharedComponentsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends BaseTranslatableComponent implements OnInit {
  isGoogleLoading = false;
  isFacebookLoading = false;
  isEmailLoading = false;
  tipo!: string | null;

  constructor(
    private readonly location: Location,
    public router: Router,
    private route: ActivatedRoute,
    private loggerService: LoggerService
  ) {
    super();
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      // biome-ignore lint/complexity/useLiteralKeys: accessing query params
      this.tipo = params['userType'] || null;
      this.loggerService.info('Tipo de usuario en register:', this.tipo || 'No definido');
    });
  }

  goBack(): void {
    this.location.back();
  }

  loginWithGoogle(): void {
    if (this.isGoogleLoading) return;

    this.isGoogleLoading = true;
    setTimeout(() => {
      this.navigateToBasicInfo();
      this.isGoogleLoading = false;
    }, 2000);
  }

  loginWithFacebook(): void {
    if (this.isFacebookLoading) return;

    this.isFacebookLoading = true;
    setTimeout(() => {
      this.navigateToBasicInfo();
      this.isFacebookLoading = false;
    }, 2000);
  }

  crearConEmail(): void {
    if (this.isEmailLoading) return;

    this.isEmailLoading = true;
    setTimeout(() => {
      this.navigateToBasicInfo();
      this.isEmailLoading = false;
    }, 500);
  }

  private navigateToBasicInfo(): void {
    const route = this.tipo === 'restaurante' ? '/auth/restaurant-basic-info' : '/auth/customer-basic-info';
    this.loggerService.info('Navegando a:', route, 'para tipo:', this.tipo);
    this.router.navigate([route]);
  }

  goToLogin(): void {
    this.router.navigate(['auth/login'], {
      queryParams: { userType: this.tipo }
    });
  }
}
