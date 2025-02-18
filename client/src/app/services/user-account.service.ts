import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserAccount } from '../types/api/response.models';

@Injectable({
  providedIn: 'root',
})
export class UserAccountService {
  constructor(private httpService: HttpClient) {}

  getUserAccount(): Observable<UserAccount> {
    return this.httpService.get<UserAccount>(`/user`);
  }
}
