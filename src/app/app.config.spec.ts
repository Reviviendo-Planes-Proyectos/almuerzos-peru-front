import { provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { appConfig } from './app.config';

describe('app.config', () => {
  it('should configure providers correctly', () => {
    expect(appConfig.providers.map((provider) => provider.toString())).toEqual(
      expect.arrayContaining([
        provideZoneChangeDetection({ eventCoalescing: true }).toString(),
        provideRouter(expect.any(Array)).toString(),
        provideClientHydration().toString()
      ])
    );
  });

  it('should have the correct number of providers', () => {
    expect(appConfig.providers).toHaveLength(4);
  });
});
