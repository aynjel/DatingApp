import { KeyValuePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { tapResponse } from '@ngrx/operators';
import { ToastService } from '../../../../shared/services/toast.service';
import { GlobalStore } from '../../../../shared/store/global.store';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password-form',
  imports: [ReactiveFormsModule, KeyValuePipe],
  template: `
    <form [formGroup]="forgotPasswordForm" (ngSubmit)="onSubmit()">
      <div class="flex flex-col gap-3">
        <input
          type="email"
          formControlName="email"
          class="input input-bordered w-full"
          [readOnly]="isLoading()"
          [class.input-error]="
            forgotPasswordForm.get('email')?.invalid &&
            forgotPasswordForm.get('email')?.touched
          "
          [class.input-success]="
            forgotPasswordForm.get('email')?.valid &&
            forgotPasswordForm.get('email')?.touched
          "
          placeholder="Email"
        />
        @if(forgotPasswordForm.get('email')?.invalid &&
        forgotPasswordForm.get('email')?.touched) {
        <p class="text-error text-[14px]">
          @for(error of forgotPasswordForm.get('email')?.errors | keyvalue;
          track error) { @switch (error.key) { @case ('required') { Email is
          required. } @case ('email') { Invalid email format. } } }
        </p>
        } @if (isSubmitted() && !isLoading()) {
        <div class="alert alert-success">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span
            >If an account exists with this email, we've sent password reset
            instructions.</span
          >
        </div>
        }
      </div>
    </form>
  `,
})
export class ForgotPasswordFormComponent {
  private globalStore = inject(GlobalStore);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private formBuilder = inject(FormBuilder);

  protected isLoading = computed(() => this.globalStore.isSubmitting());
  protected isSubmitted = computed(
    () =>
      this.globalStore.isSubmitting() === false &&
      this.forgotPasswordForm.touched
  );

  public readonly forgotPasswordForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    const value = this.forgotPasswordForm.getRawValue();

    this.globalStore.withFormSubmission<{ email: string }, void>((payload) =>
      this.authService.forgotPassword(payload.email).pipe(
        tapResponse({
          next: () => {
            this.toastService.show(
              'Password reset instructions sent to your email',
              'success'
            );
            this.forgotPasswordForm.reset();
          },
          error: (error: HttpErrorResponse) => {
            console.error('Forgot password error:', error);
            // Don't show error to user for security reasons - always show success message
            this.toastService.show(
              "If an account exists with this email, we've sent password reset instructions.",
              'info'
            );
          },
        })
      )
    )({ data: { email: value.email! } });
  }
}
