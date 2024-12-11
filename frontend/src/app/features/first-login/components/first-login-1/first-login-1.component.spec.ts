import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FirstLogin1Component } from './first-login-1.component';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PageHeaderComponent } from '../../../../shared/ui-components/page-header/page-header.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('FirstLogin1Component', () => {
  let component: FirstLogin1Component;
  let fixture: ComponentFixture<FirstLogin1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        FirstLogin1Component,
      ],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        PageHeaderComponent,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        RouterTestingModule,
        BrowserAnimationsModule,
      ],

    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstLogin1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
