import {
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { delay, finalize, first } from 'rxjs';
import { LoginUserRequest } from '../../../shared/models/dto/request/login-user.request';
import { Auth } from '../../../shared/services/auth';
import { ToastService } from '../../../shared/services/toast';

@Component({
  selector: 'app-login-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './login-modal.html',
})
export class LoginModal {
  private formBuilder = inject(FormBuilder);
  private toastService = inject(ToastService);
  protected authService = inject(Auth);

  @ViewChild('loginModal') loginModal!: ElementRef<HTMLDialogElement>;

  isOpen = signal(false);
  isLoading = signal(false);
  error = signal('');

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

  open() {
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
    this.loginForm.reset();
  }

  onSubmit(): void {
    if (!this.loginForm.valid) {
      return;
    }

    const loginCredentials: LoginUserRequest =
      this.loginForm.getRawValue() as LoginUserRequest;

    this.isLoading.set(true);
    this.error.set('');
    this.authService
      .login(loginCredentials)
      .pipe(
        first(),
        delay(1000),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          this.toastService.show('Login successful', 'success');
          this.close();
        },
        error: (err) => {
          this.toastService.show('Login failed: ' + err.error, 'error');
          this.error.set('Login failed: ' + err.error);
        },
      });
  }
}
