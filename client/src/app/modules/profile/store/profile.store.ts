import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tapResponse } from '@ngrx/operators';
import { signalStore, withMethods, withProps } from '@ngrx/signals';
import { Member } from '../../../shared/models/member.model';
import { MemberService } from '../../../shared/services/member.service';
import { ToastService } from '../../../shared/services/toast.service';
import { AuthStore } from '../../../shared/store/auth.store';
import { GlobalStore } from '../../../shared/store/global.store';
import { CreateMemberDetailsRequest } from '../models/create-member.models';

export const ProfileStore = signalStore(
  { providedIn: 'root' },
  withProps(() => ({
    authStore: inject(AuthStore),
    globalStore: inject(GlobalStore),
    memberService: inject(MemberService),
    toastService: inject(ToastService),
    router: inject(Router),
  })),
  withMethods((store) => {
    const createMemberDetails = store.globalStore.withFormSubmission<
      { userId: string; payload: CreateMemberDetailsRequest },
      Member
    >(({ userId, payload }) =>
      store.memberService.createMemberDetails(userId, payload).pipe(
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

    return {
      createMemberDetails,
    };
  })
);
