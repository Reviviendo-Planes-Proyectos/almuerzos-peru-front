import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { of, throwError } from 'rxjs';
import { AppComponent } from './app.component';
import { ApiService } from './shared/services/api/api.service';
import { LoggerService } from './shared/services/logger/logger.service';

const mockSwUpdate = {
  isEnabled: false,
  checkForUpdate: () => Promise.resolve(),
  activateUpdate: () => Promise.resolve()
};

const mockSwPush = {
  isEnabled: false,
  requestSubscription: () => Promise.resolve(),
  unsubscribe: () => Promise.resolve()
};

describe('AppComponent', () => {
  let mockApiService: jest.Mocked<ApiService>;
  let mockLogger: Partial<LoggerService>;

  beforeEach(async () => {
    mockApiService = {
      getHealth: jest.fn()
    } as unknown as jest.Mocked<ApiService>;

    mockLogger = {
      log: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: ApiService, useValue: mockApiService },
        { provide: LoggerService, useValue: mockLogger as LoggerService },
        { provide: SwUpdate, useValue: mockSwUpdate },
        { provide: SwPush, useValue: mockSwPush },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();

    jest.clearAllMocks();
  });

  it('debe crear el componente', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('debe asignar respuesta del API y registrar info', () => {
    const mockResponse = { status: 'ok' };
    mockApiService.getHealth.mockReturnValue(of(mockResponse));

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const app = fixture.componentInstance;
    expect(app.apiStatus).toEqual(mockResponse);
    expect(mockLogger.info).toHaveBeenCalledWith('API status fetched successfully:', mockResponse);
  });

  it('debe manejar error del API y registrar error', () => {
    const mockError = { status: 0, message: 'Error en API' };
    mockApiService.getHealth.mockReturnValue(throwError(() => mockError));

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const app = fixture.componentInstance;
    expect(app.apiStatus).toEqual(mockError);
    expect(mockLogger.error).toHaveBeenCalledWith('Error fetching API status:', mockError);
  });
});
