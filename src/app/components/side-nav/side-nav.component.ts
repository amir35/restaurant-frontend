import { Component, Input } from '@angular/core';
import { LoginHeaderComponent } from '../login-header/login-header.component';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent {

  constructor(private sharedService: SharedService) {}

  @Input() sideNavStatus: boolean = false;

  list = [
    {
      number: '1',
      name: 'Dashboard',
      icon: 'dashboard',
      routerLink: '/dashboard'
    },
    {
      number: '2',
      name: 'Manage Category',
      icon: 'category',
      routerLink: '/category'
    },
    {
      number: '3',
      name: 'Manage Items',
      icon: 'store',
      routerLink: '/item'
    },
    {
      number: '4',
      name: 'Manage Order',
      icon: 'shopping_cart',
      routerLink: '/order'
    },
    {
      number: '5',
      name: 'View Bills',
      icon: 'receipt',
      routerLink: '/bills'
    },
    {
      number: '6',
      name: 'About',
      icon: 'info'
    },
    {
      number: '7',
      name: 'Contact',
      icon: 'contacts',
      routerLink: '/contact'
    }
  ]

  ngOnInit() {
    this.sharedService.sideNavStatus$.subscribe((status: boolean) => {
      //console.log('sideNavStatus:', status);
      // Update the local sideNavStatus or perform any necessary actions
    });
  }

}
