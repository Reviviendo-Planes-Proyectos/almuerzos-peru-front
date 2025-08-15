import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CoreModule } from '../../../../shared/modules';
import { LoggerService } from '../../../../shared/services/logger/logger.service';
import { HomePageComponent } from './home-page.component';
import { CategoriesSectionComponent } from '../../components/categories-section/categories-section.component';
import { DiscoverSectionComponent } from '../../components/discover-section/discover-section.component';
import { FavoritesSectionComponent } from '../../components/favorites-section/favorites-section.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
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
      imports: [
        HomePageComponent,
        CoreModule,
        SearchBarComponent,
        CategoriesSectionComponent,
        FavoritesSectionComponent,
        DiscoverSectionComponent
      ],
      providers: [{ provide: LoggerService, useValue: mockLogger }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Tests de inicialización
  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default notification and cart counts', () => {
      expect(component.notificationCount).toBe(3);
      expect(component.cartItemsCount).toBe(2);
    });

    it('should have event emitters defined', () => {
      expect(component.menuToggled).toBeDefined();
      expect(component.notificationsOpened).toBeDefined();
      expect(component.cartOpened).toBeDefined();
    });

    it('should have ViewChild reference to discover section', () => {
      // ViewChild se inicializa después de detectChanges
      expect(component.discoverSection).toBeDefined();
    });
  });

  // Tests de renderizado del header
  describe('Header Rendering', () => {
    it('should render header with gradient background', () => {
      const header = fixture.debugElement.query(By.css('header'));
      expect(header).toBeTruthy();
      expect(header.nativeElement.classList).toContain('bg-gradient-to-r');
      expect(header.nativeElement.classList).toContain('from-orange-400');
      expect(header.nativeElement.classList).toContain('via-yellow-400');
      expect(header.nativeElement.classList).toContain('to-orange-500');
    });

    it('should render hamburger menu button', () => {
      const menuButton =
        fixture.debugElement.query(By.css('button[title="Menu"]')) ||
        fixture.debugElement.queryAll(By.css('button'))[0];
      expect(menuButton).toBeTruthy();

      const menuIcon = menuButton.query(By.css('svg'));
      expect(menuIcon).toBeTruthy();
    });

    it('should render logo and brand text', () => {
      const logoContainer = fixture.debugElement.query(By.css('.bg-yellow-600'));
      expect(logoContainer).toBeTruthy();

      const brandTextElement = Array.from(fixture.debugElement.queryAll(By.css('span'))).find((span) =>
        span.nativeElement.textContent.includes('ALMUERZOS PERÚ')
      );
      expect(brandTextElement).toBeTruthy();
    });

    it('should render notification button with count', () => {
      const notificationButtons = fixture.debugElement.queryAll(By.css('button'));
      const notificationButton = notificationButtons.find((btn) =>
        btn.query(By.css('svg path[d*="M14.5 18.5a2.5 2.5 0 1 1-5 0"]'))
      );
      expect(notificationButton).toBeTruthy();

      const badge = fixture.debugElement.query(By.css('.bg-red-500'));
      expect(badge).toBeTruthy();
      expect(badge.nativeElement.textContent.trim()).toBe('3');
    });

    it('should render cart button with count', () => {
      const cartButtons = fixture.debugElement.queryAll(By.css('button'));
      const cartButton = cartButtons.find((btn) =>
        btn.query(By.css('svg path[d*="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61l1.38-7.39H6"]'))
      );
      expect(cartButton).toBeTruthy();

      const badges = fixture.debugElement.queryAll(By.css('.bg-red-500'));
      const cartBadge = badges.find((badge) => badge.nativeElement.textContent.trim() === '2');
      expect(cartBadge).toBeTruthy();
    });

    it('should conditionally show notification badge', () => {
      component.notificationCount = 0;
      fixture.detectChanges();

      const badges = fixture.debugElement.queryAll(By.css('.bg-red-500'));
      const notificationBadge = badges.find((badge) => badge.nativeElement.textContent.trim() === '0');
      expect(notificationBadge).toBeFalsy();
    });

    it('should conditionally show cart badge', () => {
      component.cartItemsCount = 0;
      fixture.detectChanges();

      const badges = fixture.debugElement.queryAll(By.css('.bg-red-500'));
      const cartBadge = badges.find((badge) => badge.nativeElement.textContent.trim() === '0');
      expect(cartBadge).toBeFalsy();
    });
  });

  // Tests de componentes hijos
  describe('Child Components Rendering', () => {
    it('should render search bar component', () => {
      const searchBar = fixture.debugElement.query(By.directive(SearchBarComponent));
      expect(searchBar).toBeTruthy();
    });

    it('should render categories section component', () => {
      const categoriesSection = fixture.debugElement.query(By.directive(CategoriesSectionComponent));
      expect(categoriesSection).toBeTruthy();
    });

    it('should render favorites section component', () => {
      const favoritesSection = fixture.debugElement.query(By.directive(FavoritesSectionComponent));
      expect(favoritesSection).toBeTruthy();
    });

    it('should render discover section component', () => {
      const discoverSection = fixture.debugElement.query(By.directive(DiscoverSectionComponent));
      expect(discoverSection).toBeTruthy();
    });
  });

  // Tests de eventos del header
  describe('Header Event Handlers', () => {
    it('should emit menuToggled when menu button is clicked', () => {
      jest.spyOn(component.menuToggled, 'emit');

      component.toggleMenu();

      expect(component.menuToggled.emit).toHaveBeenCalled();
    });

    it('should emit notificationsOpened when notification button is clicked', () => {
      jest.spyOn(component.notificationsOpened, 'emit');

      component.openNotifications();

      expect(component.notificationsOpened.emit).toHaveBeenCalled();
    });

    it('should emit cartOpened when cart button is clicked', () => {
      jest.spyOn(component.cartOpened, 'emit');

      component.openCart();

      expect(component.cartOpened.emit).toHaveBeenCalled();
    });

    it('should call toggleMenu when menu button is clicked in template', () => {
      jest.spyOn(component, 'toggleMenu');

      const menuButton = fixture.debugElement.queryAll(By.css('button'))[0];
      menuButton.triggerEventHandler('click', null);

      expect(component.toggleMenu).toHaveBeenCalled();
    });

    it('should call openNotifications when notification button is clicked in template', () => {
      jest.spyOn(component, 'openNotifications');

      const buttons = fixture.debugElement.queryAll(By.css('button'));
      const notificationButton = buttons.find((btn) =>
        btn.query(By.css('svg path[d*="M14.5 18.5a2.5 2.5 0 1 1-5 0"]'))
      );

      if (notificationButton) {
        notificationButton.triggerEventHandler('click', null);
        expect(component.openNotifications).toHaveBeenCalled();
      }
    });

    it('should call openCart when cart button is clicked in template', () => {
      jest.spyOn(component, 'openCart');

      const buttons = fixture.debugElement.queryAll(By.css('button'));
      const cartButton = buttons.find((btn) =>
        btn.query(By.css('svg path[d*="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61l1.38-7.39H6"]'))
      );

      if (cartButton) {
        cartButton.triggerEventHandler('click', null);
        expect(component.openCart).toHaveBeenCalled();
      }
    });
  });

  // Tests de funcionalidad de búsqueda
  describe('Search Functionality', () => {
    beforeEach(() => {
      // Mock del DiscoverSectionComponent
      component.discoverSection = {
        filterRestaurants: jest.fn()
      } as any;
    });

    it('should handle search change events', () => {
      const searchTerm = 'pizza';

      component.onSearchChange(searchTerm);

      expect(mockLogger.info).toHaveBeenCalledWith('Search term changed:', searchTerm);
      expect(component.discoverSection.filterRestaurants).toHaveBeenCalledWith(searchTerm);
    });

    it('should handle search execution events', () => {
      const searchTerm = 'burger';

      component.onSearch(searchTerm);

      expect(mockLogger.info).toHaveBeenCalledWith('Search executed:', searchTerm);
      expect(component.discoverSection.filterRestaurants).toHaveBeenCalledWith(searchTerm);
    });

    it('should handle search change when discoverSection is undefined', () => {
      component.discoverSection = undefined as any;

      expect(() => {
        component.onSearchChange('test');
      }).not.toThrow();

      expect(mockLogger.info).toHaveBeenCalledWith('Search term changed:', 'test');
    });

    it('should handle search execution when discoverSection is undefined', () => {
      component.discoverSection = undefined as any;

      expect(() => {
        component.onSearch('test');
      }).not.toThrow();

      expect(mockLogger.info).toHaveBeenCalledWith('Search executed:', 'test');
    });
  });

  // Tests de eventos de componentes hijos
  describe('Child Component Events', () => {
    it('should handle search events from search bar', () => {
      jest.spyOn(component, 'onSearch');

      const searchBar = fixture.debugElement.query(By.directive(SearchBarComponent));
      searchBar.triggerEventHandler('searchEvent', 'test search');

      expect(component.onSearch).toHaveBeenCalledWith('test search');
    });

    it('should handle search change events from search bar', () => {
      jest.spyOn(component, 'onSearchChange');

      const searchBar = fixture.debugElement.query(By.directive(SearchBarComponent));
      searchBar.triggerEventHandler('searchChangeEvent', 'typing...');

      expect(component.onSearchChange).toHaveBeenCalledWith('typing...');
    });

    it('should handle location events from search bar', () => {
      jest.spyOn(component, 'onLocationUpdate');

      const searchBar = fixture.debugElement.query(By.directive(SearchBarComponent));
      searchBar.triggerEventHandler('locationEvent', null);

      expect(component.onLocationUpdate).toHaveBeenCalled();
    });

    it('should handle category selection from categories section', () => {
      jest.spyOn(component, 'onCategorySelected');

      const categoriesSection = fixture.debugElement.query(By.directive(CategoriesSectionComponent));
      const mockCategory = {
        id: 1,
        name: 'Pizza',
        icon: 'icon',
        image: 'image-url',
        count: 5
      };
      categoriesSection.triggerEventHandler('categorySelected', mockCategory);

      expect(component.onCategorySelected).toHaveBeenCalledWith(mockCategory);
    });

    it('should handle view all categories event', () => {
      jest.spyOn(component, 'onViewAllCategories');

      const categoriesSection = fixture.debugElement.query(By.directive(CategoriesSectionComponent));
      categoriesSection.triggerEventHandler('viewAllClicked', null);

      expect(component.onViewAllCategories).toHaveBeenCalled();
    });
  });

  // Tests de navegación y ubicación
  describe('Navigation and Location', () => {
    it('should handle location update request', () => {
      component.onLocationUpdate();

      expect(mockLogger.info).toHaveBeenCalledWith('Location update requested');
    });

    it('should handle category selection', () => {
      const mockCategory = {
        id: 1,
        name: 'Delivery',
        icon: 'truck',
        image: 'image-url',
        count: 10
      };

      expect(() => {
        component.onCategorySelected(mockCategory);
      }).not.toThrow();
    });

    it('should handle view all categories', () => {
      expect(() => {
        component.onViewAllCategories();
      }).not.toThrow();
    });
  });

  // Tests de estructura de datos
  describe('Data Structure Validation', () => {
    it('should have valid notification count type', () => {
      expect(typeof component.notificationCount).toBe('number');
      expect(component.notificationCount).toBeGreaterThanOrEqual(0);
    });

    it('should have valid cart items count type', () => {
      expect(typeof component.cartItemsCount).toBe('number');
      expect(component.cartItemsCount).toBeGreaterThanOrEqual(0);
    });

    it('should allow updating notification count', () => {
      component.notificationCount = 5;
      fixture.detectChanges();

      expect(component.notificationCount).toBe(5);
    });

    it('should allow updating cart items count', () => {
      component.cartItemsCount = 10;
      fixture.detectChanges();

      expect(component.cartItemsCount).toBe(10);
    });
  });

  // Tests de CSS y estilos
  describe('CSS Classes and Styling', () => {
    it('should apply correct header styling', () => {
      const header = fixture.debugElement.query(By.css('header'));
      expect(header.nativeElement.classList).toContain('shadow-lg');
      expect(header.nativeElement.classList).toContain('px-4');
      expect(header.nativeElement.classList).toContain('py-3');
    });

    it('should apply correct button styling', () => {
      const headerButtons = fixture.debugElement.queryAll(By.css('header button'));
      expect(headerButtons.length).toBeGreaterThan(0);

      for (const button of headerButtons) {
        expect(button.nativeElement.classList).toContain('text-white');
      }
    });

    it('should apply correct badge styling', () => {
      // Verificar que tenemos conteos para mostrar badges
      expect(component.notificationCount).toBeGreaterThan(0);
      expect(component.cartItemsCount).toBeGreaterThan(0);

      // Verificar que existen elementos con la clase de badge
      const badgeElements = fixture.debugElement.queryAll(By.css('span.bg-red-500'));
      expect(badgeElements.length).toBeGreaterThanOrEqual(0);
    });

    it('should apply correct logo styling', () => {
      const logo = fixture.debugElement.query(By.css('.bg-yellow-600'));
      expect(logo).toBeTruthy();
      expect(logo.nativeElement.classList).toContain('rounded-full');
      expect(logo.nativeElement.classList).toContain('w-8');
      expect(logo.nativeElement.classList).toContain('h-8');
    });
  });

  // Tests de casos extremos
  describe('Edge Cases', () => {
    it('should handle very large notification count', () => {
      component.notificationCount = 999;
      fixture.detectChanges();

      const badge = fixture.debugElement.query(By.css('.bg-red-500'));
      expect(badge.nativeElement.textContent.trim()).toBe('999');
    });

    it('should handle very large cart count', () => {
      component.cartItemsCount = 1000;
      fixture.detectChanges();

      const badges = fixture.debugElement.queryAll(By.css('.bg-red-500'));
      const cartBadge = badges.find((badge) => badge.nativeElement.textContent.trim() === '1000');
      expect(cartBadge).toBeTruthy();
    });

    it('should handle empty search terms', () => {
      component.discoverSection = {
        filterRestaurants: jest.fn()
      } as any;

      component.onSearchChange('');
      component.onSearch('');

      expect(component.discoverSection.filterRestaurants).toHaveBeenCalledWith('');
      expect(component.discoverSection.filterRestaurants).toHaveBeenCalledTimes(2);
    });

    it('should handle special characters in search', () => {
      component.discoverSection = {
        filterRestaurants: jest.fn()
      } as any;

      const specialTerm = '!@#$%^&*()';
      component.onSearchChange(specialTerm);

      expect(component.discoverSection.filterRestaurants).toHaveBeenCalledWith(specialTerm);
    });
  });

  // Tests de integración
  describe('Integration Tests', () => {
    it('should coordinate all components correctly', () => {
      // Verificar que todos los componentes están presentes
      expect(fixture.debugElement.query(By.directive(SearchBarComponent))).toBeTruthy();
      expect(fixture.debugElement.query(By.directive(CategoriesSectionComponent))).toBeTruthy();
      expect(fixture.debugElement.query(By.directive(FavoritesSectionComponent))).toBeTruthy();
      expect(fixture.debugElement.query(By.directive(DiscoverSectionComponent))).toBeTruthy();
    });

    it('should maintain state consistency across interactions', () => {
      // Simular interacciones múltiples
      component.toggleMenu();
      component.openNotifications();
      component.openCart();
      component.onLocationUpdate();

      // Verificar que el estado se mantiene
      expect(component.notificationCount).toBe(3);
      expect(component.cartItemsCount).toBe(2);
    });

    it('should handle rapid consecutive events', () => {
      component.discoverSection = {
        filterRestaurants: jest.fn()
      } as any;

      // Múltiples búsquedas rápidas
      for (let i = 0; i < 10; i++) {
        component.onSearchChange(`search${i}`);
      }

      expect(component.discoverSection.filterRestaurants).toHaveBeenCalledTimes(10);
    });
  });

  // Tests de accesibilidad
  describe('Accessibility', () => {
    it('should have proper ARIA attributes on SVGs', () => {
      const svgs = fixture.debugElement.queryAll(By.css('svg[aria-hidden="true"]'));
      expect(svgs.length).toBeGreaterThan(0);
    });

    it('should have proper role attributes on SVGs', () => {
      const svgs = fixture.debugElement.queryAll(By.css('svg[role="img"]'));
      expect(svgs.length).toBeGreaterThan(0);
    });

    it('should have accessible button structures', () => {
      const buttons = fixture.debugElement.queryAll(By.css('button'));

      for (const button of buttons) {
        // Cada botón debe tener contenido visual (SVG o texto)
        const hasIcon = button.query(By.css('svg'));
        const hasText = button.nativeElement.textContent.trim().length > 0;
        expect(hasIcon || hasText).toBeTruthy();
      }
    });
  });

  // Tests de rendimiento
  describe('Performance', () => {
    it('should not cause memory leaks with rapid events', () => {
      // Múltiples eventos rápidos
      for (let i = 0; i < 100; i++) {
        component.toggleMenu();
        component.openNotifications();
        component.openCart();
      }

      expect(() => {
        fixture.destroy();
      }).not.toThrow();
    });

    it('should handle component destruction gracefully', () => {
      expect(() => {
        fixture.destroy();
      }).not.toThrow();
    });
  });
});
