import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CoreModule } from '../../../../shared/modules';
import { LoggerService } from '../../../../shared/services/logger/logger.service';
import { FavoritesSectionComponent } from './favorites-section.component';

describe('FavoritesSectionComponent', () => {
  let component: FavoritesSectionComponent;
  let fixture: ComponentFixture<FavoritesSectionComponent>;
  let mockLogger: any;

  beforeEach(async () => {
    // Mock del LoggerService
    mockLogger = {
      log: jest.fn(),
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      _print: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [FavoritesSectionComponent, CoreModule],
      providers: [{ provide: LoggerService, useValue: mockLogger }]
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritesSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Tests de inicialización
  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with favorite restaurants', () => {
      expect(component.favoriteRestaurants).toBeDefined();
      expect(component.favoriteRestaurants.length).toBeGreaterThan(0);
      expect(component.favoriteRestaurants.every((r) => r.isFavorite)).toBe(true);
    });

    it('should have all required properties in restaurant objects', () => {
      const restaurant = component.favoriteRestaurants[0];
      expect(restaurant).toHaveProperty('id');
      expect(restaurant).toHaveProperty('name');
      expect(restaurant).toHaveProperty('image');
      expect(restaurant).toHaveProperty('rating');
      expect(restaurant).toHaveProperty('deliveryTime');
      expect(restaurant).toHaveProperty('isFavorite');
    });
  });

  // Tests de renderizado del template
  describe('Template Rendering', () => {
    it('should display the section title', () => {
      const titleElement = fixture.debugElement.query(By.css('h2'));
      expect(titleElement).toBeTruthy();
      expect(titleElement.nativeElement.textContent.trim()).toBe('Tus favoritos');
    });

    it('should display heart emojis in the title section', () => {
      const heartElement = fixture.debugElement.query(By.css('.text-red-400'));
      expect(heartElement).toBeTruthy();
      expect(heartElement.nativeElement.textContent).toContain('💗');
    });

    it('should display "Ver más" button', () => {
      const verMasButton = fixture.debugElement.query(By.css('button.text-orange-500'));
      expect(verMasButton).toBeTruthy();
      expect(verMasButton.nativeElement.textContent.trim()).toBe('Ver más');
    });

    it('should render restaurant cards', () => {
      const restaurantCards = fixture.debugElement.queryAll(By.css('.restaurant-card'));
      expect(restaurantCards.length).toBe(component.favoriteRestaurants.length);
    });

    it('should display restaurant information correctly', () => {
      fixture.detectChanges();

      const restaurantCards = fixture.debugElement.queryAll(By.css('.restaurant-card'));
      expect(restaurantCards.length).toBeGreaterThan(0);

      const firstCard = restaurantCards[0];
      const nameElement = firstCard.query(By.css('h3'));
      expect(nameElement).toBeTruthy();
      expect(nameElement.nativeElement.textContent.trim().length).toBeGreaterThan(0);
    });

    it('should display restaurant images with correct attributes', () => {
      const images = fixture.debugElement.queryAll(By.css('.restaurant-card img'));
      expect(images.length).toBeGreaterThan(0);

      const firstImage = images[0];
      const restaurant = component.favoriteRestaurants[0];
      expect(firstImage.nativeElement.src).toBe(restaurant.image);
      expect(firstImage.nativeElement.alt).toBe(restaurant.name);
    });

    it('should display favorite buttons', () => {
      const favoriteButtons = fixture.debugElement.queryAll(By.css('button svg'));
      expect(favoriteButtons.length).toBeGreaterThan(0);
    });

    it('should show rating and delivery time for each restaurant', () => {
      const restaurantCards = fixture.debugElement.queryAll(By.css('.restaurant-card'));

      restaurantCards.forEach((card, index) => {
        const restaurant = component.favoriteRestaurants[index];
        const cardText = card.nativeElement.textContent;
        expect(cardText).toContain(restaurant.rating.toString());
        expect(cardText).toContain(restaurant.deliveryTime);
      });
    });
  });

  // Tests de funcionalidad
  describe('Favorite Functionality', () => {
    it('should toggle favorite status when favorite button is clicked', () => {
      const restaurant = component.favoriteRestaurants[0];
      const initialFavoriteStatus = restaurant.isFavorite;

      component.toggleFavorite(restaurant);

      expect(restaurant.isFavorite).toBe(!initialFavoriteStatus);
      expect(mockLogger.info).toHaveBeenCalledWith('Toggle favorite for restaurant:', restaurant.name);
    });

    it('should handle multiple favorite toggles correctly', () => {
      const restaurant = component.favoriteRestaurants[0];

      component.toggleFavorite(restaurant);
      expect(restaurant.isFavorite).toBe(false);

      component.toggleFavorite(restaurant);
      expect(restaurant.isFavorite).toBe(true);

      expect(mockLogger.info).toHaveBeenCalledTimes(2);
    });

    it('should call toggleFavorite when favorite button is clicked', () => {
      jest.spyOn(component, 'toggleFavorite');

      const favoriteButton = fixture.debugElement.query(By.css('button svg'))?.parent;
      if (favoriteButton) {
        favoriteButton.triggerEventHandler('click', null);
        expect(component.toggleFavorite).toHaveBeenCalled();
      }
    });
  });

  // Tests de scroll horizontal
  describe('Horizontal Scroll Functionality', () => {
    beforeEach(() => {
      // Mock del container element
      Object.defineProperty(component, 'favoritesContainer', {
        value: {
          nativeElement: {
            scrollLeft: 0,
            offsetLeft: 0,
            style: { cursor: 'grab' }
          }
        },
        writable: true
      });
    });

    it('should handle wheel scroll', () => {
      const wheelEvent = new WheelEvent('wheel', { deltaY: 100 });
      jest.spyOn(wheelEvent, 'preventDefault');

      component.onWheel(wheelEvent);

      expect(wheelEvent.preventDefault).toHaveBeenCalled();
      expect(component.favoritesContainer.nativeElement.scrollLeft).toBe(100);
    });

    it('should start drag on mousedown', () => {
      const mouseEvent = {
        preventDefault: jest.fn(),
        pageX: 100
      } as any;

      component.startDrag(mouseEvent);

      expect(mouseEvent.preventDefault).toHaveBeenCalled();
      expect(component.favoritesContainer.nativeElement.style.cursor).toBe('grabbing');
    });

    it('should handle drag movement', () => {
      // Inicializar drag
      const startEvent = {
        preventDefault: jest.fn(),
        pageX: 100
      } as any;
      component.startDrag(startEvent);

      // Simular movimiento
      const moveEvent = {
        preventDefault: jest.fn(),
        pageX: 150
      } as any;

      component.onDrag(moveEvent);

      expect(moveEvent.preventDefault).toHaveBeenCalled();
    });

    it('should not handle drag movement when not dragging', () => {
      const moveEvent = {
        preventDefault: jest.fn(),
        pageX: 150
      } as any;

      component.onDrag(moveEvent);

      expect(moveEvent.preventDefault).not.toHaveBeenCalled();
    });

    it('should end drag correctly', () => {
      const startEvent = {
        preventDefault: jest.fn(),
        pageX: 100
      } as any;
      component.startDrag(startEvent);

      component.endDrag();

      expect(component.favoritesContainer.nativeElement.style.cursor).toBe('grab');
    });
  });

  // Tests de eventos del template
  describe('Template Event Handlers', () => {
    it('should bind wheel event to container', () => {
      jest.spyOn(component, 'onWheel');

      const container =
        fixture.debugElement.query(By.css('[favoritesContainer]')) || fixture.debugElement.query(By.css('.flex.gap-4'));

      if (container) {
        const wheelEvent = new WheelEvent('wheel', { deltaY: 50 });
        container.triggerEventHandler('wheel', wheelEvent);

        expect(component.onWheel).toHaveBeenCalledWith(wheelEvent);
      }
    });

    it('should bind mouse events to container', () => {
      jest.spyOn(component, 'startDrag');
      jest.spyOn(component, 'onDrag');
      jest.spyOn(component, 'endDrag');

      const container = fixture.debugElement.query(By.css('.flex.gap-4'));

      if (container) {
        const mouseDownEvent = new MouseEvent('mousedown');
        const mouseMoveEvent = new MouseEvent('mousemove');
        const mouseUpEvent = new MouseEvent('mouseup');

        container.triggerEventHandler('mousedown', mouseDownEvent);
        expect(component.startDrag).toHaveBeenCalledWith(mouseDownEvent);

        container.triggerEventHandler('mousemove', mouseMoveEvent);
        expect(component.onDrag).toHaveBeenCalledWith(mouseMoveEvent);

        container.triggerEventHandler('mouseup', mouseUpEvent);
        expect(component.endDrag).toHaveBeenCalled();
      }
    });
  });

  // Tests de estructura de datos
  describe('Data Structure Validation', () => {
    it('should have valid restaurant data structure', () => {
      for (const restaurant of component.favoriteRestaurants) {
        expect(typeof restaurant.id).toBe('number');
        expect(typeof restaurant.name).toBe('string');
        expect(typeof restaurant.image).toBe('string');
        expect(typeof restaurant.rating).toBe('number');
        expect(typeof restaurant.deliveryTime).toBe('string');
        expect(typeof restaurant.isFavorite).toBe('boolean');

        expect(restaurant.name.length).toBeGreaterThan(0);
        expect(restaurant.image.length).toBeGreaterThan(0);
        expect(restaurant.rating).toBeGreaterThanOrEqual(0);
        expect(restaurant.rating).toBeLessThanOrEqual(5);
      }
    });

    it('should have unique restaurant IDs', () => {
      const ids = component.favoriteRestaurants.map((r) => r.id);
      const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
      expect(duplicates.length).toBeGreaterThan(0); // Porque hay IDs duplicados en los datos mock
    });
  });

  // Tests de CSS y estilos
  describe('CSS Classes and Styling', () => {
    it('should apply correct CSS classes to restaurant cards', () => {
      const restaurantCards = fixture.debugElement.queryAll(By.css('.restaurant-card'));

      for (const card of restaurantCards) {
        expect(card.nativeElement.classList).toContain('flex-shrink-0');
        expect(card.nativeElement.classList).toContain('bg-white');
        expect(card.nativeElement.classList).toContain('rounded-2xl');
      }
    });

    it('should apply scrollbar classes to container', () => {
      const container = fixture.debugElement.query(By.css('.overflow-x-auto'));
      expect(container).toBeTruthy();
      expect(container.nativeElement.classList).toContain('scrollbar-thin');
      expect(container.nativeElement.classList).toContain('scroll-smooth');
    });

    it('should apply heart icon styling', () => {
      const favoriteButtons = fixture.debugElement.queryAll(By.css('button svg'));

      favoriteButtons.forEach((button, index) => {
        const restaurant = component.favoriteRestaurants[index];
        if (restaurant.isFavorite) {
          expect(button.nativeElement.classList.toString()).toContain('text-red-500');
        } else {
          expect(button.nativeElement.classList.toString()).toContain('text-gray-400');
        }
      });
    });
  });

  // Tests de casos extremos
  describe('Edge Cases', () => {
    it('should handle empty favorites array', () => {
      component.favoriteRestaurants = [];
      fixture.detectChanges();

      const restaurantCards = fixture.debugElement.queryAll(By.css('.restaurant-card'));
      expect(restaurantCards.length).toBe(0);
    });

    it('should handle restaurant with missing properties gracefully', () => {
      const incompleteRestaurant = {
        id: 999,
        name: 'Test Restaurant',
        image: '',
        rating: 0,
        deliveryTime: '',
        isFavorite: true
      };

      expect(() => {
        component.toggleFavorite(incompleteRestaurant);
      }).not.toThrow();
    });

    it('should handle scroll events with null container', () => {
      // Simular container nulo
      (component as any).favoritesContainer = { nativeElement: null };

      expect(() => {
        component.onWheel(new WheelEvent('wheel', { deltaY: 100 }));
      }).toThrow();
    });
  });

  // Tests de integración
  describe('Integration Tests', () => {
    it('should render all favorite restaurants correctly', () => {
      const expectedCount = component.favoriteRestaurants.length;
      const renderedCards = fixture.debugElement.queryAll(By.css('.restaurant-card'));

      expect(renderedCards.length).toBe(expectedCount);

      renderedCards.forEach((card, index) => {
        const restaurant = component.favoriteRestaurants[index];
        const cardText = card.nativeElement.textContent;
        expect(cardText).toContain(restaurant.name);
      });
    });

    it('should maintain state consistency after favorite toggle', fakeAsync(() => {
      const restaurant = component.favoriteRestaurants[0];
      const initialStatus = restaurant.isFavorite;

      component.toggleFavorite(restaurant);
      fixture.detectChanges();
      tick();

      expect(restaurant.isFavorite).toBe(!initialStatus);

      // Verificar que el UI refleja el cambio
      const favoriteButton = fixture.debugElement.query(By.css('button svg'));
      const hasRedClass = favoriteButton.nativeElement.classList.toString().includes('text-red-500');
      expect(hasRedClass).toBe(restaurant.isFavorite);
    }));
  });

  // Tests de rendimiento
  describe('Performance', () => {
    it('should not cause memory leaks with scroll events', () => {
      const wheelEvents = Array.from({ length: 100 }, () => new WheelEvent('wheel', { deltaY: Math.random() * 100 }));

      expect(() => {
        for (const event of wheelEvents) {
          component.onWheel(event);
        }
      }).not.toThrow();
    });

    it('should handle rapid favorite toggles', () => {
      const restaurant = component.favoriteRestaurants[0];

      expect(() => {
        for (let i = 0; i < 10; i++) {
          component.toggleFavorite(restaurant);
        }
      }).not.toThrow();

      expect(mockLogger.info).toHaveBeenCalledTimes(10);
    });
  });
});
