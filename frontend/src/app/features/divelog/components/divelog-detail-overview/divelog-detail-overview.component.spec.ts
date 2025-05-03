import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivelogDetailOverviewComponent } from './divelog-detail-overview.component';

describe('DivelogDetailOverviewComponent', () => {
  let component: DivelogDetailOverviewComponent;
  let fixture: ComponentFixture<DivelogDetailOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DivelogDetailOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DivelogDetailOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
