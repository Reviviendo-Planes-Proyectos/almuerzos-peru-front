import { NgModule } from '@angular/core';
import { BackButtonComponent } from '../components/back-button/back-button.component';
import { ButtonComponent } from '../components/button/button.component';
import { InputFieldComponent } from '../components/input-field/input-field.component';
import { SelectFieldComponent } from '../components/select-field/select-field.component';
import { StepIndicatorComponent } from '../components/step-indicator/step-indicator.component';

const SHARED_COMPONENTS = [
  BackButtonComponent,
  ButtonComponent,
  InputFieldComponent,
  SelectFieldComponent,
  StepIndicatorComponent
];

@NgModule({
  imports: SHARED_COMPONENTS,
  exports: SHARED_COMPONENTS
})
export class SharedComponentsModule {}
