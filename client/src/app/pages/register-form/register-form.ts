import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterUserRequest } from '../../shared/models/dto/request/register-user.request';
import { Auth } from '../../shared/services/auth';
import { ToastService } from '../../shared/services/toast';

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule],
  templateUrl: './register-form.html',
})
export class RegisterForm {
  private authService = inject(Auth);
  private formBuilder = inject(FormBuilder);
  private toastService = inject(ToastService);
  private router = inject(Router);

  public isLoading = signal(false);

  public registerForm = this.formBuilder.group({
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(100),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(100),
    ]),
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      this.passwordsMatch(),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      this.passwordsMatch(),
    ]),
  });

  onSubmit(): void {
    if (!this.registerForm.valid) {
      return;
    }

    const payload: RegisterUserRequest =
      this.registerForm.getRawValue() as RegisterUserRequest;

    this.isLoading.set(true);
    this.authService.registerUser(payload).subscribe({
      next: (response) => {
        this.toastService.show('Registration successful!', 'success');
        this.router.navigate(['/']);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.toastService.show(
          'Registration failed. Please try again.',
          'error'
        );
        console.error(error);
        this.isLoading.set(false);
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
