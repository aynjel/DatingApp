import { KeyValuePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RegisterUserRequest } from '../../../../shared/models/dto/request/register-user.request';
import { AuthStore } from '../../../../shared/store/auth.store';
import { GlobalStore } from '../../../../shared/store/global.store';

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule, KeyValuePipe],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss',
})
export class RegisterFormComponent {
  private globalStore = inject(GlobalStore);
  private authStore = inject(AuthStore);
  private formBuilder = inject(FormBuilder);

  protected isLoading = computed(() => this.globalStore.isSubmitting());

  public readonly registerForm = this.formBuilder.group(
    {
      displayName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    },
    { validators: this.passwordsMatch() }
  );

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const value = this.registerForm.getRawValue();
    const payload: RegisterUserRequest = {
      displayName: value.displayName!,
      email: value.email!,
      password: value.password!,
      confirmPassword: value.confirmPassword!,
    };

    this.authStore.signUp({
      data: payload,
      onSuccess: () => {
        this.registerForm.reset();
      },
    });
  }

  private passwordsMatch(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get('password');
      const confirmPassword = formGroup.get('confirmPassword');

      if (!password || !confirmPassword) {
        return null;
      }

      // If confirmPassword already has other errors (like required or minLength),
      // stop here so we don't overwrite them.
      if (
        confirmPassword.errors &&
        !confirmPassword.errors['passwordsMismatch']
      ) {
        return null;
      }

      // Check if values match
      if (password.value !== confirmPassword.value) {
        // ERROR FOUND: Set the error specifically on the confirmPassword control
        confirmPassword.setErrors({ passwordsMismatch: true });
      } else {
        // NO ERROR: Clear errors (if the current error was the mismatch)
        if (confirmPassword.hasError('passwordsMismatch')) {
          confirmPassword.setErrors(null);
        }
      }

      // Return null for the FormGroup itself, as the error is now on the child control
      return null;
    };
  }
}
