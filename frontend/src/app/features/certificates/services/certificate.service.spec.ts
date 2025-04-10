import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CertificateService } from './certificate.service';
import { environment } from '../../../../environments/environments';
import { Certificate } from '../models/certificate.model';
import { UserCertificate } from '../models/userCertificate.model';
import { CertificateFormData } from '../models/certificateFormData.model';

describe('CertificateService', () => {
  let service: CertificateService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CertificateService],
    });

    service = TestBed.inject(CertificateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Vérifie qu'il n'y a pas de requêtes non traitées
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all certificates', () => {
    const mockCertificates: Certificate[] = [
      { id: 1, name: 'Cert A', type: 'Org 1' },
      { id: 2, name: 'Cert B', type: 'Org 2' },
    ];

    service.getCertificates().subscribe((certificates) => {
      expect(certificates).toEqual(mockCertificates);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/certificates`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCertificates); // Simule la réponse HTTP
  });

  it('should fetch current user certificates', () => {
    const mockUserCertificates: UserCertificate[] = [
      { id: 1, certificate: { id: 1, name: 'Cert A', type: 'Org 1' }, displayOrder: 1, obtainedDate: '03/12/1996', location: 'Strasbourg' },
      { id: 2, certificate: { id: 2, name: 'Cert B', type: 'Org 2' }, displayOrder: 2, obtainedDate: '03/12/1996', location: 'Strasbourg' },
    ];

    service.getCurrentUserCertificates().subscribe((certificates) => {
      expect(certificates).toEqual(mockUserCertificates);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/user/certificates`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUserCertificates);
  });

  it('should add a certificate to the user', () => {
    const mockCertificateData: CertificateFormData = {
      name: 'Org 1',
      type: 'Cert A',
      obtainedDate: new Date(),
      location: 'Paris',
    };
    const mockResponse = { message: 'Certificate added successfully' };

    service.addCertificateToUser(mockCertificateData).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/user/certificates`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockCertificateData);
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.flush(mockResponse);
  });

  it('should delete a user certificate', () => {
    const certificateId = 1;
    const mockResponse = { message: 'Certificate deleted successfully' };

    service.deleteUserCertificate(certificateId).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/user/certificates/${certificateId}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.flush(mockResponse);
  });
});
