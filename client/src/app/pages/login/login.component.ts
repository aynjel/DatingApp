import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Sandbox } from '../../store/sandbox/sandbox';
import { LoginRequest } from '../../types/api/request.models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;

  private ngUnSubscribe: Subject<void> = new Subject<void>();

  constructor(private sandbox: Sandbox, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    this.sandbox.user$.pipe(takeUntil(this.ngUnSubscribe)).subscribe((user) => {
      console.log('User:', user);
    });
  }

  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const loginRequest: LoginRequest = {
        username: this.loginForm.get('username')?.value,
        password: this.loginForm.get('password')?.value,
      };
      const transId = this.sandbox.login(loginRequest);
      console.log('transId', transId);
    }
  }
}
