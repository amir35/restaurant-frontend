import { Component, Input } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  @Input() sideNavStatus: boolean = true;

  loading = true;

  constructor(public sharedService: SharedService) {

  }

  ngOnInit(): void {

    this.sharedService.sideNavStatus$.subscribe((status: boolean) => {
      this.sideNavStatus = status;
      // Log the value to the console
      console.log('sideNavStatus:', this.sideNavStatus);
    });


    setTimeout(() => {
      this.loading = false;
    }, 1500);
  }

}
