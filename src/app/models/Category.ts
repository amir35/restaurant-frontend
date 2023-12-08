export class Category {
    categoryId: number;
    categoryName: string;
    categoryStatus: string;
  
    constructor(categoryId: number, categoryName: string, categoryStatus: string) {
      this.categoryId = categoryId;
      this.categoryName = categoryName;
      this.categoryStatus = categoryStatus;
    }
  }