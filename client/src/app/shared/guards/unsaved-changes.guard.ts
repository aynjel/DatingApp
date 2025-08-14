import { CanDeactivateFn } from '@angular/router';
import { BaseFormComponents } from '../components/base-form-components/base-form-components';

export const unsavedChangesGuard: CanDeactivateFn<BaseFormComponents> = (
  component,
  currentRoute,
  currentState,
  nextState
) => {
  if (component.hasUnsavedChanges()) {
    return confirm('You have unsaved changes. Do you really want to leave?');
  }
  return true;
};
