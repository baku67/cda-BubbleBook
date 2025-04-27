import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivelogDetailComponent } from './divelog-detail.component';

describe('DivelogDetailComponent', () => {
  let component: DivelogDetailComponent;
  let fixture: ComponentFixture<DivelogDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DivelogDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DivelogDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
