import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { RegisterUserRequest } from '../../../shared/models/dto/request/register-user.request';
import { Auth } from '../../../shared/services/auth';
import { ToastService } from '../../../shared/services/toast';

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss',
})
export class RegisterFormComponent {
  private authService = inject(Auth);
  private formBuilder = inject(FormBuilder);
  private toastService = inject(ToastService);
  private router = inject(Router);

  public isLoading = signal(false);

  public registerForm = this.formBuilder.group({
    displayName: [
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
    ],
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [Validators.required, Validators.minLength(6), this.passwordsMatch()],
    ],
    confirmPassword: [
      '',
      [Validators.required, Validators.minLength(6), this.passwordsMatch()],
    ],
  });

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

    this.authService
      .registerUser(payload)
      .pipe(first())
      .subscribe({
        next: (response) => {
          this.toastService.show('Registration successful!', 'success');
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.toastService.show(
            'Registration failed. Please try again.',
            'error'
          );
        },
      });
  }

  private passwordsMatch(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get('password')?.value;
      const confirmPassword = formGroup.get('confirmPassword')?.value;
      return password === confirmPassword ? null : { passwordsMismatch: true };
    };
  }
}
