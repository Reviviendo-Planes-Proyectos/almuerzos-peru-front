import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class IdGeneratorService {
  private counter = 0;

  generateUniqueId(prefix = 'element'): string {
    this.counter += 1;
    return `${prefix}-${this.counter}`;
  }
}
