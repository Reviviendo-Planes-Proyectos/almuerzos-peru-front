import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BaseTranslatableComponent,
  CoreModule,
  MaterialModule,
  SharedComponentsModule
} from '../../../../shared/modules';
import { LoggerService } from '../../../../shared/services/logger/logger.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CoreModule, MaterialModule, SharedComponentsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseTranslatableComponent implements OnInit {
  isGoogleLoading = false;
  isFacebookLoading = false;
  isEmailLoading = false;
  tipo!: string | null;

  constructor(
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
      this.loggerService.info('Tipo de usuario en login:', this.tipo || 'No definido');
    });
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

  iniciarConEmail(): void {
    if (this.isEmailLoading) return;

    this.isEmailLoading = true;
    setTimeout(() => {
      this.navigateToBasicInfo();
      this.isEmailLoading = false;
    }, 1000);
  }

  forgotPassword(): void {
    this.router.navigate(['auth/forgot-password']);
  }

  goToRegister(): void {
    this.router.navigate(['auth/register'], {
      queryParams: { userType: this.tipo }
    });
  }

  private navigateToBasicInfo(): void {
    const route = this.tipo === 'restaurante' ? '/auth/restaurant-basic-info' : '/auth/customer-basic-info';
    this.loggerService.info('Navegando a:', route, 'para tipo:', this.tipo);
    this.router.navigate([route]);
  }
}
