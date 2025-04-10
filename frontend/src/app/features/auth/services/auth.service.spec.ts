import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environments';


describe('AuthService', () => {
  let authService: AuthService;
  let httpMock: HttpTestingController;
  let tokenServiceSpy: jasmine.SpyObj<TokenService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockEnvironment = { apiUrl: environment.apiUrl};

  beforeEach(() => {
    const tokenSpy = jasmine.createSpyObj('TokenService', ['setAccessToken', 'clearAccessToken', 'isAccessTokenValid']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: TokenService, useValue: tokenSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: 'environment', useValue: mockEnvironment },
      ],
    });

    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    tokenServiceSpy = TestBed.inject(TokenService) as jasmine.SpyObj<TokenService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('should log in a user and update token and state', () => {
    const mockResponse = { accessToken: 'mock-token', firstLoginStep: 1 };
    const mockCredentials = { email: 'test@example.com', password: 'password123', rememberMe: true };

    authService.login(mockCredentials).subscribe((response) => {
      expect(response).toEqual(mockResponse);
      expect(tokenServiceSpy.setAccessToken).toHaveBeenCalledWith('mock-token');
      expect(authService.getFirstLoginStep()).toBe(1);
    });

    const req = httpMock.expectOne(`${mockEnvironment.apiUrl}/api/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockCredentials);

    req.flush(mockResponse);
  });

  it('should log out a user and clear token and state', () => {
    authService.logout();

    expect(tokenServiceSpy.clearAccessToken).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should register a user', () => {
    const mockRegisterData = { email: 'test@example.com', password: 'password123', passwordCheck: 'password123', acceptTerms: true };
    const mockResponse = { message: 'User registered successfully' };

    authService.registerUser(mockRegisterData).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${mockEnvironment.apiUrl}/api/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRegisterData);

    req.flush(mockResponse);
  });

  it('should resend confirmation email', () => {
    const mockEmail = 'test@example.com';
    const mockResponse = { message: 'Confirmation email sent successfully' };

    authService.resendConfirmationEmail(mockEmail).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${mockEnvironment.apiUrl}/api/resend-confirmation`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: mockEmail });

    req.flush(mockResponse);
  });

  it('should check login step', () => {
    const mockStep = 2;

    tokenServiceSpy.isAccessTokenValid.and.returnValue(true);
    authService['firstLoginStep'] = mockStep;

    const result = authService.getFirstLoginStep();
    expect(result).toBe(mockStep);
  });
});
