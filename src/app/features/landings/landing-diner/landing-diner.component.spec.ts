import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { LandingDinerComponent } from './landing-diner.component';

describe('LandingDinerComponent', () => {
  let component: LandingDinerComponent;
  let fixture: ComponentFixture<LandingDinerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingDinerComponent, BrowserAnimationsModule],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(LandingDinerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
