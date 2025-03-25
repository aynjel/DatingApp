import { TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { UserAccountService } from './user-account.service';

describe('UserAccountService', () => {
  let service: UserAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(UserAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
