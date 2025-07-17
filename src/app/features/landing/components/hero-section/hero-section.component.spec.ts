import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { MaterialModule } from '../../../../shared/material.module';
import { HeroSectionComponent } from './hero-section.component';

describe('HeroSectionComponent', () => {
  let component: HeroSectionComponent;
  let fixture: ComponentFixture<HeroSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroSectionComponent, MaterialModule, ButtonComponent],
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

  it('should alert feature when handleFeatureClick is called', () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation();
    const feature = 'Menú Digital';

    component.handleFeatureClick(feature);

    expect(alertSpy).toHaveBeenCalledWith(`Feature clicked: ${feature}`);
    alertSpy.mockRestore();
  });
});
