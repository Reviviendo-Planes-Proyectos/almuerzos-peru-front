import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule } from '../../../../../../shared/modules';
import { I18N_TEST_PROVIDERS } from '../../../../../../testing/pwa-mocks';
import { PricingSectionComponent } from './pricing-section.component';

describe('PricingSectionComponent', () => {
  let component: PricingSectionComponent;
  let fixture: ComponentFixture<PricingSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PricingSectionComponent, CoreModule],
      providers: [...I18N_TEST_PROVIDERS, { provide: PLATFORM_ID, useValue: 'browser' }]
    }).compileComponents();

    fixture = TestBed.createComponent(PricingSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render pricing section', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('section#precios')).toBeTruthy();
  });
});
