import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, type Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [{ path: '', component: LoginComponent }];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), LoginComponent],
})
export class AuthModule {}
