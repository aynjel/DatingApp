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
import { routes } from './app.routes';
import { errorInterceptor } from './shared/interceptors/error.interceptor';
import { jwtInterceptor } from './shared/interceptors/jwt.interceptor';
import { AuthStore } from './shared/store/auth.store';

const initializeApp = () => {
  const authStore = inject(AuthStore);
  const document = inject(DOCUMENT);
  const renderer = inject(RendererFactory2).createRenderer(null, null);

  if (authStore.isLoggedIn()) {
    authStore.getCurrentUser();
  }

  return new Promise<void>((resolve) => {
    setTimeout(() => {
      const splash = document.getElementById('initial-splash');

      if (splash) {
        const parent = renderer.parentNode(splash) ?? document.body;
        renderer.removeChild(parent, splash);
      }

      console.log('🚀 Initialization Complete');
      resolve();
    }, 500);
  });
};

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
    provideAppInitializer(async () => await initializeApp()),
    importProvidersFrom(AvatarModule),
  ],
};
