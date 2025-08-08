import { routes } from './app.routes';

describe('app.routes', () => {
  it('should define redirect route correctly', () => {
    const redirectRoute = routes.find((route) => route.path === '');
    expect(redirectRoute).toBeTruthy();
    expect(redirectRoute?.redirectTo).toBe('home-restaurant');
    expect(redirectRoute?.pathMatch).toBe('full');
  });

  it('should define home route with loadComponent correctly', async () => {
    const homeRoute = routes.find((route) => route.path === 'home-restaurant');
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

  it('should define home-diner route with loadComponent correctly', async () => {
    const dinerRoute = routes.find((route) => route.path === 'home-diner');
    expect(dinerRoute).toBeTruthy();
    expect(dinerRoute?.loadComponent).toBeDefined();

    const loadedComponent = await dinerRoute?.loadComponent?.();
    expect(loadedComponent).toBeTruthy();
    expect(typeof loadedComponent).toBe('function');
  });

  it('should define legal route correctly', () => {
    const legalRoute = routes.find((route) => route.path === 'legal');
    expect(legalRoute).toBeTruthy();
    expect(legalRoute?.loadChildren).toBeDefined();
  });

  it('should load legal children routes correctly', async () => {
    const legalRoute = routes.find((route) => route.path === 'legal');
    expect(legalRoute).toBeTruthy();

    const loadChildrenFn = legalRoute?.loadChildren;
    expect(loadChildrenFn).toBeDefined();

    const loadedRoutes = await loadChildrenFn?.();
    expect(loadedRoutes).toBeTruthy();

    if (Array.isArray(loadedRoutes)) {
      expect(loadedRoutes.length).toBeGreaterThan(0);
    } else {
      expect(typeof loadedRoutes).toBe('object');
    }
  });

  it('should have all required routes defined', () => {
    const expectedPaths = ['', 'home-restaurant', 'home-diner', 'auth', 'legal'];
    const actualPaths = routes.map(route => route.path);
    
    expectedPaths.forEach(path => {
      expect(actualPaths).toContain(path);
    });
  });

  it('should have correct number of routes', () => {
    expect(routes).toHaveLength(5);
  });
});
