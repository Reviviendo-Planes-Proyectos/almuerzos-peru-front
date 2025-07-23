import { environment } from '../../../environments/environment';
import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerService;

  beforeEach(() => {
    service = new LoggerService();
    jest.clearAllMocks();
  });

  type LoggerMethod = 'log' | 'info' | 'warn' | 'error' | 'debug';

  const setupConsoleSpy = (level: LoggerMethod) => {
    return jest.spyOn(console, level).mockImplementation(() => {});
  };

  const levels: LoggerMethod[] = ['log', 'info', 'warn', 'error', 'debug'];

  for (const level of levels) {
    it(`debe llamar console.${level} con los argumentos correctos`, () => {
      const spy = setupConsoleSpy(level);
      const msg = `${level.toUpperCase()} mensaje`;
      const params: unknown[] = ['extra', { key: 'value' }];

      (service as Record<LoggerMethod, (msg: unknown, ...params: unknown[]) => void>)[level](msg, ...params);

      expect(spy).toHaveBeenCalledWith(msg, ...params);
    });
  }

  it('no debe imprimir debug en producción', () => {
    const originalEnv = environment.production;
    environment.production = true;

    const spy = setupConsoleSpy('debug');
    service.debug('No debe verse en producción');

    expect(spy).not.toHaveBeenCalled();

    environment.production = originalEnv;
  });

  it('sí debe imprimir debug fuera de producción', () => {
    const originalEnv = environment.production;
    environment.production = false;

    const spy = setupConsoleSpy('debug');
    service.debug('Debe verse en desarrollo');

    expect(spy).toHaveBeenCalledWith('Debe verse en desarrollo');

    environment.production = originalEnv;
  });
});
