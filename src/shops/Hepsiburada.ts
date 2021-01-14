import Shop from '../abstract/Shop';
import { Page } from 'puppeteer';
import { IShopCategory } from '../entities/ShopCategory';
import { IProduct } from "../interfaces/IProduct";
import Filter from '../abstract/Filter';
import * as path from 'path';

class Hepsiburada extends Shop {
    shopUrl = "https://hepsiburada.com";
    shopName = "Hepsiburada";
    shopId = "hepsiburada";
    laptopFilters: Filter = null;

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

    async getProductsFromCategoryPage(url: string, page: Page): Promise<IProduct[]> {
        await page.goto(url);

        let data = await page.evaluate(this.getProductsEvaluate);

        // let pagesLinks = await page.evaluate(() => {
        //     return Object.values(document.querySelectorAll('#pagination a')).map(a => {
        //         return window.location.protocol + a.getAttribute('href');
        //     });
        // });

        for (let i = 0; i < 50; i++) { // NOT: pageLinks.length kaldırıldı, yerine statik olarak 50 verildi farklı mağazalada bu duruma göre uygulanmalı
            await page.goto(url + "?sayfa=" + i);
            let products = await page.evaluate(this.getProductsEvaluate);
            data = data.concat(products);
            this.log().info(`Getting products; Page: ${i + 1}; Shop: ${this.shopId};`);
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

    async getProductDetailFromProductPage(url: string, category: string, page: Page) : Promise<IProduct> {
        try {
            await page.goto(url, {waitUntil: 'load', timeout: 0});
        } catch (err) {
            return null;
        }

        await page.addScriptTag({ path: path.join(__dirname, '../../dist/core/AttributeGeneralizer.js')});

        let data = await page.evaluate((category) => {
            //stock check
            if (document.querySelector('.product-detail-box[style="display: none"]') === null) {
                return;
            }

            let id = document.querySelector('[itemprop="sku"]').getAttribute('content');
            let productName = document.getElementById('product-name').textContent.trim();
            let price = document.querySelector('[id="offering-price"]').textContent.replace(/[^0-9.,]/g, '');
            let originalPrice = document.querySelector('[id="originalPrice"]').textContent.replace(/[^0-9.,]/g, '');
            let dealerName = document.querySelector('.seller-container .seller a').textContent;
            let dealerPoint = document.querySelector('.merchant-rating').textContent;
            let shipping = document.querySelector('[data-bind="html: timerForShipment.dueText"]').textContent;
            let comments = document.querySelector('#productReviewsTab').textContent.replace(/[^0-9]/g, '');
            let brand = document.querySelector('.brand-name').textContent.trim();
            let image = document.querySelector('img.product-image').getAttribute('src');
            let attributes = [];

            document.querySelectorAll('[class="data-list tech-spec"] tr').forEach((e) => {
                let attrName = e.querySelector('th').textContent;
                let attrValue = e.querySelector('td').textContent;
                let generalized = hepsiburadaGeneralizer[category](attrName, attrValue);

                attributes.push({
                    "attributeName": generalized.attrName,
                    "attributeValue": generalized.attrValue
                });
            });

            return {
                id: id,
                name: productName,
                price: price,
                originalPrice: originalPrice,
                image: image,
                url: window.location.href,
                categories: [],
                attributes: attributes,
                commentCount: comments,
                dealerName: dealerName,
                dealerPoint: dealerPoint,
                shipping: shipping,
                brand: brand,
                shopId: '',
                mainId: id
            }
        }, category);

        if (data) {
            data.categories = [
                category,
                category + ' ' + data.brand
            ];
        }

        return this.objectToProduct(data);
    }

    getRelatedProductsFromSearching(string: string, category: string, page: Page): Promise<IProduct[]> {
        throw new Error('Method not implemented.');
    }
}

export default Hepsiburada;