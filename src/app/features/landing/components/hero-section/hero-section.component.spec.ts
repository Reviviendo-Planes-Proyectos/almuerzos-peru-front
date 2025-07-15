import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroSectionComponent } from './hero-section.component';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

describe('HeroSectionComponent', () => {
  let component: HeroSectionComponent;
  let fixture: ComponentFixture<HeroSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroSectionComponent, MatIconModule, ButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the hero section content', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('section')).toBeTruthy();
    expect(compiled.querySelector('.gradient-text')?.textContent).toContain('Restaurante');
  });

  it('should log feature when handleFeatureClick is called', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const feature = 'Menú Digital';

    component.handleFeatureClick(feature);

    expect(consoleSpy).toHaveBeenCalledWith(`Feature clicked: ${feature}`);
    consoleSpy.mockRestore();
  });
});
