import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { HowItWorksSectionComponent } from './how-it-works-section.component';

describe('HowItWorksSectionComponent', () => {
  let component: HowItWorksSectionComponent;
  let fixture: ComponentFixture<HowItWorksSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HowItWorksSectionComponent], // componente standalone
    }).compileComponents();

    fixture = TestBed.createComponent(HowItWorksSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the how-it-works section content', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('section#como-funciona')).toBeTruthy();
    expect(compiled.querySelector('.gradient-text')?.textContent).toContain('Funciona');
  });
});
