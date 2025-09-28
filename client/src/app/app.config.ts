import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideSweetAlert2 } from '@sweetalert2/ngx-sweetalert2';
import { lastValueFrom } from 'rxjs';
import { routes } from './app.routes';
import { jwtInterceptor } from './shared/interceptors/jwt-interceptor';
import { Auth } from './shared/services/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withViewTransitions()),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptors([jwtInterceptor])),
    provideSweetAlert2({
      fireOnInit: false,
      dismissOnDestroy: true,
    }),
    provideAppInitializer(async () => {
      const authService = inject(Auth);

      return new Promise<void>((resolve) => {
        setTimeout(async () => {
          try {
            await lastValueFrom(authService.retrieveUserAccount());
          } finally {
            console.log('Initialization Complete');
            const splash = document.getElementById('initial-splash');
            if (splash) {
              splash.remove();
            }
            resolve();
          }
        }, 500);
      });
    }),
  ],
};
