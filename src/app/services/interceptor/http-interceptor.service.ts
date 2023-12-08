import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs';
import { LoginService } from '../login.service';
import { environment } from '../../environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private apiService: ApiService, private loginService: LoginService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add header with basic auth credentials if user is logged in and request is to the api url
    const user = this.loginService.userValue;
    const isLoggedIn = user?.authdata;
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    if (isLoggedIn && isApiUrl) {
        request = request.clone({
            setHeaders: { 
                Authorization: `Basic ${user.authdata}`
            }
        });
    }

    return next.handle(request);
}

  // Done for JWT (Not working -- CORS error)
  // intercept(request: HttpRequest<any>, next: HttpHandler) {
  //   if (request.url === 'http://localhost:9091/token') {
  //     return next.handle(request);
  //   }

  //   let token = localStorage.getItem('token');
  //   let basicAuthHeaderString = 'Bearer ' + token;

  //   if (token != null) {
  //     request = request.clone({
  //       setHeaders: {
  //         Authorization: basicAuthHeaderString
  //       }
  //     })
  //   }

  //   return next.handle(request);
  // }
}
