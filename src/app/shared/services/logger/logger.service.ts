import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

export type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

const LOG_PREFIXES: Record<LogLevel, string> = {
  log: '📜 [LOG]',
  info: 'ℹ️ [INFO]',
  warn: '⚠️ [WARN]',
  error: '❌ [ERROR]',
  debug: '🐞 [DEBUG]'
};

@Injectable({ providedIn: 'root' })
export class LoggerService {
  log(message: unknown, ...params: unknown[]): void {
    this._print('log', message, ...params);
  }

  info(message: unknown, ...params: unknown[]): void {
    this._print('info', message, ...params);
  }

  warn(message: unknown, ...params: unknown[]): void {
    this._print('warn', message, ...params);
  }

  error(message: unknown, ...params: unknown[]): void {
    this._print('error', message, ...params);
  }

  debug(message: unknown, ...params: unknown[]): void {
    if (!environment.production) {
      this._print('debug', message, ...params);
    }
  }

  private _print(level: LogLevel, message: unknown, ...params: unknown[]): void {
    const prefix = LOG_PREFIXES[level];
    // biome-ignore lint/suspicious/noConsole: logger centralizado permitido
    console[level](prefix, message, ...params);
  }
}
