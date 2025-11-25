import {
  ApplicationConfig,
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
import { routes } from './app.routes';
import { errorInterceptor } from './shared/interceptors/error-interceptor';
import { jwtInterceptor } from './shared/interceptors/jwt-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withViewTransitions()),
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withFetch(),
      withInterceptors([jwtInterceptor, errorInterceptor])
    ),
    provideSweetAlert2({
      fireOnInit: false,
      dismissOnDestroy: true,
    }),
    // provideAppInitializer(async () => {
    //   const authStore = inject(AuthStore);

    //   return new Promise<void>((resolve) => {
    //     setTimeout(async () => {
    //       try {
    //         await lastValueFrom(authStore.initializeStore());
    //       } finally {
    //         console.log('Initialization Complete');
    //         const splash = document.getElementById('initial-splash');
    //         if (splash) {
    //           splash.remove();
    //         }
    //         resolve();
    //       }
    //     }, 500);
    //   });
    // }),
  ],
};
