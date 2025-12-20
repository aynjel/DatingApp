import { Component, effect, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthStore } from '../../../../shared/store/auth.store';
import { RegisterFormComponent } from '../../components/register-form/register-form.component';

@Component({
  selector: 'app-register',
  imports: [RegisterFormComponent, RouterLink],
  template: `
    <div
      class="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-200 via-base-100 to-base-200 py-12 px-4"
    >
      <div class="card w-full max-w-md shadow-2xl bg-base-100">
        <div class="card-body">
          <h2 class="card-title text-3xl justify-center mb-2">Sign Up</h2>
          <p class="text-center text-base-content/70 mb-6">
            Create your account to get started
          </p>

          <app-register-form #registerFormRef />

          <div class="divider">OR</div>

          <div class="text-center">
            <p class="text-sm text-base-content/70">
              Already have an account?
              <a routerLink="/auth/login" class="link link-primary ml-1">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent {
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
