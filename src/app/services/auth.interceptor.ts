import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const basicAuth = btoa('admin:everthing@123');
  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Basic ${basicAuth}`),
  });
  return next(authReq);
};
