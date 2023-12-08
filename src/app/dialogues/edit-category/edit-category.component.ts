import { Component, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Category } from 'src/app/models/Items';
import { Inject } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent {

  category: Category; // Initialize the Category object

  categoryStatusOptions: string[] = ['Active', 'Inactive'];

  selectedCategory: any;

  constructor(public dialogRef: MatDialogRef<EditCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private categoryService: CategoryService) {
    console.log(data.id);
    this.getEditData(data.id);
  }

  ngOnInit() {
    this.category = {
      categoryId: 0,
      categoryName: "",
      categoryStatus: null,
    };
  }


  public getEditData(categoryId) {
    this.categoryService.getCategory(categoryId).subscribe({
      next: (response: any) => {
        console.log(response.data);
        console.log("Category Found : ", response.data);

        if (response.data != null) {
          this.category = response.data;
          console.log(this.category);
          this.selectedCategory = response.data.categoryStatus;
        }
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => { }
    })
  }

  onSubmit(categoryForm) {

    const dataToSendBack = categoryForm.value;

    console.log(dataToSendBack);

    this.dialogRef.close(dataToSendBack);
  }

  onCancel() {
    this.dialogRef.close(); // Close the dialog
  }


}
