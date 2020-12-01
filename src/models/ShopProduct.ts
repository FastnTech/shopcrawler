import * as mongoose from "mongoose";

export interface IShopProduct extends mongoose.Document {
    id: string;
    name: string;
    price: number;
    oldPrices: number[];
    currency: string;
    image: string;
    url: string;
    shopId: string;
    categoryId: string;
    dealerName: string;
    dealerPoint: string;
    stock: string;
    subProducts: string[];
    attributes: object;
}

export const ShopProductScheme = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    oldPrices: { type: Array, required: true },
    currency: { type: String, required: true },
    image: { type: String, required: true },
    url: { type: String, required: true },
    shopId: { type: String, required: true },
    categoryId: { type: String, required: true },
    dealerName: { type: String, required: true },
    dealerPoint: { type: String, required: true },
    stock: { type: String, required: true },
    subProducts: { type: Array, required: false },
    attributes: { type: Object, required: true }
});

const ShopProduct = mongoose.model<IShopProduct>("ShopProduct", ShopProductScheme);

export default ShopProduct;