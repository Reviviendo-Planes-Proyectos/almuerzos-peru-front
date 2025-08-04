import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { routes } from '../../../../core/routes/app.routes';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter(routes)]
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
    expect(compiled.querySelector('.gradient-text')?.textContent).toContain('ALMUERZOSPERÚ');
  });

  /*   it('should navigate to login when navigateToLogin is called', async () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.navigateToLogin();
    expect(navigateSpy).toHaveBeenCalledWith(['auth/login']);
  });
 */
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
});
