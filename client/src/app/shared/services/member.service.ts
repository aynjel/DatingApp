import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateMemberDetailsRequest } from '../../modules/profile/models/create-member.models';
import { GetMemberRequest } from '../models/dto/request/get-member.request';
import { Member, Photo } from '../models/member.model';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + '/Members';

  public getMembers(
    params?: GetMemberRequest
  ): Observable<HttpResponse<Member[]>> {
    let queryParams = new HttpParams();
    if (params) {
      if (params.pagination?.pageNumber) {
        queryParams = queryParams.set(
          'pageNumber',
          params.pagination.pageNumber
        );
      }
      if (params.pagination?.pageSize) {
        queryParams = queryParams.set('pageSize', params.pagination.pageSize);
      }
      if (params.searchTerm) {
        queryParams = queryParams.set('searchTerm', params.searchTerm);
      }
      if (params.gender) {
        queryParams = queryParams.set('gender', params.gender);
      }
      if (params.minAge) {
        queryParams = queryParams.set('minAge', params.minAge);
      }
      if (params.maxAge) {
        queryParams = queryParams.set('maxAge', params.maxAge);
      }
      if (params.city) {
        queryParams = queryParams.set('city', params.city);
      }
      if (params.country) {
        queryParams = queryParams.set('country', params.country);
      }
    }
    return this.http.get<Member[]>(this.baseUrl, {
      params: queryParams,
      observe: 'response',
    });
  }

  public getMemberById(id: string): Observable<Member> {
    return this.http.get<Member>(`${this.baseUrl}/${id}`);
  }

  public getPhotosByMemberId(memberId: string): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${this.baseUrl}/${memberId}/photos`);
  }

  public createMemberDetails(
    userId: string,
    payload: CreateMemberDetailsRequest
  ): Observable<Member> {
    return this.http.post<Member>(`${this.baseUrl}/${userId}`, payload);
  }
}
