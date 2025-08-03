import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { EMPTY, of } from 'rxjs';
import { MaterialModule } from '../../../shared/material.module';
import { LandingComponent } from './landing.component';

// Mock de SwUpdate
const mockSwUpdate = {
  isEnabled: false,
  available: EMPTY,
  activated: EMPTY,
  versionUpdates: EMPTY,
  unrecoverable: EMPTY,
  checkForUpdate: () => Promise.resolve(),
  activateUpdate: () => Promise.resolve()
};

// Mock de SwPush
const mockSwPush = {
  isEnabled: false,
  messages: EMPTY,
  notificationClicks: EMPTY,
  subscription: EMPTY,
  requestSubscription: () => Promise.resolve(),
  unsubscribe: () => Promise.resolve()
};

// Mock de MatSnackBar
const mockMatSnackBar = {
  open: jest.fn(),
  dismiss: jest.fn(),
  ngOnDestroy: jest.fn()
};

describe('LandingComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingComponent, MaterialModule],
      providers: [
        provideAnimations(),
        { provide: SwUpdate, useValue: mockSwUpdate },
        { provide: SwPush, useValue: mockSwPush },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
        { provide: PLATFORM_ID, useValue: 'browser' },
        {
          provide: ActivatedRoute,
          useValue: {
            fragment: of(null),
            params: of({}),
            queryParams: of({}),
            data: of({})
          }
        }
      ]
    }).compileComponents();
  });

  it('should create the landing component', () => {
    const fixture = TestBed.createComponent(LandingComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should render the header', () => {
    const fixture = TestBed.createComponent(LandingComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-header')).toBeTruthy();
  });

  it('should render the footer', () => {
    const fixture = TestBed.createComponent(LandingComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-footer')).toBeTruthy();
  });

  it('should render the hero section', () => {
    const fixture = TestBed.createComponent(LandingComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-hero-section')).toBeTruthy();
  });

  it('should render the benefits section', () => {
    const fixture = TestBed.createComponent(LandingComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-benefits-section')).toBeTruthy();
  });

  it('should render the how-it-works section', () => {
    const fixture = TestBed.createComponent(LandingComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-how-it-works-section')).toBeTruthy();
  });

  it('should render the testimonials section', () => {
    const fixture = TestBed.createComponent(LandingComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-testimonials-section')).toBeTruthy();
  });

  it('should render the pricing section', () => {
    const fixture = TestBed.createComponent(LandingComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-pricing-section')).toBeTruthy();
  });

  it('should render the final cta section', () => {
    const fixture = TestBed.createComponent(LandingComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-final-cta-section')).toBeTruthy();
  });
});
