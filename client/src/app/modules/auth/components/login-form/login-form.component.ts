import { KeyValuePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginUserRequest } from '../../../../shared/models/dto/request/login-user.request';
import { GlobalStore } from '../../../../store/global.store';
import { AuthStore } from '../../store/auth.store';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, KeyValuePipe],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
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
