import { Page } from 'puppeteer';
import ShopCategory, { IShopCategory } from '../models/ShopCategory';
import ShopProduct, { IShopProduct } from '../models/ShopProduct';
import { catDatabaseService, catCategoryProd, catProductProd } from '../LogConfig';

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
    abstract async getProductsFromCategoryPage(url: string, page: Page): Promise<IShopProduct[]>;

    /**
     * Marketin anasayfasına giderek tüm kategorilerini çeker.
     * 
     * @param page Puppeteer sayfası.
     */
    abstract async getCategoriesFromMainPage(page: Page): Promise<IShopCategory[]>;

    /**
     * İlişkili ürünü aratır ve çıkan sonuçları kayıt eder.
     * 
     * @param page Puppeteer sayfası.
     */
    abstract async getRelatedProductsFromSearching(name: string, page: Page): Promise<IShopProduct[]>;

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

                catDatabaseService.info(() => `Successfull: Category '${category.name}' updated Shop: ${this.shopId}`);
            } else {
                category.save();

                catDatabaseService.info(() => `Successfull: Category '${category.name}' saved Shop: ${this.shopId}`);
            }
        }
    };

    /**
     * Gelen ürünleri veritabanına kaydeder. Varsa günceller.
     * 
     * @param products Ürünler.
     */
    async updateAndCreateProducts(products: IShopProduct[], categoryId: string) {
        for (let product of products) {
            let doc = await ShopProduct.findOne({ id: product.id });

            if (doc) {
                await ShopProduct.findOneAndUpdate({ id: product.id }, {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    oldPrices: product.oldPrices,
                    currency: product.currency,
                    image: product.image,
                    url: product.url,
                    shopId: product.shopId,
                    categoryId: categoryId
                });

                catDatabaseService.info(() => `Successfull: Product '${product.name}' updated Shop: ${this.shopId}`);
            } else {
                product.categoryId = categoryId;
                await product.save();

                catDatabaseService.info(() => `Successfull: Product '${product.name}' saved Shop: ${this.shopId}`);
            }
        }
    };

    /**
     * Marketin tüm kategorilerini çeker.
     */
    async getCategoriesFromDatabase(): Promise<IShopCategory[]> {
        return await ShopCategory.find({ shopId: this.shopId});
    }

    /**
     * Marketin tüm ürünlerini çeker.
     */
    async getProductsFromDatabase(): Promise<IShopProduct[]> {
        return await ShopProduct.find({ shopId: this.shopId});
    }

    /**
     * Liste olarak verilmiş bir datayı ShopProduct
     * objelernini bulunduğu bir listeye çevirir.
     * 
     * @param data Ürünlerin listesi
     */
    arrayToProductList(data: Array<any>): IShopProduct[] {
        let products: IShopProduct[] = [];

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

        catProductProd.info(() => `Successfull: Array to Product List | Shop: ${this.shopId} | Product Count: ${products.length}`);

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
            category.shopId = this.shopId;
            category.url = e.url;

            categories.push(category);
        });

        catCategoryProd.info(() => `Successfull: Array to Category List | Shop: ${this.shopId}`);

        return categories;
    }
}

export default Shop;