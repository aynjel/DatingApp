import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { LoginUserRequest } from '@model/dto/request/login-user.request';
import { LoginUserResponse } from '@model/dto/response/login-user.response';
import { CookieService } from 'ngx-cookie-service';
import { Observable, tap } from 'rxjs';
import { APIEndpoints } from '../../../shared/constants/api-endpoints';
import { RegisterUserRequest } from '../../../shared/models/dto/request/register-user.request';
import { RegisterUserResponse } from '../../../shared/models/dto/response/register-user.response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private cookieService = inject(CookieService);

  getCurrentUser(): Observable<LoginUserResponse> {
    return this.http.get<LoginUserResponse>(
      environment.apiUrl + APIEndpoints.CURRENT_USER
    );
  }

  login(payload: LoginUserRequest): Observable<LoginUserResponse> {
    return this.http
      .post<LoginUserResponse>(environment.apiUrl + APIEndpoints.LOGIN, payload)
      .pipe(
        tap((response) => {
          this.cookieService.set('accessToken', response.accessToken);
          this.cookieService.set('refreshToken', response.refreshToken);
        })
      );
  }

  logout(): void {
    this.cookieService.delete('accessToken');
    this.cookieService.delete('refreshToken');
  }

  registerUser(
    registerPayload: RegisterUserRequest
  ): Observable<RegisterUserResponse> {
    return this.http.post<RegisterUserResponse>(
      environment.apiUrl + APIEndpoints.REGISTER,
      registerPayload
    );
  }
}
