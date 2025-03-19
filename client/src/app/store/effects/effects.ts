import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { CommonHttpService } from '../../services/common-http.service';
import {
  ActionTypes,
  Failure,
  LoginUser,
  LoginUserSuccess,
  RegisterUser,
  RegisterUserSuccess,
} from '../actions/actions';

@Injectable()
export class Effects {
  login$: Observable<Action> = createEffect(() => {
    return this.actions$.pipe(
      ofType(ActionTypes.LOGIN_USER),
      map((action: LoginUser) => action.payload),
      switchMap(([transId, payload]) => {
        return this.commonHttpService.login(payload).pipe(
          map((user) => new LoginUserSuccess([transId, user])),
          catchError((error: HttpErrorResponse) =>
            of(new Failure([transId, { concern: 'LOGIN_USER', error }]))
          )
        );
      })
    );
  });

  register$: Observable<Action> = createEffect(() => {
    return this.actions$.pipe(
      ofType(ActionTypes.REGISTER_USER),
      map((action: RegisterUser) => action.payload),
      switchMap(([transId, payload]) => {
        return this.commonHttpService.register(payload).pipe(
          map((user) => new RegisterUserSuccess([transId, user])),
          catchError((error: HttpErrorResponse) =>
            of(new Failure([transId, { concern: 'REGISTER_USER', error }]))
          )
        );
      })
    );
  });

  constructor(
    private actions$: Actions,
    private commonHttpService: CommonHttpService
  ) {}
}
