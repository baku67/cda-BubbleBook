import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmEmailComponent } from './confirm-email.component';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { environment } from '../../../../../environments/environments';
import { RouterTestingModule } from '@angular/router/testing';
import { PageHeaderComponent } from '../../../../shared/ui-components/page-header/page-header.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ConfirmEmailComponent', () => {
  let component: ConfirmEmailComponent;
  let fixture: ComponentFixture<ConfirmEmailComponent>;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ConfirmEmailComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        MatProgressSpinnerModule,
        PageHeaderComponent,
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ token: 'mockToken', emailAddress: 'test@example.com' }),
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // Ignore les erreurs liées à des composants non déclarés
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmEmailComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    const req = httpMock.expectOne(`${environment.apiUrl}/api/confirm-email?token=mockToken`);
    expect(req.request.method).toBe('GET');
    req.flush({}); // Simule une réponse réussie

    expect(component).toBeTruthy();
  });

  it('should confirm email successfully', () => {
    const req = httpMock.expectOne(`${environment.apiUrl}/api/confirm-email?token=mockToken`);
    req.flush({}); // Simule une réponse réussie

    expect(component.isLoading).toBeFalse();
    expect(component.confirmSuccess).toBeTrue();
  });

  it('should handle email confirmation failure', () => {
    const req = httpMock.expectOne(`${environment.apiUrl}/api/confirm-email?token=mockToken`);
    req.flush({}, { status: 400, statusText: 'Bad Request' }); // Simule une erreur

    expect(component.isLoading).toBeFalse();
    expect(component.confirmSuccess).toBeFalse();
  });

  describe('Redirect tests', () => {
    beforeEach(async () => {
      await TestBed.resetTestingModule().configureTestingModule({
        declarations: [ConfirmEmailComponent],
        imports: [
          RouterTestingModule,
          HttpClientTestingModule,
          TranslateModule.forRoot(),
          MatProgressSpinnerModule,
          PageHeaderComponent,
        ],
        providers: [
          { provide: Router, useValue: routerSpy },
          {
            provide: ActivatedRoute,
            useValue: { queryParams: of({}) }, // Pas de token ou emailAddress
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ConfirmEmailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should redirect to "/" if token or emailAddress is missing', () => {
      // Simulez la requête API ouverte pour éviter l'erreur
      const req = httpMock.expectOne(`${environment.apiUrl}/api/confirm-email?token=mockToken`);
      req.flush({}, { status: 400, statusText: 'Bad Request' });
  
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
