import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseTranslatableComponent, CoreModule, SharedComponentsModule } from '../../../../shared/modules';

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
  imports: [CoreModule, SharedComponentsModule],
  templateUrl: './restaurant-schedule.component.html',
  styleUrl: './restaurant-schedule.component.scss'
})
export class RestaurantScheduleComponent extends BaseTranslatableComponent {
  currentStep = 5;

  schedule: DaySchedule[] = [
    { day: 'Lunes', isActive: false, openTime: '11:00', closeTime: '22:00', isConfigured: false },
    { day: 'Martes', isActive: true, openTime: '11:00', closeTime: '22:00', isConfigured: true },
    { day: 'Miércoles', isActive: true, openTime: '11:00', closeTime: '22:00', isConfigured: false },
    { day: 'Jueves', isActive: true, openTime: '11:00', closeTime: '22:00', isConfigured: false },
    { day: 'Viernes', isActive: true, openTime: '11:00', closeTime: '22:00', isConfigured: false },
    { day: 'Sábado', isActive: true, openTime: '11:00', closeTime: '22:00', isConfigured: false },
    { day: 'Domingo', isActive: true, openTime: '11:00', closeTime: '22:00', isConfigured: false }
  ];

  isLocalService = true;
  isDeliveryService = false;

  showTimeModal = false;
  selectedDay: DaySchedule | null = null;
  selectedDayIndex = -1;
  tempOpenTime = '';
  tempCloseTime = '';
  timeValidationError = '';

  constructor(private router: Router) {
    super();
  }

  toggleDay(index: number): void {
    this.schedule[index].isActive = !this.schedule[index].isActive;
  }

  configureDay(index: number): void {
    this.selectedDay = this.schedule[index];
    this.selectedDayIndex = index;
    this.tempOpenTime = this.selectedDay.openTime;
    this.tempCloseTime = this.selectedDay.closeTime;
    this.timeValidationError = '';
    this.showTimeModal = true;
  }

  closeTimeModal(): void {
    this.showTimeModal = false;
    this.selectedDay = null;
    this.selectedDayIndex = -1;
    this.tempOpenTime = '';
    this.tempCloseTime = '';
    this.timeValidationError = '';
  }

  saveTimeConfiguration(): void {
    if (!this.tempOpenTime || !this.tempCloseTime) {
      this.timeValidationError = 'Por favor, completa ambos horarios';
      return;
    }

    if (this.tempOpenTime >= this.tempCloseTime) {
      this.timeValidationError = 'La hora de apertura debe ser menor que la de cierre';
      return;
    }

    if (this.selectedDayIndex >= 0) {
      this.schedule[this.selectedDayIndex].openTime = this.tempOpenTime;
      this.schedule[this.selectedDayIndex].closeTime = this.tempCloseTime;
      this.schedule[this.selectedDayIndex].isConfigured = true;
    }

    this.closeTimeModal();
  }

  toggleLocalService(): void {
    this.isLocalService = !this.isLocalService;
  }

  toggleDeliveryService(): void {
    this.isDeliveryService = !this.isDeliveryService;
  }

  selectAllDays(): void {
    for (const day of this.schedule) {
      day.isActive = true;
    }
  }

  selectOnlyWeekdays(): void {
    this.schedule.forEach((day, index) => {
      day.isActive = index < 5;
    });
  }

  onBackClick(): void {
    this.router.navigate(['/auth/restaurant-profile-photo']);
  }

  goBack(): void {
    this.router.navigate(['/auth/restaurant-profile-photo']);
  }

  continue(): void {
    const hasActiveDays = this.schedule.some((day) => day.isActive);
    const hasServiceType = this.isLocalService || this.isDeliveryService;

    if (!hasActiveDays || !hasServiceType) {
      alert('Debes seleccionar al menos un día de atención y una modalidad de servicio');
      return;
    }

    this.router.navigate(['/auth/next-step']);
  }
}
