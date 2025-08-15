import { TestBed } from '@angular/core/testing';
import { IdGeneratorService } from './id-generator.service';

describe('IdGeneratorService', () => {
  let service: IdGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate unique IDs with default prefix', () => {
    const id1 = service.generateUniqueId();
    const id2 = service.generateUniqueId();

    expect(id1).toBe('element-1');
    expect(id2).toBe('element-2');
    expect(id1).not.toBe(id2);
  });

  it('should generate unique IDs with custom prefix', () => {
    const id1 = service.generateUniqueId('toggle');
    const id2 = service.generateUniqueId('button');

    expect(id1).toBe('toggle-1');
    expect(id2).toBe('button-2');
  });

  it('should increment counter for each call', () => {
    const id1 = service.generateUniqueId('test');
    const id2 = service.generateUniqueId('test');
    const id3 = service.generateUniqueId('test');

    expect(id1).toBe('test-1');
    expect(id2).toBe('test-2');
    expect(id3).toBe('test-3');
  });

  it('should handle different prefixes independently', () => {
    const toggleId = service.generateUniqueId('toggle');
    const buttonId = service.generateUniqueId('button');
    const inputId = service.generateUniqueId('input');

    expect(toggleId).toBe('toggle-1');
    expect(buttonId).toBe('button-2');
    expect(inputId).toBe('input-3');
  });
});
