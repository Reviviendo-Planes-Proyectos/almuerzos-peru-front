import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/core/config/app.config';

bootstrapApplication(AppComponent, {
  providers: [...appConfig.providers, provideAnimations(), provideHttpClient()]
});
