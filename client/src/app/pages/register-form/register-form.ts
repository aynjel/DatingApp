import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RegisterUserRequest } from '../../shared/models/dto/request/register-user.request';
import { Auth } from '../../shared/services/auth';

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule],
  templateUrl: './register-form.html',
})
export class RegisterForm {
  private authService = inject(Auth);
  private formBuilder = inject(FormBuilder);

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

    this.authService.registerUser(payload).subscribe({
      next: (response) => {
        // Handle successful registration
        console.log(response);
      },
      error: (error) => {
        // Handle registration error
        console.error(error);
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
