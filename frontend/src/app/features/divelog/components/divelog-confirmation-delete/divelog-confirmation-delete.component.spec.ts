import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivelogConfirmationDeleteComponent } from './divelog-confirmation-delete.component';

describe('DivelogConfirmationDeleteComponent', () => {
  let component: DivelogConfirmationDeleteComponent;
  let fixture: ComponentFixture<DivelogConfirmationDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DivelogConfirmationDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DivelogConfirmationDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
