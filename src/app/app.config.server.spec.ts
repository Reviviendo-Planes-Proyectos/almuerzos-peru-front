import { config } from './app.config.server';
import { appConfig } from './app.config';
import { provideServerRendering } from '@angular/platform-server';

describe('app.config.server', () => {
  it('should merge appConfig and serverConfig correctly', () => {
    expect(config.providers).toContainEqual(provideServerRendering());
    expect(config.providers).toEqual(expect.arrayContaining(appConfig.providers));
  });
});
