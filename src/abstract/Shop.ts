import { Page } from 'puppeteer';
import ShopCategory, { IShopCategory } from '../entities/ShopCategory';
import ShopProduct, { IShopProduct } from '../entities/ShopProduct';
import { catDatabaseService, catProductProd } from '../loggers/LogConfig';
import LogDna from "../loggers/LogDna";
import {IProduct} from "../interfaces/IProduct";
import {Product} from "../models/Product";
import Filter from './Filter';

abstract class Shop {
    abstract shopId: string;
    abstract shopUrl: string;
    abstract shopName: string;
    abstract filters: { [x: string]: Filter; };

    /**
     * Bir kategori sayfasındaki tüm ürünlerin detay
     * bilgilerini çeker.
     * 
     * @param url Gidilecek olan url
     * @param page Puppeteer sayfası
     */
    abstract getProductsFromCategoryPage(url: string, page: Page): Promise<IProduct[]>;

    /**
     * Marketin anasayfasına giderek tüm kategorilerini çeker.
     * 
     * @param page Puppeteer sayfası.
     */
    abstract getCategoriesFromMainPage(page: Page): Promise<IShopCategory[]>;

    /**
     * İlişkili ürünü aratır ve çıkan sonuçları kayıt eder.
     * 
     * @param page Puppeteer sayfası.
     */
    abstract getRelatedProductsFromSearching(name: string, category: string, page: Page): Promise<IProduct[]>;

    /**
     * Ürün detay sayfasından ürünün detaylarını alır ve geri döner.
     * 
     * @param url Gidilecek olan ürün URL'i
     * @param page Puppeteer sayfası
     */
    abstract getProductDetailFromProductPage(url: string, category: string, page: Page) : Promise<IProduct>;

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
                await category.save();

                catDatabaseService.info(() => `Successfull: Category '${category.name}' saved Shop: ${this.shopId}`);
            }
        }
    };

    /**
     * Gelen ürünleri veritabanına kaydeder. Varsa günceller.
     *
     * @param products Ürünler.
     * @param isMainProduct ana ürünler olup olmadığı
     */
    async updateAndCreateProducts(products: IProduct[], isMainProduct: boolean = false) {
        for (let product of products) {
            let filter = isMainProduct ? { "subProducts": { $elemMatch: { id: product.id }}} : { "id": product.mainId };
            let doc = await ShopProduct.findOne(filter);

            if (doc) {
                let index: number = 0;
                let productFilter = doc.subProducts.filter((_product: IProduct, _index: number) => {
                    index = _index;
                    return product.id === _product.id;
                });

                if (productFilter.length > 0) {
                    doc.subProducts[index] = product;
                    await ShopProduct.findOneAndUpdate(filter, doc);
                    this.log().info(`Product '${product.name}' updated Shop: ${this.shopId}`);
                }
                else if (!isMainProduct) {
                    let firstSub: IProduct = doc.subProducts[0];

                    if (this.checkAttrs(firstSub.attributes, product.attributes, product.categories[0])) {
                        this.log().info(`updateAndCreateProducts Processing in ${product.id}-${product.name} | Main ${firstSub.id}-${firstSub.name}`);

                        doc.subProducts.push(product);
                        await ShopProduct.findOneAndUpdate(filter, doc);
                        this.log().info(`New product '${product.name}' added Shop: ${this.shopId}`);
                    } else {
                        this.log().warn(`Adding failed product attributes not match`);
                    }
                }
                else {
                    await this.createShopProductFromProduct(product).save();
                    this.log().info(`Product '${product.name}' saved Shop: ${this.shopId}`);
                }
            } else {
                await this.createShopProductFromProduct(product).save();
                this.log().info(`Product '${product.name}' saved Shop: ${this.shopId}`);
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
     * Verilen kategoriye göre ürünleri çeker
     * 
     * @param category Kategori adı
     */
    async getProductsByCategory(category: string): Promise<IShopProduct[]> {
        return await ShopProduct.find({ category: category})
    }

    /**
     * Tüm ürünleri çeker.
     */
    async getAllProductsFromDatabase(): Promise<IShopProduct[]> {
        return ShopProduct.find();
    }

    /**
     * Ürün attributelerini alır ve kategorisine göre eşleştirme sağlar
     * 
     * @param attributes hali hazırda veritabanında olan ürünün detayları
     * @param _attributes eklenecek olan ürünün detayları
     * @param category main ürünün kategorisi
     */
    checkAttrs(attributes: object[], _attributes: object[], category: string): boolean {
        let result: boolean = true;

        if (this.filters.hasOwnProperty(category)) {
            result = this.filters[category].apply(attributes, _attributes);
        }

        return result;
    }

    /**
     * Verilen type sız ürün objesini ShopProduct objesine çevirir.
     * 
     * @param data Ürün objesi
     */
    objectToProduct(data: any): IProduct {
        let product: IProduct = new Product();

        if (typeof data === "undefined" || !data) {
            return null;
        }

        product.id = data['id'] || '';
        product.name = data['name'] || '';
        product.price = data['price'] || 0;
        product.originalPrice = data['originalPrice'] || [];
        product.url = data['url'] || '';
        product.image = data['image'] || '';
        product.shopId = this.shopId;
        product.attributes = data['attributes'] || {};
        product.categories = data['categories'] || [];
        product.dealerName = data['dealerName'] || '';
        product.dealerPoint = data['dealerPoint'] || '';
        product.shipping = data['shipping'] || '';
        product.commentCount = data['commentCount'] || '';
        product.mainId = data['mainId'] || '';
        product.brand = data['brand'] || '';

        return product;
    }

    /**
     * Liste olarak verilmiş bir datayı ShopProduct
     * objelerinin bulunduğu bir listeye çevirir.
     * 
     * @param data Ürünlerin listesi
     */
    arrayToProductList(data: Array<any>): IProduct[] {
        let products: IProduct[] = [];

        data.forEach(e => {
            let product = new Product();

            product.id = e.id;
            product.name = e.name;
            product.price = e.price;
            product.originalPrice = e.originalPrice;
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

        catProductProd.info(() => `Successfull: Array to Category List | Shop: ${this.shopId}`);

        return categories;
    }

    /**
     * Tekil ürünü ShopProduct objesine çevirir
     *
     * @param data Ürününü ilk subproduct ı
     */
    createShopProductFromProduct(data: IProduct): IShopProduct {
        let shopProduct: IShopProduct = new ShopProduct();

        data.mainId = data.id;

        shopProduct.image = data.image;
        shopProduct.slug = this.slugify(data.name);
        shopProduct.id = data.id;
        shopProduct.name = data.name;
        shopProduct.subProducts.push(data);
        shopProduct.category = data.categories[0];

        return shopProduct;
    }

    /**
     * Verilen metni slug url e çevirir
     * 
     * @param text Çevirilecek metin
     */
    slugify = function(text: string) {
        var trMap = {
            'çÇ': 'c',
            'ğĞ': 'g',
            'şŞ': 's',
            'üÜ': 'u',
            'ıİ': 'i',
            'öÖ': 'o'
        };

        for(var key in trMap) {
            text = text.replace(new RegExp('['+key+']','g'), trMap[key]);
        }

        return  text.replace(/[^-a-zA-Z0-9\s]+/ig, '') // remove non-alphanumeric chars
            .replace(/\s/gi, "-") // convert spaces to dashes
            .replace(/[-]+/gi, "-") // trim repeated dashes
            .toLowerCase();
    };

    /**
     * Async methodların beklemelerini sağlayan helper fonksiyon
     * 
     * Kullanım : await this.sleep(2000); // 2 saniye bekletir.
     * 
     * @param ms Milisaniye 
     */
    sleep = function(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    };

    /**
     * Loglama fonksiyonu.
     * 2 çeşit loglama yapılabiliyor.
     * Eğer logların logdna e gönderilmesi isteniyorsa LogDna nesnesi return edilmeli
     * catProductProd nesnesi sadece console işlevi görmektedir
     * LogDna console a herhangi bir alert basmaz
     */
    log = function() {
        return catProductProd;
    }
}

export default Shop;