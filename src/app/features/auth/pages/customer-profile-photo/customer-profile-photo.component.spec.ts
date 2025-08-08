import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerProfilePhotoComponent } from './customer-profile-photo.component';

describe('CustomerProfilePhotoComponent', () => {
  let component: CustomerProfilePhotoComponent;
  let fixture: ComponentFixture<CustomerProfilePhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerProfilePhotoComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerProfilePhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
