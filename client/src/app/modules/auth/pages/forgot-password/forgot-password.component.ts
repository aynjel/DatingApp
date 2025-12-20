import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ForgotPasswordFormComponent } from '../../components/forgot-password-form/forgot-password-form.component';

@Component({
  selector: 'app-forgot-password',
  imports: [ForgotPasswordFormComponent, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-200 via-base-100 to-base-200 py-12 px-4">
      <div class="card w-full max-w-md shadow-2xl bg-base-100">
        <div class="card-body">
          <h2 class="card-title text-3xl justify-center mb-2">Forgot Password</h2>
          <p class="text-center text-base-content/70 mb-6">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
          
          <app-forgot-password-form #forgotPasswordFormRef />
          
          <div class="divider">OR</div>
          
          <div class="text-center space-y-2">
            <a routerLink="/auth/login" class="link link-primary text-sm">
              Back to Sign In
            </a>
            <p class="text-sm text-base-content/70">
              Don't have an account?
              <a routerLink="/auth/register" class="link link-primary ml-1">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ForgotPasswordComponent {}

