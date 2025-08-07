import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
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
      imports: [RegisterComponent],
      providers: [
        { provide: Location, useValue: locationSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
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

  it('should execute loginWithGoogle method without errors', () => {
    expect(() => component.loginWithGoogle()).not.toThrow();
  });

  it('should execute loginWithFacebook method without errors', () => {
    expect(() => component.loginWithFacebook()).not.toThrow();
  });

  it('should execute crearConEmail method without errors', () => {
    expect(() => component.crearConEmail()).not.toThrow();
  });

  it('should have router property accessible', () => {
    expect(component.router).toBeDefined();
    expect(component.router).toBe(mockRouter);
  });

  it('should have all required dependencies injected', () => {
    expect(component).toBeTruthy();
    expect(mockLocation).toBeTruthy();
    expect(mockRouter).toBeTruthy();
  });
});
