import { KeyValuePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  InfoIcon,
  LockIcon,
  LucideAngularModule,
  MinusIcon,
  PlusIcon,
} from 'lucide-angular';
import { GlobalStore } from '../../../../shared/store/global.store';
import { CreateMemberDetailsRequest } from '../../models/create-member.models';
import { ProfileStore } from '../../store/profile.store';

@Component({
  selector: 'app-member-details-form',
  imports: [ReactiveFormsModule, KeyValuePipe, LucideAngularModule],
  templateUrl: './member-details-form.component.html',
})
export class MemberDetailsFormComponent {
  private profileStore = inject(ProfileStore);
  private globalStore = inject(GlobalStore);
  private formBuilder = inject(FormBuilder);

  protected interestInput = signal('');
  protected interestError = signal<string | null>(null);

  readonly addIcon = PlusIcon;
  readonly removeIcon = MinusIcon;
  readonly lockIcon = LockIcon;
  readonly infoIcon = InfoIcon;
  readonly maxInterests = 10;

  protected currentUser = computed(() =>
    this.profileStore.authStore.currentUser()
  );
  protected memberDetails = computed(
    () => this.profileStore.authStore.currentUser()?.memberDetails
  );

  protected isLoading = computed(() => this.globalStore.isSubmitting());

  public readonly memberDetailsForm = this.formBuilder.group({
    displayName: [this.currentUser()?.displayName || '', [Validators.required]],
    dateOfBirth: [
      this.memberDetails()?.dateOfBirth || '',
      [Validators.required],
    ],
    gender: [this.memberDetails()?.gender || '', [Validators.required]],
    description: [
      this.memberDetails()?.description || '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(500),
      ],
    ],
    interests: [this.memberDetails()?.interests || [], [Validators.required]],
    city: [
      this.memberDetails()?.city || '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
    ],
    country: [
      this.memberDetails()?.country || '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
    ],
  });

  onCreateMemberDetailsSubmit(): void {
    if (this.memberDetailsForm.invalid || !this.currentUser()) {
      this.memberDetailsForm.markAllAsTouched();
      return;
    }

    const value = this.memberDetailsForm.getRawValue();
    const payload: CreateMemberDetailsRequest = {
      city: value.city!,
      country: value.country!,
      dateOfBirth: value.dateOfBirth!,
      description: value.description!,
      gender: value.gender!,
      interests: value.interests!,
    };

    if (this.memberDetails()) {
      this.profileStore.updateMemberDetails({
        data: payload,
      });
    } else {
      this.profileStore.createMemberDetails({
        data: payload,
      });
    }
  }

  addInterest(event: Event): void {
    event.preventDefault();

    const trimmedValue = this.interestInput().trim();

    const control = this.memberDetailsForm.get('interests');
    const currentInterests = (control?.value as string[]) || [];

    // Check for max interests
    if (currentInterests.length >= this.maxInterests) {
      this.interestError.set(
        `You can add up to ${this.maxInterests} interests only.`
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
    control?.setValue([...currentInterests, trimmedValue]);
    control?.updateValueAndValidity();
    this.interestInput.set(''); // Clear the input
    this.interestError.set(null); // Clear any previous error
  }

  removeInterest(interest: string): void {
    const control = this.memberDetailsForm.get('interests');
    const currentInterests = (control?.value as string[]) || [];
    const updatedInterests = currentInterests.filter((i) => i !== interest);

    control?.setValue(updatedInterests);
    control?.updateValueAndValidity();
  }

  getSelectedInterests(): string[] {
    return (this.memberDetailsForm.get('interests')?.value as string[]) || [];
  }
}
