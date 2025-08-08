import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ProfileSelectionComponent } from './profile-selection.component';

describe('ProfileSelectionComponent', () => {
  let component: ProfileSelectionComponent;
  let fixture: ComponentFixture<ProfileSelectionComponent>;
  let mockLocation: jest.Mocked<Location>;
  let mockRouter: jest.Mocked<Router>;

  beforeEach(async () => {
    const locationSpy = {
      back: jest.fn()
    };
    const routerSpy = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ProfileSelectionComponent],
      providers: [
        { provide: Location, useValue: locationSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileSelectionComponent);
    component = fixture.componentInstance;
    mockLocation = TestBed.inject(Location) as jest.Mocked<Location>;
    mockRouter = TestBed.inject(Router) as jest.Mocked<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call location.back() when goBack is called', () => {
    component.goBack();
    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('should navigate to register when elegirTipoUsuario is called with restaurante', (done) => {
    component.elegirTipoUsuario('restaurante');

    setTimeout(() => {
      expect(mockRouter.navigate).toHaveBeenCalledWith(['auth/register']);
      done();
    }, 850);
  });

  it('should navigate to register when elegirTipoUsuario is called with comensal', (done) => {
    component.elegirTipoUsuario('comensal');

    setTimeout(() => {
      expect(mockRouter.navigate).toHaveBeenCalledWith(['auth/register']);
      done();
    }, 850);
  });

  it('should have router property accessible', () => {
    expect(component.router).toBeDefined();
    expect(component.router).toBe(mockRouter);
  });
});
