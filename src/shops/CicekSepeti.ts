import Shop from '../abstract/Shop';
import { Page } from 'puppeteer';
import { IShopCategory } from '../entities/ShopCategory';
import { IProduct } from "../interfaces/IProduct";
import Filter from '../abstract/Filter';
import LaptopFilters from '../Filters/ciceksepeti/LaptopFilters';
import * as path from 'path';

class CicekSepeti extends Shop {
    shopId: string = "ciceksepeti";
    shopUrl: string = "https://www.ciceksepeti.com";
    shopName: string = "ÇiçekSepeti";
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
            await page.goto("https://www.ciceksepeti.com/Arama?query=" + encodeURIComponent(newName).trim().toLowerCase(), { 
                waitUntil: 'load', timeout: 0
            });
        } catch (err) {
            return [];
        }

        let productUrls: string[] = await page.evaluate(() => {
            let links = [];

            document.querySelectorAll('.products.products--category .products__item a').forEach((e) => {
                links.push(e.getAttribute('href'));
            });

            return links;
        });

        productUrls = productUrls.slice(0, 20);

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

        await page.evaluate(_ => {
            window.scrollBy(0, window.innerHeight);
        });

        await page.addScriptTag({path: path.join(__dirname, '../../dist/core/FunctionInjector.js')}); // local dev
        //await page.addScriptTag({path: path.join(__dirname, '../FunctionInjector.js')}); // circle ci

        let data: any = await page.evaluate(() => {
            try {
                //out-of-stock check
                if (document.querySelector('.product__not-available.js-product-not-available.js-no-stock') !== null || document.querySelector('#productCode') === null) {
                    return null;
                }

                let id = getAttributeFromElement(document.querySelector('#productCode'), 'value');
                let productName = getTextContentFromElement(document.querySelector('.product__info__title'));
                let price = getPriceFromElement(document.querySelector('.product__info__new-price'));
                let originalPrice = getPriceFromElement(document.querySelector('.product__info__old-price')) || price;
                let dealerName = getTextContentFromElement(document.querySelector('a[href*="storeid"]'));
                let dealerPoint = '';
                let shipping = getTextContentFromElement(document.querySelector('.js-delivery-estimation')).trim();
                let comments = getTextContentFromElement(document.querySelector('.js-comments-count'));
                let brand = '';
                let image = getAttributeFromElement(document.querySelector('.product__image'), 'src');
                let attributes = [];

                document.querySelectorAll('.product__specifications__table-body .product__specifications__table-row').forEach((e) => {
                    let attrName = e.querySelectorAll('.product__specifications__table-cell')[0].textContent.trim();
                    let attrValue = e.querySelectorAll('.product__specifications__table-cell')[1].textContent.trim();

                    if (attrName === "Ram (Sistem Belleği)") {
                        attrName = "RAM";
                        attrValue = attrValue.replace(/[^0-9]/g, '') + " GB";
                    }

                    if (attrName === "SSD Kapasitesi") {
                        attrName = "SSD";
                        attrValue = attrValue.replace(/[^0-9 TGBtgb]/g, '').toUpperCase().trim();
                    }

                    if (attrName === "Kapasite") {
                        attrName = "HDD";
                        attrValue = attrValue.replace(/[^0-9 TGBtgb]/g, '').toUpperCase().trim();
                    }

                    if (attrName === "İşlemci Tipi") {
                        attrName = "İşlemci";
                        attrValue = attrValue.toLocaleUpperCase();
                    }

                    if (attrName === "İşlemci Modeli") {
                        attrName = "İşlemci Model";
                        attrValue = attrValue.toLocaleUpperCase();
                    }

                    if (attrName === "Ekran Boyutu") {
                        attrName = "Ekran Boyutu";
                        attrValue = attrValue.split('-')[0].replace(/[^0-9.,]/g, '').replace(/,/g, '.');
                    }

                    attributes.push({
                        "attributeName": attrName,
                        "attributeValue": attrValue
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
        });

        if (data) {
            data.categories = [
                category,
                category + ' ' + data.brand
            ];
        }

        return this.objectToProduct(data);
    }
}

export default CicekSepeti