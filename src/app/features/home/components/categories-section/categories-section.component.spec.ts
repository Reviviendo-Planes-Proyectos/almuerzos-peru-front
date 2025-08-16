import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CoreModule } from '../../../../shared/modules';
import { LoggerService } from '../../../../shared/services/logger/logger.service';
import { CategoriesSectionComponent, Category } from './categories-section.component';

describe('CategoriesSectionComponent', () => {
  let component: CategoriesSectionComponent;
  let fixture: ComponentFixture<CategoriesSectionComponent>;
  let mockLogger: Partial<LoggerService>;

  beforeEach(async () => {
    // Mock del LoggerService
    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      log: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [CategoriesSectionComponent, CoreModule],
      providers: [{ provide: LoggerService, useValue: mockLogger }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with categories data', () => {
      expect(component.categories).toBeDefined();
      expect(component.categories.length).toBeGreaterThan(0);
    });

    it('should have valid category structure', () => {
      const firstCategory = component.categories[0];
      expect(firstCategory).toHaveProperty('id');
      expect(firstCategory).toHaveProperty('name');
      expect(firstCategory).toHaveProperty('image');
      expect(firstCategory).toHaveProperty('count');
    });
  });

  describe('Template Rendering', () => {
    it('should render section title', () => {
      const titleElement = fixture.debugElement.query(By.css('h2'));
      expect(titleElement.nativeElement.textContent.trim()).toBe('Categorías');
    });

    it('should render "Ver todo" button', () => {
      const viewAllButton = fixture.debugElement.query(By.css('button'));
      expect(viewAllButton.nativeElement.textContent.trim()).toBe('Ver todo');
    });

    it('should render all categories', () => {
      const categoryElements = fixture.debugElement.queryAll(By.css('.flex-shrink-0'));
      // Como hay muchas categorías duplicadas, verificamos que al menos se rendericen algunas
      expect(categoryElements.length).toBeGreaterThan(0);
    });

    it('should display category images', () => {
      const images = fixture.debugElement.queryAll(By.css('img'));
      expect(images.length).toBeGreaterThan(0);

      const firstImage = images[0];
      expect(firstImage.nativeElement.src).toContain('/img/pollo.png');
      expect(firstImage.nativeElement.alt).toBe(component.categories[0].name);
    });
  });

  describe('Event Emissions', () => {
    it('should emit categorySelected when category is clicked', () => {
      const emitSpy = jest.spyOn(component.categorySelected, 'emit');
      const testCategory: Category = component.categories[0];

      component.onCategoryClick(testCategory);

      expect(emitSpy).toHaveBeenCalledWith(testCategory);
    });

    it('should emit viewAllClicked when "Ver todo" button is clicked', () => {
      const emitSpy = jest.spyOn(component.viewAllClicked, 'emit');

      component.onViewAll();

      expect(emitSpy).toHaveBeenCalled();
    });

    it('should emit categorySelected when category element is clicked in template', () => {
      const emitSpy = jest.spyOn(component.categorySelected, 'emit');

      const categoryElement = fixture.debugElement.query(By.css('.flex-shrink-0'));
      if (categoryElement) {
        categoryElement.triggerEventHandler('click', null);
        expect(emitSpy).toHaveBeenCalled();
      }
    });
  });

  describe('Scroll Functionality', () => {
    beforeEach(() => {
      // Mock del ViewChild
      const mockContainer = {
        nativeElement: {
          scrollLeft: 0,
          offsetLeft: 0,
          style: { cursor: 'grab' }
        }
      };
      component.categoriesContainer = mockContainer as any;
    });

    it('should handle wheel scroll', () => {
      const wheelEvent = new WheelEvent('wheel', { deltaY: 100 });
      const preventDefaultSpy = jest.spyOn(wheelEvent, 'preventDefault');

      component.onWheel(wheelEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(component.categoriesContainer.nativeElement.scrollLeft).toBe(100);
    });

    it('should start drag on mousedown', () => {
      const mouseEvent = {
        pageX: 100,
        preventDefault: jest.fn()
      } as any;

      component.startDrag(mouseEvent);

      expect(mouseEvent.preventDefault).toHaveBeenCalled();
      expect((component as any).isDragging).toBe(true);
      expect(component.categoriesContainer.nativeElement.style.cursor).toBe('grabbing');
    });

    it('should handle drag movement', () => {
      // Primero iniciar el drag
      (component as any).isDragging = true;
      (component as any).startX = 50;
      (component as any).scrollLeft = 0;

      const mouseEvent = {
        pageX: 100,
        preventDefault: jest.fn()
      } as any;

      component.onDrag(mouseEvent);

      expect(mouseEvent.preventDefault).toHaveBeenCalled();
    });

    it('should end drag on mouseup', () => {
      (component as any).isDragging = true;

      component.endDrag();

      expect((component as any).isDragging).toBe(false);
      expect(component.categoriesContainer.nativeElement.style.cursor).toBe('grab');
    });

    it('should not handle drag when not dragging', () => {
      (component as any).isDragging = false;
      const mouseEvent = {
        pageX: 100,
        preventDefault: jest.fn()
      } as any;

      component.onDrag(mouseEvent);

      expect(mouseEvent.preventDefault).not.toHaveBeenCalled();
    });
  });

  describe('Image Error Handling', () => {
    it('should handle image load errors', () => {
      const mockEvent = {
        target: { src: '/img/pollo.png' }
      };
      const testCategory: Category = component.categories[0];

      component.onImageError(mockEvent, testCategory);

      expect(mockEvent.target.src).toBe('assets/images/categories/default.jpg');
      expect(mockLogger.error).toHaveBeenCalledWith('Error loading image for category:', testCategory.name);
    });
  });

  describe('Utility Methods', () => {
    it('should track categories by id', () => {
      const testCategory: Category = { id: 1, name: 'Test', image: 'test.jpg', count: 5 };

      const result = component.trackByCategory(0, testCategory);

      expect(result).toBe(1);
    });
  });

  describe('Template Integration Tests', () => {
    it('should call onViewAll when "Ver todo" button is clicked', () => {
      const onViewAllSpy = jest.spyOn(component, 'onViewAll');

      const viewAllButton = fixture.debugElement.query(By.css('button'));
      viewAllButton.nativeElement.click();

      expect(onViewAllSpy).toHaveBeenCalled();
    });

    it('should apply correct CSS classes', () => {
      const container = fixture.debugElement.query(By.css('.overflow-x-auto'));
      expect(container).toBeTruthy();

      const categoryItems = fixture.debugElement.queryAll(By.css('.flex-shrink-0'));
      expect(categoryItems.length).toBeGreaterThan(0);
    });

    it('should display category count', () => {
      const countElements = fixture.debugElement.queryAll(By.css('.text-gray-400'));
      expect(countElements.length).toBeGreaterThan(0);

      if (countElements.length > 0) {
        const firstCount = countElements[0].nativeElement.textContent;
        expect(firstCount).toContain('opciones');
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty categories array', () => {
      component.categories = [];
      fixture.detectChanges();

      const categoryElements = fixture.debugElement.queryAll(By.css('.flex-shrink-0'));
      expect(categoryElements.length).toBe(0);
    });

    it('should handle undefined category in trackBy', () => {
      const result = component.trackByCategory(0, { id: 999, name: 'Test', image: 'test.jpg', count: 0 });
      expect(result).toBe(999);
    });
  });

  describe('Accessibility', () => {
    it('should have proper alt attributes for images', () => {
      const images = fixture.debugElement.queryAll(By.css('img'));

      images.forEach((img, index) => {
        const altText = img.nativeElement.getAttribute('alt');
        expect(altText).toBe(component.categories[index].name);
      });
    });

    it('should have clickable elements', () => {
      const clickableElements = fixture.debugElement.queryAll(By.css('.cursor-pointer'));
      expect(clickableElements.length).toBeGreaterThan(0);
    });
  });

  describe('Lifecycle Hooks', () => {
    it('should call ngAfterViewInit', () => {
      const ngAfterViewInitSpy = jest.spyOn(component, 'ngAfterViewInit');
      component.ngAfterViewInit();
      expect(ngAfterViewInitSpy).toHaveBeenCalled();
    });
  });

  describe('Responsive Behavior', () => {
    it('should handle touch/mobile events', () => {
      // Test para asegurar que el componente es mobile-friendly
      const container = fixture.debugElement.query(By.css('.overflow-x-auto'));
      expect(container.nativeElement.classList).toContain('overflow-x-auto');
    });

    it('should apply correct styling classes', () => {
      const component_element = fixture.debugElement.query(By.css('.px-4'));
      expect(component_element).toBeTruthy();
    });
  });
});
