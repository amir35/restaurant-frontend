import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Category } from 'src/app/models/Category';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent {

  category: Category; // Initialize the Category object

  categoryStatusOptions: string[] = ['Active', 'Inactive'];

  constructor(public dialogRef: MatDialogRef<AddCategoryComponent>) { }

  ngOnInit() {
    this.category = {
      categoryId: 0,
      categoryName: "",
      categoryStatus: "",
    };
  }

  // onSubmit(categoryForm) {
  //   console.log(categoryForm.value);
  // }

  onSubmit(categoryForm) {

    const dataToSendBack = categoryForm.value;

    console.log(dataToSendBack);

    this.dialogRef.close(dataToSendBack);
  }

  onCancel() {
    this.dialogRef.close(); // Close the dialog
  }

}
