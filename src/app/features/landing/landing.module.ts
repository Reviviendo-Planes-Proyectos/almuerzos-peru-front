import { NgModule } from '@angular/core';
import { RouterModule, type Routes } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { LandingComponent } from './landing.component';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent
  }
];

@NgModule({
  imports: [MaterialModule, RouterModule.forChild(routes), LandingComponent]
})
export class LandingModule {}
