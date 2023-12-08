import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-login-header',
  templateUrl: './login-header.component.html',
  styleUrls: ['./login-header.component.scss']
})
export class LoginHeaderComponent {

  @Output() sideNavToggle = new EventEmitter<boolean>();
  menuStatus: boolean = false;

  receivedUserFullName: string;

  SideNavToggled() {
    this.menuStatus = !this.menuStatus;
    this.sideNavToggle.emit(this.menuStatus);
    this.sharedService.updateSideNavStatus(this.menuStatus);
  }

  constructor(public loginService : LoginService, public sharedService: SharedService) { 
    this.sharedService.userFullName$.subscribe(userFullName => {
      this.receivedUserFullName = userFullName;
    });
  }

  ngOnInit() {
    this.sharedService.userFullName$.subscribe(userFullName => {
      this.receivedUserFullName = userFullName;
    });
  }

  
}

