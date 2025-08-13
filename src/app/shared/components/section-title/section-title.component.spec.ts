import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SectionTitleComponent } from './section-title.component';

describe('SectionTitleComponent', () => {
  let component: SectionTitleComponent;
  let fixture: ComponentFixture<SectionTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionTitleComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SectionTitleComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the icon', () => {
    component.icon = 'star';
    fixture.detectChanges();

    const iconElement = fixture.debugElement.query(By.css('.material-icons'));
    expect(iconElement.nativeElement.textContent.trim()).toBe('star');
  });

  it('should display the title', () => {
    component.title = 'Test Title';
    fixture.detectChanges();

    const titleElement = fixture.debugElement.query(By.css('h2'));
    expect(titleElement.nativeElement.textContent.trim()).toBe('Test Title');
  });

  it('should display the subtitle', () => {
    component.subtitle = 'Test Subtitle';
    fixture.detectChanges();

    const subtitleElement = fixture.debugElement.query(By.css('p'));
    expect(subtitleElement.nativeElement.textContent.trim()).toBe('Test Subtitle');
  });

  it('should have correct CSS classes for the icon container', () => {
    fixture.detectChanges();

    const iconContainer = fixture.debugElement.query(By.css('.w-16.h-16.bg-orange-500.rounded-full'));
    expect(iconContainer).toBeTruthy();
  });

  it('should have correct CSS classes for the title', () => {
    fixture.detectChanges();

    const titleElement = fixture.debugElement.query(By.css('h2.text-xl.font-bold.text-gray-900'));
    expect(titleElement).toBeTruthy();
  });

  it('should have correct CSS classes for the subtitle', () => {
    fixture.detectChanges();

    const subtitleElement = fixture.debugElement.query(By.css('p.text-gray-600.text-sm'));
    expect(subtitleElement).toBeTruthy();
  });

  it('should render all elements with provided inputs', () => {
    component.icon = 'photo_camera';
    component.title = 'Foto de Perfil';
    component.subtitle = 'Ya casi termina tu registro';
    fixture.detectChanges();

    const iconElement = fixture.debugElement.query(By.css('.material-icons'));
    const titleElement = fixture.debugElement.query(By.css('h2'));
    const subtitleElement = fixture.debugElement.query(By.css('p'));

    expect(iconElement.nativeElement.textContent.trim()).toBe('photo_camera');
    expect(titleElement.nativeElement.textContent.trim()).toBe('Foto de Perfil');
    expect(subtitleElement.nativeElement.textContent.trim()).toBe('Ya casi termina tu registro');
  });

  it('should have the correct structure', () => {
    fixture.detectChanges();

    const container = fixture.debugElement.query(By.css('.text-center.mb-6'));
    const iconContainer = fixture.debugElement.query(
      By.css('.w-16.h-16.bg-orange-500.rounded-full.flex.items-center.justify-center.mx-auto.mb-4')
    );
    const icon = fixture.debugElement.query(By.css('.material-icons.text-white.text-2xl'));
    const title = fixture.debugElement.query(By.css('h2.text-xl.font-bold.text-gray-900.mb-2'));
    const subtitle = fixture.debugElement.query(By.css('p.text-gray-600.text-sm'));

    expect(container).toBeTruthy();
    expect(iconContainer).toBeTruthy();
    expect(icon).toBeTruthy();
    expect(title).toBeTruthy();
    expect(subtitle).toBeTruthy();
  });
});
