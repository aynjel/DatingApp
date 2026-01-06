import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Member } from '../../../shared/models/member.model';
import { MemberService } from '../../../shared/services/member.service';
import { BatchUploadResponse } from '../models/batch-upload-response.models';
import { CreateMemberDetailsRequest } from '../models/create-member.models';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private http = inject(HttpClient);
  private memberService = inject(MemberService);

  public createMemberDetails(
    payload: CreateMemberDetailsRequest
  ): Observable<Member> {
    return this.http.post<Member>(this.memberService.baseUrl, payload);
  }

  public updateMemberDetails(
    payload: CreateMemberDetailsRequest
  ): Observable<Member> {
    return this.http.put<Member>(this.memberService.baseUrl, payload);
  }

  public setMainPhoto(photoId: string): Observable<void> {
    return this.http.put<void>(
      `${this.memberService.baseUrl}/set-main-photo/${photoId}`,
      {}
    );
  }

  public deletePhoto(photoId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.memberService.baseUrl}/delete-photo/${photoId}`
    );
  }

  public uploadProfilePhoto(file: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<void>(
      `${this.memberService.baseUrl}/add-profile-photo`,
      formData
    );
  }

  public uploadBatchPhotos(files: File[]): Observable<BatchUploadResponse> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    return this.http.post<BatchUploadResponse>(
      `${this.memberService.baseUrl}/add-photos`,
      formData
    );
  }
}
