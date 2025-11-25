import { withReset, withStorageSync } from '@angular-architects/ngrx-toolkit';
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginUserRequest } from '@model/dto/request/login-user.request';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  type,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { withEntities } from '@ngrx/signals/entities';
import { RegisterUserRequest } from '../../../shared/models/dto/request/register-user.request';
import { LoginUserResponse } from '../../../shared/models/dto/response/login-user.response';
import { RegisterUserResponse } from '../../../shared/models/dto/response/register-user.response';
import { User } from '../../../shared/models/user';
import { GlobalStore } from '../../../store/global.store';
import { AuthService } from '../services/auth.service';

type AuthStore = {
  currentUser: User | undefined;
  isLoggedIn: boolean;
  accessToken: string | undefined;
};

const initialState: AuthStore = {
  currentUser: undefined,
  isLoggedIn: false,
  accessToken: undefined,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withStorageSync('auth'),
  withReset(),
  withProps(() => ({
    globalStore: inject(GlobalStore),
    authService: inject(AuthService),
    router: inject(Router),
  })),
  withEntities({
    collection: 'user',
    entity: type<User>(),
  }),
  withMethods((store) => {
    const setCurrentUser = (user: User | undefined) => {
      patchState(store, { currentUser: user });
    };

    const setIsLoggedIn = (isLoggedIn: boolean) => {
      patchState(store, { isLoggedIn });
    };

    const setAccessToken = (accessToken: string | undefined) => {
      patchState(store, { accessToken });
    };

    const signIn = store.globalStore.withFormSubmission<
      LoginUserRequest,
      LoginUserResponse
    >((payload) =>
      store.authService.login(payload).pipe(
        tapResponse({
          next: (response) => {
            setCurrentUser(response);
            setIsLoggedIn(true);
            setAccessToken(response.token.accessToken);
            store.router.navigate(['/dashboard']);
          },
          error: (error: HttpErrorResponse) => {
            console.error('Login error:', error);
          },
        })
      )
    );

    const signUp = store.globalStore.withFormSubmission<
      RegisterUserRequest,
      RegisterUserResponse
    >((payload) =>
      store.authService.registerUser(payload).pipe(
        tapResponse({
          next: (response) => {
            setCurrentUser(response);
            setIsLoggedIn(true);
            setAccessToken(response.token);
            store.router.navigate(['/dashboard']);
          },
          error: (error: HttpErrorResponse) => {
            console.error('Registration error:', error);
          },
        })
      )
    );

    return {
      setCurrentUser,
      setIsLoggedIn,
      setAccessToken,

      signIn,
      signUp,
    };
  })
);
