import { AfterViewInit,Input, Component, ViewChild } from '@angular/core';
import { Menu } from '../../models/Menu';
import { ApiService } from 'src/app/services/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AddCategoryComponent } from 'src/app/dialogues/add-category/add-category.component';
import { CategoryService } from 'src/app/services/category.service';
import { ItemService } from 'src/app/services/item.service';
import { Category } from 'src/app/models/Items';
import { DeleteCategoryComponent } from 'src/app/dialogues/delete-category/delete-category.component';
import { Router } from '@angular/router';
import { EditCategoryComponent } from 'src/app/dialogues/edit-category/edit-category.component';
import { SharedService } from 'src/app/services/shared.service';

export interface CategoryData {
  id: number;
  name: string;
  items: number;
  status: string;
}

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements AfterViewInit {

  @Input() sideNavStatus: boolean = true;

  loading = false;

  allCategories: Category[];
  allItems: any[];

  categoryDataArray: CategoryData[];

  displayedColumns: string[] = ['id', 'name', 'items', 'status', 'action'];
  dataSource: MatTableDataSource<CategoryData> = new MatTableDataSource(); // Initialize dataSource here

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private apiService: ApiService, public dialog: MatDialog, private categoryService: CategoryService
    , private itemService: ItemService, public sharedService: SharedService,
    private router: Router) {

      this.loading = true;
    this.getAllCategory();
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

  openDialog(): void {
    const dialogRef = this.dialog.open(AddCategoryComponent, {
      data: { name: 'Your Data' },
      disableClose: true, // Prevent closing on click outside
    });

    dialogRef.afterClosed().subscribe(formData => {
      if (formData) {
        console.log('Form data received from the dialog:', formData);
        // You can now work with the form data received from the dialog
        this.addCategory(formData);
      } else {
        console.log('Dialog was closed without data.');
      }
    });
  }

  addCategory(category: Category) {
    this.categoryService.addCategory(category).subscribe({
      next: (response) => {
        console.log(response);
        this.allCategories = [...this.allCategories, response.data];
        this.getCategoryCount();
      },
      error: (error) => {
        console.log(error);
      },
      complete() {
      },
    });
  }

  public openDeleteDialog(categoryId: number) {
    const dialogRef = this.dialog.open(DeleteCategoryComponent, {
      data: { id: categoryId },
      disableClose: true, // Prevent closing on click outside
    });

    dialogRef.afterClosed().subscribe(choose => {
      if (choose) {
        console.log('Form data received from the dialog:', choose);
        // You can now work with the form data received from the dialog
        this.deleteCategory(categoryId);
      } else {
        console.log('Dialog was closed without data.');
      }
    });
  }

  public deleteCategory(categoryId) {
    console.log(categoryId);
    this.categoryService.deleteCategory(categoryId).subscribe({
      next: (response) => {
        console.log("Category Deleted");

        this.categoryDataArray = this.categoryDataArray.filter(categoryDataTemp => categoryDataTemp.id != categoryId);
        this.dataSource = new MatTableDataSource(this.categoryDataArray);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) => {
        console.log(error);
      },
      complete() { }
    })

  }

  public openEditDialog(categoryId: number) {
    const dialogRef = this.dialog.open(EditCategoryComponent, {
      data: { id: categoryId, componentText: "Category" },
      disableClose: true, // Prevent closing on click outside
    });

    dialogRef.afterClosed().subscribe(editFormData => {
      if (editFormData) {
        console.log('Form data received from the dialog:', editFormData);
        // You can now work with the form data received from the dialog
        this.editCategory(categoryId, editFormData);
      } else {
        console.log('Dialog was closed without data.');
      }
    });
  }

  public editCategory(categoryId: number, category: Category) {
    this.categoryService.editCategory(categoryId, category).subscribe({
      next: (response) => {
        console.log(response);

        // Find and replace the existing category data in categoryDataArray
        this.categoryDataArray = this.categoryDataArray.map(categoryDataTemp => {
          if (categoryDataTemp.id === response.data.categoryId) {
            return {
              id: response.data.categoryId,
              name: response.data.categoryName,
              status: response.data.categoryStatus,
              items: categoryDataTemp.items, // Update the item count if needed
            };
          }
          return categoryDataTemp;
        });

        // Update the data source with the modified categoryDataArray
      //this.dataSource.data = this.categoryDataArray;
      this.dataSource = new MatTableDataSource(this.categoryDataArray);

      // Optionally, reapply sorting and pagination
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      },
      error: (error) => {
        console.log(error);
      },
      complete() {
      },
    });
  }


  public getAllCategory() {
    this.categoryService.getAllCategories().subscribe({
      next: (response: any) => {
        console.log(response.data);
        this.allCategories = response.data;
      },
      error: (error) => {
        console.log(error);
      },
      complete() {

      },
    })
  }

  public getAllItems() {
    this.itemService.getAllItems().subscribe({
      next: (response: any) => {
        this.allItems = response.data;
        console.log(this.allItems);
        this.getCategoryCount();
      },
      error: (err) => {
        console.log(err)
      },
      complete() {

      },
    })
  }

  public getCategoryCount() {

    const categoryCountMap = new Map<string, number>();

    if(this.allItems != null){
      this.allItems.forEach(item => {
        const category = item.category.categoryName;
        if (categoryCountMap.has(category)) {
          // Increment the count if the category is already in the Map
          const count = categoryCountMap.get(category) + 1;
          categoryCountMap.set(category, count);
        } else {
          // Initialize the count to 1 if the category is not in the Map
          categoryCountMap.set(category, 1);
        }
      });

    }
    

    categoryCountMap.forEach((count, category) => {
      console.log(`Category: ${category}, Number of Items: ${count}`);
    });

    // Create an array of objects conforming to the CategoryData interface
    // const categoryDataArray: CategoryData[] = Array.from(categoryCountMap, ([name, items]) => ({
    //   id:  // Generate a random ID
    //   name,
    //   items
    // }));

    this.categoryDataArray = this.allCategories.map((category) => ({
      id: category.categoryId, // Use the ID from the Category object
      name: category.categoryName, // Use the name from the Category object
      status: category.categoryStatus, // Use the status from the Category object
      items: categoryCountMap.get(category.categoryName) || 0, // Get the count from the categoryCountMap
    }));

    // Display the array of objects
    console.log(this.categoryDataArray);

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.categoryDataArray);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
