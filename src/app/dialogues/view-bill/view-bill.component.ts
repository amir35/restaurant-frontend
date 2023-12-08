import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Customer, Order } from 'src/app/models/Bills';

@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.css']
})
export class ViewBillComponent {

  orders : Order[] = [];
  customer : Customer;
  totalPrice: number;

  constructor(public dialogRef: MatDialogRef<ViewBillComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {    

      console.log(data.order);
      this.orders = data.order;
      this.customer = data.customer;
      this.totalPrice = data.total;

    }

    onCancel() {
      this.dialogRef.close(); // Close the dialog
    }
  

}
