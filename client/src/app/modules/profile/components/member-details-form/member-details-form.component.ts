import { KeyValuePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../../../shared/services/toast.service';
import { AuthStore } from '../../../../shared/store/auth.store';
import { GlobalStore } from '../../../../shared/store/global.store';
import { MemberStore } from '../../../../shared/store/member.store';
import { CreateMemberDetailsRequest } from '../../models/create-member.models';

@Component({
  selector: 'app-member-details-form',
  imports: [ReactiveFormsModule, KeyValuePipe],
  templateUrl: './member-details-form.component.html',
})
export class MemberDetailsFormComponent {
  private authStore = inject(AuthStore);
  private memberStore = inject(MemberStore);
  private globalStore = inject(GlobalStore);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private toastService = inject(ToastService);

  protected userDetails = computed(() => this.authStore.currentUser());
  protected memberDetails = computed(() => this.userDetails()?.memberDetails);

  protected isLoading = computed(() => this.globalStore.isSubmitting());

  public readonly memberDetailsForm = this.formBuilder.group({
    dateOfBirth: ['', [Validators.required]],
    imageUrl: ['', [Validators.required]],
    displayName: [
      this.userDetails()?.displayName,
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
    if (this.memberDetailsForm.invalid) {
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

    this.memberStore.createMemberDetails({
      data: {
        userId: this.authStore.currentUser()!.userId,
        payload: payload,
      },
      onSuccess: async () => {
        this.toastService.show(
          'Member details created successfully.',
          'success'
        );
        this.router.navigate(['/profile/me']);
      },
      onError: (error) => {
        this.toastService.show(error, 'error');
        console.error('Create member details error:', error);
      },
    });
  }
}
