import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { CreateMemberDetailsRequest } from '../../modules/profile/models/create-member.models';
import { MemberService } from '../../modules/profile/services/member.service';
import { Member } from '../models/member.model';
import { ToastService } from '../services/toast.service';
import { AuthStore } from './auth.store';
import { GlobalStore } from './global.store';

type MemberStoreType = {
  member: Member | undefined;
};

const initialState: MemberStoreType = {
  member: undefined,
};

export const MemberStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps(() => ({
    globalStore: inject(GlobalStore),
    authStore: inject(AuthStore),
    memberService: inject(MemberService),
    toastService: inject(ToastService),
  })),
  withMethods((store) => {
    const createMemberDetails = store.globalStore.withFormSubmission<
      { userId: string; payload: CreateMemberDetailsRequest },
      Member
    >((payload) =>
      store.memberService
        .createMemberDetails(payload.userId, payload.payload)
        .pipe(
          tapResponse({
            next: (response) => {
              store.toastService.show(
                'Member details created successfully.',
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

    return {
      createMemberDetails,
    };
  }),
  withComputed((store) => ({
    member: computed(() => store.authStore.currentUser()?.memberDetails),
  }))
);
