import { CanDeactivateFn } from '@angular/router';
import { BaseFormComponent } from '../components/base-form/base-form.component';

export const unsavedChangesGuard: CanDeactivateFn<BaseFormComponent> = (
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
