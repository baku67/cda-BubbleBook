import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivelogListComponent } from './divelog-list.component';

describe('DivelogListComponent', () => {
  let component: DivelogListComponent;
  let fixture: ComponentFixture<DivelogListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DivelogListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DivelogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
