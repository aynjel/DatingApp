import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { LucideAngularModule } from 'lucide-angular';
import { Photo } from '../../../../shared/models/member.model';
import { AuthStore } from '../../../../shared/store/auth.store';
import { PhotoUploadModalComponent } from '../../components/photo-upload-modal/photo-upload-modal.component';
import { ProfileAboutComponent } from '../../components/profile-about/profile-about.component';
import {
  DetailInfo,
  ProfileDetailsComponent,
} from '../../components/profile-details/profile-details.component';
import { ProfileHeaderComponent } from '../../components/profile-header/profile-header.component';
import { ProfilePhotosComponent } from '../../components/profile-photos/profile-photos.component';

@Component({
  selector: 'app-profile',
  imports: [
    LucideAngularModule,
    SwalComponent,
    PhotoUploadModalComponent,
    ProfileHeaderComponent,
    ProfileAboutComponent,
    ProfilePhotosComponent,
    ProfileDetailsComponent,
  ],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  private authStore = inject(AuthStore);
  protected logoutAlert = viewChild<SwalComponent>('logoutAlert');

  protected photoUploadModalOpen = signal(false);
  protected memberDetails = computed(() => this.authStore.memberDetails());

  protected profileDetails = computed<DetailInfo[]>(() => {
    const details = this.memberDetails();
    return [
      {
        label: 'Looking for',
        value: 'Not Specified',
      },
      {
        label: 'Occupation',
        value: 'Not Specified',
      },
      {
        label: 'Education',
        value: 'Not Specified',
      },
      {
        label: 'Religion',
        value: 'Not Specified',
      },
      {
        label: 'Address',
        value: details?.city
          ? `${details.city}, ${details.country}`
          : 'Not Specified',
      },
    ];
  });

  ngOnInit(): void {
    if (!this.authStore.memberDetails()) {
      this.authStore.getCurrentUser();
    }
  }

  onLogout() {
    this.authStore.logout();
  }

  openPhotoUploadModal(): void {
    this.photoUploadModalOpen.set(true);
  }

  onPhotoSelected(file: File): void {
    console.log('New photo selected:', file);
    // TODO: Implement photo upload logic here
  }

  onExistingPhotoSelected(photo: Photo): void {
    console.log('Existing photo selected:', photo);
    // TODO: Implement existing photo selection logic here
  }
}
