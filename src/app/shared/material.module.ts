import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

// Angular Core Modules
const ANGULAR_MODULES = [CommonModule, ReactiveFormsModule];

// Material Design Modules
const MATERIAL_MODULES = [
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatTooltipModule
];

// Combine all modules into a single array for easy import
const ALL_MODULES = [...ANGULAR_MODULES, ...MATERIAL_MODULES];

@NgModule({
  imports: ALL_MODULES,
  exports: ALL_MODULES
})
export class MaterialModule {}
