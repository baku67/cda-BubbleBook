import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherUserProfilComponent } from './other-user-profil.component';

describe('OtherUserProfilComponent', () => {
  let component: OtherUserProfilComponent;
  let fixture: ComponentFixture<OtherUserProfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtherUserProfilComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherUserProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
