import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonHttpService {
  constructor(private http: HttpClient) {}

  login(payload: any): Observable<any> {
    return of({});
  }

  register(payload: any): Observable<any> {
    return of({});
  }
}
