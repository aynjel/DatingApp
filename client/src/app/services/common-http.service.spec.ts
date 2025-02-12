import { TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { CommonHttpService } from './common-http.service';

describe('CommonHttpService', () => {
  let service: CommonHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(CommonHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
