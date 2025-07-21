import { EMPTY } from 'rxjs';
import { mockMatSnackBar, mockSwPush, mockSwUpdate, PWA_TEST_PROVIDERS } from './pwa-mocks';

describe('PWA Mocks', () => {
  describe('mockSwUpdate', () => {
    it('should have correct default properties', () => {
      expect(mockSwUpdate.isEnabled).toBe(false);
      expect(mockSwUpdate.available).toBe(EMPTY);
      expect(mockSwUpdate.activated).toBe(EMPTY);
      expect(mockSwUpdate.versionUpdates).toBe(EMPTY);
      expect(mockSwUpdate.unrecoverable).toBe(EMPTY);
    });

    it('should have checkForUpdate method that returns resolved Promise', async () => {
      const result = await mockSwUpdate.checkForUpdate();
      expect(result).toBeUndefined();
    });

    it('should have activateUpdate method that returns resolved Promise', async () => {
      const result = await mockSwUpdate.activateUpdate();
      expect(result).toBeUndefined();
    });
  });

  describe('mockSwPush', () => {
    it('should have correct default properties', () => {
      expect(mockSwPush.isEnabled).toBe(false);
      expect(mockSwPush.messages).toBe(EMPTY);
      expect(mockSwPush.notificationClicks).toBe(EMPTY);
      expect(mockSwPush.subscription).toBe(EMPTY);
    });

    it('should have requestSubscription method that returns resolved Promise', async () => {
      const result = await mockSwPush.requestSubscription();
      expect(result).toBeUndefined();
    });

    it('should have unsubscribe method that returns resolved Promise', async () => {
      const result = await mockSwPush.unsubscribe();
      expect(result).toBeUndefined();
    });
  });

  describe('mockMatSnackBar', () => {
    it('should have jest mock functions', () => {
      expect(jest.isMockFunction(mockMatSnackBar.open)).toBe(true);
      expect(jest.isMockFunction(mockMatSnackBar.dismiss)).toBe(true);
      expect(jest.isMockFunction(mockMatSnackBar.ngOnDestroy)).toBe(true);
    });

    it('should allow calling mock methods', () => {
      mockMatSnackBar.open('test message');
      mockMatSnackBar.dismiss();
      mockMatSnackBar.ngOnDestroy();

      expect(mockMatSnackBar.open).toHaveBeenCalledWith('test message');
      expect(mockMatSnackBar.dismiss).toHaveBeenCalled();
      expect(mockMatSnackBar.ngOnDestroy).toHaveBeenCalled();
    });
  });

  describe('PWA_TEST_PROVIDERS', () => {
    it('should contain all required providers', () => {
      expect(PWA_TEST_PROVIDERS).toHaveLength(4);

      const providerTokens = PWA_TEST_PROVIDERS.map((provider) => provider.provide);
      expect(providerTokens).toContain('SwUpdate');
      expect(providerTokens).toContain('SwPush');
      expect(providerTokens).toContain('MatSnackBar');
      expect(providerTokens).toContain('PLATFORM_ID');
    });

    it('should have correct provider values', () => {
      const swUpdateProvider = PWA_TEST_PROVIDERS.find((p) => p.provide === 'SwUpdate');
      const swPushProvider = PWA_TEST_PROVIDERS.find((p) => p.provide === 'SwPush');
      const snackBarProvider = PWA_TEST_PROVIDERS.find((p) => p.provide === 'MatSnackBar');
      const platformProvider = PWA_TEST_PROVIDERS.find((p) => p.provide === 'PLATFORM_ID');

      expect(swUpdateProvider?.useValue).toBe(mockSwUpdate);
      expect(swPushProvider?.useValue).toBe(mockSwPush);
      expect(snackBarProvider?.useValue).toBe(mockMatSnackBar);
      expect(platformProvider?.useValue).toBe('browser');
    });
  });
});
