import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivelogPageComponent } from './divelog-page.component';

describe('DivelogPageComponent', () => {
  let component: DivelogPageComponent;
  let fixture: ComponentFixture<DivelogPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DivelogPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DivelogPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
