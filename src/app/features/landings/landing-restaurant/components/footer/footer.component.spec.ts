import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the footer element', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('footer')).toBeTruthy();
  });

  it('should display the brand name "ALMUERZOSPERÚ"', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const brandText = compiled.textContent || '';
    expect(brandText).toContain('ALMUERZOS');
    expect(brandText).toContain('PERÚ');
  });

  it('should contain social icons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const icons = compiled.querySelectorAll('span.material-icons');
    const iconNames = Array.from(icons).map((el) => el.textContent?.trim());
    expect(iconNames).toContain('facebook');
    expect(iconNames).toContain('camera_alt');
  });
});
