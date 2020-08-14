import { Page } from 'puppeteer';
import Shop from '../abstract/Shop';
import ShopProduct from '../models/ShopProduct';
import ShopCategory, { IShopCategory } from '../models/ShopCategory';

class Hepsiburada extends Shop {
    shopUrl = "https://hepsiburada.com/";
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

            let price = priceElement.textContent.replace(/[^0-9.,]/g, '');
            let currency = priceElement.textContent.replace(/[^TLRY]/g, '');

            let oldPrices = [];

            oldPricesElements.forEach(function (element) {
                oldPrices.push(element.textContent.replace(/[^0-9.,]/g, ''))
            });

            data.push({
                id, name, price, url, oldPrices, image, currency
            });
        });

        return data;
    }

    async getProductsFromCategoryPage(url: string, page: Page): Promise<ShopProduct[]> {
        await page.goto(url);

        let data = await page.evaluate(this.getProductsEvaluate);

        let pagesLinks = await page.evaluate(() => {
            return Object.values(document.querySelectorAll('#pagination a')).map(a => { 
                return window.location.protocol + a.getAttribute('href'); 
            });
        });

        for (let pageLink of pagesLinks) {
            await page.goto(pageLink);
            let products = await page.evaluate(this.getProductsEvaluate);
            console.log(products);
            data.concat(products);
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
}

export default Hepsiburada;