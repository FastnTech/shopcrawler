import * as mongoose from "mongoose";

export interface IShopCategory extends mongoose.Document {
    id: string;
    name: string;
    url: string;
    shopId: string;
}

export const ShopCategoryScheme = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
    shopId: { type: String, required: true },
});

const ShopCategory = mongoose.model<IShopCategory>("ShopCategory", ShopCategoryScheme);

export default ShopCategory;