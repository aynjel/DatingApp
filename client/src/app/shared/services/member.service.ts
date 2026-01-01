import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateMemberDetailsRequest } from '../../modules/profile/models/create-member.models';
import {
  PaginationHeaderResponse,
  PaginationParams,
} from '../models/common-models';
import { Member, Photo } from '../models/member.model';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + '/Members';

  public getMembers(
    params?: PaginationParams & { searchTerm?: string }
  ): Observable<{ data: Member[]; pagination: PaginationHeaderResponse }> {
    let queryParams = new HttpParams();
    if (params?.pageNumber) {
      queryParams = queryParams.set('pageNumber', params.pageNumber);
    }
    if (params?.pageSize) {
      queryParams = queryParams.set('pageSize', params.pageSize);
    }
    if (params?.searchTerm) {
      queryParams = queryParams.set('searchTerm', params.searchTerm);
    }
    return this.http
      .get<Member[]>(this.baseUrl, { params: queryParams, observe: 'response' })
      .pipe(
        map((response: HttpResponse<Member[]>) => {
          const paginationHeader = response.headers.get('Pagination');
          let pagination: PaginationHeaderResponse = {
            currentPage: 1,
            itemsPerPage: 10,
            totalItems: 0,
            totalPages: 0,
          };

          if (paginationHeader) {
            try {
              pagination = JSON.parse(paginationHeader);
            } catch (error) {
              console.error('Error parsing pagination header:', error);
            }
          }

          return {
            data: response.body || [],
            pagination,
          };
        })
      );
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
