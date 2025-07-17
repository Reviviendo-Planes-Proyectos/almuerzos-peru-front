import { NgModule } from '@angular/core';
import { RouterModule, type Routes } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [{ path: '', component: LoginComponent }];

@NgModule({
  imports: [MaterialModule, RouterModule.forChild(routes), LoginComponent],
})
export class AuthModule {}
