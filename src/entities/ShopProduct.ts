import * as mongoose from "mongoose";
import {IProduct} from "../interfaces/IProduct";

export interface IShopProduct extends mongoose.Document {
    id: string;
    name: string;
    image: string;
    slug: string;
    subProducts: IProduct[];
}

export const ShopProductScheme = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    slug: { type: String, required: true },
    subProducts: { type: Array, required: true },
});

const ShopProduct = mongoose.model<IShopProduct>("ShopProduct", ShopProductScheme);

export default ShopProduct;