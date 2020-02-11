import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Injectable } from '@angular/core';
import * as fromApp from '../store/app.reducer';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  private token: string;

  constructor(private store: Store<fromApp.AppState>) {
    this.store.select('auth').subscribe(authState => {
      this.token = authState.accessToken;
    });
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const headersConfig = {};

    if (this.token) {
      headersConfig['Authorization'] = `Bearer ${this.token}`;
    }

    const request = req.clone({ setHeaders: headersConfig });
    return next.handle(request);
  }
}
