import { TestBed } from '@angular/core/testing';

import { EmailCheckServiceService } from './email-check-service.service';

describe('EmailCheckServiceService', () => {
  let service: EmailCheckServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailCheckServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
