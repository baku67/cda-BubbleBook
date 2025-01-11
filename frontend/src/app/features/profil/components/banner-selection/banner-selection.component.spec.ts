import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerSelectionComponent } from './banner-selection.component';

describe('BannerSelectionComponent', () => {
  let component: BannerSelectionComponent;
  let fixture: ComponentFixture<BannerSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BannerSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
