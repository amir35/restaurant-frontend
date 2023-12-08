import { AfterViewInit, Component, ViewChild, Input } from '@angular/core';
import { Menu } from '../../models/Menu';
import { ApiService } from 'src/app/services/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AddCategoryComponent } from 'src/app/dialogues/add-category/add-category.component';
import { CategoryService } from 'src/app/services/category.service';
import { AddItemComponent } from 'src/app/dialogues/add-item/add-item.component';
import { Items } from 'src/app/models/Items';
import { ItemService } from 'src/app/services/item.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Image } from 'src/app/models/Image';
import { Observable, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DeleteCategoryComponent } from 'src/app/dialogues/delete-category/delete-category.component';
import { SharedService } from 'src/app/services/shared.service';


@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class ItemComponent implements AfterViewInit {

  @Input() sideNavStatus: boolean = true;

  loading = false;

  uniqueCategoryNames: Set<string> = new Set();

  items : Items[];

  //tabData: { [tabLabel: string]: Items[]; } = {};
  // tabData: TabDataItem[] = [];

  expandedElement: Items | null;

  retrievedImage: any;
  base64Data: any;
  retrieveResonse: any;
  message: string;
  imageName: any;
  imageId: any;
  imageData: Image;
  images: Image[] = [];

  public imageUrls: { [imageId: number]: string } = {};

  displayedColumns: string[] = ['itemId', 'itemName', 'category', 'price', 'action'];
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];

  // dataSource: MatTableDataSource<TabDataItem> = new MatTableDataSource(); // Initialize dataSource here

  dataSource: MatTableDataSource<Items> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private apiService: ApiService, public dialog: MatDialog, private itemService: ItemService,
    private _snackBar: MatSnackBar, public sharedService: SharedService,
    private httpClient: HttpClient) {

      this.loading = true;
    this.getAllItems();

    setTimeout(() => {
      this.loading = false;
    }, 1500);

  }

  ngOnInit(): void {

    this.sharedService.sideNavStatus$.subscribe((status: boolean) => {

      this.sideNavStatus = status;

      // Log the value to the console
      console.log('sideNavStatus:', this.sideNavStatus);
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public getAllItems() {

    this.itemService.getAllItems().subscribe({
      next: (response: any) => {
        console.log(response.data);

        // Extract unique category names from the response data
        this.uniqueCategoryNames = new Set(
          response.data.map((item: Items) => item.category.categoryName)
        );

        this.items = response.data;

        this.getAllImageData(this.items);

        this.dataSource = new MatTableDataSource(this.items);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) => {
        console.log(error);
      },
      complete() {

      },
    })
  }

  public getAllImageData(items: Items[]) {
    console.log(items);
    this.getImagesForItems(items).subscribe({
      next: (fetchedImages) => {
        this.images = fetchedImages;
        console.log(this.images);
        fetchedImages.forEach((image) => {
          this.imageUrls[image.id] = 'data:' + image.type + ';base64,' + image.picByte;
        });

        console.log(this.imageUrls);
      },
      error: (error) => {
        console.log(error);
      },
      complete() { },
    });
  }

  getImagesForItems(items: Items[]): Observable<Image[]> {
    console.log(items);
    // Extract all imageIds from the items
  
    const imageIds = items
      .filter((item) => item.imageId !== null) // Filter out items with null imageId
      .map((item) => item.imageId);

    console.log(imageIds);

    // Create an array of observables for fetching images based on imageIds
    const imageObservables = imageIds.map((id) =>
      this.httpClient.get<Image>('http://localhost:8080/image/get/' + id)
    );

    // Use forkJoin to make all image requests concurrently
    return forkJoin(imageObservables);
  }

  openDialog(): void {
    
    const dialogRef = this.dialog.open(AddItemComponent, {
      data: { mode: "add"  },
      disableClose: true, // Prevent closing on click outside
    });

    dialogRef.afterClosed().subscribe(formData => {
      if (formData) {
        console.log('Form data received from the dialog:', formData);
        // You can now work with the form data received from the dialog
        this.addItem(formData);
      } else {
        console.log('Dialog was closed without data.');
      }
    });
  }

  addItem(item: Items) {

    console.log(item);
    this.itemService.addItem(item).subscribe({
      next: (response) => {
        console.log(response);
        this.getAllItems();
        this.openSnackBar("add");
      },
      error: (error) => {
        console.log(error);
      },
      complete() {
      },
    });
  }

  openSnackBar(mode : string) {
    if(mode === "add"){
      this._snackBar.open("Item Successfully Inserted", "Close");
    } else {
      this._snackBar.open("Item Successfully Updated", "Close");
    }
    
  }

  public openDeleteDialog(itemId: number, category: string) {
    const dialogRef = this.dialog.open(DeleteCategoryComponent, {
      data: { id: itemId, componentText: "Item" },
      disableClose: true, // Prevent closing on click outside
    });

    console.log("Id: ", itemId + " and Category : ", category);

    dialogRef.afterClosed().subscribe(choose => {
      if (choose) {
        console.log('Form data received from the dialog:', choose);
        // You can now work with the form data received from the dialog
        this.deleteCategory(itemId, category);
      } else {
        console.log('Dialog was closed without data.');
      }
    });
  }

  public deleteCategory(itemId: number, category: string) {
    console.log(itemId);
    this.itemService.deleteItem(itemId).subscribe({
      next: (response) => {
        console.log("Category Deleted");

        this.items = this.items.filter(itemTemp => itemTemp.id != itemId);

        this.dataSource = new MatTableDataSource(this.items);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        //this.tabData[category] = this.tabData[category].filter(categoryDataTemp => categoryDataTemp.id != itemId);
        
      },
      error: (error) => {
        console.log(error);
      },
      complete() { }
    })

  }

  public openEditDialog(itemId: number, category: string, imageId: number) {

    console.log(this.imageUrls[imageId]);
    console.log(imageId);
    console.log(this.images);

    const image = this.images.find(image => image.id === imageId);
    if (image) {
        this.imageName = image.name;
    } else {
      this.imageName = null;
    }

    const dialogRef = this.dialog.open(AddItemComponent, {
      data: { 
        id: itemId, 
        componentText: category, 
        mode: "edit", 
        imageUrl: this.imageUrls[imageId],
        //imageName: this.imageName
        imageId: imageId
      },
      disableClose: true, // Prevent closing on click outside
    });

    dialogRef.afterClosed().subscribe(editFormData => {
      if (editFormData != null) {
        console.log('Form data received from the dialog:', editFormData);
        // You can now work with the form data received from the dialog
        this.editCategory(itemId, editFormData);
      } else {
        console.log('Dialog was closed without data.');
      }
    }); 
  }

  public editCategory(itemId: number, item: Items) {
    console.log(item);
    this.itemService.updateItem(itemId, item).subscribe({
      next: (response) => {
        console.log(response);
        this.getAllItems();
        this.openSnackBar("edit");

      },
      error: (error) => {
        console.log(error);
      },
      complete() {
      },
    });


  }

}
