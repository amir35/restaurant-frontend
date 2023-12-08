export class Items {
    id: number;
    title: string;
    category: Category;
    price: number;
    imageId: number;
    description: string;
}

export class Category {
    categoryId: number;
    categoryName: string;
    categoryStatus: string;
}

export class ImageData {
    imageId : number;
    imageName : string;
    imageType : string;
    // private byte[] picByte;
}