import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { SignUpCredentials, Token, Users } from '../models/Users';
import { environment } from '../environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  API_URL: String;
  AUTH_API_URL = '/auth/server/';

  constructor(private http: HttpClient) { 
    this.API_URL = 'api';
   }

   getAll() {
    return this.http.get(`${environment.apiUrl}/owner`);
}

  public generateToken(credential : SignUpCredentials): Observable<any> {
    return this.http.post("http://localhost:8080/token",credential);

  }

  public getWelcomeMessage(): Observable<any> {
    return this.http.get("http://localhost:8080/owner/welcome");

  }

  public loginUser(tokenStr : any) {
      return this.http.get("http://localhost:8080/owner/welcome");
  }

  public basicAuthentication(token): Observable<any> {
    return this.http.get("http://localhost:8080/owner/welcome");
  }

  public registerUser(userDetails: any): Observable<any> {
    return this.http.post("http://localhost:8080/owner/saveOwner",  userDetails);
  }

  public getCityList(): Observable<any> {
    return this.http.get("http://localhost:3000/cities");
  }


}
