import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivelogListPageComponent } from './divelog-list-page.component';

describe('DivelogListPageComponent', () => {
  let component: DivelogListPageComponent;
  let fixture: ComponentFixture<DivelogListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DivelogListPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DivelogListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
