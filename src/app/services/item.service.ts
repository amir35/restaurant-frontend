import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { SignUpCredentials, Token, Users } from '../models/Users';
import { environment } from '../environments/environment.dev';
import { Items } from '../models/Items';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  API_URL: String;
  AUTH_API_URL = '/auth/server/';

  constructor(private http: HttpClient) {
    this.API_URL = 'api';
  }

  public getAllItems() {
    return this.http.get("http://localhost:8080/category/item");
  }

  public getAllItemsByCategoryId(categoryId: number) {
    return this.http.get("http://localhost:8080/category/item/byCategory/" +categoryId);
  }

  public addItem(item: Items): Observable<any> {
    return this.http.post("http://localhost:8080/category/item/saveItem", item);
  }

  public getItem(itemId: number): Observable<any> {
    return this.http.get("http://localhost:8080/category/item/" +itemId);
  }

  public updateItem(itemId: number, item: Items): Observable<any> {
    return this.http.put("http://localhost:8080/category/item/" +itemId, item);
  }

  public deleteItem(itemId: number): Observable<any> {
    return this.http.delete("http://localhost:8080/category/item/" +itemId);
  }

  public getCityList(): Observable<any> {
    return this.http.get("http://localhost:3000/cities");
  }


}
