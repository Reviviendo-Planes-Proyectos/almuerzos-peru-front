import { environment } from '../../../../environments/environment';
import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerService;
  const originalEnv = environment.production;

  beforeEach(() => {
    service = new LoggerService();
    jest.clearAllMocks();
  });

  afterEach(() => {
    environment.production = originalEnv;
  });

  type LoggerMethod = 'log' | 'info' | 'warn' | 'error' | 'debug';

  const setupConsoleSpy = (level: LoggerMethod) => {
    return jest.spyOn(console, level).mockImplementation(() => {});
  };

  const prefixMap: Record<LoggerMethod, string> = {
    log: '📜 [LOG]',
    info: 'ℹ️ [INFO]',
    warn: '⚠️ [WARN]',
    error: '❌ [ERROR]',
    debug: '🐞 [DEBUG]'
  };

  const levels: LoggerMethod[] = ['log', 'info', 'warn', 'error', 'debug'];

  for (const level of levels) {
    it(`debe llamar console.${level} con prefijo y argumentos`, () => {
      const spy = setupConsoleSpy(level);
      const msg = `${level.toUpperCase()} mensaje`;
      const params: unknown[] = ['extra', { key: 'value' }];

      environment.production = false;

      service[level](msg, ...params);

      const expectedPrefix = prefixMap[level];
      const expectedArgs = [expectedPrefix, msg, ...params];

      if (level === 'debug' && environment.production) {
        expect(spy).not.toHaveBeenCalled();
      } else {
        expect(spy).toHaveBeenCalledWith(...expectedArgs);
      }
    });
  }

  it('no debe imprimir debug en producción', () => {
    environment.production = true;
    const spy = setupConsoleSpy('debug');

    service.debug('No debe verse');

    expect(spy).not.toHaveBeenCalled();
  });

  it('sí debe imprimir debug en desarrollo', () => {
    environment.production = false;
    const spy = setupConsoleSpy('debug');

    service.debug('Debe verse');

    expect(spy).toHaveBeenCalledWith('🐞 [DEBUG]', 'Debe verse');
  });
});
