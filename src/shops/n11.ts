// import { Page } from 'puppeteer';
// import Shop from '../abstract/Shop';
// import { IShopCategory } from '../entities/ShopCategory';
// import { IShopProduct } from '../entities/ShopProduct';
// import { catCategoryProd } from '../LogConfig';
// import {IProduct} from "../interfaces/IProduct";
//
// class n11 extends Shop {
//     shopUrl = "https://www.n11.com";
//     shopName = "n11";
//     shopId = "n11";
//
//     getProductsEvaluate () {
//         let products = document.querySelectorAll('.group.listingGroup.resultListGroup.import-search-view .catalogView ul li');
//
//         if (products) {
//             products = document.querySelectorAll('.group.listingGroup.resultListGroup.import-search-view .listView ul li');
//         }
//
//         let data = [];
//
//         products.forEach(function (e) {
//             if (!e.querySelector('.productName')) {
//                 return;
//             }
//             let name = e.querySelector('.productName').textContent.trim();
//             let url = e.querySelector('a').getAttribute('href');
//             let id = e.querySelector('a').getAttribute('data-id');
//             let priceElement = e.querySelector('.view-instant-price');
//             let oldPricesElements = e.querySelectorAll('.oldPrice, .newPrice');
//             let image = e.querySelector('img').getAttribute('data-original');
//
//             if (priceElement == null) {
//                 priceElement = e.querySelector('.newPrice');
//                 oldPricesElements = e.querySelectorAll('.oldPrice');
//             }
//
//             let price = (priceElement || {textContent: ''}).textContent.replace(/[^0-9.,]/g, '');
//             let currency = (priceElement || {textContent: ''}).textContent.replace(/[^TLRY]/g, '');
//
//             let oldPrices = [];
//
//             oldPricesElements.forEach(function (element) {
//                 oldPrices.push((element || {textContent: ''}).textContent.replace(/[^0-9.,]/g, ''))
//             });
//
//             if (price && currency && name && url && image) {
//                 data.push({
//                     id, name, price, url, oldPrices, image, currency
//                 });
//             }
//         });
//
//         return data;
//     }
//
//     async getProductsFromCategoryPage(url: string, page: Page): Promise<IProduct[]> {
//         let data = [];
//
//         try {
//             await page.goto(url);
//
//             data = await page.evaluate(this.getProductsEvaluate);
//
//             let pagesLinks = await page.evaluate(() => {
//                 return Object.values(document.querySelectorAll('.pagination a')).map(a => {
//                     return a.getAttribute('href');
//                 });
//             });
//
//             for (let i = 0; i < pagesLinks.length; i++) {
//                 await page.goto(pagesLinks[i]);
//                 let products = await page.evaluate(this.getProductsEvaluate);
//                 data = data.concat(products);
//                 catCategoryProd.info(() => `Getting products; Page: ${i + 1}; Products: ${products.length}; Shop: ${this.shopId};`);
//             }
//         } catch (err) {
//             catCategoryProd.info(() => `An error occurred on page; Shop: ${this.shopId};`);
//         }
//
//         return this.arrayToProductList(data);
//     }
//
//     async getCategoriesFromMainPage(page: Page): Promise<IShopCategory[]> {
//         await page.goto(this.shopUrl);
//
//         let data = await page.evaluate(async () => {
//             let categories = [];
//
//             document.querySelectorAll('.catMenu li a').forEach((cat) => {
//                 let href = cat.getAttribute('href');
//                 let text = cat.textContent.trim();
//
//                 if (href && text) {
//                     href = href.trim();
//
//                     categories.push({
//                         id: btoa(encodeURIComponent(text)),
//                         name: text,
//                         url: href
//                     });
//                 }
//             });
//
//             return categories;
//         });
//
//         return this.arrayToCategoryList(data);
//     }
//
//     async getRelatedProductsFromSearching(name: string, page: Page): Promise<IProduct[]> {
//         let data = [];
//
//         try {
//             catCategoryProd.info(() => `Search started with: ${name.slice(0, 50)};`);
//             await page.goto("https://www.n11.com/arama?q=" + encodeURIComponent(name.slice(0, 50)));
//
//             data = await page.evaluate(this.getProductsEvaluate);
//
//             catCategoryProd.info(() => `First data: ${data.length};`);
//
//             if (data.length > 0) {
//                 let pagesLinks = await page.evaluate(() => {
//                     return Object.values(document.querySelectorAll('.pagination a')).map(a => {
//                         return a.getAttribute('href');
//                     });
//                 });
//
//                 for (let i = 0; i < pagesLinks.length; i++) {
//                     await page.goto(pagesLinks[i]);
//                     let products = await page.evaluate(this.getProductsEvaluate);
//                     data = data.concat(products);
//                     catCategoryProd.info(() => `Getting products in search; Page: ${i + 1}; Products: ${products.length}; Shop: ${this.shopId};`);
//                 }
//             }
//         } catch (err) {
//             catCategoryProd.info(() => `An error occurred on page; Shop: ${this.shopId};`);
//         }
//
//         return this.arrayToProductList(data);
//     }
// }
//
// export default n11;