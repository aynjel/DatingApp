import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@env/environment';
import { LoginUserRequest } from '@model/dto/request/login-user.request';
import { LoginUserResponse } from '@model/dto/response/login-user.response';
import { User, UserRole, UserRoleEnum } from '@model/user';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);

  private readonly baseUrl = environment.apiUrl + '/account';

  private role = signal<UserRole>(UserRoleEnum.USER);
  private userAccountData = signal<User | undefined>(undefined);
  private isLoggedIn = signal(false);

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
    return this.http.post<LoginUserResponse>(this.baseUrl, payload).pipe(
      tap((response) => {
        this.setUserAccountData(response);
      })
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(this.baseUrl + 'logout', {}).pipe(
      tap(() => {
        this.isLoggedIn.set(false);
        this.userAccountData.set(undefined);
        this.role.set(UserRoleEnum.USER);
      })
    );
  }

  private setUserAccountData(userResponse: LoginUserResponse): void {
    this.userAccountData.set(userResponse);
    this.isLoggedIn.set(true);
    this.role.set(userResponse.role);
  }

  //#region Getters
  getUserAccountData(): User | undefined {
    return this.userAccountData();
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }

  getRole(): UserRole {
    return this.role();
  }
  //#endregion
}
