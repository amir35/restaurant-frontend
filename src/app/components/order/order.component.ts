import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Category, Items } from 'src/app/models/Items';
import { ApiService } from 'src/app/services/api.service';
import { CategoryService } from 'src/app/services/category.service';
import { ItemService } from 'src/app/services/item.service';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BillService } from 'src/app/services/bill.service';
import { saveAs } from 'file-saver';
import { SharedService } from 'src/app/services/shared.service';

interface Order {
  name: string;
  category: string;
  price: number;
  quantity: number;
  itemTotalPrice: number
}

interface Customer {
  name: string;
  email: string;
  contact: string;
  payment: string;
}

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  @Input() sideNavStatus: boolean = true;

  loading = false;

  isButtonDisabled: boolean = true; // Set to true or false based on your condition
  isButtonDisabled2: boolean = true; // Set to true or false based on your condition
  categories: Category[] = [];
  selectedCategoryId: number;
  selectedCategoryName : string;
  items: Items[] = [];
  selectedItemName: string;
  itemPrice: number = 0;
  itemTotalPrice: number = 0;
  totalPrice: number = 0;
  quantity: number = 1;

  order: Order[] = [];
  orderTemp: Order;
  customer: Customer = null;

  displayedColumns: string[] = ['name', 'category', 'price', 'quantity', 'total', 'action'];
  dataSource: MatTableDataSource<Order> = new MatTableDataSource(); // Initialize dataSource here

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private apiService: ApiService, private itemService: ItemService,
    private categoryService: CategoryService,
    private billService: BillService,
    public sharedService: SharedService,
    private httpClient: HttpClient) {

      this.loading = true;
    this.getAllCategories();

    setTimeout(() => {
      this.loading = false; // Set loading to false after the specified duration
    }, 1500);
    
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Order>([]);
    this.customer = {
      name: "",
      email: "",
      contact: "",
      payment: ""
    };

    this.sharedService.sideNavStatus$.subscribe((status: boolean) => {

      this.sideNavStatus = status;

      // Log the value to the console
      console.log('sideNavStatus:', this.sideNavStatus);
    });
  }


  public getAllCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (response: any) => {
        console.log(response.data);
        this.categories = response.data;
      },
      error: (err) => {
        console.log(err)
      },
      complete() { },
    })
  }

  onOptionSelected(categoryId: number) {
    const selectedValue = categoryId;
    console.log('Selected value: ' + selectedValue);

    this.categories.map(c => {
      if(c.categoryId === categoryId){
        this.selectedCategoryName = c.categoryName;
      }
    })

    // You can perform actions based on the selected value here

    this.itemService.getAllItemsByCategoryId(selectedValue).subscribe({
      next: (response: any) => {
        this.items = response.data;
        console.log(this.items);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => { }
    })

  }

  onItemSelected(itemName: string) {
    console.log('Selected item: ' + itemName);
    this.selectedItemName = itemName;
    this.items.map(item => {
      if (item.title === itemName) {
        this.itemPrice = item.price;
        this.quantity = 1;
        this.itemTotalPrice = this.itemPrice * this.quantity;
      }
})

  }

  onquantitySelected(quantitySelected: number) {
    console.log('Selected item: ' + quantitySelected);
    this.quantity = quantitySelected;
    if(this.itemPrice != 0)
    this.itemTotalPrice = this.itemPrice * quantitySelected;
  }

  addItemToOrder() {

    this.orderTemp = {
      name : this.selectedItemName,
      category : this.selectedCategoryName,
      price : this.itemPrice,
      quantity : this.quantity,
      itemTotalPrice : this.itemTotalPrice
    }

    this.totalPrice = this.totalPrice + this.itemTotalPrice;

    this.order.push({ ...this.orderTemp });

    if (Object.keys(this.customer).every(key => this.customer[key] === null || this.customer[key] === '')) {
      console.log(this.customer);
  } else {
    this.isButtonDisabled2 = false;
  }

     this.dataSource = new MatTableDataSource(this.order);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
  }


  onSubmit(categoryForm) {
    this.loading = true;
    console.log(categoryForm.value);
    this.customer = categoryForm.value;

    setTimeout(() => {
      this.loading = false; // Set loading to false after the specified duration
    }, 1500);

    if(this.customer != null) {
      console.log(this.customer);
    }
    
    this.isButtonDisabled = false;

    


    // if(this.order.length > 0) {
    //   this.isButtonDisabled = false;
    // }

    
  }


  public deleteOrder(orderName: string) {

    this.order = this.order.filter(order => order.name != orderName);
        this.dataSource = new MatTableDataSource(this.order);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

  }

  public downloadBill() {
    var data = {
      name: this.customer.name,
      email: this.customer.email,
      contactNumber: this.customer.contact,
      paymentMethod: this.customer.payment,
      totalAmount: this.totalPrice.toString(),
      productDetails: JSON.stringify(this.order)
    }

    console.log("Data sending to backend API\n" , data);

    this.billService.generateReport(data).subscribe({
      next: (response: any) => {
        console.log(response);
      // Handle the response correctly
      this.handlePdfResponse(response);
        //this.downloadBillDocument(response?.uuid);
      },
      error: (err) => {
        console.log(err);
      },
      complete() {
        
      },
    })
  }

  private handlePdfResponse(response: any) {
    // Assuming the response is a byte array (Uint8Array)
  //const uint8Array = new Uint8Array(response);

  // Create a Blob from the Uint8Array
  const blob = new Blob([response], { type: 'application/pdf' });
    // Create a link element and trigger a click to download the file
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'bill.pdf'; // Set the default name or customize it
    link.click();
  }

  public downloadBillDocument(fileName : string) {
    var data = {
      uuid: fileName
    }

    this.billService.getPdf(data).subscribe({
      next: (response: any) => {
        saveAs(response, fileName+ ".pdf");
      },
      error: (error) => {

      },
      complete() {
        
      },
    })

  }

}
