import { NgModule } from '@angular/core';
import { RouterModule, type Routes } from '@angular/router';
import { AuthModule } from './features/auth/auth.module';
import { LandingComponent } from './features/landing/landing.component';

const routes: Routes = [
  { path: 'login', loadChildren: () => AuthModule },
  { path: 'home', component: LandingComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
