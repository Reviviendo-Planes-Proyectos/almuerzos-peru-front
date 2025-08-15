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

  // Eventos para comunicar con el componente padre
  @Output() searchEvent = new EventEmitter<string>();
  @Output() locationEvent = new EventEmitter<void>();
  @Output() searchChangeEvent = new EventEmitter<string>();

  constructor() {
    // Configurar debounce para búsqueda en tiempo real
    this.searchSubject
      .pipe(
        debounceTime(300), // Esperar 300ms después del último cambio
        distinctUntilChanged() // Solo emitir si el valor cambió
      )
      .subscribe((searchTerm) => {
        this.searchChangeEvent.emit(searchTerm);
      });
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  // Método para buscar (al presionar Enter o click)
  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.searchEvent.emit(this.searchTerm.trim());
    }
  }

  // Método para detectar cambios en tiempo real
  onSearchChange(event: any): void {
    this.searchTerm = event.target.value;
    this.searchSubject.next(this.searchTerm); // Enviar al subject con debounce
  }

  // Método para el botón de ubicación
  onLocationClick(): void {
    this.locationEvent.emit();
    // Aquí puedes implementar la lógica de GPS
    this.getCurrentLocation();
  }

  // Método para obtener ubicación (opcional)
  private getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          this.logger.info('Location obtained:', { latitude, longitude });
          // Emitir la ubicación o procesarla
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
