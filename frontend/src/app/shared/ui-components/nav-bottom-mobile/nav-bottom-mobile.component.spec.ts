import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavBottomMobileComponent } from './nav-bottom-mobile.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('NavBottomMobileComponent', () => {
  let component: NavBottomMobileComponent;
  let fixture: ComponentFixture<NavBottomMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NavBottomMobileComponent,
        HttpClientTestingModule,
        RouterTestingModule,
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavBottomMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
