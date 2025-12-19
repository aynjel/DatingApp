import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';
import { BaseFormComponent } from '../components/base-form/base-form.component';
import { unsavedChangesGuard } from './unsaved-changes.guard';

describe('unsavedChangesGuard', () => {
  const executeGuard: CanDeactivateFn<BaseFormComponent> = (
    component,
    currentRoute,
    currentState,
    nextState
  ) =>
    TestBed.runInInjectionContext(() =>
      unsavedChangesGuard(component, currentRoute, currentState, nextState)
    );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: BaseFormComponent,
          useValue: {
            hasUnsavedChanges: () => true,
          },
        },
      ],
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
