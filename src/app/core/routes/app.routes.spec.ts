import { routes } from './app.routes';

describe('app.routes', () => {
  it('should define redirect route correctly', () => {
    const redirectRoute = routes.find((route) => route.path === '');
    expect(redirectRoute).toBeTruthy();
    expect(redirectRoute?.redirectTo).toBe('home');
    expect(redirectRoute?.pathMatch).toBe('full');
  });

  it('should define home route with loadComponent correctly', async () => {
    const homeRoute = routes.find((route) => route.path === 'home');
    expect(homeRoute).toBeTruthy();
    expect(homeRoute?.loadComponent).toBeDefined();

    const loadedComponent = await homeRoute?.loadComponent?.();
    expect(loadedComponent).toBeTruthy();
    expect(typeof loadedComponent).toBe('function');
  });

  it('should define auth route correctly', () => {
    const authRoute = routes.find((route) => route.path === 'auth');
    expect(authRoute).toBeTruthy();
    expect(authRoute?.loadChildren).toBeDefined();
  });

  it('should load auth children routes correctly', async () => {
    const authRoute = routes.find((route) => route.path === 'auth');
    expect(authRoute).toBeTruthy();

    const loadChildrenFn = authRoute?.loadChildren;
    expect(loadChildrenFn).toBeDefined();

    const loadedRoutes = await loadChildrenFn?.();
    expect(loadedRoutes).toBeTruthy();

    if (Array.isArray(loadedRoutes)) {
      expect(loadedRoutes.length).toBeGreaterThan(0);
    } else {
      expect(typeof loadedRoutes).toBe('object');
    }
  });
});
