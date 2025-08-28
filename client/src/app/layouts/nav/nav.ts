import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LoginUserRequest } from '../../shared/models/dto/request/login-user.request';
import { Auth } from '../../shared/services/auth';

@Component({
  selector: 'app-nav',
  imports: [ReactiveFormsModule, RouterLink, RouterLinkActive, NgClass],
  templateUrl: './nav.html',
})
export class Nav {
  private formBuilder = inject(FormBuilder);
  protected authService = inject(Auth);

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

    // Handle login logic here
    this.authService.login(loginCredentials).subscribe({
      next: (response) => {
        console.log('Login successful', response);
      },
      error: (error) => {
        alert('Login failed: ' + error.error);
      },
    });
  }

  protected onLogout(): void {
    this.authService.logout().subscribe({
      next: (response) => {
        console.log('Logout successful', response);
      },
      error: (error) => {
        alert('Logout failed: ' + error.error);
      },
    });
  }
}
