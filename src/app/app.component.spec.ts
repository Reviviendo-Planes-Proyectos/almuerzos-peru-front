import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { EMPTY } from 'rxjs';
import { AppComponent } from './app.component';

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

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: SwUpdate, useValue: mockSwUpdate },
        { provide: SwPush, useValue: mockSwPush },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'almuerzos-peru-front' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('almuerzos-peru-front');
  });
});
