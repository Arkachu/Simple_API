import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class WebReqInterceptor implements HttpInterceptor {

  constructor(private authserv: AuthService, private router: Router) {}

  // Méthode pour intercepter les requêtes
  // On utilise cette méthode ici pour rediriger vers la page souhaitée en cas d'erreur et pour afficher une alerte
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        const uri = request.url.split('/')[3];
        if (err.status === 400) {
          this.router.navigate([`${uri}`]);
        } else if (err.status === 401) {
          this.router.navigate([`register`]);
        }
        window.alert(err.statusText);
        return throwError(err);
      })
    );
  }
}