import { provideHttpClient } from '@angular/common/http';
import { APP_INITIALIZER } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/core/config/app.config';
import { ScrollService } from './app/shared/services/scroll.service';

function initializeScrollService(scrollService: ScrollService) {
  return () => {
    scrollService.scrollToTop();
    return Promise.resolve();
  };
}

bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig.providers,
    provideAnimations(),
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeScrollService,
      deps: [ScrollService],
      multi: true
    }
  ]
});
