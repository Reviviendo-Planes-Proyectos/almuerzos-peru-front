import { Component, Input } from '@angular/core';
import { CoreModule } from '../../modules';

@Component({
  selector: 'app-section-title',
  standalone: true,
  imports: [CoreModule],
  templateUrl: './section-title.component.html',
  styleUrl: './section-title.component.scss'
})
export class SectionTitleComponent {
  @Input() icon!: string;
  @Input() title!: string;
  @Input() subtitle!: string;
}
