import { NgModule } from '@angular/core';
import {
  BackButtonComponent,
  ButtonComponent,
  FileUploadComponent,
  HeaderWithStepsComponent,
  InputFieldComponent,
  LangComponent,
  LocationSelectorModalComponent,
  PwaPromptComponent,
  SectionTitleComponent,
  SelectFieldComponent,
  StepIndicatorComponent,
  WarningModalComponent
} from '../components';

const SHARED_COMPONENTS = [
  BackButtonComponent,
  ButtonComponent,
  FileUploadComponent,
  HeaderWithStepsComponent,
  InputFieldComponent,
  LangComponent,
  LocationSelectorModalComponent,
  PwaPromptComponent,
  SectionTitleComponent,
  SelectFieldComponent,
  StepIndicatorComponent,
  WarningModalComponent
];

@NgModule({
  imports: SHARED_COMPONENTS,
  exports: SHARED_COMPONENTS
})
export class SharedComponentsModule {}
