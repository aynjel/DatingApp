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
          <h2 class="card-title text-3xl justify-center mb-2">
            Access Your Account
          </h2>
          <p class="text-center text-base-content/70 mb-6">
            Welcome back! Please log in to continue.
          </p>

          <app-login-form #loginFormRef />

          <div class="divider">OR</div>

          <button class="btn bg-white text-black border-[#e5e5e5]">
            <svg
              aria-label="Google logo"
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <g>
                <path d="m0 0H512V512H0" fill="#fff"></path>
                <path
                  fill="#34a853"
                  d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                ></path>
                <path
                  fill="#4285f4"
                  d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                ></path>
                <path
                  fill="#fbbc02"
                  d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                ></path>
                <path
                  fill="#ea4335"
                  d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                ></path>
              </g>
            </svg>
            Login with Google
          </button>

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
