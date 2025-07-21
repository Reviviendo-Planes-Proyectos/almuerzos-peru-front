import { EMPTY } from 'rxjs';

// Mock de SwUpdate para tests
export const mockSwUpdate = {
  isEnabled: false,
  available: EMPTY,
  activated: EMPTY,
  versionUpdates: EMPTY,
  unrecoverable: EMPTY,
  checkForUpdate: () => Promise.resolve(),
  activateUpdate: () => Promise.resolve()
};

// Mock de SwPush para tests
export const mockSwPush = {
  isEnabled: false,
  messages: EMPTY,
  notificationClicks: EMPTY,
  subscription: EMPTY,
  requestSubscription: () => Promise.resolve(),
  unsubscribe: () => Promise.resolve()
};

// Mock de MatSnackBar para tests
export const mockMatSnackBar = {
  open: jest.fn(),
  dismiss: jest.fn(),
  ngOnDestroy: jest.fn()
};

// Providers comunes para tests con PWA
export const PWA_TEST_PROVIDERS = [
  { provide: 'SwUpdate', useValue: mockSwUpdate },
  { provide: 'SwPush', useValue: mockSwPush },
  { provide: 'MatSnackBar', useValue: mockMatSnackBar },
  { provide: 'PLATFORM_ID', useValue: 'browser' }
];
