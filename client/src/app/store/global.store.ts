import { inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, finalize, Observable, pipe, switchMap, tap } from 'rxjs';
import { ToastService } from '../shared/services/toast.service';

export type WithCallbacks<T, S> = {
  data: T;
  onSuccess?: (response: S) => void;
  onError?: (error: any) => void;
};

type GlobalStore = {
  isSubmitting: boolean;
};

const initialState: GlobalStore = {
  isSubmitting: false,
};

export const GlobalStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps(() => ({
    toastService: inject(ToastService),
  })),
  withMethods((store) => ({
    withFormSubmission<T, S>(source$: (source: T) => Observable<S>) {
      return rxMethod<WithCallbacks<T, S>>(
        pipe(
          tap(() => patchState(store, { isSubmitting: true })),
          debounceTime(300),
          switchMap((cb) =>
            source$(cb.data).pipe(
              tap({
                next: (response) => {
                  cb.onSuccess?.(response);
                  store.toastService.show(
                    'Operation completed successfully.',
                    'success'
                  );
                },
                error: (error) => {
                  cb.onError?.(error);
                  store.toastService.show(
                    'An error occurred. Please try again.',
                    'error'
                  );
                },
              }),
              finalize(() => {
                patchState(store, { isSubmitting: false });
              })
            )
          )
        )
      );
    },
    withApiState<T, S>(source$: (data: T) => Observable<S>) {
      return rxMethod<T>(pipe(switchMap(source$)));
    },
  }))
);
