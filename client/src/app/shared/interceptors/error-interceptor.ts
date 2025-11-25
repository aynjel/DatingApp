import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { catchError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error) {
        switch (error.status) {
          case 400:
            if (error.error.errors) {
              const modelErrors: string[] = [];
              const errorObj = error.error.errors;

              for (const key in errorObj) {
                if (errorObj[key]) {
                  modelErrors.push(errorObj[key]);
                }
              }
              throw modelErrors.flat();
            } else {
              toast.show(error.error, 'error');
            }
            break;

          case 401:
            toast.show('Unauthorized', 'error');
            break;

          case 404:
            router.navigateByUrl('/not-found');
            break;

          case 500:
            const navigationExtras: NavigationExtras = {
              state: { error: error.error },
            };
            router.navigateByUrl('/server-error', navigationExtras);
            break;

          default:
            toast.show('Something went wrong', 'error');
            break;
        }
      }

      throw error;
    })
  );
};
