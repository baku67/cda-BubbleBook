import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiveFormComponent } from './dive-form.component';

describe('DiveFormComponent', () => {
  let component: DiveFormComponent;
  let fixture: ComponentFixture<DiveFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiveFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiveFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
