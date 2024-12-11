import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FirstLogin2Component } from './first-login-2.component';
import { PageHeaderComponent } from '../../../../shared/ui-components/page-header/page-header.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('FirstLogin2Component', () => {
  let component: FirstLogin2Component;
  let fixture: ComponentFixture<FirstLogin2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        FirstLogin2Component,
      ],
      imports: [
        PageHeaderComponent,
        TranslateModule.forRoot(),
        RouterTestingModule,
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstLogin2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
