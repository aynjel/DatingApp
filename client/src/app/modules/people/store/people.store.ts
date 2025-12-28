import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import {
  PaginationHeaderResponse,
  PaginationParams,
} from '../../../shared/models/common-models';
import { Member } from '../../../shared/models/member.model';
import { MemberService } from '../../../shared/services/member.service';
import { ToastService } from '../../../shared/services/toast.service';
import { GlobalStore } from '../../../shared/store/global.store';

type PeopleStoreType = {
  members: Member[];
  pagination: PaginationHeaderResponse;
};

const initialState: PeopleStoreType = {
  members: [],
  pagination: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
  },
};

export const PeopleStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps(() => ({
    globalStore: inject(GlobalStore),
    memberService: inject(MemberService),
    toastService: inject(ToastService),
  })),
  withMethods((store) => {
    const getMembers = store.globalStore.withApiState<
      PaginationParams,
      { data: Member[]; pagination: PaginationHeaderResponse }
    >(({ pageNumber = 1, pageSize = 10 }) =>
      store.memberService.getMembers({ pageNumber, pageSize }).pipe(
        tapResponse({
          next: (response) => {
            patchState(store, {
              members: response.data,
              pagination: response.pagination,
            });
          },
          error: (error: HttpErrorResponse) => {
            store.toastService.show(
              error.error.message || 'Something went wrong',
              'error'
            );
          },
        })
      )
    );

    return {
      getMembers,
    };
  })
);
