import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginUserRequest } from '../models/dto/request/login-user.request';
import { LoginUserResponse } from '../models/dto/response/login-user.response';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + '/account/login';

  public isLoggedIn = signal(false);

  login(payload: LoginUserRequest): Observable<LoginUserResponse> {
    return this.http
      .post<LoginUserResponse>(this.baseUrl, payload)
      .pipe(tap(() => this.isLoggedIn.set(true)));
  }

  logout(): Observable<void> {
    return this.http
      .post<void>(environment.apiUrl + '/account/logout', {})
      .pipe(tap(() => this.isLoggedIn.set(false)));
  }
}
