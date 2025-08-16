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
});
