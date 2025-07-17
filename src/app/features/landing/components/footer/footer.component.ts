import { Component } from '@angular/core';
import { MaterialModule } from '../../../../shared/material.module';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [MaterialModule]
})
export class FooterComponent {}
