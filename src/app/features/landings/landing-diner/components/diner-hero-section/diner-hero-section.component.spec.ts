import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { DinerHeroSectionComponent } from './diner-hero-section.component';

describe('DinerHeroSectionComponent', () => {
  let component: DinerHeroSectionComponent;
  let fixture: ComponentFixture<DinerHeroSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DinerHeroSectionComponent, BrowserAnimationsModule],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(DinerHeroSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have stats data', () => {
    expect(component.stats).toBeDefined();
    expect(component.stats.length).toBeGreaterThan(0);
  });

  it('should scroll to section when called', () => {
    const mockElement = document.createElement('div');
    const mockScrollIntoView = jest.fn();
    mockElement.scrollIntoView = mockScrollIntoView;

    jest.spyOn(document, 'getElementById').mockReturnValue(mockElement);

    component.scrollToSection('test-section');

    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('should handle missing element in scrollToSection', () => {
    jest.spyOn(document, 'getElementById').mockReturnValue(null);

    expect(() => component.scrollToSection('non-existent-section')).not.toThrow();
  });

  it('should have correct stats structure', () => {
    for (const stat of component.stats) {
      expect(stat).toHaveProperty('value');
      expect(stat).toHaveProperty('label');
      expect(stat).toHaveProperty('icon');
      expect(stat).toHaveProperty('color');
    }
  });

  it('should initialize isVisible to false', () => {
    expect(component.isVisible).toBe(false);
  });

  it('should set isVisible to true after ngOnInit', (done) => {
    component.ngOnInit();

    setTimeout(() => {
      expect(component.isVisible).toBe(true);
      done();
    }, 150);
  });

  it('should update scrollY on window scroll', () => {
    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });

    component.onWindowScroll();

    expect(component.scrollY).toBe(100);
  });
});
