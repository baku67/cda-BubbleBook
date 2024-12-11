import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserProfilComponent } from './user-profil.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PageHeaderComponent } from '../../../../shared/ui-components/page-header/page-header.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

describe('UserProfilComponent', () => {
  let component: UserProfilComponent;
  let fixture: ComponentFixture<UserProfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        UserProfilComponent, 
      ],
      imports: [
        HttpClientTestingModule,
        PageHeaderComponent,
        TranslateModule.forRoot(),
        MatProgressSpinnerModule,
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
