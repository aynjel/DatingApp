import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import {
  ApplicationConfig,
  DOCUMENT,
  importProvidersFrom,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  RendererFactory2,
} from '@angular/core';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideSweetAlert2 } from '@sweetalert2/ngx-sweetalert2';
import { AvatarModule } from 'ngx-avatar-2';
import { lastValueFrom, of } from 'rxjs';
import { routes } from './app.routes';
import { AuthStore } from './modules/auth/store/auth.store';
import { errorInterceptor } from './shared/interceptors/error.interceptor';
import { jwtInterceptor } from './shared/interceptors/jwt.interceptor';

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
    provideAppInitializer(async () => {
      const authStore = inject(AuthStore);
      const rendererFactory = inject(RendererFactory2);
      const renderer = rendererFactory.createRenderer(null, null);
      const document = inject(DOCUMENT);

      return new Promise<void>((resolve) => {
        setTimeout(async () => {
          try {
            if (authStore.isLoggedIn()) {
              await lastValueFrom(of(authStore.getCurrentUser()));
            }
          } finally {
            console.log('Initialization Complete');
            const splash = document.querySelector('#initial-splash');
            if (splash) {
              const parent = renderer.parentNode(splash);
              if (parent) {
                renderer.removeChild(parent, splash);
              }
            }
            resolve();
          }
        }, 500);
      });
    }),
    importProvidersFrom(AvatarModule),
  ],
};
