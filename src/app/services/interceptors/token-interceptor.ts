import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpXsrfTokenExtractor,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private kcService: KeycloakService,
    private tokenExtractor: HttpXsrfTokenExtractor
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const noAuthUrls = [
      '/template/template/',
      '/template/render/',
    ]

    const requiresAuth = !noAuthUrls.some(url => request.url.includes(url));

    if(requiresAuth) {
      const authToken = this.kcService.getKeycloakInstance().token || '';
      const token = this.tokenExtractor.getToken() as string;
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + authToken,
        },
      });
    }

    return next.handle(request);
  }
}
