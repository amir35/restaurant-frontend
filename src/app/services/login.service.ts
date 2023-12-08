import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { SignUpCredentials, Token, Users } from '../models/Users';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment.dev';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  isLoggedIn = false;
  isLogIn: BehaviorSubject<boolean>;
  welcomeUser = new BehaviorSubject<string>('LoginUser');

  private userSubject: BehaviorSubject<Users | null>;
  public user: Observable<Users | null>;

  constructor(
    private route: Router,
    private http: HttpClient,
    private apiService: ApiService
  ) {
    this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
    this.user = this.userSubject.asObservable();
  }

  public get userValue() {
    return this.userSubject.value;
  }

  login(username: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/authenticate`, { username, password })
      .pipe(map(user => {
        // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
        console.log("User found");
        user.authdata = window.btoa(username + ':' + password);
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.route.navigate(['/login']);
  }

  userLoggedIn() {
    const user = localStorage.getItem('user');
    return !(user === null);
  }


  // authenticateUser(credential: SignUpCredentials): any {
  //   let uId = this.apiService.generateToken(credential);
  //   console.log(uId);
  //   return uId;
  // }

  // loginUser(token) {
  //   console.log(token);
  //   //return this.apiService.loginUser(tokenStr);
  //   return this.apiService.basicAuthentication(token);
  // }

  // getAuthStatus(): Observable<boolean> {
  //   return this.isLogIn.asObservable();
  //   //return;
  // }


  // doLogOut() {
  //   // remove the key 'userId' if exists
  //   localStorage.removeItem('userId');
  //   this.route.navigate(['/login']);
  // }

  // userLoggedIn() {
  //   // const userId = localStorage.getItem('userId');
  //   const token = localStorage.getItem('token');
  //   return !(token === null);
  // }

}
