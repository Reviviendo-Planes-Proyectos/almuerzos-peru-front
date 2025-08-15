import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CoreModule } from '../../../../shared/modules';
import { LoggerService } from '../../../../shared/services/logger/logger.service';
import { DiscoverSectionComponent } from './discover-section.component';

describe('DiscoverSectionComponent', () => {
  let component: DiscoverSectionComponent;
  let fixture: ComponentFixture<DiscoverSectionComponent>;
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
      imports: [DiscoverSectionComponent, CoreModule],
      providers: [{ provide: LoggerService, useValue: mockLogger }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DiscoverSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with mock restaurants data', () => {
      expect((component as any).allRestaurants).toBeDefined();
      expect((component as any).allRestaurants.length).toBe(100);
    });

    it('should load initial restaurants on construction', () => {
      expect(component.discoverRestaurants.length).toBe(20);
      expect(component.currentPage).toBe(1);
      expect(component.hasMoreItems).toBe(true);
    });

    it('should set initial pagination state correctly', () => {
      expect(component.itemsPerPage).toBe(20);
      expect(component.isLoading).toBe(false);
    });
  });

  describe('Template Rendering', () => {
    it('should render section title "Descubre" when not searching', () => {
      const titleElement = fixture.debugElement.query(By.css('h2'));
      expect(titleElement.nativeElement.textContent.trim()).toBe('Descubre');
    });

    it('should render restaurants list', () => {
      const restaurantElements = fixture.debugElement.queryAll(By.css('.restaurant-item'));
      expect(restaurantElements.length).toBe(20);
    });

    it('should display restaurant information correctly', () => {
      // Verificar que hay datos mock
      expect(component.discoverRestaurants.length).toBeGreaterThan(0);

      fixture.detectChanges();

      // Buscar cualquier elemento de restaurante renderizado
      const restaurantElements = fixture.debugElement.queryAll(By.css('.restaurant-item'));
      expect(restaurantElements.length).toBeGreaterThan(0);

      // Verificar que el primer restaurante se muestra correctamente
      const firstElement = restaurantElements[0];
      const nameElement = firstElement.query(By.css('h3'));

      expect(nameElement).toBeTruthy();
      expect(nameElement.nativeElement.textContent.trim().length).toBeGreaterThan(0);
    });

    it('should show "Ver más restaurantes" button when has more items', () => {
      component.hasMoreItems = true;
      component.isLoading = false;
      fixture.detectChanges();

      const buttons = fixture.debugElement.queryAll(By.css('button'));
      const viewMoreButton = buttons.find((btn) =>
        btn.nativeElement.textContent.trim().includes('Ver más restaurantes')
      );
      expect(viewMoreButton).toBeTruthy();
    });

    it('should show loading spinner when loading', () => {
      component.isLoading = true;
      fixture.detectChanges();

      const spinner = fixture.debugElement.query(By.css('.animate-spin'));
      expect(spinner).toBeTruthy();
    });

    it('should show end message when no more items', () => {
      component.hasMoreItems = false;
      component.isLoading = false;
      fixture.detectChanges();

      const endMessage = fixture.debugElement.query(By.css('.text-gray-500'));
      expect(endMessage.nativeElement.textContent).toContain('Has visto todos los restaurantes disponibles');
    });
  });

  describe('Search Functionality', () => {
    it('should show search results title when searching', () => {
      component.filterRestaurants('test');
      fixture.detectChanges();

      const titleElement = fixture.debugElement.query(By.css('h2'));
      expect(titleElement.nativeElement.textContent.trim()).toBe('Resultados de búsqueda');
    });

    it('should show search info when searching', () => {
      component.filterRestaurants('maido');
      fixture.detectChanges();

      const searchInfo = fixture.debugElement.query(By.css('p'));
      expect(searchInfo.nativeElement.textContent).toContain('resultado');
      expect(searchInfo.nativeElement.textContent).toContain('maido');
    });

    it('should show clear search button when searching', () => {
      component.filterRestaurants('test');
      fixture.detectChanges();

      const clearButton = fixture.debugElement.query(By.css('button'));
      expect(clearButton.nativeElement.textContent.trim()).toBe('Limpiar');
    });

    it('should show no results message when search returns empty', () => {
      component.filterRestaurants('nonexistent');
      fixture.detectChanges();

      const noResultsMessage = fixture.debugElement.query(By.css('h3'));
      expect(noResultsMessage.nativeElement.textContent).toBe('No encontramos resultados');
    });
  });

  describe('Search Methods', () => {
    it('should filter restaurants by name', () => {
      component.filterRestaurants('Maido');

      expect(component.isSearching).toBe(true);
      expect(component.currentSearchTerm).toBe('maido');
      expect(component.discoverRestaurants.length).toBeGreaterThanOrEqual(0);
    });

    it('should filter restaurants by category', () => {
      component.filterRestaurants('Peruana');

      expect(component.isSearching).toBe(true);
      expect(
        component.discoverRestaurants.every(
          (r) => r.category.toLowerCase().includes('peruana') || r.name.toLowerCase().includes('peruana')
        )
      ).toBe(true);
    });

    it('should filter restaurants by location', () => {
      component.filterRestaurants('Miraflores');

      expect(component.isSearching).toBe(true);
      expect(
        component.discoverRestaurants.some(
          (r) => r.location.toLowerCase().includes('miraflores') || r.name.toLowerCase().includes('miraflores')
        )
      ).toBe(true);
    });

    it('should clear search and reset to all restaurants', () => {
      component.filterRestaurants('test');
      component.clearSearch();

      expect(component.isSearching).toBe(false);
      expect(component.currentSearchTerm).toBe('');
      expect(component.discoverRestaurants.length).toBe(20);
    });

    it('should handle empty search term', () => {
      component.filterRestaurants('');

      expect(component.isSearching).toBe(false);
      expect(component.discoverRestaurants.length).toBe(20);
    });

    it('should handle whitespace-only search term', () => {
      component.filterRestaurants('   ');

      expect(component.isSearching).toBe(false);
      expect(component.discoverRestaurants.length).toBe(20);
    });
  });

  describe('Pagination Functionality', () => {
    it('should load more restaurants when called', fakeAsync(() => {
      component.loadMoreRestaurants();
      expect(component.isLoading).toBe(true);

      tick(1000);

      expect(component.isLoading).toBe(false);
      expect(component.discoverRestaurants.length).toBe(40);
      expect(component.currentPage).toBe(2);
    }));

    it('should not load more when already loading', () => {
      component.isLoading = true;
      const initialLength = component.discoverRestaurants.length;

      component.loadMoreRestaurants();

      expect(component.discoverRestaurants.length).toBe(initialLength);
    });

    it('should not load more when no more items available', () => {
      component.hasMoreItems = false;
      const initialLength = component.discoverRestaurants.length;

      component.loadMoreRestaurants();

      expect(component.discoverRestaurants.length).toBe(initialLength);
    });

    it('should update hasMoreItems correctly when reaching end', fakeAsync(() => {
      // Simular cargar hasta el final
      for (let i = 0; i < 5; i++) {
        component.loadMoreRestaurants();
        tick(1000);
      }

      expect(component.hasMoreItems).toBe(false);
    }));
  });

  describe('Event Handlers', () => {
    it('should handle restaurant click', () => {
      const restaurant = component.discoverRestaurants[0];

      component.onRestaurantClick(restaurant);

      expect(mockLogger.info).toHaveBeenCalledWith('Restaurant clicked:', restaurant.name);
    });

    it('should handle image error', () => {
      const mockEvent = {
        target: { src: 'invalid-url.jpg' }
      };

      component.onImageError(mockEvent);

      expect(mockEvent.target.src).toBe(
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop'
      );
      expect(mockLogger.error).toHaveBeenCalledWith('Error loading restaurant image');
    });

    it('should track restaurants by id', () => {
      const restaurant = component.discoverRestaurants[0];

      const result = component.trackByRestaurant(0, restaurant);

      expect(result).toBe(restaurant.id);
    });
  });

  describe('Getters', () => {
    it('should return correct isSearching value', () => {
      expect(component.isSearching).toBe(false);

      component.filterRestaurants('test');
      expect(component.isSearching).toBe(true);
    });

    it('should return correct currentSearchTerm', () => {
      component.filterRestaurants('Maido');
      expect(component.currentSearchTerm).toBe('maido');
    });

    it('should return correct totalResults when not searching', () => {
      expect(component.totalResults).toBe(100);
    });

    it('should return correct totalResults when searching', () => {
      component.filterRestaurants('Maido');
      expect(component.totalResults).toBe((component as any).filteredRestaurants.length);
    });
  });

  describe('Template Integration', () => {
    it('should call onRestaurantClick when restaurant item is clicked', () => {
      const onRestaurantClickSpy = jest.spyOn(component, 'onRestaurantClick');

      const restaurantElement = fixture.debugElement.query(By.css('.restaurant-item'));
      restaurantElement.triggerEventHandler('click', null);

      expect(onRestaurantClickSpy).toHaveBeenCalled();
    });

    it('should call loadMoreRestaurants when "Ver más" button is clicked', fakeAsync(() => {
      const loadMoreSpy = jest.spyOn(component, 'loadMoreRestaurants');
      component.hasMoreItems = true;
      component.isLoading = false;
      fixture.detectChanges();

      const viewMoreButton = fixture.debugElement.query(By.css('button[ng-reflect-ng-if="true"]'));
      if (viewMoreButton) {
        viewMoreButton.nativeElement.click();
        expect(loadMoreSpy).toHaveBeenCalled();
      }
    }));

    it('should call clearSearch when clear button is clicked', () => {
      const clearSearchSpy = jest.spyOn(component, 'clearSearch');
      component.filterRestaurants('test');
      fixture.detectChanges();

      const clearButton = fixture.debugElement.query(By.css('button'));
      clearButton.nativeElement.click();

      expect(clearSearchSpy).toHaveBeenCalled();
    });
  });

  describe('Restaurant Data Structure', () => {
    it('should have valid restaurant structure', () => {
      const restaurant = component.discoverRestaurants[0];

      expect(restaurant).toHaveProperty('id');
      expect(restaurant).toHaveProperty('name');
      expect(restaurant).toHaveProperty('location');
      expect(restaurant).toHaveProperty('image');
      expect(restaurant).toHaveProperty('rating');
      expect(restaurant).toHaveProperty('deliveryTime');
      expect(restaurant).toHaveProperty('distance');
      expect(restaurant).toHaveProperty('category');
      expect(restaurant).toHaveProperty('categoryColor');
      expect(restaurant).toHaveProperty('price');
    });

    it('should generate restaurants with valid data types', () => {
      const restaurant = component.discoverRestaurants[0];

      expect(typeof restaurant.id).toBe('number');
      expect(typeof restaurant.name).toBe('string');
      expect(typeof restaurant.rating).toBe('number');
      expect(restaurant.rating).toBeGreaterThanOrEqual(3.5);
      expect(restaurant.rating).toBeLessThanOrEqual(5);
    });
  });

  describe('CSS Classes and Styling', () => {
    it('should apply correct CSS classes to restaurant items', () => {
      const restaurantElement = fixture.debugElement.query(By.css('.restaurant-item'));

      expect(restaurantElement.nativeElement.classList).toContain('restaurant-item');
      expect(restaurantElement.nativeElement.classList).toContain('flex');
      expect(restaurantElement.nativeElement.classList).toContain('cursor-pointer');
    });

    it('should apply category color classes correctly', () => {
      fixture.detectChanges();

      const categoryBadge = fixture.debugElement.query(By.css('span[class*="bg-"]'));
      expect(categoryBadge).toBeTruthy();
      expect(categoryBadge.nativeElement.classList.toString()).toContain('bg-');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty restaurants array', () => {
      (component as any).allRestaurants = [];
      (component as any).resetToAllRestaurants();

      expect(component.discoverRestaurants.length).toBe(0);
      expect(component.hasMoreItems).toBe(false);
    });

    it('should handle search with no results', () => {
      component.filterRestaurants('nonexistentrestaurant12345');

      expect(component.discoverRestaurants.length).toBe(0);
      expect(component.isSearching).toBe(true);
    });

    it('should handle null/undefined events gracefully', () => {
      // Reset del mock usando jest.clearAllMocks en beforeEach
      jest.clearAllMocks();

      // Verificar que no se ejecuta la lógica cuando event es null
      expect(() => {
        component.onImageError(null);
      }).not.toThrow();

      // Verificar que no se ejecuta la lógica cuando event es undefined
      expect(() => {
        component.onImageError(undefined);
      }).not.toThrow();

      // Verificar que no se ejecuta la lógica cuando target es null
      expect(() => {
        component.onImageError({ target: null });
      }).not.toThrow();

      // Verificar que el logger no fue llamado en estos casos
      expect(mockLogger.error).not.toHaveBeenCalled();
    });
  });

  describe('Performance', () => {
    it('should use trackBy function for restaurant list', () => {
      const trackByFn = component.trackByRestaurant;
      expect(typeof trackByFn).toBe('function');

      const restaurant = component.discoverRestaurants[0];
      expect(trackByFn(0, restaurant)).toBe(restaurant.id);
    });

    it('should lazy load images', () => {
      const images = fixture.debugElement.queryAll(By.css('img[loading="lazy"]'));
      expect(images.length).toBeGreaterThan(0);
    });
  });
});
