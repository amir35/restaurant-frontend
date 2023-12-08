import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { SignUpCredentials, Token, Users } from '../models/Users';
import { environment } from '../environments/environment.dev';
import { Category, Items } from '../models/Items';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  API_URL: String;
  AUTH_API_URL = '/auth/server/';

  constructor(private http: HttpClient) {
    this.API_URL = 'api';
  }

  getAll() {
    return this.http.get(`${environment.apiUrl}/owner`);
  }

  public loginUser(tokenStr: any) {
    return this.http.get("http://localhost:8080/employee/welcome");
  }

  public basicAuthentication(token): Observable<any> {
    return this.http.get("http://localhost:8080/employee/welcome");
  }

  public getAllCategories() {
    return this.http.get("http://localhost:8080/category");

  }

  public addCategory(category: Category): Observable<any> {
    return this.http.post("http://localhost:8080/category/saveCategory", category);
  }

  public deleteCategory(categoryId: number): Observable<any> {
    return this.http.delete("http://localhost:8080/category/" + categoryId);
  }

  public getCategory(categoryId: number): Observable<any> {
    console.log(categoryId);
    return this.http.get("http://localhost:8080/category/" + categoryId);
  }

  public editCategory(categoryId: number, category: Category): Observable<any> {
    return this.http.put("http://localhost:8080/category/" + categoryId, category);
  }

  public getCityList(): Observable<any> {
    return this.http.get("http://localhost:3000/cities");
  }


}
