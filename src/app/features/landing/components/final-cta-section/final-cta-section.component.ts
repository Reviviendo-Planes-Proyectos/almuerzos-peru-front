import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-final-cta-section',
  standalone: true,
  templateUrl: './final-cta-section.component.html',
  styleUrls: ['./final-cta-section.component.scss'],
  imports: [CommonModule, MatIconModule, MatButtonModule, ButtonComponent],
})
export class FinalCtaSectionComponent {
  onStartFree() {}

  onContactExpert() {}
}
