import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { APIEndpoints } from '../../../shared/constants/api-endpoints.const';
import { PaginationParams } from '../../../shared/models/common-models';
import { Conversation, Message } from '../../../shared/models/message.model';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + APIEndpoints.MESSAGES;

  getMessages(params?: PaginationParams): Observable<Message[]> {
    let queryParams = new HttpParams();
    if (params) {
      queryParams = queryParams.append(
        'pageNumber',
        params.pageNumber.toString()
      );
      queryParams = queryParams.append('pageSize', params.pageSize.toString());
    }
    return this.http.get<Message[]>(this.baseUrl, { params: queryParams });
  }

  getConversations(params?: PaginationParams): Observable<Conversation[]> {
    let queryParams = new HttpParams();
    if (params) {
      queryParams = queryParams.append(
        'pageNumber',
        params.pageNumber.toString()
      );
      queryParams = queryParams.append('pageSize', params.pageSize.toString());
    }
    return this.http.get<Conversation[]>(this.baseUrl, { params: queryParams });
  }

  sendMessage(message: Message): Observable<Message> {
    return this.http.post<Message>(this.baseUrl, message);
  }
}
