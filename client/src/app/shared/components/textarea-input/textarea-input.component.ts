import { Component, input, Self } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-textarea-input',
  imports: [ReactiveFormsModule],
  templateUrl: './textarea-input.component.html',
})
export class TextareaInputComponent implements ControlValueAccessor {
  label = input.required<string>();

  isReadOnly = input<boolean>(false);

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }

  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }

  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}
}
