import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Category, Items } from 'src/app/models/Items';
import { CategoryService } from 'src/app/services/category.service';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent {
  selectedFile: File;
  message: string;
  messageStatus: boolean;

  isFileSelected: boolean = false;

  //data coming from Item component to dialogue box
  id: number;
  componentText: string;
  mode: string;
  imageUrl: string;
  //imageName: string;
  editImageId: number;

  itemForm: FormGroup;
  categories: Category[] = []; // Load your categories here
  imageIdNumber: number;
  

  //data for Edit Items
  item: Items;
  selectedCategory: any;

  // ngOnInit() {
  //   this.item = {
  //     title: "",
  //     category: 0,
  //     price: 0,
  //     imageId: 0,
  //     description: ""
  //   };
  // }


  get title() {
    return this.itemForm.get('title');
  }

  get categoryId() {
    return this.itemForm.get('categoryId');
  }

  get price() {
    return this.itemForm.get('price');
  }

  get imageId() {
    return this.itemForm.get('imageId');
  }

  get description() {
    return this.itemForm.get('description');
  }


  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<AddItemComponent>,
    private categoryService: CategoryService,
    private itemService: ItemService,
    private httpClient: HttpClient
    , @Inject(MAT_DIALOG_DATA) private data: any) {
    console.log(data.id);
    this.id = data.id;
    this.componentText = data.componentText;
    this.mode = data.mode;
    this.imageUrl = data.imageUrl;
    this.editImageId = data.imageId;

    console.log("Id: ", this.id + " and Category : ", this.componentText + " and Mode: " + this.mode);
    console.log("Image Id for Edit: ", this.editImageId);

    this.itemForm = this.formBuilder.group({
      title: ['', Validators.required],
      price: ['', Validators.required],
      imageId: ['', Validators.required],
      description: ['', Validators.required],
      categoryId: ['', [Validators.required]],
    });

    this.getAllCategories();

    if (this.mode === "edit") {
      this.getItemById(this.id);
    }

  }

  public getItemById(itemId : number) {
    this.itemService.getItem(itemId).subscribe({
      next: (response: any) => {
        console.log("Item Found : ", response.data);

        if (response.data != null) {
          this.item = response.data;
          console.log(this.item);
          //this.selectedCategory = this.item.category.categoryName;

          // Set the default value for the categoryId form control
          this.itemForm.get('categoryId').setValue(this.item.category.categoryId);
          //this.itemForm.get('imageId').setValue(this.item.imageId);

          // Update the form controls with the retrieved data
          this.itemForm.patchValue({
            title: this.item.title,
            price: this.item.price,
            //imageId: this.editImageId,
            description: this.item.description,
          });

        }
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => { }
    })
  }

  //Fetch All Active Categories from Backend Server
  public getAllCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (response: any) => {
        console.log(response.data); // Access the 'category' property
        this.categories = response.data;
        console.log(this.categories);
      },
      error: (error) => {
        console.log(error);
      },
      complete() { },
    }
    )
  }

  //Gets called when the user selects an image
  public onFileSelected(event) {

    // Check if a file is selected
    this.isFileSelected = event.target.files[0] && event.target.files.length > 0;

    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
  }

  //Gets called when the user clicks on submit to upload the image
  onUpload(event: Event) {

    // Prevent the default form submission behavior
    event.preventDefault();
    console.log(this.selectedFile);

    this.isFileSelected = false;

    //FormData API provides methods and properties to allow us easily prepare form data to be sent with POST HTTP requests.
    const uploadImageData = new FormData();
    uploadImageData.append('imageFile', this.selectedFile, this.selectedFile.name);

    //Make a call to the Spring Boot Application to save the image
    this.httpClient.post('http://localhost:8080/image/upload', uploadImageData, { observe: 'response' })
      .subscribe({
        next: (response: any) => {
          console.log(response.body);

          if(this.mode === "edit"){
            this.editImageId = response.body.data.id;
            console.log(this.editImageId);
          } else {
            this.imageIdNumber = response.body.data.id;
            console.log(this.imageIdNumber);
          }

            this.message = 'Image uploaded successfully';
            this.messageStatus = true;

        },
        error: (error) => {
          console.log(error);
          this.message = 'Image not uploaded successfully';
        },
        complete() { },
      });
  }


  onSubmit() {

    console.log(this.itemForm.value);

    const item = new Items();

    // Assign values from the form to the item object
    item.title = this.itemForm.get('title').value;
    item.price = this.itemForm.get('price').value;
    item.description = this.itemForm.get('description').value;

    if(this.mode === "edit"){
      item.imageId = this.editImageId;
    } else {
      item.imageId = this.imageIdNumber;
    }
    

    // Create a Category object and assign the category name from the form
    const foundCategory = this.categories.find(category => category.categoryId === this.itemForm.get('categoryId').value);

    if (foundCategory) {
      // You've found the category
      console.log('Found Category:', foundCategory);
    } else {
      // Category with the specified categoryId not found
      console.log('Category not found.');
    }

    item.category = foundCategory;

    console.log(item);

    // Close the dialog and pass the data
    this.dialogRef.close(item);
  }

  onCancel() {
    this.dialogRef.close(); // Close the dialog
  }

}
