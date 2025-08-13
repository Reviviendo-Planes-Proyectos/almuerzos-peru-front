import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();

// Mock para IntersectionObserver
(global as any).IntersectionObserver = class {
  root = null;
  rootMargin = '';
  thresholds = [];

  observe(_target: Element): void {}
  unobserve(_target: Element): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
};

// Mock para fetch API
(global as any).fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve('{}')
  })
);

// Mock para Element.scrollTo
Element.prototype.scrollTo = jest.fn();
