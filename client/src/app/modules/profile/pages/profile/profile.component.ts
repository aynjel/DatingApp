import { Component, inject } from '@angular/core';
import { AuthStore } from '../../../../shared/store/auth.store';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  protected authStore = inject(AuthStore);

  // Mock fallback data for fields not present on the current user model
  protected mock: any = {
    displayName: 'Jane Doe',
    age: 28,
    location: 'New York, NY',
    bio: 'Outdoor enthusiast. Coffee lover. Amateur photographer. Looking for someone to explore the world with.',
    photos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80&auto=format&fit=crop',
    ],
    interests: ['Hiking', 'Travel', 'Cooking', 'Photography'],
  };

  protected get user(): any {
    return this.authStore.currentUser() ?? this.mock;
  }

  protected get photos(): string[] {
    return this.user?.photos && this.user.photos.length
      ? this.user.photos
      : this.mock.photos;
  }
}
