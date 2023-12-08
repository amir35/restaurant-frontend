import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private apiService : ApiService) { }

  registerUser(userDetails): Observable<any> {
    return this.apiService.registerUser(userDetails);
  }

  getCityList() : Observable<any> {
    return this.apiService.getCityList();
  }
}
