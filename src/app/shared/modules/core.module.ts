import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

const ANGULAR_MODULES = [CommonModule, ReactiveFormsModule];

@NgModule({
  imports: ANGULAR_MODULES,
  exports: ANGULAR_MODULES
})
export class CoreModule {}
