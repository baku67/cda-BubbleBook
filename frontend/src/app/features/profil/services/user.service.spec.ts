import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environments';
import { UserProfil } from '../models/userProfile.model';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch the current user', () => {
    const mockUser: UserProfil = {
      username: 'test',
      email: 'test@test.fr',
      accountType: 'option-diver',
      nationality: 'FRA', // Code invalide
      avatarUrl: '',
      bannerUrl: '',
      isVerified: false,
      is2fa: false,  
    };

    service.getCurrentUser().subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/user/me`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should handle errors when fetching the current user', () => {
    const errorMessage = 'Failed to fetch user profile';

    service.getCurrentUser().subscribe(
      () => fail('expected an error, not user data'),
      (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Internal Server Error');
      }
    );

    const req = httpMock.expectOne(`${environment.apiUrl}/api/user/me`);
    expect(req.request.method).toBe('GET');
    req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
  });
});
