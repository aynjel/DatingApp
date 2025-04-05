import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, RegisterRequest } from '../types/api/request.models';
import { LoginResponse } from '../types/api/response.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  public login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      environment.baseApiUrl + 'Account/login',
      payload
    );
  }

  public register(payload: RegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      environment.baseApiUrl + 'Users',
      payload
    );
  }
}
