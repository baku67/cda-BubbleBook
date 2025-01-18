import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { PreventPublicAccessGuard } from './prevent-access-public.guard';
import { TokenService } from '../../features/auth/services/token.service';

describe('PreventPublicAccessGuard', () => {
  let guard: PreventPublicAccessGuard;
  let tokenServiceSpy: jasmine.SpyObj<TokenService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const tokenSpy = jasmine.createSpyObj('TokenService', ['getAccessToken']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        PreventPublicAccessGuard,
        { provide: TokenService, useValue: tokenSpy },
        { provide: Router, useValue: routerSpyObj },
      ],
    });

    guard = TestBed.inject(PreventPublicAccessGuard);
    tokenServiceSpy = TestBed.inject(TokenService) as jasmine.SpyObj<TokenService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should deny access and redirect to /user-profil if token exists', () => {
    tokenServiceSpy.getAccessToken.and.returnValue('mock-token');

    const result = guard.canActivate();

    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/user-profil']);
  });

  it('should allow access if no token exists', () => {
    tokenServiceSpy.getAccessToken.and.returnValue(null);

    const result = guard.canActivate();

    expect(result).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});
