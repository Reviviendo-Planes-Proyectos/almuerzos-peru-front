import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CoreModule } from '../../modules';

@Component({
  selector: 'app-location-selector-modal',
  standalone: true,
  imports: [CoreModule],
  templateUrl: './location-selector-modal.component.html',
  styleUrl: './location-selector-modal.component.scss'
})
export class LocationSelectorModalComponent {
  @Input() isVisible = false;
  @Input() searchQuery = '';
  @Output() closeModal = new EventEmitter<void>();
  @Output() confirmLocation = new EventEmitter<string>();
  @Output() searchQueryChange = new EventEmitter<string>();

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value;
    this.searchQueryChange.emit(this.searchQuery);
  }

  onConfirmLocation(): void {
    if (this.searchQuery.trim()) {
      this.confirmLocation.emit(this.searchQuery);
      this.onClose();
    }
  }

  onClose(): void {
    this.closeModal.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}
