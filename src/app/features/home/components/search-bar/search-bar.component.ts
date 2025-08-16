// search-bar.component.ts
import { Component, EventEmitter, inject, OnDestroy, Output } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { CoreModule } from '../../../../shared/modules';
import { LoggerService } from '../../../../shared/services/logger/logger.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CoreModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnDestroy {
  searchTerm = '';
  private readonly logger = inject(LoggerService);
  private searchSubject = new Subject<string>();

  @Output() searchEvent = new EventEmitter<string>();
  @Output() locationEvent = new EventEmitter<void>();
  @Output() searchChangeEvent = new EventEmitter<string>();

  constructor() {
    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe((searchTerm) => {
      this.searchChangeEvent.emit(searchTerm);
    });
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.searchEvent.emit(this.searchTerm.trim());
    }
  }

  onSearchChange(event: any): void {
    this.searchTerm = event.target.value;
    this.searchSubject.next(this.searchTerm);
  }

  onLocationClick(): void {
    this.locationEvent.emit();

    this.getCurrentLocation();
  }

  private getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          this.logger.info('Location obtained:', { latitude, longitude });
        },
        (error) => {
          this.logger.error('Error getting location:', error);
        }
      );
    } else {
      this.logger.error('Geolocation not supported');
    }
  }
}
