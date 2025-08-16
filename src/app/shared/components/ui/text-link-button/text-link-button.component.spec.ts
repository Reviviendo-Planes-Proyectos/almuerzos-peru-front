import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule } from '../../../modules';
import { TextLinkButtonComponent } from './text-link-button.component';

describe('TextLinkButtonComponent', () => {
  let component: TextLinkButtonComponent;
  let fixture: ComponentFixture<TextLinkButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextLinkButtonComponent, CoreModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TextLinkButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit clicked event when active and clicked', () => {
    const emitSpy = jest.spyOn(component.clicked, 'emit');
    component.isActive = true;

    component.onClick();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should not emit clicked event when inactive and clicked', () => {
    const emitSpy = jest.spyOn(component.clicked, 'emit');
    component.isActive = false;

    component.onClick();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should apply orange variant classes by default', () => {
    component.variant = 'orange';
    component.isActive = true;

    const classes = component.buttonClasses;

    expect(classes).toContain('text-orange-500');
    expect(classes).toContain('hover:text-orange-600');
  });

  it('should apply gray variant classes when specified', () => {
    component.variant = 'gray';
    component.isActive = true;

    const classes = component.buttonClasses;

    expect(classes).toContain('text-gray-500');
    expect(classes).toContain('hover:text-gray-600');
  });

  it('should apply disabled classes when inactive', () => {
    component.isActive = false;

    const classes = component.buttonClasses;

    expect(classes).toContain('text-gray-400');
    expect(classes).toContain('cursor-not-allowed');
  });

  it('should display label when no translateKey is provided', () => {
    component.label = 'Test Label';
    component.translateKey = null;
    fixture.detectChanges();

    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.textContent.trim()).toBe('Test Label');
  });

  it('should have orange as default variant', () => {
    expect(component.variant).toBe('orange');
  });

  it('should be active by default', () => {
    expect(component.isActive).toBe(true);
  });
});
