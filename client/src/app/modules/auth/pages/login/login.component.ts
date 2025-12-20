import { Component, effect, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthStore } from '../../../../shared/store/auth.store';
import { LoginFormComponent } from '../../components/login-form/login-form.component';

@Component({
  selector: 'app-login',
  imports: [LoginFormComponent, RouterLink],
  template: `
    <div
      class="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-200 via-base-100 to-base-200 py-12 px-4"
    >
      <div class="card w-full max-w-md shadow-2xl bg-base-100">
        <div class="card-body">
          <h2 class="card-title text-3xl justify-center mb-2">Sign In</h2>
          <p class="text-center text-base-content/70 mb-6">
            Welcome back! Please sign in to your account.
          </p>

          <app-login-form #loginFormRef />

          <div class="divider">OR</div>

          <div class="text-center space-y-2">
            <a
              routerLink="/auth/forgot-password"
              class="link link-primary text-sm"
            >
              Forgot your password?
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
export class LoginComponent {
  private authStore = inject(AuthStore);
  private router = inject(Router);

  constructor() {
    // Navigate to home if already logged in
    effect(() => {
      if (this.authStore.isLoggedIn()) {
        this.router.navigate(['/home']);
      }
    });
  }
}
