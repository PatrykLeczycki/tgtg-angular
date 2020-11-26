import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {AuthService} from './auth.service';
import {catchError, exhaustMap, take, tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.user.pipe(take(1), exhaustMap(user => {

      if (!user) {
        return next.handle(req);
      }

      const modifiedReq = req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + user.token
        }
      });

      // return next.handle(modifiedReq);
      return next.handle(modifiedReq).pipe(
        tap(event => {
          console.log(event);
          if (event instanceof HttpResponse) {
            if (event.body && event.body.success) {
              console.log('Success!');
            }
          }
        }),
        catchError((err: any) => {
          if (err instanceof HttpErrorResponse && err.error && err.error.status && err.error.status === 401) {
            console.log(err);
            console.log(req);
            console.log(next);
            console.log(this.router);
            console.log(this.route);
            // this.authService.user = null;
            // this.router.navigate(['/auth'], {
            //   queryParams: {
            //     redirectUrl: state.url
            //   }
            // });
          }
          return of(err);
        }));
    }));
  }
}
