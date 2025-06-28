import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private router: Router
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token');

    if (token) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }
    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpResponse) {
          console.log(error.url);
          if (error.status === 401 || error.status === 403) {
            if (this.router.url === '/login') {
              //Do nothing
            } else {
              localStorage.removeItem('token');
              this.router.navigate(['/']);
            }
          }
        }
        return throwError(error);
      })
    );
  }
}
