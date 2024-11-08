import { TestBed } from '@angular/core/testing';

import { EmailCheckService } from '../../../features/auth/services/email-disponibility.service';

describe('EmailCheckServiceService', () => {
  let service: EmailCheckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailCheckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
