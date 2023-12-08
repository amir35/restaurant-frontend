export interface Order {
    name: string;
    category: string;
    price: number;
    quantity: number;
    itemTotalPrice: number
}

export interface Customer {
    name: string;
    email: string;
    contact: string;
    payment: string;
}

export interface Bills {
    id: number,
    uuid: string,
    name: string,
    contactNumber: string,
    email: string,
    paymentMethod: string,
    total: number,
    productDetails: string
}