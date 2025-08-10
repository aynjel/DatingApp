import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token =
    'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im9ydGVnYWNhbmlsbG83Ni4xQGdtYWlsLmNvbSIsIm5hbWVpZCI6IjljOWFmMTdlLWQ0NGMtNDUzNS1iZjYyLTAwYWYwYzFkZjc2YyIsIm5iZiI6MTc1NDgwMzI4MiwiZXhwIjoxNzU0ODA2ODgyLCJpYXQiOjE3NTQ4MDMyODJ9.sBCLje4AxaVgGkWt8oBIgOrrn0Fqsq8Va8Fybt1_hMi3BCMhSuZp9p1_hPH97yIOOr9CPNdwuOiPLKslav_qiA';
  const modifiedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
  return next(modifiedRequest);
};
