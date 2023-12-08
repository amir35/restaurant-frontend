import { Component } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-delete-category',
  templateUrl: './delete-category.component.html',
  styleUrls: ['./delete-category.component.css']
})
export class DeleteCategoryComponent {

  id : number;
  componentText : string;

  constructor(public dialogRef: MatDialogRef<DeleteCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) { 
      console.log(data.id);
      this.id = data.id;
      this.componentText = data.componentText;
    }

  onOk() {
    const dataToSendBack = true;
    console.log(dataToSendBack);

    this.dialogRef.close(dataToSendBack);
  }

  onCancel() {
    this.dialogRef.close(); // Close the dialog
  }

}
