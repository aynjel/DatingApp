import { withReset, withStorageSync } from '@angular-architects/ngrx-toolkit';
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoginUserRequest } from '@model/dto/request/login-user.request';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { RegisterUserRequest } from '../../../shared/models/dto/request/register-user.request';
import { AuthUserResponse } from '../../../shared/models/dto/response/auth-user.response';
import { User } from '../../../shared/models/user.model';
import { ToastService } from '../../../shared/services/toast.service';
import { GlobalStore } from '../../../store/global.store';
import { AuthService } from '../services/auth.service';

type AuthStoreType = {
  currentUser: User | undefined;
  isLoggedIn: boolean;
  accessToken: string | undefined;
};

const initialState: AuthStoreType = {
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
    toastService: inject(ToastService),
  })),
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
      AuthUserResponse
    >((payload) =>
      store.authService.login(payload).pipe(
        tapResponse({
          next: (response) => {
            setIsLoggedIn(true);
            setAccessToken(response.token.accessToken);
          },
          error: (error: HttpErrorResponse) => {
            console.error('Login error:', error);
          },
        })
      )
    );

    const signUp = store.globalStore.withFormSubmission<
      RegisterUserRequest,
      AuthUserResponse
    >((payload) =>
      store.authService.registerUser(payload).pipe(
        tapResponse({
          next: (response) => {
            setIsLoggedIn(true);
            setAccessToken(response.token.accessToken);
          },
          error: (error: HttpErrorResponse) => {
            console.error('Registration error:', error);
          },
        })
      )
    );

    const logout = store.globalStore.withApiState<void, true>(() =>
      store.authService.logout().pipe(
        tapResponse({
          next: (response) => {
            store.resetState();
            setIsLoggedIn(false);
            setAccessToken(undefined);
            setCurrentUser(undefined);
            store.toastService.show('Logged out successfully.', 'success');
          },
          error: (error: HttpErrorResponse) => {
            console.error('Logout error:', error);
          },
        })
      )
    );

    const getCurrentUser = store.globalStore.withApiState<void, User>(() =>
      store.authService.getCurrentUser().pipe(
        tapResponse({
          next: (response) => {
            setCurrentUser(response);
          },
          error: (error: HttpErrorResponse) => {
            console.error('Get Current User error:', error);
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
      logout,
      getCurrentUser,
    };
  })
);
