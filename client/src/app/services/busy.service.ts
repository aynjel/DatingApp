import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class BusyService {
  busyRequestCount: number = 0;

  constructor(private spinnerService: NgxSpinnerService) {}

  busy(): void {
    this.busyRequestCount++;
    this.spinnerService.show(undefined, {
      type: 'ball-newton-cradle',
      bdColor: 'rgba(0, 0, 0, 0.8)',
      color: '#ffffff',
    });
  }

  idle(): void {
    this.busyRequestCount--;
    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this.spinnerService.hide();
    }
  }
}
