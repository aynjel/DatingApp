import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@env/environment';
import { LoginUserRequest } from '@model/dto/request/login-user.request';
import { LoginUserResponse } from '@model/dto/response/login-user.response';
import { User, UserRole, UserRoleEnum } from '@model/user';
import { CookieService } from 'ngx-cookie-service';
import { Observable, tap } from 'rxjs';
import { RegisterUserRequest } from '../models/dto/request/register-user.request';
import { RegisterUserResponse } from '../models/dto/response/register-user.response';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private cookieService = inject(CookieService);

  private readonly baseUrl = environment.apiUrl + '/account';

  public role = signal<UserRole>(UserRoleEnum.GUEST);
  public userAccountData = signal<User | undefined>(undefined);
  public isLoggedIn = signal(false);

  retrieveUserAccount(): void {
    if (this.userAccountData() === undefined) {
      this.http.get<LoginUserResponse>(this.baseUrl + '/user').subscribe({
        next: (response) => {
          this.setUserAccountData(response);
        },
        error: () => {
          this.isLoggedIn.set(false);
          this.userAccountData.set(undefined);
        },
      });
    }
  }

  login(payload: LoginUserRequest): Observable<LoginUserResponse> {
    return this.http
      .post<LoginUserResponse>(this.baseUrl + '/login', payload)
      .pipe(
        tap((response) => {
          this.cookieService.set('token', response.token);
          this.setUserAccountData(response);
        })
      );
  }

  logout(): Observable<void> {
    return this.http.post<void>(this.baseUrl + 'logout', {}).pipe(
      tap(() => {
        this.isLoggedIn.set(false);
        this.userAccountData.set(undefined);
        this.role.set(UserRoleEnum.GUEST);
      })
    );
  }

  registerUser(
    registerPayload: RegisterUserRequest
  ): Observable<RegisterUserResponse> {
    return this.http
      .post<RegisterUserResponse>(this.baseUrl + '/register', registerPayload)
      .pipe(
        tap((response) => {
          this.cookieService.set('token', response.token);
        })
      );
  }

  private setUserAccountData(userResponse: LoginUserResponse): void {
    this.userAccountData.set(userResponse);
    this.isLoggedIn.set(true);
    this.role.set(userResponse.role);
  }
}
