import { routes } from './app.routes';

describe('app.routes', () => {
  it('should define auth route correctly', () => {
    const authRoute = routes.find((route) => route.path === 'auth');
    expect(authRoute).toBeTruthy();
    expect(authRoute?.children?.[0]?.loadChildren).toBeDefined();
  });

  it('should define auth route with children correctly', async () => {
    const authRoute = routes.find((route) => route.path === 'auth');
    expect(authRoute).toBeTruthy();
    expect(authRoute?.children?.[0]?.loadChildren).toBeDefined();

    const loadedModule = await authRoute?.children?.[0]?.loadChildren?.();
    expect(loadedModule).toBeTruthy();

    if (Array.isArray(loadedModule)) {
      expect(loadedModule.length).toBeGreaterThan(0);
    } else {
      expect(typeof loadedModule).toBe('object');
    }
  });

  it('should define redirect route correctly', () => {
    const redirectRoute = routes.find((route) => route.path === '');
    expect(redirectRoute).toBeTruthy();
    expect(redirectRoute?.redirectTo).toBe('auth/login');
    expect(redirectRoute?.pathMatch).toBe('full');
  });
});
