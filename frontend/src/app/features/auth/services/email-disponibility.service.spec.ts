import { TestBed } from '@angular/core/testing';
import { EmailCheckService } from '../../../features/auth/services/email-disponibility.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EmailCheckServiceService', () => {
  let service: EmailCheckService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(EmailCheckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
