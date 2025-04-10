import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { TokenService } from '../../features/auth/services/token.service';
import { AuthService } from '../../features/auth/services/auth.service';
import { Router } from '@angular/router';

describe('AuthInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let tokenServiceSpy: jasmine.SpyObj<TokenService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const tokenSpy = jasmine.createSpyObj('TokenService', ['getAccessToken']);
    const authSpy = jasmine.createSpyObj('AuthService', ['logout']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: TokenService, useValue: tokenSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    tokenServiceSpy = TestBed.inject(TokenService) as jasmine.SpyObj<TokenService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add Authorization header if token exists', () => {
    const mockToken = 'mock-token';
    tokenServiceSpy.getAccessToken.and.returnValue(mockToken);

    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
  });

  it('should not add Authorization header if token does not exist', () => {
    tokenServiceSpy.getAccessToken.and.returnValue(null);

    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBeFalse();
  });

  it('should handle 401 error for expired session and logout user', () => {
    tokenServiceSpy.getAccessToken.and.returnValue('mock-token');

    httpClient.get('/api/secure').subscribe({
      next: () => fail('Expected an error, but got a response'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(401);
        expect(authServiceSpy.logout).toHaveBeenCalled();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
      },
    });

    const req = httpMock.expectOne('/api/secure');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  });

  it('should not logout on 401 error during login', () => {
    tokenServiceSpy.getAccessToken.and.returnValue(null);

    httpClient.post('/login', { username: 'test', password: 'test' }).subscribe({
      next: () => fail('Expected an error, but got a response'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(401);
        expect(authServiceSpy.logout).not.toHaveBeenCalled();
        expect(routerSpy.navigate).not.toHaveBeenCalled();
      },
    });

    const req = httpMock.expectOne('/login');
    req.flush('Invalid credentials', { status: 401, statusText: 'Unauthorized' });
  });
});
