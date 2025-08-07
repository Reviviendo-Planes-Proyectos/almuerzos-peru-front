import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerBasicInfoComponent } from './customer-basic-info.component';

describe('CustomerBasicInfoComponent', () => {
  let component: CustomerBasicInfoComponent;
  let fixture: ComponentFixture<CustomerBasicInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerBasicInfoComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerBasicInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
