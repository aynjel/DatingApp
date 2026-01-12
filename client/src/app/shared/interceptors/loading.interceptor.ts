import { HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { of, tap } from 'rxjs';

const cache = new Map<string, HttpEvent<any>>();

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method === 'GET') {
    const cachedResponse = cache.get(req.urlWithParams);
    if (cachedResponse) {
      return of(cachedResponse);
    }
  }

  return next(req).pipe(
    tap((event) => {
      if (req.method === 'GET') {
        cache.set(req.urlWithParams, event);
      }
    })
  );
};
