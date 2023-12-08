import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.dev';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

   generateReport(data: any) {
    return this.httpClient.post(this.url+"/bill/generateReport",data, {
      headers: new HttpHeaders().set('Content-Type', "application/json"),
      responseType: 'blob' as 'json'
    })
  }

  getPdf(data: any){
    return this.httpClient.post(this.url+"/bill/getPdf",data, {
      headers: new HttpHeaders().set('Content-Type', "application/json"),
      responseType: 'blob' as 'json'
    })
  }

  getBills() {
    return this.httpClient.get(this.url+"/bill/getBills");
  }

  public deleteBill(billId: number): Observable<any> {
    return this.httpClient.delete("http://localhost:8080/bill/" +billId);
  }

}
