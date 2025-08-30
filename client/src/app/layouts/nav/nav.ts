import { NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { finalize, first } from 'rxjs';
import { LoginUserRequest } from '../../shared/models/dto/request/login-user.request';
import { Auth } from '../../shared/services/auth';
import { ToastService } from '../../shared/services/toast';

@Component({
  selector: 'app-nav',
  imports: [ReactiveFormsModule, RouterLink, RouterLinkActive, NgClass],
  templateUrl: './nav.html',
})
export class Nav {
  private formBuilder = inject(FormBuilder);
  private toastService = inject(ToastService);
  protected authService = inject(Auth);

  protected isLoading = signal(false);

  protected loginForm = this.formBuilder.group({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(100),
    ]),
  });

  protected onSubmit(): void {
    if (!this.loginForm.valid) {
      return;
    }

    const loginCredentials: LoginUserRequest =
      this.loginForm.getRawValue() as LoginUserRequest;

    this.isLoading.set(true);
    this.authService
      .login(loginCredentials)
      .pipe(
        first(),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          this.toastService.show('Login successful', 'success');
        },
        error: (err) => {
          this.toastService.show('Login failed: ' + err.error, 'error');
        },
      });
  }

  protected onLogout(): void {
    this.authService.logout();
  }
}
