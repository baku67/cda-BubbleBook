import { TestBed } from '@angular/core/testing';
import { FirstLoginService } from './first-login.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FirstLoginService', () => {
  let service: FirstLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ]
    });
    service = TestBed.inject(FirstLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
