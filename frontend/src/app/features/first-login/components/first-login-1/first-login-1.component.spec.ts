import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FirstLogin1Component } from './first-login-1.component';
import { FirstLoginService } from '../../services/first-login.service';
import { UserService } from '../../../profil/services/user.service';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PageHeaderComponent } from '../../../../shared/ui-components/page-header/page-header.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('FirstLogin1Component', () => {
  let component: FirstLogin1Component;
  let fixture: ComponentFixture<FirstLogin1Component>;
  let firstLoginServiceSpy: jasmine.SpyObj<FirstLoginService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const firstLoginSpy = jasmine.createSpyObj('FirstLoginService', ['updateUser']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [FirstLogin1Component],
      imports: [
        ReactiveFormsModule, 
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        PageHeaderComponent,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        RouterTestingModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: FirstLoginService, useValue: firstLoginSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: UserService, useValue: {} }, // Mock minimal si le UserService n'est pas utilisé directement
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FirstLogin1Component);
    component = fixture.componentInstance;
    firstLoginServiceSpy = TestBed.inject(FirstLoginService) as jasmine.SpyObj<FirstLoginService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on init', () => {
    expect(component.firstLoginForm).toBeDefined();
    expect(component.firstLoginForm.get('accountType')?.value).toBe('option-diver');
  });

  it('should set accountType value', () => {
    component.setAccountTypeValue('option-club');
    expect(component.firstLoginForm.get('accountType')?.value).toBe('option-club');
  });

  it('should submit the form and navigate to the next step on success', () => {
    component.firstLoginForm.setValue({ accountType: 'option-diver' });
    firstLoginServiceSpy.updateUser.and.returnValue(of(undefined));

    component.onSubmit();

    expect(firstLoginServiceSpy.updateUser).toHaveBeenCalledWith({ accountType: 'option-diver' });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/first-login/step-two']);
    expect(component.isLoading).toBeFalse();
  });

  it('should handle errors when submitting the form', () => {
    component.firstLoginForm.setValue({ accountType: 'option-diver' });
    firstLoginServiceSpy.updateUser.and.returnValue(throwError(() => new Error('Request failed')));

    component.onSubmit();

    expect(firstLoginServiceSpy.updateUser).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  });

  it('should not submit the form if invalid', () => {
    component.firstLoginForm.setValue({ accountType: 'invalid-type' });

    component.onSubmit();

    expect(firstLoginServiceSpy.updateUser).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  });
});
