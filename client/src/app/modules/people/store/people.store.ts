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
import { Member, MemberParams } from '../../../shared/models/member.model';
import { Pagination } from '../../../shared/models/pagination.models';
import { MemberService } from '../../../shared/services/member.service';
import { ToastService } from '../../../shared/services/toast.service';
import { GlobalStore } from '../../../shared/store/global.store';

type PeopleStoreType = {
  members: Member[];
  pagination: Pagination;
  searchTerm: string;
};

const memberParams = new MemberParams();
const initialState: PeopleStoreType = {
  members: [],
  pagination: {
    currentPage: memberParams.pageNumber,
    itemsPerPage: memberParams.pageSize,
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
      MemberParams,
      HttpResponse<Member[]>
    >((params: MemberParams) =>
      store.memberService.getMembers(params).pipe(
        tapResponse({
          next: (response) => {
            patchState(store, {
              members: response.body || [],
              pagination: JSON.parse(
                response.headers.get('Pagination') as string
              ) as Pagination,
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
