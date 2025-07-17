import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { routes } from '../../../../app.routes'; // Asegúrate de tener tus rutas aquí
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
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

  it('should navigate to login when navigateToLogin is called', async () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.navigateToLogin();
    expect(navigateSpy).toHaveBeenCalledWith(['auth/login']);
  });
});
