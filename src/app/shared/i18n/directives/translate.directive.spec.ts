import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { I18nService } from '../services/translation.service';
import { TranslateDirective } from './translate.directive';

@Component({
  template: `
    <div appTranslate="test.key" id="test-element"></div>
    <div appTranslate="missing.key" id="missing-element"></div>
    <div appTranslate="" id="empty-element"></div>
  `,
  standalone: true,
  imports: [TranslateDirective]
})
class TestComponent {}

class MockI18nService {
  private translationsLoaded = true;

  t(key: string): string {
    const translations: Record<string, string> = {
      'test.key': 'Test Translation'
    };
    return translations[key] || key;
  }

  isTranslationsLoaded(): boolean {
    return this.translationsLoaded;
  }

  setTranslationsLoaded(loaded: boolean) {
    this.translationsLoaded = loaded;
  }
}

describe('TranslateDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let mockI18nService: MockI18nService;

  beforeEach(async () => {
    const mockService = new MockI18nService();

    await TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [{ provide: I18nService, useValue: mockService }]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    mockI18nService = mockService;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should translate text content when key exists', () => {
    const element = fixture.debugElement.query(By.css('#test-element'));
    expect(element.nativeElement.textContent).toBe('Test Translation');
  });

  it('should return key when translation not found', () => {
    const element = fixture.debugElement.query(By.css('#missing-element'));
    expect(element.nativeElement.textContent).toBe('missing.key');
  });

  it('should handle empty key', () => {
    const element = fixture.debugElement.query(By.css('#empty-element'));
    expect(element.nativeElement.textContent).toBe('');
  });

  it('should update text when translations are loaded', () => {
    mockI18nService.setTranslationsLoaded(false);
    fixture.detectChanges();

    mockI18nService.setTranslationsLoaded(true);
    fixture.detectChanges();

    const element = fixture.debugElement.query(By.css('#test-element'));
    expect(element.nativeElement.textContent).toBe('Test Translation');
  });
});
