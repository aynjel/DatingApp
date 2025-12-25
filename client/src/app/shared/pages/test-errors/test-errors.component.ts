import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ErrorEndpoints } from '../../shared/constants/api-endpoints.const';

@Component({
  selector: 'app-test-errors',
  imports: [],
  templateUrl: './test-errors.component.html',
})
export class TestErrorsComponent {
  private httpClient = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  protected validationErrors = signal<string[]>([]);

  getTestError() {
    this.httpClient
      .get(this.baseUrl + '/buggy/' + ErrorEndpoints.TEST)
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  get404Error() {
    this.httpClient
      .get(this.baseUrl + '/buggy/' + ErrorEndpoints.NOT_FOUND)
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  get400Error() {
    this.httpClient
      .get(this.baseUrl + '/buggy/' + ErrorEndpoints.BAD_REQUEST)
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  get500Error() {
    this.httpClient
      .get(this.baseUrl + '/buggy/' + ErrorEndpoints.SERVER_ERROR)
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  get401Error() {
    this.httpClient
      .get(this.baseUrl + '/buggy/' + ErrorEndpoints.UNAUTHORIZED)
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  get400ValidationError() {
    this.httpClient
      .post(this.baseUrl + '/account/' + ErrorEndpoints.REGISTER, {})
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          console.log(error);
          this.validationErrors.set(error);
        },
      });
  }
}
