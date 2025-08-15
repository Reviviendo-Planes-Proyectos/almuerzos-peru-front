import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { I18nModule } from './i18n.module';

const ANGULAR_MODULES = [CommonModule, FormsModule, ReactiveFormsModule, RouterModule];

@NgModule({
  imports: [ANGULAR_MODULES, I18nModule],
  exports: [ANGULAR_MODULES, I18nModule]
})
export class CoreModule {}
