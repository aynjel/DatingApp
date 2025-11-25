import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@env/environment';
import { LoginUserRequest } from '@model/dto/request/login-user.request';
import { LoginUserResponse } from '@model/dto/response/login-user.response';
import { User, UserRole, UserRoleEnum } from '@model/user';
import { CookieService } from 'ngx-cookie-service';
import { first, Observable, of, tap } from 'rxjs';
import { APIEndpoints } from '../../../shared/constants/api-endpoints';
import { RegisterUserRequest } from '../../../shared/models/dto/request/register-user.request';
import { RegisterUserResponse } from '../../../shared/models/dto/response/register-user.response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private cookieService = inject(CookieService);

  public role = signal<UserRole>(UserRoleEnum.GUEST);
  public userAccountData = signal<User | undefined>(undefined);
  public isLoggedIn = signal(false);

  retrieveUserAccount() {
    if (this.userAccountData() === undefined) {
      this.http
        .get<LoginUserResponse>(environment.apiUrl + APIEndpoints.CURRENT_USER)
        .pipe(first())
        .subscribe({
          next: (response) => {
            this.setUserAccountData(response);
          },
          error: () => {
            this.isLoggedIn.set(false);
            this.userAccountData.set(undefined);
          },
        });
    }

    return of(null);
  }

  login(payload: LoginUserRequest): Observable<LoginUserResponse> {
    return this.http
      .post<LoginUserResponse>(environment.apiUrl + APIEndpoints.LOGIN, payload)
      .pipe(
        tap((response) => {
          this.cookieService.set('accessToken', response.token.accessToken);
          this.cookieService.set('refreshToken', response.token.refreshToken);
          this.setUserAccountData(response);
        })
      );
  }

  logout(): void {
    this.cookieService.delete('accessToken');
    this.cookieService.delete('refreshToken');
    this.userAccountData.set(undefined);
    this.isLoggedIn.set(false);
    this.role.set(UserRoleEnum.GUEST);
  }

  registerUser(
    registerPayload: RegisterUserRequest
  ): Observable<RegisterUserResponse> {
    return this.http
      .post<RegisterUserResponse>(
        environment.apiUrl + APIEndpoints.REGISTER,
        registerPayload
      )
      .pipe(
        tap((response) => {
          // this.cookieService.set('accessToken', response.token.accessToken);
          // this.cookieService.set('refreshToken', response.token.refreshToken);
          // this.setUserAccountData(response);
        })
      );
  }

  private setUserAccountData(userResponse: LoginUserResponse): void {
    this.userAccountData.set(userResponse);
    this.isLoggedIn.set(true);
    this.role.set(userResponse.role);
  }
}
