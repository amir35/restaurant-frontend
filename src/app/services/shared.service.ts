import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  private sideNavStatusSubject = new BehaviorSubject<boolean>(false);
  private userFullNameSubject = new BehaviorSubject<string>('');

  sideNavStatus$ = this.sideNavStatusSubject.asObservable();
  userFullName$ = this.userFullNameSubject.asObservable();

  updateSideNavStatus(status: boolean) {
    this.sideNavStatusSubject.next(status);
  }

  updateUserFullName(userFullName: string) {
    this.userFullNameSubject.next(userFullName);
  }
}
