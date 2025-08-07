import { AUTH_ROUTES } from './auth.routes';

describe('AUTH_ROUTES', () => {
  it('should define login route correctly', async () => {
    const loginRoute = AUTH_ROUTES.find((route) => route.path === 'login');
    expect(loginRoute).toBeTruthy();
    expect(loginRoute?.loadComponent).toBeDefined();

    const loadedComponent = await loginRoute?.loadComponent?.();
    expect(loadedComponent).toBeTruthy();
  });

  it('should define register route correctly', async () => {
    const registerRoute = AUTH_ROUTES.find((route) => route.path === 'register');
    expect(registerRoute).toBeTruthy();
    expect(registerRoute?.loadComponent).toBeDefined();

    const loadedComponent = await registerRoute?.loadComponent?.();
    expect(loadedComponent).toBeTruthy();
  });

  it('should define forgot-password route correctly', async () => {
    const forgotPasswordRoute = AUTH_ROUTES.find((route) => route.path === 'forgot-password');
    expect(forgotPasswordRoute).toBeTruthy();
    expect(forgotPasswordRoute?.loadComponent).toBeDefined();

    const loadedComponent = await forgotPasswordRoute?.loadComponent?.();
    expect(loadedComponent).toBeTruthy();
  });

  it('should define profile-selection route correctly', async () => {
    const profileSelectionRoute = AUTH_ROUTES.find((route) => route.path === 'profile-selection');
    expect(profileSelectionRoute).toBeTruthy();
    expect(profileSelectionRoute?.loadComponent).toBeDefined();

    const loadedComponent = await profileSelectionRoute?.loadComponent?.();
    expect(loadedComponent).toBeTruthy();
  });
});
