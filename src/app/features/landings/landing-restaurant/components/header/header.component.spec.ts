import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { routes } from '../../../../../core/routes/app.routes';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let router: Router;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockActivatedRoute = {
      snapshot: {
        queryParams: {}
      }
    };

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter(routes), { provide: ActivatedRoute, useValue: mockActivatedRoute }]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the header content', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('header')).toBeTruthy();
    expect(compiled.textContent).toContain('ALMUERZOS');
    expect(compiled.textContent).toContain('PERÚ');
  });

  it('should navigate to profile-selection when navigateToLogin is called', async () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.navigateToLogin();
    expect(navigateSpy).toHaveBeenCalledWith(['auth/profile-selection'], { queryParams: {} });
  });

  it('should scroll to section when element exists', () => {
    const mockElement = {
      getBoundingClientRect: jest.fn().mockReturnValue({ top: 100 })
    } as unknown as HTMLElement;

    const getElementByIdSpy = jest.spyOn(document, 'getElementById').mockReturnValue(mockElement);

    Object.defineProperty(window, 'pageYOffset', { value: 50, writable: true });
    const scrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation();

    component.scrollToSection('test-section');

    expect(getElementByIdSpy).toHaveBeenCalledWith('test-section');
    expect(mockElement.getBoundingClientRect).toHaveBeenCalled();
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 70, behavior: 'smooth' });

    getElementByIdSpy.mockRestore();
    scrollToSpy.mockRestore();
  });

  it('should do nothing when element does not exist', () => {
    const getElementByIdSpy = jest.spyOn(document, 'getElementById').mockReturnValue(null);
    const scrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation();

    component.scrollToSection('non-existent-section');

    expect(getElementByIdSpy).toHaveBeenCalledWith('non-existent-section');
    expect(scrollToSpy).not.toHaveBeenCalled();

    getElementByIdSpy.mockRestore();
    scrollToSpy.mockRestore();
  });

  it('should return true for isLegalPage when on legal route', () => {
    Object.defineProperty(router, 'url', { value: '/legal/terms-and-conditions' });
    expect(component.isLegalPage).toBe(true);
  });

  it('should return false for isLegalPage when not on legal route', () => {
    Object.defineProperty(router, 'url', { value: '/home' });
    expect(component.isLegalPage).toBe(false);
  });

  it('should return true for isDinerLanding when on diner route', () => {
    Object.defineProperty(router, 'url', { value: '/home-diner' });
    expect(component.isDinerLanding).toBe(true);
  });

  it('should return false for isDinerLanding when not on diner route', () => {
    Object.defineProperty(router, 'url', { value: '/home-restaurant' });
    expect(component.isDinerLanding).toBe(false);
  });

  it('should return true for isRestaurantLanding when on restaurant route', () => {
    Object.defineProperty(router, 'url', { value: '/home-restaurant' });
    expect(component.isRestaurantLanding).toBe(true);
  });

  it('should return false for isRestaurantLanding when not on restaurant route', () => {
    Object.defineProperty(router, 'url', { value: '/home-diner' });
    expect(component.isRestaurantLanding).toBe(false);
  });

  it('should navigate to diner home when currently on diner landing', async () => {
    Object.defineProperty(router, 'url', { value: '/home-diner' });
    const navigateSpy = jest.spyOn(router, 'navigate');

    component.navigateToHome();

    expect(navigateSpy).toHaveBeenCalledWith(['/home-diner']);
  });

  it('should navigate to restaurant home when currently on restaurant landing', async () => {
    Object.defineProperty(router, 'url', { value: '/home-restaurant' });
    const navigateSpy = jest.spyOn(router, 'navigate');

    component.navigateToHome();

    expect(navigateSpy).toHaveBeenCalledWith(['/home-restaurant']);
  });

  it('should navigate to restaurant home by default when on other routes', async () => {
    Object.defineProperty(router, 'url', { value: '/some-other-route' });
    const navigateSpy = jest.spyOn(router, 'navigate');

    component.navigateToHome();

    expect(navigateSpy).toHaveBeenCalledWith(['/home-restaurant']);
  });

  it('should navigate to diner home when on legal page with diner query param', async () => {
    Object.defineProperty(router, 'url', { value: '/legal/terms' });
    mockActivatedRoute.snapshot.queryParams = { from: 'diner' };
    const navigateSpy = jest.spyOn(router, 'navigate');

    component.navigateToHome();

    expect(navigateSpy).toHaveBeenCalledWith(['/home-diner']);
  });

  it('should navigate to restaurant home when on legal page without diner param', async () => {
    Object.defineProperty(router, 'url', { value: '/legal/terms' });
    mockActivatedRoute.snapshot.queryParams = { from: 'restaurant' };
    const navigateSpy = jest.spyOn(router, 'navigate');

    component.navigateToHome();

    expect(navigateSpy).toHaveBeenCalledWith(['/home-restaurant']);
  });

  it('should handle window scroll event', () => {
    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });

    component.onWindowScroll();

    expect(component.isScrolled).toBe(true);

    Object.defineProperty(window, 'scrollY', { value: 30, writable: true });

    component.onWindowScroll();

    expect(component.isScrolled).toBe(false);
  });
});
