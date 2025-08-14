import { AUTH_ROUTES } from './auth.routes';

describe('AUTH_ROUTES', () => {
  it('should have correct number of routes', () => {
    expect(AUTH_ROUTES).toHaveLength(14);
  });

  describe('Route configuration', () => {
    it('should define login route correctly', async () => {
      const loginRoute = AUTH_ROUTES.find((route) => route.path === 'login');
      expect(loginRoute).toBeTruthy();
      expect(loginRoute?.loadComponent).toBeDefined();

      const loadedModule = await loginRoute?.loadComponent?.();
      expect(loadedModule).toBeTruthy();
    });

    it('should define register route correctly', async () => {
      const registerRoute = AUTH_ROUTES.find((route) => route.path === 'register');
      expect(registerRoute).toBeTruthy();
      expect(registerRoute?.loadComponent).toBeDefined();

      const loadedModule = await registerRoute?.loadComponent?.();
      expect(loadedModule).toBeTruthy();
    });

    it('should define forgot-password route correctly', async () => {
      const forgotPasswordRoute = AUTH_ROUTES.find((route) => route.path === 'forgot-password');
      expect(forgotPasswordRoute).toBeTruthy();
      expect(forgotPasswordRoute?.loadComponent).toBeDefined();

      const loadedModule = await forgotPasswordRoute?.loadComponent?.();
      expect(loadedModule).toBeTruthy();
    });

    it('should define profile-selection route correctly', async () => {
      const profileSelectionRoute = AUTH_ROUTES.find((route) => route.path === 'profile-selection');
      expect(profileSelectionRoute).toBeTruthy();
      expect(profileSelectionRoute?.loadComponent).toBeDefined();

      const loadedModule = await profileSelectionRoute?.loadComponent?.();
      expect(loadedModule).toBeTruthy();
    });

    it('should define customer-basic-info route correctly', async () => {
      const customerBasicInfoRoute = AUTH_ROUTES.find((route) => route.path === 'customer-basic-info');
      expect(customerBasicInfoRoute).toBeTruthy();
      expect(customerBasicInfoRoute?.loadComponent).toBeDefined();

      const loadedModule = await customerBasicInfoRoute?.loadComponent?.();
      expect(loadedModule).toBeTruthy();
    });

    it('should define email-verification route correctly', async () => {
      const emailVerificationRoute = AUTH_ROUTES.find((route) => route.path === 'email-verification');
      expect(emailVerificationRoute).toBeTruthy();
      expect(emailVerificationRoute?.loadComponent).toBeDefined();

      const loadedModule = await emailVerificationRoute?.loadComponent?.();
      expect(loadedModule).toBeTruthy();
    });

    it('should define email-verification with parameter route correctly', async () => {
      const emailVerificationParamRoute = AUTH_ROUTES.find((route) => route.path === 'email-verification/:email');
      expect(emailVerificationParamRoute).toBeTruthy();
      expect(emailVerificationParamRoute?.loadComponent).toBeDefined();

      const loadedModule = await emailVerificationParamRoute?.loadComponent?.();
      expect(loadedModule).toBeTruthy();
    });

    it('should define customer-profile-photo route correctly', async () => {
      const customerProfilePhotoRoute = AUTH_ROUTES.find((route) => route.path === 'customer-profile-photo');
      expect(customerProfilePhotoRoute).toBeTruthy();
      expect(customerProfilePhotoRoute?.loadComponent).toBeDefined();

      const loadedModule = await customerProfilePhotoRoute?.loadComponent?.();
      expect(loadedModule).toBeTruthy();
    });

    it('should define restaurant-social-networks route correctly', async () => {
      const restaurantSocialNetworksRoute = AUTH_ROUTES.find((route) => route.path === 'restaurant-social-networks');
      expect(restaurantSocialNetworksRoute).toBeTruthy();
      expect(restaurantSocialNetworksRoute?.loadComponent).toBeDefined();

      const loadedModule = await restaurantSocialNetworksRoute?.loadComponent?.();
      expect(loadedModule).toBeTruthy();
    });
  });

  describe('Route paths validation', () => {
    it('should have all expected route paths', () => {
      const expectedPaths = [
        'login',
        'register',
        'forgot-password',
        'profile-selection',
        'customer-basic-info',
        'email-verification',
        'email-verification/:email',
        'customer-profile-photo'
      ];

      const actualPaths = AUTH_ROUTES.map((route) => route.path);

      for (const expectedPath of expectedPaths) {
        expect(actualPaths).toContain(expectedPath);
      }
    });

    it('should not have duplicate routes except email-verification variants', () => {
      const paths = AUTH_ROUTES.map((route) => route.path).filter((path): path is string => typeof path === 'string');
      const nonEmailPaths = paths.filter((path) => !path.startsWith('email-verification'));
      const uniqueNonEmailPaths = [...new Set(nonEmailPaths)];

      expect(nonEmailPaths).toHaveLength(uniqueNonEmailPaths.length);

      // Verificar que tenemos exactamente 2 rutas de email-verification
      const emailPaths = paths.filter((path) => path.startsWith('email-verification'));
      expect(emailPaths).toHaveLength(2);
    });

    it('should have email-verification routes with correct paths', () => {
      const emailPaths = AUTH_ROUTES.filter((route) => route.path?.startsWith('email-verification')).map(
        (route) => route.path
      );

      expect(emailPaths).toContain('email-verification');
      expect(emailPaths).toContain('email-verification/:email');
    });
  });

  describe('Lazy loading validation', () => {
    it('should have loadComponent function for all routes', () => {
      for (const route of AUTH_ROUTES) {
        expect(route.loadComponent).toBeDefined();
        expect(typeof route.loadComponent).toBe('function');
      }
    });

    it('should successfully load all components', async () => {
      const loadPromises = AUTH_ROUTES.map(async (route) => {
        try {
          const loadedModule = await route.loadComponent?.();
          return { path: route.path, success: true, module: loadedModule };
        } catch (error) {
          return { path: route.path, success: false, error };
        }
      });

      const results = await Promise.all(loadPromises);

      for (const result of results) {
        expect(result.success).toBe(true);
        expect(result.module).toBeTruthy();
      }
    });

    it('should load components without throwing errors', async () => {
      for (const route of AUTH_ROUTES) {
        await expect(route.loadComponent?.()).resolves.toBeTruthy();
      }
    });
  });

  describe('Route structure validation', () => {
    it('should have valid route objects', () => {
      for (const route of AUTH_ROUTES) {
        expect(route).toHaveProperty('path');
        expect(route).toHaveProperty('loadComponent');
        expect(typeof route.path).toBe('string');
        expect(typeof route.loadComponent).toBe('function');
      }
    });

    it('should not have empty paths', () => {
      for (const route of AUTH_ROUTES) {
        expect(route.path).toBeTruthy();
        expect(route.path?.length).toBeGreaterThan(0);
      }
    });

    it('should follow Angular route path conventions', () => {
      for (const route of AUTH_ROUTES) {
        if (route.path) {
          // Paths should not start with '/'
          expect(route.path.startsWith('/')).toBe(false);

          // Paths should be kebab-case or contain parameters
          const isValidPath = /^[a-z0-9\-/:]+$/.test(route.path);
          expect(isValidPath).toBe(true);
        }
      }
    });
  });

  describe('Authentication flow validation', () => {
    it('should include all required auth flow routes', () => {
      const requiredRoutes = [
        'login',
        'register',
        'profile-selection',
        'customer-basic-info',
        'email-verification',
        'customer-profile-photo'
      ];

      const actualPaths = AUTH_ROUTES.map((route) => route.path);

      for (const requiredRoute of requiredRoutes) {
        expect(actualPaths).toContain(requiredRoute);
      }
    });

    it('should include forgot-password for password recovery', () => {
      const actualPaths = AUTH_ROUTES.map((route) => route.path);
      expect(actualPaths).toContain('forgot-password');
    });

    it('should have proper email verification routes', () => {
      const emailVerificationRoutes = AUTH_ROUTES.filter((route) => route.path?.includes('email-verification'));

      expect(emailVerificationRoutes).toHaveLength(2);

      const paths = emailVerificationRoutes.map((route) => route.path);
      expect(paths).toContain('email-verification');
      expect(paths).toContain('email-verification/:email');
    });
  });

  it('should define email-sent-confirmation route correctly', async () => {
    const emailSentRoute = AUTH_ROUTES.find((route) => route.path === 'email-sent-confirmation');
    expect(emailSentRoute).toBeTruthy();
    expect(emailSentRoute?.loadComponent).toBeDefined();

    const loadedComponent = await emailSentRoute?.loadComponent?.();
    expect(loadedComponent).toBeTruthy();
  });

  it('should have correct number of routes', () => {
    expect(AUTH_ROUTES).toHaveLength(14);
  });

  it('should have all expected route paths', () => {
    const expectedPaths = [
      'login',
      'register',
      'forgot-password',
      'profile-selection',
      'email-sent-confirmation',
      'customer-basic-info',
      'email-verification',
      'email-verification/:email',
      'customer-profile-photo',
      'restaurant-basic-info',
      'phone-verification',
      'restaurant-profile-photo',
      'restaurant-schedule',
      'restaurant-social-networks'
    ];

    const actualPaths = AUTH_ROUTES.map((route) => route.path);

    for (const path of expectedPaths) {
      expect(actualPaths).toContain(path);
    }
  });
});
