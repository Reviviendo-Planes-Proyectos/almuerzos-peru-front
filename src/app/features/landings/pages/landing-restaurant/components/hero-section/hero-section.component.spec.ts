import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule, SharedComponentsModule } from '../../../../../../shared/modules';
import { I18N_TEST_PROVIDERS } from '../../../../../../testing/pwa-mocks';
import { HeroSectionComponent } from './hero-section.component';

describe('HeroSectionComponent', () => {
  let component: HeroSectionComponent;
  let fixture: ComponentFixture<HeroSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroSectionComponent, MaterialModule, SharedComponentsModule],
      providers: [provideHttpClient(), provideHttpClientTesting(), ...I18N_TEST_PROVIDERS]
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
    expect(compiled.querySelector('.gradient-text')?.textContent).toContain('Sube tu carta.');
  });

  it('should log feature and navigate when handleFeatureClick is called', () => {
    const loggerSpy = jest.spyOn((component as any).logger, 'log');
    const routerSpy = jest.spyOn((component as any).router, 'navigate');
    const feature = 'Menú Digital';

    component.handleFeatureClick(feature);

    expect(loggerSpy).toHaveBeenCalledWith(`Feature clicked: ${feature}`);
    expect(routerSpy).toHaveBeenCalledWith(['/home-diner']);
  });
});
