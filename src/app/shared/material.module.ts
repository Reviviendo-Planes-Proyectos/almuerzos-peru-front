import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [CommonModule, MatButtonModule, MatTooltipModule, MatCardModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule],
  exports: [CommonModule, MatButtonModule, MatTooltipModule, MatCardModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule]
})
export class MaterialModule {}
