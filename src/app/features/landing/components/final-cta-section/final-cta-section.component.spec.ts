import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { MaterialModule } from '../../../../shared/material.module';
import { FinalCtaSectionComponent } from './final-cta-section.component';

describe('FinalCtaSectionComponent', () => {
  let component: FinalCtaSectionComponent;
  let fixture: ComponentFixture<FinalCtaSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalCtaSectionComponent, MaterialModule, ButtonComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FinalCtaSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render CTA title and description', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Únete a la Revolución Digital');
    expect(compiled.querySelector('p')?.textContent).toContain('beneficios de tener un menú digital');
  });

  it('should render dos botones de acción', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2);
    const btnTexts = Array.from(buttons as NodeListOf<Element>).map((b) => b.textContent?.trim());
    expect(btnTexts).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Comienza Gratis Ahora'),
        expect.stringContaining('Hablar con un Experto'),
      ]),
    );
  });

  it('should render checklist with 3 check_circle icons', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    const icons = compiled.querySelectorAll('mat-icon');

    const iconTexts = Array.from(icons)
      .map((el: Element) => el.textContent?.trim())
      .filter((text) => text === 'check_circle');

    expect(iconTexts.length).toBe(3);
  });

  it('should call onStartFree', () => {
    const spy = jest.spyOn(component, 'onStartFree');
    component.onStartFree();
    expect(spy).toHaveBeenCalled();
  });

  it('should call onContactExpert', () => {
    const spy = jest.spyOn(component, 'onContactExpert');
    component.onContactExpert();
    expect(spy).toHaveBeenCalled();
  });
});
