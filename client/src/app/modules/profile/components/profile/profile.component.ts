import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthStore } from '../../../auth/store/auth.store';

@Component({
  selector: 'app-profile',
  imports: [JsonPipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  protected authStore = inject(AuthStore);
}
