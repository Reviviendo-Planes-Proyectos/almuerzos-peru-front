import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

const ANGULAR_MODULES = [CommonModule, FormsModule, ReactiveFormsModule, RouterModule];

@NgModule({
  imports: ANGULAR_MODULES,
  exports: ANGULAR_MODULES
})
export class CoreModule {}
