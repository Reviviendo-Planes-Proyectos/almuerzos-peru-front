import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SelectOption } from '../../../../../shared/components/ui/select-field/select-field.component';
import { ASSET_URLS } from '../../../../../shared/constants';
import { DISTRITO_OPTIONS, PROVINCIA_OPTIONS } from '../../../../../shared/constants/location-options';
import { BaseTranslatableComponent, CoreModule, SharedComponentsModule } from '../../../../../shared/modules';
import { LoggerService } from '../../../../../shared/services/logger/logger.service';

@Component({
  selector: 'app-customer-basic-info',
  standalone: true,
  imports: [CoreModule, SharedComponentsModule],
  templateUrl: './customer-basic-info.component.html',
  styleUrls: ['./customer-basic-info.component.scss']
})
export class CustomerBasicInfoComponent extends BaseTranslatableComponent implements OnInit {
  assetUrls = ASSET_URLS;
  customerForm!: FormGroup;

  provinciaOptions: SelectOption[] = PROVINCIA_OPTIONS;
  distritoOptions: SelectOption[] = DISTRITO_OPTIONS;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public readonly logger: LoggerService
  ) {
    super();
  }

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dni: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^[0-9]+$/)]],
      provincia: ['', Validators.required],
      distrito: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      this.logger.info('Formulario enviado:', this.customerForm.value);

      const email = this.customerForm.get('email')?.value;
      const encodedEmail = encodeURIComponent(email);

      this.router.navigate(['/auth/email-verification', encodedEmail]);
    } else {
      this.customerForm.markAllAsTouched();
    }
  }

  onBackClick(): void {
    this.router.navigate(['/auth/register']);
  }
}
