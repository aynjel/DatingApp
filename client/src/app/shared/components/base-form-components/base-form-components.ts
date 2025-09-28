import { Component, signal, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-base-form-components',
  imports: [],
  template: ``,
})
export class BaseFormComponents {
  public hasUnsavedChanges: WritableSignal<boolean> = signal(false);
}
