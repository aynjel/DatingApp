import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Auth } from '../../shared/services/auth';

@Component({
  selector: 'app-nav',
  imports: [ReactiveFormsModule],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class Nav {
  private authService = inject(Auth);
  private formBuilder = inject(FormBuilder);

  protected isLoggedIn = this.authService.isLoggedIn;

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
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.getRawValue();

      // Handle login logic here
      this.authService.login(username!, password!).subscribe({
        next: (response) => {
          console.log('Login successful', response);
        },
        error: (error) => {
          alert('Login failed: ' + error.error);
        },
      });
    } else {
      alert('Form is invalid. Please check your input.');
    }
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
