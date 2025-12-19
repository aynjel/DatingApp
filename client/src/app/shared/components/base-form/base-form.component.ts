import { Component, signal, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-base-form-component',
  imports: [],
  template: ``,
})
export class BaseFormComponent {
  public hasUnsavedChanges: WritableSignal<boolean> = signal(false);
}
