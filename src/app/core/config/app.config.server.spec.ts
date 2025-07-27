import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { config } from './app.config.server';

describe('app.config.server', () => {
  it('should merge appConfig and serverConfig correctly', () => {
    expect(config.providers).toContainEqual(provideServerRendering());
    expect(config.providers).toEqual(expect.arrayContaining(appConfig.providers));
  });
});
