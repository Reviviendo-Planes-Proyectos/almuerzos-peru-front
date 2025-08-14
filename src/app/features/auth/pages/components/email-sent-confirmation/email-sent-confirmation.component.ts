import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  BaseTranslatableComponent,
  CoreModule,
  MaterialModule,
  SharedComponentsModule
} from '../../../../../shared/modules';

@Component({
  selector: 'app-email-sent-confirmation',
  standalone: true,
  imports: [CoreModule, MaterialModule, SharedComponentsModule],
  templateUrl: './email-sent-confirmation.component.html',
  styleUrls: ['./email-sent-confirmation.component.scss']
})
export class EmailSentConfirmationComponent extends BaseTranslatableComponent {
  isLoading = false;

  constructor(private router: Router) {
    super();
  }

  goToLogin(): void {
    this.router.navigate(['auth/login']);
  }

  resendEmail(): void {
    this.isLoading = true;

    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }
}
