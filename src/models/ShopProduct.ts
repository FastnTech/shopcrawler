import * as mongoose from "mongoose";

export interface IShopProduct extends mongoose.Document {
    id: string;
    name: string;
    price: string;
    oldPrices: string[];
    currency: string;
    image: string;
    url: string;
    shopId: string;
    categoryId: string;
    subProducts: string[];
}

export const ShopProductScheme = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: String, required: true },
    oldPrices: { type: Array, required: true },
    currency: { type: String, required: true },
    image: { type: String, required: true },
    url: { type: String, required: true },
    shopId: { type: String, required: true },
    categoryId: { type: String, required: true },
    subProducts: { type: Array, required: false }
});

const ShopProduct = mongoose.model<IShopProduct>("ShopProduct", ShopProductScheme);

export default ShopProduct;