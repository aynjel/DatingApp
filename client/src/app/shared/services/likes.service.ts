import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Member } from '../models/member.model';

@Injectable({
  providedIn: 'root',
})
export class LikesService {
  private http = inject(HttpClient);
  public readonly baseUrl = environment.apiUrl + '/Likes';

  toggleLike(memberId: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${memberId}`, {});
  }

  getLikes(
    predicate?: string,
    pageNumber: number = 1,
    pageSize: number = 10,
  ): Observable<Member[]> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    if (predicate) {
      params = params.set('predicate', predicate);
    }
    return this.http.get<Member[]>(this.baseUrl, { params });
  }

  getLikeIds(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/list`);
  }
}
