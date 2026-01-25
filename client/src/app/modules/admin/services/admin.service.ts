import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { APIEndpoints } from '../../../shared/constants/api-endpoints.const';
import { UserWithRoles } from '../models/common.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + APIEndpoints.ADMIN;

  getUsersWithRoles(): Observable<UserWithRoles[]> {
    return this.http.get<UserWithRoles[]>(`${this.baseUrl}/users-with-roles`);
  }

  updateUserRoles(payload: {
    userId: string;
    roles: string[];
  }): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/edit-roles`, payload);
  }
}
