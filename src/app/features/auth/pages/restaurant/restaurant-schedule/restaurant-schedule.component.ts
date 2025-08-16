import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ASSET_URLS } from '../../../../../shared/constants';
import { BaseTranslatableComponent, CoreModule, SharedComponentsModule } from '../../../../../shared/modules';

interface DaySchedule {
  day: string;
  isActive: boolean;
  openTime: string;
  closeTime: string;
  isConfigured: boolean;
}

@Component({
  selector: 'app-restaurant-schedule',
  standalone: true,
  imports: [CoreModule, FormsModule, SharedComponentsModule],
  templateUrl: './restaurant-schedule.component.html',
  styleUrl: './restaurant-schedule.component.scss'
})
export class RestaurantScheduleComponent extends BaseTranslatableComponent {
  readonly assetUrls = ASSET_URLS;

  currentStep = 5;

  // Configuración de días
  schedule: DaySchedule[] = [
    { day: 'Lunes', isActive: false, openTime: '11:00', closeTime: '22:00', isConfigured: false },
    { day: 'Martes', isActive: true, openTime: '11:00', closeTime: '22:00', isConfigured: true },
    { day: 'Miércoles', isActive: true, openTime: '11:00', closeTime: '22:00', isConfigured: false },
    { day: 'Jueves', isActive: true, openTime: '11:00', closeTime: '22:00', isConfigured: false },
    { day: 'Viernes', isActive: true, openTime: '11:00', closeTime: '22:00', isConfigured: false },
    { day: 'Sábado', isActive: true, openTime: '11:00', closeTime: '22:00', isConfigured: false },
    { day: 'Domingo', isActive: true, openTime: '11:00', closeTime: '22:00', isConfigured: false }
  ];

  // Modalidades de servicio
  isLocalService = true;
  isDeliveryService = false;

  // Variables para el modal de configuración de horarios
  showTimeModal = false;
  selectedDay: DaySchedule | null = null;
  selectedDayIndex = -1;
  tempOpenTime = '';
  tempCloseTime = '';
  timeValidationError = '';
  applyToAllDays = false;

  constructor(private router: Router) {
    super();
  }

  // Toggle día activo/inactivo
  toggleDay(index: number): void {
    this.schedule[index].isActive = !this.schedule[index].isActive;
  }

  // Configurar horarios de un día específico
  configureDay(index: number): void {
    this.selectedDay = this.schedule[index];
    this.selectedDayIndex = index;
    this.tempOpenTime = this.selectedDay.openTime;
    this.tempCloseTime = this.selectedDay.closeTime;
    this.timeValidationError = '';
    this.showTimeModal = true;
  }

  // Cerrar modal de configuración
  closeTimeModal(): void {
    this.showTimeModal = false;
    this.selectedDay = null;
    this.selectedDayIndex = -1;
    this.tempOpenTime = '';
    this.tempCloseTime = '';
    this.timeValidationError = '';
    this.applyToAllDays = false;
  }

  // Guardar configuración de horarios
  saveTimeConfiguration(): void {
    // Validar que los horarios sean válidos
    if (!this.tempOpenTime || !this.tempCloseTime) {
      this.timeValidationError = 'Por favor, completa ambos horarios';
      return;
    }

    // Validar que la hora de apertura sea menor que la de cierre
    if (this.tempOpenTime >= this.tempCloseTime) {
      this.timeValidationError = 'La hora de apertura debe ser menor que la de cierre';
      return;
    }

    // Guardar los cambios
    if (this.applyToAllDays) {
      // Aplicar a todos los días
      for (const day of this.schedule) {
        day.openTime = this.tempOpenTime;
        day.closeTime = this.tempCloseTime;
        day.isConfigured = true;
      }
    } else {
      // Aplicar solo al día seleccionado
      if (this.selectedDayIndex >= 0) {
        this.schedule[this.selectedDayIndex].openTime = this.tempOpenTime;
        this.schedule[this.selectedDayIndex].closeTime = this.tempCloseTime;
        this.schedule[this.selectedDayIndex].isConfigured = true;
      }
    }

    // Cerrar modal
    this.closeTimeModal();
  }

  // Toggle modalidades de servicio
  toggleLocalService(): void {
    this.isLocalService = !this.isLocalService;
  }

  toggleDeliveryService(): void {
    this.isDeliveryService = !this.isDeliveryService;
  }

  // Acciones rápidas
  selectAllDays(): void {
    for (const day of this.schedule) {
      day.isActive = true;
    }
  }

  selectOnlyWeekdays(): void {
    this.schedule.forEach((day, index) => {
      // Lunes a Viernes (índices 0-4)
      day.isActive = index < 5;
    });
  }

  // Navegación
  onBackClick(): void {
    this.router.navigate(['/auth/restaurant-profile-photo']);
  }

  goBack(): void {
    this.router.navigate(['/auth/restaurant-profile-photo']);
  }

  continue(): void {
    // Validar que al menos un día esté activo y una modalidad seleccionada
    const hasActiveDays = this.schedule.some((day) => day.isActive);
    const hasServiceType = this.isLocalService || this.isDeliveryService;

    if (!hasActiveDays || !hasServiceType) {
      // Mostrar mensaje de error
      alert('Debes seleccionar al menos un día de atención y una modalidad de servicio');
      return;
    }

    // Aquí guardarías la configuración en el servicio/estado
    // Navegar al siguiente paso
    this.router.navigate(['/auth/restaurant-social-networks']);
  }
}
