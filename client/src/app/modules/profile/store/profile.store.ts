import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tapResponse } from '@ngrx/operators';
import { signalStore, withMethods, withProps } from '@ngrx/signals';
import { BatchPhotoUploadResponseDto } from '../../../shared/models/dto/response/photo.response';
import { Member } from '../../../shared/models/member.model';
import { ToastService } from '../../../shared/services/toast.service';
import { AuthStore } from '../../../shared/store/auth.store';
import { GlobalStore } from '../../../shared/store/global.store';
import { CreateMemberDetailsRequest } from '../models/create-member.models';
import { ProfileService } from '../services/profile.service';

export const ProfileStore = signalStore(
  { providedIn: 'root' },
  withProps(() => ({
    authStore: inject(AuthStore),
    globalStore: inject(GlobalStore),
    profileService: inject(ProfileService),
    toastService: inject(ToastService),
    router: inject(Router),
  })),
  withMethods((store) => {
    const createMemberDetails = store.globalStore.withFormSubmission<
      CreateMemberDetailsRequest,
      Member
    >((payload) =>
      store.profileService.createMemberDetails(payload).pipe(
        tapResponse({
          next: (response) => {
            store.toastService.show(
              `${response.displayName} profile created successfully.`,
              'success'
            );
            store.authStore.setMemberDetails(response);
            store.router.navigate(['/profile/me']);
          },
          error: (error: HttpErrorResponse) => {
            store.toastService.show(
              error.error.detail || 'Something went wrong',
              'error'
            );
          },
        })
      )
    );

    const updateMemberDetails = store.globalStore.withFormSubmission<
      CreateMemberDetailsRequest,
      Member
    >((payload) =>
      store.profileService.updateMemberDetails(payload).pipe(
        tapResponse({
          next: (response) => {
            store.toastService.show(
              `${response.displayName} profile updated successfully.`,
              'success'
            );
            store.authStore.setMemberDetails(response);
            store.router.navigate(['/profile/me']);
          },
          error: (error: HttpErrorResponse) => {
            store.toastService.show(
              error.error.detail || 'Something went wrong',
              'error'
            );
          },
        })
      )
    );

    const uploadBatchPhotos = store.globalStore.withFormSubmission<
      File[],
      BatchPhotoUploadResponseDto
    >((files) =>
      store.profileService.uploadBatchPhotos(files).pipe(
        tapResponse({
          next: (response) => {
            store.toastService.show(
              `${response.totalUploaded} photos uploaded successfully.`,
              'success'
            );
            store.authStore.setPhotos(response.photos);
          },
          error: (error: HttpErrorResponse) => {
            store.toastService.show(
              error.error.detail || 'Something went wrong',
              'error'
            );
          },
        })
      )
    );

    const uploadProfilePhoto = store.globalStore.withFormSubmission<File, void>(
      (file) =>
        store.profileService.uploadProfilePhoto(file).pipe(
          tapResponse({
            next: () => {
              store.authStore.getCurrentUser();
              store.toastService.show(
                `Profile photo uploaded successfully.`,
                'success'
              );
            },
            error: (error: HttpErrorResponse) => {
              store.toastService.show(
                error.error.detail || 'Something went wrong',
                'error'
              );
            },
          })
        )
    );

    const deletePhoto = store.globalStore.withFormSubmission<string, void>(
      (photoId) =>
        store.profileService.deletePhoto(photoId).pipe(
          tapResponse({
            next: () => {
              store.authStore.getCurrentUser();
              store.toastService.show(`Photo deleted successfully.`, 'success');
            },
            error: (error: HttpErrorResponse) => {
              store.toastService.show(
                error.error.detail || 'Something went wrong',
                'error'
              );
            },
          })
        )
    );

    const setMainPhoto = store.globalStore.withFormSubmission<string, void>(
      (photoId) =>
        store.profileService.setMainPhoto(photoId).pipe(
          tapResponse({
            next: () => {
              store.toastService.show(
                `Main photo updated successfully.`,
                'success'
              );
              store.authStore.getCurrentUser();
            },
            error: (error: HttpErrorResponse) => {
              store.toastService.show(
                error.error.detail || 'Something went wrong',
                'error'
              );
            },
          })
        )
    );

    return {
      createMemberDetails,
      updateMemberDetails,
      uploadBatchPhotos,
      uploadProfilePhoto,
      deletePhoto,
      setMainPhoto,
    };
  })
);
