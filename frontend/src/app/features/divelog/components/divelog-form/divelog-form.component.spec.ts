import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivelogFormComponent } from './divelog-form.component';

describe('DivelogFormComponent', () => {
  let component: DivelogFormComponent;
  let fixture: ComponentFixture<DivelogFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DivelogFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DivelogFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
