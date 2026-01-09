import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, MinusIcon, PlusIcon } from 'lucide-angular';

@Component({
  selector: 'app-interest-input',
  imports: [FormsModule, LucideAngularModule],
  templateUrl: './interest-input.component.html',
})
export class InterestInputComponent {
  label = input.required<string>();
  isReadOnly = input<boolean>(false);

  onAddInterest = output<string[]>();

  selectedInterests = signal<string[]>([]);

  protected interestInput = signal('');
  protected interestError = signal<string | null>(null);

  maxInterests = signal(10);

  readonly addIcon = PlusIcon;
  readonly removeIcon = MinusIcon;

  addInterest(): void {
    const trimmedValue = this.interestInput().trim();

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
      (interest) => interest.toLowerCase() === trimmedValue.toLowerCase()
    );

    if (isDuplicate) {
      this.interestError.set('This interest has already been added.');
      return;
    }

    // Add the interest
    this.selectedInterests.update((interests) => [...interests, trimmedValue]);
    this.interestInput.set(''); // Clear the input
    this.interestError.set(null); // Clear any previous error
    this.onAddInterest.emit(this.selectedInterests());
  }

  removeInterest(interest: string): void {
    this.selectedInterests.update((interests) =>
      interests.filter((i) => i !== interest)
    );
    this.onAddInterest.emit(this.selectedInterests());
  }
}
