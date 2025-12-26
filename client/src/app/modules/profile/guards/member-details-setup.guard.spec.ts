import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { memberDetailsSetupGuard } from './member-details-setup.guard';

describe('memberDetailsSetupGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() =>
      memberDetailsSetupGuard(...guardParameters)
    );

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
