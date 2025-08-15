import { provideHttpClient } from '@angular/common/http';
import { APP_INITIALIZER, isDevMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideServiceWorker } from '@angular/service-worker';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/core/config/app.config';
import { I18nService, initializeTranslations } from './app/shared/i18n';
import { ScrollService } from './app/shared/services/scroll/scroll.service';

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
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeTranslations,
      deps: [I18nService],
      multi: true
    },
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ]
});
