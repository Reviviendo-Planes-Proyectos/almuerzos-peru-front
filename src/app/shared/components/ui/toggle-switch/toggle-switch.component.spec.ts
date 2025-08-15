import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule } from '../../../modules';
import { IdGeneratorService } from '../../../services';
import { ToggleSwitchComponent } from './toggle-switch.component';

describe('ToggleSwitchComponent', () => {
  let component: ToggleSwitchComponent;
  let fixture: ComponentFixture<ToggleSwitchComponent>;

  beforeEach(async () => {
    const mockIdGeneratorService = {
      generateUniqueId: jest.fn().mockReturnValue('toggle-1')
    };

    await TestBed.configureTestingModule({
      imports: [ToggleSwitchComponent, CoreModule],
      providers: [{ provide: IdGeneratorService, useValue: mockIdGeneratorService }]
    }).compileComponents();

    fixture = TestBed.createComponent(ToggleSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate unique toggle ID on initialization', () => {
    expect(component.toggleId).toBe('toggle-1');
  });

  it('should emit toggle event when clicked', () => {
    const toggleChangeSpy = jest.spyOn(component.toggleChange, 'emit');

    component.toggle();

    expect(toggleChangeSpy).toHaveBeenCalledWith(true);
    expect(component.checked).toBe(true);
  });

  it('should not toggle when disabled', () => {
    component.disabled = true;
    component.checked = false;
    const toggleChangeSpy = jest.spyOn(component.toggleChange, 'emit');

    component.toggle();

    expect(toggleChangeSpy).not.toHaveBeenCalled();
    expect(component.checked).toBe(false);
  });

  it('should toggle from false to true', () => {
    component.checked = false;
    const toggleChangeSpy = jest.spyOn(component.toggleChange, 'emit');

    component.toggle();

    expect(component.checked).toBe(true);
    expect(toggleChangeSpy).toHaveBeenCalledWith(true);
  });

  it('should toggle from true to false', () => {
    component.checked = true;
    const toggleChangeSpy = jest.spyOn(component.toggleChange, 'emit');

    component.toggle();

    expect(component.checked).toBe(false);
    expect(toggleChangeSpy).toHaveBeenCalledWith(false);
  });

  it('should use custom toggle ID when provided', () => {
    component.toggleId = 'custom-toggle-id';
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input');
    const label = fixture.nativeElement.querySelector('label');

    expect(input.id).toBe('custom-toggle-id');
    expect(label.getAttribute('for')).toBe('custom-toggle-id');
  });

  it('should apply aria-label when provided', () => {
    component.ariaLabel = 'Toggle notifications';
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input');
    expect(input.getAttribute('aria-label')).toBe('Toggle notifications');
  });
});
