import { Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { TextInputComponent } from '../../../../shared/components/text-input/text-input.component';
import { LoginUserRequest } from '../../../../shared/models/dto/request/login-user.request';
import { AuthStore } from '../../../../shared/store/auth.store';
import { GlobalStore } from '../../../../shared/store/global.store';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, TextInputComponent, ButtonComponent],
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent {
  private globalStore = inject(GlobalStore);
  private authStore = inject(AuthStore);
  private formBuilder = inject(FormBuilder);

  public readonly isLoading = computed(() => this.globalStore.isSubmitting());

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

    this.authStore.signIn({
      data: payload,
      onSuccess: () => {
        this.loginForm.reset();
      },
    });
  }
}
