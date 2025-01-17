import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FirstLoginStepsService } from './first-login-steps.service';
import { environment } from '../../../../environments/environments';

describe('FirstLoginStepsService', () => {
  let service: FirstLoginStepsService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/api/user`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FirstLoginStepsService],
    });

    service = TestBed.inject(FirstLoginStepsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Vérifie qu'il n'y a pas de requêtes non traitées
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#updateUser', () => {
    it('should send a PATCH request to update user data', () => {
      const mockUpdateData = { username: 'testUser', avatar: 'avatarUrl' };

      service.updateUser(mockUpdateData).subscribe((response) => {
        expect(response).toBeNull(); // Observable<void> n'émet rien
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(mockUpdateData);
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush(null); // Réponse vide pour un Observable<void>
    });
  });

  describe('#skipStep', () => {
    it('should send a PATCH request to skip a step', () => {
      const step = 2;

      service.skipStep(step).subscribe((response) => {
        expect(response).toBeNull(); // Observable<void> n'émet rien
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ passStep: true, step: step });
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush(null); // Réponse vide pour un Observable<void>
    });
  });
});
