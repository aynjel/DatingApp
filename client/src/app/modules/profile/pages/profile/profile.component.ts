import { Component, computed, inject, viewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { LucideAngularModule } from 'lucide-angular';
import { Photo } from '../../../../shared/models/member.model';
import { ModalService } from '../../../../shared/services/modal.service';
import { PhotoManagementModalComponent } from '../../components/photo-management-modal/photo-management-modal.component';
import { PhotoUploadModalComponent } from '../../components/photo-upload-modal/photo-upload-modal.component';
import { ProfileAboutComponent } from '../../components/profile-about/profile-about.component';
import {
  DetailInfo,
  ProfileDetailsComponent,
} from '../../components/profile-details/profile-details.component';
import { ProfileHeaderComponent } from '../../components/profile-header/profile-header.component';
import { ProfilePhotosComponent } from '../../components/profile-photos/profile-photos.component';
import { ProfileStore } from '../../store/profile.store';

@Component({
  selector: 'app-profile',
  imports: [
    LucideAngularModule,
    SwalComponent,
    ProfileHeaderComponent,
    ProfileAboutComponent,
    ProfileDetailsComponent,
    ProfilePhotosComponent,
  ],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  private profileStore = inject(ProfileStore);
  private modalService = inject(ModalService);

  protected logoutAlert = viewChild<SwalComponent>('logoutAlert');

  protected memberDetails = computed(() =>
    this.profileStore.authStore.memberDetails()
  );

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

  private confirmDeleteSwal =
    viewChild.required<SwalComponent>('confirmDeleteSwal');

  onLogout() {
    this.profileStore.authStore.logout();
  }

  openPhotoUploadModal(): void {
    this.modalService.open(PhotoUploadModalComponent, {
      existingPhotos: this.memberDetails()?.photos || [],
      photoSelected: (file: File) => {
        this.profileStore.uploadProfilePhoto({
          data: file,
          onSuccess: () => {
            this.modalService.close();
          },
        });
      },
      existingPhotoSelected: (photo: Photo) => {
        this.profileStore.setMainPhoto({
          data: photo.id,
          onSuccess: () => {
            this.modalService.close();
          },
        });
      },
    });
  }

  openPhotoManagementModal(): void {
    this.modalService.open(PhotoManagementModalComponent, {
      photos: this.memberDetails()?.photos || [],
      deletePhotoClicked: (photoId: string) =>
        this.handleConfirmDelete(photoId),
    });
  }

  private handleConfirmDelete(photoId: string): void {
    this.modalService.close();
    this.confirmDeleteSwal()
      .fire()
      .then((result) => {
        console.log(result);
        if (result.isConfirmed) {
          this.profileStore.deletePhoto({
            data: photoId,
          });
        } else {
          this.openPhotoManagementModal();
        }
      });
  }
}
