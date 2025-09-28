import { Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiError } from '../../shared/models/common-models';

@Component({
  selector: 'app-server-error',
  imports: [],
  templateUrl: './server-error.html',
})
export class ServerError {
  private router = inject(Router);
  private location = inject(Location);

  protected error = signal<ApiError | null>(null);
  protected showDetails = signal<boolean>(false);

  constructor() {
    const navigation = this.router.getCurrentNavigation();

    this.error.set(navigation?.extras?.state?.['error']);
  }

  detailsToggle() {
    this.showDetails.update((state) => !state);
  }

  goBack(): void {
    this.location.back();
  }
}
