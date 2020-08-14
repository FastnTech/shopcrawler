import { Page } from 'puppeteer';
import ShopProduct from '../models/ShopProduct';
import ShopCategory, { IShopCategory } from '../models/ShopCategory';
import * as mongoose from "mongoose";

abstract class Shop {
    abstract shopId: string;
    abstract shopUrl: string;
    abstract shopName: string;

    /**
     * Bir kategori sayfasındaki tüm ürünlerin detay
     * bilgilerini çeker.
     * 
     * @param url Gidilecek olan url
     * @param page Puppeteer sayfası
     */
    abstract async getProductsFromCategoryPage(url: string, page: Page): Promise<ShopProduct[]>;

    /**
     * Marketin anasayfasına giderek tüm kategorilerini çeker.
     * 
     * @param page Puppeteer sayfası.
     */
    abstract async getCategoriesFromMainPage(page: Page): Promise<IShopCategory[]>;

    /**
     * Gelen kategorileri veritabanına kaydeder. Varsa günceller.
     * 
     * @param categories Kategoriler.
     */
    async updateAndCreateCategories(categories: IShopCategory[]) {
        for (let category of categories) {
            let doc = await ShopCategory.findOne({ id: category.id });

            if (doc) {
                await ShopCategory.findOneAndUpdate({ id: category.id }, {
                    id: category.id,
                    name: category.name,
                    url: category.url,
                    shopId: category.shopId
                });
            } else {
                category.save();
            }
        }
    };

    /**
     * Liste olarak verilmiş bir datayı ShopProduct
     * objelernini bulunduğu bir listeye çevirir.
     * 
     * @param data Ürünlerin listesi
     */
    arrayToProductList(data: Array<any>): ShopProduct[] {
        let products: ShopProduct[] = [];

        data.forEach(e => {
            let product = new ShopProduct();

            product.id = e.id;
            product.name = e.name;
            product.price = e.price;
            product.currency = e.currency;
            product.oldPrices = e.oldPrices;
            product.url = e.url;
            product.image = e.image;
            product.shopId = this.shopId;

            products.push(product);
        });

        return products;
    }

    /**
     * Liste olarak verilmiş bir datayı ShopCategory
     * objelerinin bulunduğu bir listeye çevirir.
     * 
     * @param data Kategorilerin listesi
     */
    arrayToCategoryList(data: Array<any>): IShopCategory[] {
        let categories: IShopCategory[] = [];

        data.forEach(e => {
            let category = new ShopCategory();

            category.id = e.id;
            category.name = e.name;
            category.url = this.shopUrl + e.url;
            category.shopId = this.shopId;

            categories.push(category);
        });

        return categories;
    }
}

export default Shop;