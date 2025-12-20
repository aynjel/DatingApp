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
import { AuthService } from '../../modules/auth/services/auth.service';
import { TokenResponse } from '../models/common-models';
import { RegisterUserRequest } from '../models/dto/request/register-user.request';
import { AuthUserResponse } from '../models/dto/response/auth-user.response';
import { User } from '../models/user.model';
import { ToastService } from '../services/toast.service';
import { GlobalStore } from './global.store';

type AuthStoreType = {
  currentUser: User | undefined;
  isLoggedIn: boolean;
  token: TokenResponse | undefined;
};

const initialState: AuthStoreType = {
  currentUser: undefined,
  isLoggedIn: false,
  token: undefined,
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

    const setToken = (token: TokenResponse | undefined) => {
      patchState(store, { token });
    };

    const signIn = store.globalStore.withFormSubmission<
      LoginUserRequest,
      AuthUserResponse
    >((payload) =>
      store.authService.login(payload).pipe(
        tapResponse({
          next: (response) => {
            store.toastService.show(
              `Welcome ${response.displayName}!`,
              'success'
            );
            setIsLoggedIn(true);
            setToken(response.token);
            getCurrentUser();
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
            store.toastService.show(
              `Welcome ${response.displayName}!`,
              'success'
            );
            setIsLoggedIn(true);
            setToken(response.token);
            getCurrentUser();
          },
          error: (error: HttpErrorResponse) => {
            console.error('Registration error:', error);
          },
        })
      )
    );

    const logout = () => {
      store.resetState();
      setIsLoggedIn(false);
      setToken(undefined);
      setCurrentUser(undefined);
      store.toastService.show('Logged out successfully.', 'success');

      // Reload page after a short delay to ensure state is cleared
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    };

    const getCurrentUser = store.globalStore.withApiState<void, User>(() =>
      store.authService.getCurrentUser().pipe(
        tapResponse({
          next: (response) => {
            setCurrentUser(response);
          },
          error: (error: HttpErrorResponse) => {
            console.error('Get Current User error:', error);
            // force logout
            logout();
          },
        })
      )
    );

    return {
      setCurrentUser,
      setIsLoggedIn,
      setToken,

      signIn,
      signUp,
      logout,
      getCurrentUser,
    };
  })
);
