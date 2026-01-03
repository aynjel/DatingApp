import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { PaginationHeaderResponse } from '../../../shared/models/common-models';
import { GetMemberRequest } from '../../../shared/models/dto/request/get-member.request';
import { Member } from '../../../shared/models/member.model';
import { MemberService } from '../../../shared/services/member.service';
import { ToastService } from '../../../shared/services/toast.service';
import { GlobalStore } from '../../../shared/store/global.store';

type PeopleStoreType = {
  members: Member[];
  pagination: PaginationHeaderResponse;
  searchTerm: string;
};

const initialState: PeopleStoreType = {
  members: [],
  pagination: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
  },
  searchTerm: '',
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
      GetMemberRequest | undefined,
      HttpResponse<Member[]>
    >((params?: GetMemberRequest) =>
      store.memberService.getMembers(params).pipe(
        tapResponse({
          next: (response) => {
            patchState(store, {
              members: response.body || [],
              pagination: JSON.parse(
                response.headers.get('Pagination') as string
              ) as PaginationHeaderResponse,
              searchTerm: params?.searchTerm || '',
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
