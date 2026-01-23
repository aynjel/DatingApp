import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LikesService {
  private http = inject(HttpClient);
  public readonly baseUrl = environment.apiUrl + '/Likes';

  toggleLike(memberId: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${memberId}`, {});
  }

  getLikes(predicate: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}?predicate=${predicate}`);
  }

  getLikeIds(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/list`);
  }
}
