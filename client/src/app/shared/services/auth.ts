import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + '/account/login';

  public isLoggedIn = signal(false);

  login(username: string, password: string) {
    return this.http
      .post(this.baseUrl, { username, password })
      .pipe(tap(() => this.isLoggedIn.set(true)));
  }

  logout() {
    return this.http
      .post(environment.apiUrl + '/account/logout', {})
      .pipe(tap(() => this.isLoggedIn.set(false)));
  }
}
