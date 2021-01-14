import Shop from '../abstract/Shop';
import { Page } from 'puppeteer';
import { IShopCategory } from '../entities/ShopCategory';
import { IProduct } from "../interfaces/IProduct";
import Filter from '../abstract/Filter';
import LaptopFilters from '../Filters/n11/LaptopFilters';
import * as path from 'path';

class n11 extends Shop {
    shopId: string = "n11";
    shopName: string = "n11";
    shopUrl: string = "https://www.n11.com/";
    laptopFilters: Filter = new LaptopFilters();

    getProductsEvaluate () {
        let products = document.querySelectorAll('.group.listingGroup.resultListGroup.import-search-view .catalogView ul li');

        if (products) {
            products = document.querySelectorAll('.group.listingGroup.resultListGroup.import-search-view .listView ul li');
        }

        let data = [];

        products.forEach(function (e) {
            if (!e.querySelector('.productName')) {
                return;
            }
            let name = e.querySelector('.productName').textContent.trim();
            let url = e.querySelector('a').getAttribute('href');
            let id = e.querySelector('a').getAttribute('data-id');
            let priceElement = e.querySelector('.view-instant-price');
            let oldPricesElements = e.querySelectorAll('.oldPrice, .newPrice');
            let image = e.querySelector('img').getAttribute('data-original');

            if (priceElement == null) {
                priceElement = e.querySelector('.newPrice');
                oldPricesElements = e.querySelectorAll('.oldPrice');
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
        let data = [];

        try {
            await page.goto(url, {waitUntil: 'load', timeout: 0});

            data = await page.evaluate(this.getProductsEvaluate);

            let pagesLinks = await page.evaluate(() => {
                return Object.values(document.querySelectorAll('.pagination a')).map(a => {
                    return a.getAttribute('href');
                });
            });

            for (let i = 0; i < pagesLinks.length; i++) {
                await page.goto(pagesLinks[i], {waitUntil: 'load', timeout: 0});
                let products = await page.evaluate(this.getProductsEvaluate);
                data = data.concat(products);
                this.log().info(`Getting products; Page: ${i + 1}; Products: ${products.length}; Shop: ${this.shopId};`);
            }
        } catch (err) {
            this.log().warn(`An error occurred on page; Shop: ${this.shopId};`);
        }

        return this.arrayToProductList(data);
    }

    async getProductDetailFromProductPage(url: string, category: string, page: Page): Promise<IProduct> {
        try {
            await page.goto(url, {waitUntil: 'load', timeout: 0});
        } catch (err) {
            return null;
        }

        await this.sleep(1500);

        await page.addScriptTag({ path: path.join(__dirname, '../../dist/core/AttributeGeneralizer.js') });

        let data = await page.evaluate((category) => {
            try {
                if (document.querySelector('[id="outOfStock"]').getAttribute("value") === "true") {
                    return null;
                }

                let id = document.querySelector('[name="skuId"]').getAttribute('value');
                let productName = document.querySelector('.proName').textContent.trim();
                let price = document.querySelector('.newPrice').textContent.replace(/[^0-9.,]/g, '');
                let originalPrice = document.querySelector('.oldPrice ').textContent.replace(/[^0-9.,]/g, '') || price;
                let dealerName = document.querySelector('.sallerTop a').textContent;
                let dealerPoint = document.querySelector('.shopPoint .point') ? document.querySelector('.shopPoint .point').textContent.trim() : '-';
                let shipping = document.querySelector('.cargoTime').textContent.trim();
                let comments = document.querySelector('#tabProductCom').textContent.replace(/[^0-9]/g, '');
                let brand = document.querySelector('a[href*="markalar"]').textContent.trim();
                let image = document.querySelector('.imgObj img').getAttribute('src');
                let attributes = [];

                document.querySelectorAll('.tabPanelItem.features .feaItem').forEach((e) => {
                    let attrName = e.querySelector('.label').textContent.trim();
                    let attrValue = e.querySelector('.data').textContent.trim();
                    let generalized = n11Generalizer[category](attrName, attrValue);

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
            } catch (err) {
                return null;
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

    async getRelatedProductsFromSearching(name: string, category: string, page: Page): Promise<IProduct[]> {
        let newName: string = name.split(' ').slice(0, 5).join('+');

        try {
            await page.goto("https://www.n11.com/arama?q=" + encodeURIComponent(newName), {waitUntil: 'load', timeout: 0});
        } catch (err) {
            return [];
        }

        let productUrls: string[] = await page.evaluate(() => {
            if (document.querySelector('.result-mean-text-mm') !== null) {
                return [];
            }

            let links = [];

            document.querySelectorAll('[id="view"].listView > ul > li').forEach(function (e) {
                links.push(e.querySelector('.plink').getAttribute('href'));
            });

            return links;
        });

        let products = [];

        for (let productUrl of productUrls) {
            if (productUrl === "") {
                return null;
            }
    
            let product = await this.getProductDetailFromProductPage(productUrl, category, page);
            products.push(product);
        }

        return products;
    }

    async getCategoriesFromMainPage(page: Page): Promise<IShopCategory[]> {
        return undefined;
    }
}

export default n11;