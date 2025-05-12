import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteAccountComponent } from './confirm-delete-account.component';

describe('ConfirmDeleteAccountComponent', () => {
  let component: ConfirmDeleteAccountComponent;
  let fixture: ComponentFixture<ConfirmDeleteAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDeleteAccountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmDeleteAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
