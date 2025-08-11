import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { HeaderWithStepsComponent } from './header-with-steps.component';

describe('HeaderWithStepsComponent', () => {
  let component: HeaderWithStepsComponent;
  let fixture: ComponentFixture<HeaderWithStepsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderWithStepsComponent] // Componente standalone
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderWithStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Properties', () => {
    it('should have default currentStep value of 1', () => {
      expect(component.currentStep).toBe(1);
    });

    it('should have default showBackButton value of true', () => {
      expect(component.showBackButton).toBe(true);
    });

    it('should accept custom currentStep input', () => {
      component.currentStep = 3;
      fixture.detectChanges();

      expect(component.currentStep).toBe(3);
    });

    it('should accept custom showBackButton input', () => {
      component.showBackButton = false;
      fixture.detectChanges();

      expect(component.showBackButton).toBe(false);
    });
  });

  describe('Template Rendering', () => {
    it('should display the correct step number', () => {
      component.currentStep = 5;
      fixture.detectChanges();

      const stepIndicator = fixture.debugElement.query(By.css('.bg-orange-500'));
      expect(stepIndicator.nativeElement.textContent.trim()).toBe('5');
    });

    it('should display the logo text correctly', () => {
      const logoElement = fixture.debugElement.query(By.css('h1'));
      const logoText = logoElement.nativeElement.textContent;

      expect(logoText).toContain('Almuerzos');
      expect(logoText).toContain('Perú');
    });

    it('should have correct logo styling classes', () => {
      const logoElement = fixture.debugElement.query(By.css('h1'));

      expect(logoElement.nativeElement.classList).toContain('text-lg');
      expect(logoElement.nativeElement.classList).toContain('font-semibold');
      expect(logoElement.nativeElement.classList).toContain('text-gray-800');
    });

    it('should have orange styling on Perú span', () => {
      const peruSpan = fixture.debugElement.query(By.css('.text-orange-500'));

      expect(peruSpan.nativeElement.textContent.trim()).toBe('Perú');
    });
  });

  describe('Back Button Behavior', () => {
    it('should show back button when showBackButton is true', () => {
      component.showBackButton = true;
      fixture.detectChanges();

      const backButton = fixture.debugElement.query(By.css('button[aria-label="Volver atrás"]'));
      expect(backButton).toBeTruthy();

      // Verificar que no existe el div spacer (que solo aparece cuando showBackButton es false)
      const allDivs = fixture.debugElement.queryAll(By.css('div'));
      const spacerDiv = allDivs.find(
        (div) =>
          div.nativeElement.classList.contains('w-10') &&
          div.nativeElement.classList.contains('h-10') &&
          !div.nativeElement.classList.contains('bg-orange-500') // Excluir el step indicator
      );
      expect(spacerDiv).toBeFalsy();
    });

    it('should hide back button and show spacer when showBackButton is false', () => {
      component.showBackButton = false;
      fixture.detectChanges();

      const backButton = fixture.debugElement.query(By.css('button[aria-label="Volver atrás"]'));
      expect(backButton).toBeFalsy();

      const spacer = fixture.debugElement.query(By.css('div.w-10.h-10'));
      expect(spacer).toBeTruthy();
    });

    it('should have correct back button styling classes', () => {
      component.showBackButton = true;
      fixture.detectChanges();

      const backButton = fixture.debugElement.query(By.css('button'));
      const buttonElement = backButton.nativeElement;

      expect(buttonElement.classList).toContain('flex');
      expect(buttonElement.classList).toContain('items-center');
      expect(buttonElement.classList).toContain('justify-center');
      expect(buttonElement.classList).toContain('w-10');
      expect(buttonElement.classList).toContain('h-10');
      expect(buttonElement.classList).toContain('rounded-full');
      expect(buttonElement.classList).toContain('bg-gray-100');
    });

    it('should have material icon in back button', () => {
      component.showBackButton = true;
      fixture.detectChanges();

      const materialIcon = fixture.debugElement.query(By.css('.material-icons'));

      expect(materialIcon).toBeTruthy();
      expect(materialIcon.nativeElement.textContent.trim()).toBe('arrow_back');
      expect(materialIcon.nativeElement.classList).toContain('text-gray-600');
    });

    it('should have correct aria-label for accessibility', () => {
      component.showBackButton = true;
      fixture.detectChanges();

      const backButton = fixture.debugElement.query(By.css('button'));

      expect(backButton.nativeElement.getAttribute('aria-label')).toBe('Volver atrás');
    });
  });

  describe('Event Emission', () => {
    it('should emit backClick event when back button is clicked', () => {
      jest.spyOn(component.backClick, 'emit');
      component.showBackButton = true;
      fixture.detectChanges();

      const backButton = fixture.debugElement.query(By.css('button'));
      backButton.nativeElement.click();

      expect(component.backClick.emit).toHaveBeenCalled();
    });

    it('should call onBackClick method when back button is clicked', () => {
      jest.spyOn(component, 'onBackClick');
      component.showBackButton = true;
      fixture.detectChanges();

      const backButton = fixture.debugElement.query(By.css('button'));
      backButton.nativeElement.click();

      expect(component.onBackClick).toHaveBeenCalled();
    });

    it('should emit backClick event when onBackClick is called directly', () => {
      jest.spyOn(component.backClick, 'emit');

      component.onBackClick();

      expect(component.backClick.emit).toHaveBeenCalled();
    });
  });

  describe('Step Indicator', () => {
    it('should have correct step indicator styling classes', () => {
      const stepIndicator = fixture.debugElement.query(By.css('.bg-orange-500'));
      const indicatorElement = stepIndicator.nativeElement;

      expect(indicatorElement.classList).toContain('flex');
      expect(indicatorElement.classList).toContain('items-center');
      expect(indicatorElement.classList).toContain('justify-center');
      expect(indicatorElement.classList).toContain('w-10');
      expect(indicatorElement.classList).toContain('h-10');
      expect(indicatorElement.classList).toContain('bg-orange-500');
      expect(indicatorElement.classList).toContain('text-white');
      expect(indicatorElement.classList).toContain('rounded-full');
      expect(indicatorElement.classList).toContain('font-semibold');
      expect(indicatorElement.classList).toContain('text-sm');
    });

    it('should update step indicator when currentStep changes', () => {
      // Cambiar a paso 2
      component.currentStep = 2;
      fixture.detectChanges();
      let stepIndicator = fixture.debugElement.query(By.css('.bg-orange-500'));
      expect(stepIndicator.nativeElement.textContent.trim()).toBe('2');

      // Cambiar a paso 10
      component.currentStep = 10;
      fixture.detectChanges();
      stepIndicator = fixture.debugElement.query(By.css('.bg-orange-500'));
      expect(stepIndicator.nativeElement.textContent.trim()).toBe('10');
    });
  });

  describe('Layout Structure', () => {
    it('should have correct main container classes', () => {
      const mainContainer = fixture.debugElement.query(By.css('div'));
      const containerElement = mainContainer.nativeElement;

      expect(containerElement.classList).toContain('flex');
      expect(containerElement.classList).toContain('items-center');
      expect(containerElement.classList).toContain('justify-between');
      expect(containerElement.classList).toContain('p-4');
      expect(containerElement.classList).toContain('bg-white');
      expect(containerElement.classList).toContain('shadow-sm');
    });

    it('should have correct logo container classes', () => {
      const logoContainer = fixture.debugElement.query(By.css('.flex-1'));

      expect(logoContainer.nativeElement.classList).toContain('flex-1');
      expect(logoContainer.nativeElement.classList).toContain('flex');
      expect(logoContainer.nativeElement.classList).toContain('justify-center');
    });
  });

  describe('Integration Tests', () => {
    it('should work correctly with different step values and back button states', () => {
      // Test con paso 3 y botón visible
      component.currentStep = 3;
      component.showBackButton = true;
      fixture.detectChanges();

      const stepIndicator = fixture.debugElement.query(By.css('.bg-orange-500'));
      const backButton = fixture.debugElement.query(By.css('button'));

      expect(stepIndicator.nativeElement.textContent.trim()).toBe('3');
      expect(backButton).toBeTruthy();

      // Test con paso 7 y botón oculto
      component.currentStep = 7;
      component.showBackButton = false;
      fixture.detectChanges();

      const updatedStepIndicator = fixture.debugElement.query(By.css('.bg-orange-500'));
      const hiddenButton = fixture.debugElement.query(By.css('button'));
      const spacer = fixture.debugElement.query(By.css('div.w-10.h-10'));

      expect(updatedStepIndicator.nativeElement.textContent.trim()).toBe('7');
      expect(hiddenButton).toBeFalsy();
      expect(spacer).toBeTruthy();
    });

    it('should emit event and maintain correct state after interaction', () => {
      let emittedEvents = 0;
      component.backClick.subscribe(() => {
        emittedEvents++;
      });

      component.currentStep = 2;
      component.showBackButton = true;
      fixture.detectChanges();

      // Click en el botón
      const backButton = fixture.debugElement.query(By.css('button'));
      backButton.nativeElement.click();

      expect(emittedEvents).toBe(1);
      expect(component.currentStep).toBe(2); // No debería cambiar
      expect(component.showBackButton).toBe(true); // No debería cambiar
    });
  });
});
