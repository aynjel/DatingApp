import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { filter, map, Observable } from 'rxjs';
import {
  ErrorService,
  ErrorState,
  ErrorStatus,
} from './services/error.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'DatingApp';

  @ViewChild('error', { static: false }) error: ElementRef | undefined;

  errorMessages$: Observable<ErrorState[]> = this.errorService.errors$.pipe(
    filter((error) => !!error),
    map((error) => {
      if (this.error) {
        this.error.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
      return error;
    })
  );

  constructor(private errorService: ErrorService) {}

  ngOnInit(): void {
    this.errorService.setError({
      key: 'testError',
      message: 'This is a test error message',
      status: ErrorStatus.ERROR,
    });
  }
}
