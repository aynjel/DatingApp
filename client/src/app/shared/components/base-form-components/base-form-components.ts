import { Component, signal, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-base-form-components',
  imports: [],
  templateUrl: './base-form-components.html',
  styleUrl: './base-form-components.scss',
})
export class BaseFormComponents {
  public hasUnsavedChanges: WritableSignal<boolean> = signal(false);
}
