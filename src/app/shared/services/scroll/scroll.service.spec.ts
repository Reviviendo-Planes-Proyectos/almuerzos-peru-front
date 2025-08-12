import { ViewportScroller } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ScrollService } from './scroll.service';

describe('ScrollService', () => {
  let service: ScrollService;
  let mockRouter: any;
  let mockViewportScroller: any;
  let eventsSubject: Subject<any>;

  beforeEach(() => {
    eventsSubject = new Subject();

    mockRouter = {
      events: eventsSubject.asObservable()
    };

    mockViewportScroller = {
      scrollToPosition: jest.fn(),
      scrollToAnchor: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        ScrollService,
        { provide: Router, useValue: mockRouter },
        { provide: ViewportScroller, useValue: mockViewportScroller }
      ]
    });

    service = TestBed.inject(ScrollService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should scroll to top on navigation end', () => {
    const navigationEnd = new NavigationEnd(1, '/test', '/test');

    eventsSubject.next(navigationEnd);

    expect(mockViewportScroller.scrollToPosition).toHaveBeenCalledWith([0, 0]);
  });

  it('should scroll to top when scrollToTop is called', () => {
    service.scrollToTop();

    expect(mockViewportScroller.scrollToPosition).toHaveBeenCalledWith([0, 0]);
  });

  it('should scroll to element when scrollToElement is called', () => {
    const elementId = 'test-element';

    service.scrollToElement(elementId);

    expect(mockViewportScroller.scrollToAnchor).toHaveBeenCalledWith(elementId);
  });

  it('should not scroll on non-NavigationEnd events', () => {
    mockViewportScroller.scrollToPosition.mockClear();

    eventsSubject.next({ type: 'NavigationStart' });

    expect(mockViewportScroller.scrollToPosition).not.toHaveBeenCalled();
  });
});
