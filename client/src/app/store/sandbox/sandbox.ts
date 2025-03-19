import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { NgrxError } from 'src/app/types/error.types';
import { LoginRequest, RegisterRequest } from '../../types/api/request.models';
import { TUser } from '../../types/common.types';
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
  errorMessage$: Observable<string[]> = this.store.pipe(
    select(fromStore.getErrorMessage)
  );

  constructor(private store: Store<fromStore.State>) {}

  login(payload: LoginRequest): Guid {
    const transId = Guid.create();
    this.store.dispatch(new LoginUser([transId, payload]));
    return transId;
  }

  register(payload: RegisterRequest): Guid {
    const transId = Guid.create();
    this.store.dispatch(new RegisterUser([transId, payload]));
    return transId;
  }

  logout(): void {
    this.store.dispatch(new LogoutUser());
  }

  setErrorMessage(messages: string[]): void {
    this.store.dispatch(new ErrorMessage(messages));
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
