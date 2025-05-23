import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendRequestMessageComponent } from './friend-request-message.component';

describe('FriendRequestMessageComponent', () => {
  let component: FriendRequestMessageComponent;
  let fixture: ComponentFixture<FriendRequestMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FriendRequestMessageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FriendRequestMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
