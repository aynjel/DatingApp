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
import { LikesService } from '../../../shared/services/likes.service';
import { MemberService } from '../../../shared/services/member.service';
import { ToastService } from '../../../shared/services/toast.service';
import { GlobalStore } from '../../../shared/store/global.store';

type PeopleStoreType = {
  members: Member[];
  pagination: Pagination;
  likedMemberIds: string[];
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
  likedMemberIds: [],
};

export const PeopleStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps(() => ({
    globalStore: inject(GlobalStore),
    memberService: inject(MemberService),
    likesService: inject(LikesService),
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
                response.headers.get('Pagination') as string,
              ) as Pagination,
            });
          },
          error: (error: HttpErrorResponse) => {
            store.toastService.show(
              error.error.message || 'Something went wrong',
              'error',
            );
          },
        }),
      ),
    );

    const toggleLike = (memberId: string) => {
      store.likesService.toggleLike(memberId).subscribe({
        next: () => {
          const filteredIds = store
            .likedMemberIds()
            .filter((id) => id !== memberId);
          patchState(store, {
            likedMemberIds: store.likedMemberIds().includes(memberId)
              ? filteredIds
              : [...store.likedMemberIds(), memberId],
          });
        },
        error: (error: HttpErrorResponse) => {
          store.toastService.show(
            error.error.message || 'Something went wrong',
            'error',
          );
        },
      });
    };

    const getLikeIds = store.globalStore.withApiState<void, string[]>(() =>
      store.likesService.getLikeIds().pipe(
        tapResponse({
          next: (likeIds: string[]) => {
            patchState(store, { likedMemberIds: likeIds });
          },
          error: (error: HttpErrorResponse) => {
            store.toastService.show(
              error.error.message || 'Something went wrong',
              'error',
            );
          },
        }),
      ),
    );

    const getMemberLikes = store.globalStore.withApiState<
      { predicate?: string; pageNumber: number; pageSize: number },
      Member[]
    >((params) =>
      store.likesService
        .getLikes(params.predicate, params.pageNumber, params.pageSize)
        .pipe(
          tapResponse({
            next: (members: Member[]) => {
              patchState(store, { members });
            },
            error: (error: HttpErrorResponse) => {
              store.toastService.show(
                error.error.message || 'Something went wrong',
                'error',
              );
            },
          }),
        ),
    );

    return {
      getMembers,
      toggleLike,
      getLikeIds,
      getMemberLikes,
    };
  }),
);
