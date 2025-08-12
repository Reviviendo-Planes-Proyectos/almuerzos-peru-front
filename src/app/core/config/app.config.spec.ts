import { appConfig } from './app.config';

describe('app.config', () => {
  it('should configure providers correctly', () => {
    expect(appConfig.providers).toBeDefined();
    expect(appConfig.providers.length).toBeGreaterThan(0);
  });

  it('should have the correct number of providers', () => {
    expect(appConfig.providers).toHaveLength(5);
  });

  it('should include essential providers', () => {
    expect(appConfig.providers).toBeDefined();
    const hasZoneConfig = appConfig.providers.some(
      (provider) => provider && typeof provider === 'object' && 'ɵproviders' in provider
    );
    expect(hasZoneConfig).toBe(true);
  });
});
