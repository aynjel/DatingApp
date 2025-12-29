import { KeyValuePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { GlobalStore } from '../../../../shared/store/global.store';
import { CreateMemberDetailsRequest } from '../../models/create-member.models';
import { ProfileStore } from '../../store/profile.store';

@Component({
  selector: 'app-member-details-form',
  imports: [ReactiveFormsModule, KeyValuePipe],
  templateUrl: './member-details-form.component.html',
})
export class MemberDetailsFormComponent {
  private profileStore = inject(ProfileStore);
  private globalStore = inject(GlobalStore);
  private formBuilder = inject(FormBuilder);

  protected currentUser = computed(() =>
    this.profileStore.authStore.currentUser()
  );
  protected memberDetails = computed(
    () => this.profileStore.authStore.currentUser()?.memberDetails
  );

  protected isLoading = computed(() => this.globalStore.isSubmitting());

  public readonly memberDetailsForm = this.formBuilder.group({
    dateOfBirth: ['', [Validators.required]],
    imageUrl: ['', [Validators.required]],
    displayName: [
      this.currentUser()?.displayName,
      [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
    ],
    gender: ['', [Validators.required]],
    description: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(500),
      ],
    ],
    city: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
    ],
    country: [
      '',
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
      dateOfBirth: value.dateOfBirth!,
      imageUrl: value.imageUrl!,
      displayName: value.displayName!,
      gender: value.gender!,
      description: value.description!,
      city: value.city!,
      country: value.country!,
    };

    this.profileStore.createMemberDetails({
      data: {
        userId: this.currentUser()!.userId,
        payload: payload,
      },
    });
  }
}
