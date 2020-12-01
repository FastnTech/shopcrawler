import { Page, Product } from 'puppeteer';
import Shop from '../abstract/Shop';
import { IShopCategory } from '../models/ShopCategory';
import { IShopProduct } from '../models/ShopProduct';
import { catCategoryProd } from '../LogConfig';

class Hepsiburada extends Shop {
    shopUrl = "https://hepsiburada.com";
    shopName = "Hepsiburada";
    shopId = "hepsiburada";

    getProductsEvaluate () {
        let products = document.querySelectorAll('.product-list li');
        let data = [];

        products.forEach(function (e) {
            let name = e.querySelector('.product-title').getAttribute('title');
            let linker = e.querySelector('a[data-productid]');
            let id = linker.getAttribute('data-productid');
            let url = window.location.protocol + '//' + window.location.hostname + linker.getAttribute('href');
            let priceElement = e.querySelector('.price-value');
            let oldPricesElements = e.querySelectorAll('.price.old');
            let image = e.querySelector('img').getAttribute('data-src').split(' ')[0];

            if (priceElement == null) {
                priceElement = e.querySelector('.price.product-price');
            }

            let price = (priceElement || {textContent: ''}).textContent.replace(/[^0-9.,]/g, '');
            let currency = (priceElement || {textContent: ''}).textContent.replace(/[^TLRY]/g, '');

            let oldPrices = [];

            oldPricesElements.forEach(function (element) {
                oldPrices.push((element || {textContent: ''}).textContent.replace(/[^0-9.,]/g, ''))
            });

            if (price && currency && name && url && image) {
                data.push({
                    id, name, price, url, oldPrices, image, currency
                });
            }
        });

        return data;
    }

    async getProductsFromCategoryPage(url: string, page: Page): Promise<IShopProduct[]> {
        await page.goto(url);

        let data = await page.evaluate(this.getProductsEvaluate);

        let pagesLinks = await page.evaluate(() => {
            return Object.values(document.querySelectorAll('#pagination a')).map(a => { 
                return window.location.protocol + a.getAttribute('href'); 
            });
        });

        for (let i = 0; i < pagesLinks.length; i++) {
            await page.goto(pagesLinks[i]);
            let products = await page.evaluate(this.getProductsEvaluate);
            data = data.concat(products);
            catCategoryProd.info(() => `Getting products; Page: ${i + 1}; Shop: ${this.shopId};`);
        }

        return this.arrayToProductList(data);
    }
    
    async getCategoriesFromMainPage(page: Page): Promise<IShopCategory[]> {
        await page.goto(this.shopUrl);

        let data = await page.evaluate(async () => {
            let ids = window[Object.getOwnPropertyNames(window).filter((e) => { return e.indexOf('NAVIGATION') !== -1; })[0]].data.map(e => {return e.id});
            let categories = [];
            
            for (let i = 0; i < ids.length; i++) {
                let id = ids[i];

                let response = await fetch("https://www.hepsiburada.com/api/v1/navigation/" + id);
                let json = await response.json();

                json.data.items.forEach((cat) => {
                    if (cat.categoryId && cat.title && cat.url) {
                        categories.push({
                            id: cat.categoryId,
                            name: cat.title,
                            url: cat.url
                        });
                    } else if (cat.children && cat.children.length > 0) {
                        cat.children.forEach((child) => {
                            if (child.categoryId && child.title && child.url) {
                                categories.push({
                                    id: child.categoryId,
                                    name: child.title,
                                    url: child.url
                                });
                            }
                        })
                    }
                });
            }

            return categories;
        });

        return this.arrayToCategoryList(data);
    }

    async getProductDetailFromProductPage(url: string, page: Page) : Promise<IShopProduct> {
        await page.goto(url);

        let data = await page.evaluate(() => {

        });

        return this.objectToProduct(data);
    }

    getRelatedProductsFromSearching(string: string, page: Page): Promise<IShopProduct[]> {
        throw new Error('Method not implemented.');
    }
}

export default Hepsiburada;