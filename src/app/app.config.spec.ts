import { provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { appConfig } from './app.config';
import { MaterialModule } from './shared/material.module';

describe('app.config', () => {
  it('should configure providers correctly', () => {
    expect(appConfig.providers.map((provider) => provider.toString())).toEqual(
      expect.arrayContaining([
        provideZoneChangeDetection({ eventCoalescing: true }).toString(),
        provideRouter(expect.any(Array)).toString(),
        provideClientHydration().toString(),
        MaterialModule.toString()
      ])
    );
  });
});
