import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Users, OwnerResponse } from 'src/app/models/Users';
import { ApiService } from 'src/app/services/api.service';
import { LoginService } from 'src/app/services/login.service';
import { first } from 'rxjs/operators';
import { Menu } from '../../models/Menu';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ItemService } from 'src/app/services/item.service';
import { CategoryService } from 'src/app/services/category.service';
import { HttpClient } from '@angular/common/http';
import { Image } from 'src/app/models/Image';
import { Items } from 'src/app/models/Items';
import { forkJoin, Observable } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    @Input() sideNavStatus: boolean = true;

    loading = false;
    users?: Users[];
    categories: string[] = ['All'];
    activeCategories: string[];
    // menuItems: any[] = Menu;
    menuItems: any[];
    allItems: any[];

    retrievedImage: any;
    base64Data: any;
    retrieveResonse: any;
    message: string;
    imageName: any;
    imageId: any;
    imageData: Image;
    images: Image[] = [];

    public imageUrls: { [imageId: number]: string } = {};

    constructor(private apiService: ApiService, private itemService: ItemService,
        private categoryService: CategoryService, public sharedService: SharedService,
        private httpClient: HttpClient) {

        this.getAllCategories();
        this.getAllItems();

    }

    ngOnInit() {
        this.loading = true;

            this.sharedService.sideNavStatus$.subscribe((status: boolean) => {
              this.sideNavStatus = status;
              // Log the value to the console
              console.log('sideNavStatus:', this.sideNavStatus);
            });

        // this.apiService.getAll().pipe(first()).subscribe({
        //     next: (response: OwnerResponse) => {
        //         console.log(response.owner[0]);
        //         this.loading = false;
        //         this.users = response.owner;
        //     },
        //     error: (error) => {
        //         console.log(error);
        //     },
        //     complete: () => { }
        // }
        //)
    }

    //filterItems(selectedCategory: string) {
    filterItems(event: MatTabChangeEvent) {
        const selectedCategory = this.categories[event.index];
        console.log(selectedCategory);
        if (selectedCategory === 'All') {
            // this.menuItems = Menu;
            this.menuItems = this.allItems;
            console.log(this.menuItems);
        } else {
            console.log(selectedCategory);
            // const newItems = Menu.filter((item) => item.category === selectedCategory);
            const newItems = this.allItems.filter((item) => item.category.categoryName === selectedCategory);
            this.menuItems = newItems;
            console.log(this.menuItems);
        }

    };


    public getAllItems() {
        this.loading = true;
        this.itemService.getAllItems().subscribe({
            next: (response: any) => {
                this.allItems = response.data;
                this.menuItems = this.allItems;
                console.log(this.allItems);
                //this.getImagesForItems(this.allItems);
                // Fetch images for the items and store them in the images array
                this.getImagesForItems(this.allItems).subscribe({
                    next: (fetchedImages) => {
                        this.images = fetchedImages;
                        console.log(fetchedImages);
                        fetchedImages.forEach((image) => {
                            this.imageUrls[image.id] = 'data:' + image.type + ';base64,' + image.picByte;
                        });

                        setTimeout(() => {
                            this.loading = false;
                          }, 1500);
                    },
                    error: (error) => {
                        console.log(error);
                    },
                    complete() { },
                });
            },
            error: (err) => {
                console.log(err)
            },
            complete() {

            },
        })
    }

    public getAllCategories() {
        this.loading = true;

        const uniqueCategorySet = new Set<string>();

        this.categoryService.getAllCategories().subscribe({
            next: (response: any) => {
                console.log(response);
                const activeCategories = response.data.filter(c => c.categoryStatus === 'Active');
                activeCategories.forEach(ct => {
                    uniqueCategorySet.add(ct.categoryName);
                })

                this.categories = this.categories.concat(Array.from(uniqueCategorySet));
                console.log(this.categories);

                setTimeout(() => {
                    this.loading = false;
                  }, 1500);
            },
            error: (err) => {
                console.log(err)
            },
            complete() {

            },
        })

    }

    //Gets called when the user clicks on retieve image button to get the image from back end
    public getImage() {
        this.loading = true;
        //Make a call to Sprinf Boot to get the Image Bytes.
        this.httpClient.get('http://localhost:8080/image/get/' + this.imageId)
            .subscribe({
                next: (response: any) => {
                    console.log(response);
                    this.imageData = response;
                    this.retrieveResonse = response;
                    this.base64Data = this.retrieveResonse.picByte;
                    this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;

                    setTimeout(() => {
                        this.loading = false;
                      }, 1500);
                },
                error: (error) => {
                    console.log(error);
                },
                complete() {

                },
            });
    }

    getImagesForItems(items: Items[]): Observable<Image[]> {
        console.log(items);
        // Extract all imageIds from the items
        const imageIds = items
            .filter((item) => item.imageId !== null)
            .map((item) => item.imageId);
        console.log(imageIds);

        // Create an array of observables for fetching images based on imageIds
        const imageObservables = imageIds.map((id) =>
            this.httpClient.get<Image>('http://localhost:8080/image/get/' + id)
        );

        // Use forkJoin to make all image requests concurrently
        return forkJoin(imageObservables);
    }


}
