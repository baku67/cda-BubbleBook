import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EmailCheckService } from './email-disponibility.service';
import { environment } from '../../../../environments/environments';

describe('EmailCheckService', () => {
  let service: EmailCheckService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EmailCheckService],
    });
    service = TestBed.inject(EmailCheckService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Vérifie qu'il n'y a pas de requêtes HTTP non traitées
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a POST request to check email availability', () => {
    const mockResponse = { exists: true };
    const mockEmail = 'test@example.com';
    const expectedUrl = `${environment.apiUrl}/api/check-email-exist`;

    service.checkEmailExists(mockEmail).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST'); // Vérifie que la méthode est POST
    expect(req.request.body).toEqual({ email: mockEmail }); // Vérifie le corps de la requête

    req.flush(mockResponse); // Simule une réponse de l'API
  });

  it('should handle errors gracefully', () => {
    const mockEmail = 'invalid-email@example.com';
    const expectedUrl = `${environment.apiUrl}/api/check-email-exist`;

    service.checkEmailExists(mockEmail).subscribe({
      next: () => fail('Expected an error, but got a response'),
      error: (error) => {
        expect(error.status).toBe(500); // Vérifie que l'erreur HTTP est correctement gérée
      },
    });

    const req = httpMock.expectOne(expectedUrl);
    req.flush('Error occurred', { status: 500, statusText: 'Internal Server Error' });
  });
});
