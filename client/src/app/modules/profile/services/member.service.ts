import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Member, Photo } from '../../../shared/models/member.model';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + '/Members';

  public getMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(this.baseUrl);
  }

  public getMemberById(id: string): Observable<Member> {
    return this.http.get<Member>(`${this.baseUrl}/${id}`);
  }

  public getPhotosByMemberId(memberId: string): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${this.baseUrl}/${memberId}/photos`);
  }

  public createMember(): Observable<Member> {
    return this.http.post<Member>(this.baseUrl, {});
  }
}
