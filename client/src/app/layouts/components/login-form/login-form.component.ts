import { KeyValuePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { delay, first } from 'rxjs';
import { LoginUserRequest } from '../../../shared/models/dto/request/login-user.request';
import { Auth } from '../../../shared/services/auth';
import { ToastService } from '../../../shared/services/toast';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, KeyValuePipe],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent {
  private formBuilder = inject(FormBuilder);
  private toastService = inject(ToastService);
  protected authService = inject(Auth);

  public readonly loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const value = this.loginForm.getRawValue();
    const payload: LoginUserRequest = {
      email: value.email!,
      password: value.password!,
    };

    this.authService
      .login(payload)
      .pipe(first(), delay(1000))
      .subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.toastService.show('Login successful', 'success');
        },
        error: (err: HttpErrorResponse) => {
          console.error('Login failed:', err);
        },
      });
  }
}
