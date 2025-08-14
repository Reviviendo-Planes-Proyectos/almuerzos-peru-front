import { EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { LocationSelectorModalComponent } from './location-selector-modal.component';

describe('LocationSelectorModalComponent', () => {
  let component: LocationSelectorModalComponent;
  let fixture: ComponentFixture<LocationSelectorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationSelectorModalComponent, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LocationSelectorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.isVisible).toBe(false);
    expect(component.searchQuery).toBe('');
  });

  it('should emit searchQueryChange when onSearchChange is called', () => {
    const spy = jest.spyOn(component.searchQueryChange, 'emit');
    const mockEvent = {
      target: { value: 'Lima, Peru' }
    } as unknown as Event;

    component.onSearchChange(mockEvent);

    expect(component.searchQuery).toBe('Lima, Peru');
    expect(spy).toHaveBeenCalledWith('Lima, Peru');
  });

  it('should emit confirmLocation and close modal when onConfirmLocation is called with valid query', () => {
    const confirmSpy = jest.spyOn(component.confirmLocation, 'emit');
    const closeSpy = jest.spyOn(component.closeModal, 'emit');

    component.searchQuery = 'Lima, Peru';
    component.onConfirmLocation();

    expect(confirmSpy).toHaveBeenCalledWith('Lima, Peru');
    expect(closeSpy).toHaveBeenCalled();
  });

  it('should not emit confirmLocation when onConfirmLocation is called with empty query', () => {
    const confirmSpy = jest.spyOn(component.confirmLocation, 'emit');
    const closeSpy = jest.spyOn(component.closeModal, 'emit');

    component.searchQuery = '   ';
    component.onConfirmLocation();

    expect(confirmSpy).not.toHaveBeenCalled();
    expect(closeSpy).not.toHaveBeenCalled();
  });

  it('should emit closeModal when onClose is called', () => {
    const spy = jest.spyOn(component.closeModal, 'emit');

    component.onClose();

    expect(spy).toHaveBeenCalled();
  });

  it('should close modal when backdrop is clicked', () => {
    const spy = jest.spyOn(component.closeModal, 'emit');
    const backdrop = document.createElement('div');
    const mockEvent = {
      target: backdrop,
      currentTarget: backdrop
    } as unknown as Event;

    component.onBackdropClick(mockEvent);

    expect(spy).toHaveBeenCalled();
  });

  it('should not close modal when backdrop click is not on backdrop element', () => {
    const spy = jest.spyOn(component.closeModal, 'emit');
    const mockEvent = {
      target: document.createElement('div'),
      currentTarget: document.createElement('span')
    } as unknown as Event;

    component.onBackdropClick(mockEvent);

    expect(spy).not.toHaveBeenCalled();
  });

  describe('Input Properties', () => {
    it('should update isVisible property', () => {
      component.isVisible = true;
      fixture.detectChanges();

      expect(component.isVisible).toBe(true);
    });

    it('should update searchQuery property', () => {
      component.searchQuery = 'Test Location';
      fixture.detectChanges();

      expect(component.searchQuery).toBe('Test Location');
    });
  });

  describe('Output Events', () => {
    it('should have closeModal output emitter', () => {
      expect(component.closeModal).toBeDefined();
      expect(component.closeModal).toBeInstanceOf(EventEmitter);
    });

    it('should have confirmLocation output emitter', () => {
      expect(component.confirmLocation).toBeDefined();
      expect(component.confirmLocation).toBeInstanceOf(EventEmitter);
    });

    it('should have searchQueryChange output emitter', () => {
      expect(component.searchQueryChange).toBeDefined();
      expect(component.searchQueryChange).toBeInstanceOf(EventEmitter);
    });
  });
});
