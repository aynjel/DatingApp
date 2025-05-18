import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ErrorState {
  key: string;
  message: string;
  status: ErrorStatus;
}

export enum ErrorStatus {
  ERROR = 'ERROR',
  WARNING = 'WARNING',
}

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private errorSubject = new BehaviorSubject<ErrorState[]>([]);

  readonly errors$: Observable<ErrorState[]> = this.errorSubject.asObservable();

  constructor() {}

  setError(error: ErrorState): void {
    this.errorSubject.next([...this.errorSubject.getValue(), error]);
  }

  clearError(): void {
    this.errorSubject.next([]);
  }

  removeError(key: string): void {
    const errors = this.errorSubject.getValue();
    const updatedErrors = errors.filter((error) => error.key !== key);
    this.errorSubject.next(updatedErrors);
  }

  getErrors(): ErrorState[] {
    return this.errorSubject.getValue();
  }

  getError(key: string): ErrorState | null {
    const errors = this.errorSubject.getValue();
    const error = errors.find((error) => error.key === key);
    return error || null;
  }

  getErrorCount(): number {
    return this.errorSubject.getValue().length;
  }
}
