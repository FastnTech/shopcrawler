import {IProduct} from "../interfaces/IProduct";

export class Product implements IProduct {
    attributes: object;
    categories: string[];
    commentCount: string;
    dealerName: string;
    dealerPoint: string;
    id: string;
    image: string;
    mainId: string;
    name: string;
    originalPrice: string;
    price: string;
    shipping: string;
    shopId: string;
    url: string;
    brand: string;
}