import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BatchPhotoUploadResponseDto } from '../models/dto/response/photo.response';
import { Member, MemberParams } from '../models/member.model';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private http = inject(HttpClient);
  public readonly baseUrl = environment.apiUrl + '/Members';

  public getMembers(
    memberParams: MemberParams
  ): Observable<HttpResponse<Member[]>> {
    let params = new HttpParams();

    params = params.append('pageNumber', memberParams.pageNumber);
    params = params.append('pageSize', memberParams.pageSize);
    params = params.append('minAge', memberParams.minAge);
    params = params.append('maxAge', memberParams.maxAge);
    if (memberParams.gender) {
      params = params.append('gender', memberParams.gender);
    }

    return this.http.get<Member[]>(this.baseUrl, {
      params,
      observe: 'response',
    });
  }

  public getMemberById(id: string): Observable<Member> {
    return this.http.get<Member>(`${this.baseUrl}/${id}`);
  }

  public uploadPhotos(files: File[]): Observable<BatchPhotoUploadResponseDto> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    return this.http.post<BatchPhotoUploadResponseDto>(
      `${this.baseUrl}/add-photos`,
      formData
    );
  }
}
