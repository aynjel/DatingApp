import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { APIEndpoints } from '../../../shared/constants/api-endpoints.const';
import {
  CreateMessageRequest,
  GetMessageParams,
  Message,
} from '../../../shared/models/message.model';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + APIEndpoints.MESSAGES;

  // GET /messages - Get messages for user with pagination
  getMessages(params?: GetMessageParams): Observable<HttpResponse<Message[]>> {
    let queryParams = new HttpParams();
    if (params) {
      if (params.pageNumber) {
        queryParams = queryParams.append(
          'pageNumber',
          params.pageNumber.toString()
        );
      }
      if (params.pageSize) {
        queryParams = queryParams.append(
          'pageSize',
          params.pageSize.toString()
        );
      }
      if (params.container) {
        queryParams = queryParams.append('container', params.container);
      }
    }
    return this.http.get<Message[]>(this.baseUrl, {
      params: queryParams,
      observe: 'response',
    });
  }

  // GET /messages/thread/{recipientId} - Get message thread with specific user
  getMessageThread(recipientId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.baseUrl}/thread/${recipientId}`);
  }

  // POST /messages - Send a new message
  sendMessage(message: CreateMessageRequest): Observable<Message> {
    return this.http.post<Message>(this.baseUrl, message);
  }

  // DELETE /messages/{messageId} - Delete a message
  deleteMessage(messageId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${messageId}`);
  }
}
