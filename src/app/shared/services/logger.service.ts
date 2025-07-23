import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  log(message: unknown, ...optionalParams: unknown[]): void {
    this._print('log', message, ...optionalParams);
  }
  info(message: unknown, ...optionalParams: unknown[]): void {
    this._print('info', message, ...optionalParams);
  }
  warn(message: unknown, ...optionalParams: unknown[]): void {
    this._print('warn', message, ...optionalParams);
  }
  error(message: unknown, ...optionalParams: unknown[]): void {
    this._print('error', message, ...optionalParams);
  }
  debug(message: unknown, ...optionalParams: unknown[]): void {
    this._print('debug', message, ...optionalParams);
  }

  private _print(level: LogLevel, message: unknown, ...optionalParams: unknown[]): void {
    if (environment.production && level === 'debug') return;
    // biome-ignore lint/suspicious/noConsole: Logger centralizado permitido
    console[level](message, ...optionalParams);
  }
}
