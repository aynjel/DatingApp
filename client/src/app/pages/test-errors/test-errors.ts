import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ErrorEndpoints } from '../../shared/constants/api-endpoints';

@Component({
  selector: 'app-test-errors',
  imports: [],
  templateUrl: './test-errors.html',
})
export class TestErrors {
  private httpClient = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/buggy/`;

  getTestError() {
    this.httpClient.get('https://localhost:5001/api/Buggy/test').subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  get404Error() {
    this.httpClient.get(this.baseUrl + ErrorEndpoints.NOT_FOUND).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  get400Error() {
    this.httpClient.get(this.baseUrl + ErrorEndpoints.BAD_REQUEST).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  get500Error() {
    this.httpClient.get(this.baseUrl + ErrorEndpoints.SERVER_ERROR).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  get401Error() {
    this.httpClient.get(this.baseUrl + ErrorEndpoints.UNAUTHORIZED).subscribe({
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
      .post(this.baseUrl + ErrorEndpoints.ACCOUNT_REGISTER, {})
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
}
