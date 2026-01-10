import { Component, input, Self, signal } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { LucideAngularModule, MinusIcon, PlusIcon } from 'lucide-angular';

@Component({
  selector: 'app-interest-input',
  standalone: true,
  imports: [ReactiveFormsModule, LucideAngularModule],
  templateUrl: './interest-input.component.html',
})
export class InterestInputComponent implements ControlValueAccessor {
  label = input.required<string>();
  isReadOnly = input<boolean>(false);

  selectedInterests = signal<string[]>([]);

  protected interestInput = signal('');
  protected interestError = signal<string | null>(null);

  maxInterests = signal(10);

  readonly addIcon = PlusIcon;
  readonly removeIcon = MinusIcon;

  private onChange: (value: string[]) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }

  addInterest(): void {
    const value = this.interestInput().trim();

    if (!value) {
      this.interestError.set('Please enter an interest.');
      return;
    }

    const currentInterests = this.selectedInterests();

    // Check for max interests
    if (currentInterests.length >= this.maxInterests()) {
      this.interestError.set(
        `You can add up to ${this.maxInterests()} interests only.`
      );
      return;
    }

    // Check for duplicates (case-insensitive)
    const isDuplicate = currentInterests.some(
      (interest) => interest.toLowerCase() === value.toLowerCase()
    );

    if (isDuplicate) {
      this.interestError.set('This interest has already been added.');
      return;
    }

    // Add the interest
    const updatedInterests = [...currentInterests, value];
    this.selectedInterests.set(updatedInterests);
    this.interestInput.set(''); // Clear the input
    this.interestError.set(null); // Clear any previous error

    // Notify form control of the change
    this.onChange(updatedInterests);
    this.onTouched();
  }

  onInterestInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.interestInput.set(value);
    this.interestError.set(null);
  }

  removeInterest(interest: string): void {
    const updatedInterests = this.selectedInterests().filter(
      (i) => i !== interest
    );
    this.selectedInterests.set(updatedInterests);

    // Notify form control of the change
    this.onChange(updatedInterests);
    this.onTouched();
  }

  get control(): FormControl<string[]> {
    return this.ngControl.control as FormControl<string[]>;
  }

  writeValue(value: string[] | null | undefined): void {
    if (Array.isArray(value)) {
      this.selectedInterests.set([...value]);
    } else {
      this.selectedInterests.set([]);
    }
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
