import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmEmailComponent } from './confirm-email.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PageHeaderComponent } from '../../../../shared/ui-components/page-header/page-header.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

describe('ConfirmEmailComponent', () => {
  let component: ConfirmEmailComponent;
  let fixture: ComponentFixture<ConfirmEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ConfirmEmailComponent,
      ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        PageHeaderComponent,
        TranslateModule.forRoot(),
        MatProgressSpinnerModule,
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
