import Shop from '../abstract/Shop';
import { Page } from 'puppeteer';
import { IShopCategory } from '../entities/ShopCategory';
import { IProduct } from "../interfaces/IProduct";
import Filter from '../abstract/Filter';
import LaptopFilters from '../Filters/trendyol/LaptopFilters';
import * as path from 'path';

class Trendyol extends Shop {
    shopId: string = "trendyol";
    shopUrl: string = "https://www.trendyol.com";
    shopName: string = "Trendyol";
    laptopFilters: Filter = new LaptopFilters();

    getProductsFromCategoryPage(url: string, page: Page): Promise<IProduct[]> {
        throw new Error('Method not implemented.');
    }

    getCategoriesFromMainPage(page: Page): Promise<IShopCategory[]> {
        throw new Error('Method not implemented.');
    }

    async getRelatedProductsFromSearching(name: string, category: string, page: Page): Promise<IProduct[]> {
        let newName: string = name.split(' ').slice(0, 5).join(' ');

        try {
            await page.goto("https://www.trendyol.com/sr?q=" + encodeURIComponent(newName), { 
                waitUntil: 'load', timeout: 0
            });
        } catch (err) {
            return [];
        }

        let productUrls: string[] = await page.evaluate(() => {
            let title = document.querySelector('.srch-rslt-title');

            if (title && title.textContent.indexOf('bulunamadı') !== -1) {
                return [];
            }

            let links = [];

            document.querySelectorAll('.prdct-cntnr-wrppr .p-card-wrppr a').forEach((e) => {
                links.push(e.getAttribute('href'));
            });

            return links;
        });

        let products = [];

        for (let productUrl of productUrls) {
            if (productUrl === "") {
                return null;
            }

            let product = await this.getProductDetailFromProductPage(this.shopUrl + productUrl, category, page);
            products.push(product);
        }

        return products;
    }

    async getProductDetailFromProductPage(url: string, category: string, page: Page): Promise<IProduct> {
        try {
            await page.goto(url, {waitUntil: 'load', timeout: 0});
        } catch (err) {
            return null;
        }

        await this.sleep(1500);

        await page.addScriptTag({ path: path.join(__dirname, '../../dist/core/AttributeGeneralizer.js')})

        let data = await page.evaluate((category) => {
            try {
                // giriş yapmış kullanıcılar için .so (sold out) yok .notify-me-btn var
                if (document.querySelector('.pr-in-btn.add-to-bs.so') !== null) {
                    return null;
                }

                let id = window["productDetailDatalayerObject"]["ProductId"] || '';
                let productName = window["productDetailDatalayerObject"]["ProductName"] || '';
                let price = window["productDetailDatalayerObject"]["DiscountedPrice"] || window["productDetailDatalayerObject"]["SalePrice"] || '';
                let originalPrice = window["productDetailDatalayerObject"]["SalePrice"] || '';
                let dealerName = window["productDetailDatalayerObject"]["ProductMerchant"] || '';
                let dealerPoint = document.querySelector('.sl-pn').textContent.trim();
                let shipping = document.querySelector('.pr-dd-rs-w').textContent.trim();
                let comments = document.querySelectorAll('.pr-rnr-sm-p-s span')[1].textContent.trim();
                let brand = window["productDetailDatalayerObject"]["BrandName"] || '';
                let image = document.querySelector('.ph-gl-slc img').getAttribute('src') || '';
                let attributes = [];

                id = id.toString();
                price = price.toString().replace(/\./g, ',');
                originalPrice = price.toString().replace(/\./g, ',');

                document.querySelectorAll('.pr-prop .prop-item').forEach((e) => {
                    let attrName = e.querySelector('.item-key').textContent.trim().replace(/:/g, '');
                    let attrValue = e.querySelector('.item-value').textContent.trim();
                    let generalized = trendyolGeneralizer[category](attrName, attrValue);

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
}

export default Trendyol