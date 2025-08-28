import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@env/environment';
import { LoginUserRequest } from '@model/dto/request/login-user.request';
import { LoginUserResponse } from '@model/dto/response/login-user.response';
import { User, UserRole, UserRoleEnum } from '@model/user';
import { CookieService } from 'ngx-cookie-service';
import { Observable, tap } from 'rxjs';
import { APIEndpoints } from '../constants/api-endpoints';
import { RegisterUserRequest } from '../models/dto/request/register-user.request';
import { RegisterUserResponse } from '../models/dto/response/register-user.response';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private cookieService = inject(CookieService);

  public role = signal<UserRole>(UserRoleEnum.GUEST);
  public userAccountData = signal<User | undefined>(undefined);
  public isLoggedIn = signal(false);

  retrieveUserAccount(): void {
    if (this.userAccountData() === undefined) {
      this.http
        .get<LoginUserResponse>(environment.apiUrl + APIEndpoints.CURRENT_USER)
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

  logout(): Observable<void> {
    this.cookieService.delete('accessToken');
    this.cookieService.delete('refreshToken');
    this.userAccountData.set(undefined);
    this.isLoggedIn.set(false);
    this.role.set(UserRoleEnum.GUEST);
    return new Observable<void>((observer) => {
      observer.next();
      observer.complete();
    });
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
