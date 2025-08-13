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

  it('debe inicializar el indicador de scroll al cargar', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    mockApiService.getHealth.mockReturnValue(of({ status: 'ok' }));

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('debe manejar el scroll y actualizar las propiedades CSS', () => {
    Object.defineProperty(window, 'pageYOffset', { value: 100, writable: true });
    Object.defineProperty(document.documentElement, 'scrollTop', { value: 100, writable: true });
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 800, writable: true });

    const setPropertySpy = jest.spyOn(document.documentElement.style, 'setProperty');
    const addClassSpy = jest.spyOn(document.body.classList, 'add');

    mockApiService.getHealth.mockReturnValue(of({ status: 'ok' }));

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges();

    (app as any).handleScroll();

    expect(setPropertySpy).toHaveBeenCalledWith('--scroll-progress', expect.any(String));
    expect(setPropertySpy).toHaveBeenCalledWith('--scroll-position', expect.any(String));
    expect(addClassSpy).toHaveBeenCalledWith('scrolling');
  });

  it('debe limpiar el timeout de scroll y remover clase scrolling', (done) => {
    jest.useFakeTimers();
    const removeClassSpy = jest.spyOn(document.body.classList, 'remove');

    mockApiService.getHealth.mockReturnValue(of({ status: 'ok' }));

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges();

    (app as any).handleScroll();
    (app as any).handleScroll();

    jest.advanceTimersByTime(1500);

    expect(removeClassSpy).toHaveBeenCalledWith('scrolling');

    jest.useRealTimers();
    done();
  });

  it('debe manejar scrollHeight igual a 0', () => {
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 800, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 800, writable: true });

    const setPropertySpy = jest.spyOn(document.documentElement.style, 'setProperty');

    mockApiService.getHealth.mockReturnValue(of({ status: 'ok' }));

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges();

    (app as any).handleScroll();

    expect(setPropertySpy).not.toHaveBeenCalledWith('--scroll-progress', expect.any(String));
  });
});
