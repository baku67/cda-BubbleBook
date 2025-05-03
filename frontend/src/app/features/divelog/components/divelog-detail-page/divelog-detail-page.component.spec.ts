import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivelogDetailPageComponent } from './divelog-detail-page.component';

describe('DivelogDetailPageComponent', () => {
  let component: DivelogDetailPageComponent;
  let fixture: ComponentFixture<DivelogDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DivelogDetailPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DivelogDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
