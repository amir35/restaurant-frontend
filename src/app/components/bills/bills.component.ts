import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { DeleteCategoryComponent } from 'src/app/dialogues/delete-category/delete-category.component';
import { ViewBillComponent } from 'src/app/dialogues/view-bill/view-bill.component';
import { BillService } from 'src/app/services/bill.service';
import { saveAs } from 'file-saver';
import { Order, Customer, Bills } from 'src/app/models/Bills';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.css']
})
export class BillsComponent implements OnInit {

  @Input() sideNavStatus: boolean = true;

  loading = false;

  bills: Bills[] = [];
  bill: Bills;
  orders: Order[] = [];
  customer: Customer;

  uuid: string;

  constructor(private billService: BillService, public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    public sharedService: SharedService) {

  }

  ngOnInit(): void {
    this.getAllBills();

    this.customer = {
      name: "",
      email: "",
      contact: "",
      payment: ""
    };

    this.sharedService.sideNavStatus$.subscribe((status: boolean) => {
      // Update the local sideNavStatus
      this.sideNavStatus = status;

      // Log the value to the console
      console.log('sideNavStatus:', this.sideNavStatus);
    });
  }

  @ViewChild('tooltip') tooltip: MatTooltip;

  displayedColumns: string[] = ['id', 'uuid', 'name', 'contact', 'email', 'payment', 'total', 'action'];
  dataSource: MatTableDataSource<Bills> = new MatTableDataSource(); // Initialize dataSource here

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public getAllBills() {
    this.loading = true;
    this.billService.getBills().subscribe({
      next: (response: any) => {
        console.log(response);
        this.bills = response.data;
        console.log(this.bills);

        this.dataSource = new MatTableDataSource(this.bills);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        setTimeout(() => {
          this.loading = false;
        }, 1500);

      },
      error: (error) => {
        console.log(error);
      },
      complete() {

      },
    })
  }

  hideTooltip() {
    // Programmatically hide the tooltip
    this.tooltip.hide();
  }

  showBillDetails(billId: number) {
    this.loading = true;
    console.log(billId);

    this.bill = this.bills.find(bill => billId === bill.id);
    console.log(this.bill.productDetails);

    this.customer.name = this.bill.name;
    this.customer.email = this.bill.email;
    this.customer.contact = this.bill.contactNumber;
    this.customer.payment = this.bill.paymentMethod;

    console.log(this.customer);

    const jsonString = this.bill.productDetails;

    // Convert the JSON string to a JavaScript object
    this.orders = JSON.parse(jsonString);

    console.log(this.orders);

    const dialogRef = this.dialog.open(ViewBillComponent, {
      data: {
        order: this.orders,
        customer: this.customer,
        total: this.bill.total
      },
      disableClose: true, // Prevent closing on click outside
    });

    dialogRef.afterClosed().subscribe(formData => {
      if (formData) {
        console.log('Form data received from the dialog:', formData);
        // You can now work with the form data received from the dialog
      } else {
        console.log('Dialog was closed without data.');
      }
    });

  }

  deleteBillDetails(billId: number) {
    console.log(billId);
    const dialogRef = this.dialog.open(DeleteCategoryComponent, {
      data: { id: billId, componentText: "Bill" },
      disableClose: true, // Prevent closing on click outside
    });

    dialogRef.afterClosed().subscribe(choose => {
      if (choose) {
        console.log('Form data received from the dialog:', choose);
        // You can now work with the form data received from the dialog
        this.deleteBill(billId);
      } else {
        console.log('Dialog was closed without data.');
      }
    });
  }

  public deleteBill(billId: number) {
    this.loading = true;
    console.log(billId);
    this.billService.deleteBill(billId).subscribe({
      next: (response) => {
        console.log("Bill Deleted");

        this.bills = this.bills.filter(bill => bill.id != billId);

        this.dataSource = new MatTableDataSource(this.bills);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        setTimeout(() => {
          this.loading = false;
        }, 1500);

        this._snackBar.open("Bill Successfully deleted", "Close");

      },
      error: (error) => {
        console.log(error);
        this._snackBar.open("Bill Not deleted", "Close");
      },
      complete() { }
    })

  }

  // Common code. To be taken into different component
  public downloadBill(billId: number) {

    this.loading = true;

    this.bill = this.bills.find(bill => billId === bill.id);

    var data = {
      name: this.bill.name,
      email: this.bill.email,
      contactNumber: this.bill.contactNumber,
      paymentMethod: this.bill.paymentMethod,
      totalAmount: this.bill.total.toString(),
      uuid: this.bill.uuid,
      productDetails: JSON.stringify(JSON.parse(this.bill.productDetails))
    }

    console.log("Data sending to backend API\n", data);

    this.billService.getPdf(data).subscribe({
      next: (response: any) => {
        console.log(response);
        // Handle the response correctly
        this.uuid = this.bill.uuid;
        this.handlePdfResponse(response);

        setTimeout(() => {
          this.loading = false;
        }, 1500);

      },
      error: (err) => {
        console.log(err);
      },
      complete() {

      },
    })
  }

  private handlePdfResponse(response: any) {
    const blob = new Blob([response], { type: 'application/pdf' });
    // Create a link element and trigger a click to download the file
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = this.uuid + '.pdf'; // Set the default name or customize it
    link.click();

    setTimeout(() => {
      this.loading = false;
    }, 1500);
  }

}
