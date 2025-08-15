import { Component, EventEmitter, Input, inject, Output } from '@angular/core';
import { CoreModule } from '../../../modules';
import { IdGeneratorService } from '../../../services';

@Component({
  selector: 'app-toggle-switch',
  standalone: true,
  imports: [CoreModule],
  templateUrl: './toggle-switch.component.html',
  styleUrls: ['./toggle-switch.component.scss']
})
export class ToggleSwitchComponent {
  private readonly idGenerator = inject(IdGeneratorService);

  @Input() checked = false;
  @Input() disabled = false;
  @Input() ariaLabel = '';
  @Input() toggleId = this.idGenerator.generateUniqueId('toggle');

  @Output() toggleChange = new EventEmitter<boolean>();

  toggle(): void {
    if (!this.disabled) {
      this.checked = !this.checked;
      this.toggleChange.emit(this.checked);
    }
  }
}
