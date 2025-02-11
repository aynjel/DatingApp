import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { NgrxError } from 'src/app/types/error.types';
import { TUser } from '../../types/user.models';
import {
  ErrorMessage,
  LoginUser,
  LogoutUser,
  RegisterUser,
  ResetStore,
} from '../actions/actions';
import * as fromStore from '../index';

@Injectable({
  providedIn: 'root',
})
export class Sandbox {
  user$: Observable<TUser | null> = this.store.pipe(select(fromStore.getUser));
  errorMessage$: Observable<string | null> = this.store.pipe(
    select(fromStore.getErrorMessage)
  );

  constructor(private store: Store<fromStore.State>) {}

  login(user: TUser): Guid {
    const transId = Guid.create();
    this.store.dispatch(new LoginUser([transId, user]));
    return transId;
  }

  register(user: TUser): Guid {
    const transId = Guid.create();
    this.store.dispatch(new RegisterUser([transId, user]));
    return transId;
  }

  logout(): void {
    this.store.dispatch(new LogoutUser());
  }

  setErrorMessage(message: string): void {
    this.store.dispatch(new ErrorMessage(message));
  }

  resetStore(): void {
    this.store.dispatch(new ResetStore());
  }

  isLoading$(transId: Guid): Observable<boolean | undefined> {
    return this.store.pipe(select(fromStore.getIsLoading(transId)));
  }

  hasFailure$(transId: Guid): Observable<NgrxError | undefined> {
    return this.store.pipe(select(fromStore.getHasFailure(transId)));
  }
}
