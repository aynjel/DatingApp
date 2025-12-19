import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { LoginUserRequest } from '@model/dto/request/login-user.request';
import { Observable, of } from 'rxjs';
import { APIEndpoints } from '../../../shared/constants/api-endpoints.const';
import { RegisterUserRequest } from '../../../shared/models/dto/request/register-user.request';
import { AuthUserResponse } from '../../../shared/models/dto/response/auth-user.response';
import { User } from '../../../shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(environment.apiUrl + APIEndpoints.CURRENT_USER);
  }

  login(payload: LoginUserRequest): Observable<AuthUserResponse> {
    return this.http.post<AuthUserResponse>(
      environment.apiUrl + APIEndpoints.LOGIN,
      payload
    );
  }

  registerUser(
    registerPayload: RegisterUserRequest
  ): Observable<AuthUserResponse> {
    return this.http.post<AuthUserResponse>(
      environment.apiUrl + APIEndpoints.REGISTER,
      registerPayload
    );
  }

  logout(): Observable<true> {
    return of(true);
  }
}
