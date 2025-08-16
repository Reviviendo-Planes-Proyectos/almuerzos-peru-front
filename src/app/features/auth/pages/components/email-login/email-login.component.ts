import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ASSET_URLS } from '../../../../../shared/constants';
import {
  BaseTranslatableComponent,
  CoreModule,
  MaterialModule,
  SharedComponentsModule
} from '../../../../../shared/modules';
import { LoggerService } from '../../../../../shared/services/logger/logger.service';

@Component({
  selector: 'app-email-login',
  standalone: true,
  imports: [CoreModule, MaterialModule, SharedComponentsModule],
  templateUrl: './email-login.component.html',
  styleUrls: ['./email-login.component.scss']
})
export class EmailLoginComponent extends BaseTranslatableComponent implements OnInit {
  assetUrls = ASSET_URLS;
  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;
  tipo!: string | null;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private loggerService: LoggerService,
    private formBuilder: FormBuilder
  ) {
    super();
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      // biome-ignore lint/complexity/useLiteralKeys: accessing query params
      this.tipo = params['userType'] || null;
      this.loggerService.info('Tipo de usuario en email login:', this.tipo || 'No definido');
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    const { email } = this.loginForm.value;

    this.loggerService.info('Iniciando sesión con email:', email);

    // Simulación de login
    setTimeout(() => {
      this.navigateToBasicInfo();
      this.isLoading = false;
    }, 2000);
  }

  goToForgotPassword(): void {
    this.router.navigate(['/auth/forgot-password'], {
      queryParams: { userType: this.tipo }
    });
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register'], {
      queryParams: { userType: this.tipo }
    });
  }

  goBack(): void {
    this.router.navigate(['/auth/login'], {
      queryParams: { userType: this.tipo }
    });
  }

  private markFormGroupTouched(): void {
    for (const key of Object.keys(this.loginForm.controls)) {
      const control = this.loginForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    }
  }

  private navigateToBasicInfo(): void {
    const route = this.tipo === 'restaurante' ? '/auth/restaurant-basic-info' : '/auth/customer-basic-info';
    this.loggerService.info('Navegando a:', route, 'para tipo:', this.tipo);
    this.router.navigate([route], {
      queryParams: { userType: this.tipo }
    });
  }
}
