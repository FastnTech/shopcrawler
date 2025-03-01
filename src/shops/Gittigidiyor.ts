import Shop from '../abstract/Shop';
import { Page } from 'puppeteer';
import { IShopCategory } from '../entities/ShopCategory';
import { IProduct } from '../interfaces/IProduct';
import Filter from '../abstract/Filter';
import LaptopFilters from '../Filters/gittigidiyor/LaptopFilters';
import DesktopPCFilters from '../Filters/gittigidiyor/DesktopPCFilters';
import MotherboardFilters from '../Filters/gittigidiyor/MotherboardFilters';
import * as path from 'path';

class Gittigidiyor extends Shop {
    shopId: string = "gittigidiyor";
    shopUrl: string = "https://www.gittigidiyor.com/";
    shopName: string = "Gittigidiyor";
    filters: { [x: string]: Filter; } = {
        "Laptop": new LaptopFilters(),
        "Masaüstü Bilgisayar": new DesktopPCFilters(),
        "Anakart": new MotherboardFilters()
    };

    getProductsFromCategoryPage(url: string, page: Page): Promise<IProduct[]> {
        throw new Error('Method not implemented.');
    }

    getCategoriesFromMainPage(page: Page): Promise<IShopCategory[]> {
        throw new Error('Method not implemented.');
    }

    async getRelatedProductsFromSearching(name: string, category: string, page: Page): Promise<IProduct[]> {
        let newName: string = name.split(' ').slice(0, 5).join(' ');

        try {
            await page.goto("https://www.gittigidiyor.com/arama/?k=" + encodeURIComponent(newName), { 
                waitUntil: 'load', timeout: 0
            });
        } catch (err) {
            return [];
        }

        let productUrls: string[] = await page.evaluate(() => {
            let title = document.querySelector('.search-info');

            if (title && title.textContent.indexOf('bulunamadı') !== -1) {
                return [];
            }

            let links = [];

            document.querySelectorAll('.products-container > li[product-id] a.product-link').forEach((e) => {
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

        await page.addScriptTag({ path: path.join(__dirname, '../../dist/core/AttributeGeneralizer.js')});

        let data = await page.evaluate((category) => {
            try {
                let id = document.querySelector('#productId').getAttribute('value');
                let productName = (document.querySelector('#sp-title') || { textContent: "" }).textContent;
                let price = (document.querySelector('#sp-price-highPrice') || { textContent: "0" }).textContent.replace(/[^0-9.,]/g, '');
                let originalPrice = price;
                let dealerName = (document.querySelector('#sp-member-nick') || { textContent: "" }).textContent.trim();
                let dealerPoint = (document.querySelector('#sp-positiveCommentPercentage') || { textContent: "" }).textContent;
                let shipping = (document.querySelector('.shippingTimeText') || { textContent: "" }).textContent.trim();
                let comments = (document.querySelector('.best-review-all-reviews') || { textContent: "0" }).textContent.replace(/[^0-9]/g, '');
                let brand = (document.querySelector('[id="spp-brand"]') || { textContent: "" }).textContent.trim();
                let image = document.querySelector('#big-photo').getAttribute('src');
                let attributes = [];

                if (document.querySelectorAll('.catalog-info-content ul.product-items > li') && document.querySelectorAll('.catalog-info-content ul.product-items > li').length > 10 || document.querySelectorAll('.catalog-info-content tr') && document.querySelectorAll('.catalog-info-content tr').length > 10) {
                    let list = document.querySelectorAll('.catalog-info-content ul.product-items > li');
                    let table = document.querySelectorAll('.catalog-info-content tr');

                    (list.length > 0 ? list : table).forEach((e, i) => {
                        let attrName = '';
                        let attrValue = '';

                        if (e.querySelector('.spec-title')) {
                            attrName = e.querySelector('.spec-title').textContent.trim();
                            attrValue = e.querySelector('.productFeaturesitemList').textContent.trim();
                        } else if (e.querySelectorAll('td').length > 1) {
                            attrName = e.querySelector('.spec-title').textContent.trim();
                            attrValue = e.querySelector('.productFeaturesitemList').textContent.trim();
                        } else {
                            return;
                        }
    
                        let generalized = gittigidiyorGeneralizer[category](attrName, attrValue);

                        attributes.push({
                            "attributeName": generalized.attrName,
                            "attributeValue": generalized.attrValue
                        });
                    });
                }

                if (document.querySelectorAll('.tech-spec tr') && attributes.length === 0) {
                    document.querySelectorAll('.tech-spec tr').forEach((e) => {
                        let attrName = e.querySelectorAll('td')[0].textContent.trim();
                        let attrValue = e.querySelectorAll('td')[1].textContent.trim();

                        if (attrName === "Ram (Sistem Belleği)") {
                            attrName = "RAM";
                            attrValue = attrValue.replace(/[^0-9]/g, '') + " GB";
                        }
    
                        if (attrName === "SSD Kapasitesi") {
                            attrName = "SSD";
                            attrValue = attrValue.replace(/[^0-9 TGBtgb]/g, '').toUpperCase().trim();
                        }
    
                        if (attrName === "Harddisk Kapasitesi") {
                            attrName = "HDD";
                            attrValue = attrValue.replace(/[^0-9 TGBtgb]/g, '').toUpperCase().trim();
                        }
    
                        if (attrName === "İşlemci Tipi") {
                            attrName = "İşlemci";
                            attrValue = attrValue.toLocaleUpperCase();
                        }
    
                        if (attrName === "İşlemci") {
                            attrName = "İşlemci Model";
                            attrValue = attrValue.toLocaleUpperCase();
                        }
    
                        if (attrName === "Ekran Boyutu") {
                            attrName = "Ekran Boyutu";
                            attrValue = attrValue.replace(/[^0-9.,]/g, '').replace(/,/g, '.');
                        }
    
                        attributes.push({
                            "attributeName": attrName,
                            "attributeValue": attrValue
                        });
                    });
                }

                if (document.querySelectorAll('#productDescription table tr') && attributes.length === 0) {
                    document.querySelectorAll('.tech-spec tr').forEach((e) => {
                        let attrName = e.querySelectorAll('td')[0].textContent.trim();
                        let attrValue = e.querySelectorAll('td')[1].textContent.trim();

                        if (attrName === "Ram (Sistem Belleği)") {
                            attrName = "RAM";
                            attrValue = attrValue.replace(/[^0-9]/g, '') + " GB";
                        }
    
                        if (attrName === "SSD Kapasitesi") {
                            attrName = "SSD";
                            attrValue = attrValue.replace(/[^0-9 TGBtgb]/g, '').toUpperCase().trim();
                        }
    
                        if (attrName === "Harddisk Kapasitesi") {
                            attrName = "HDD";
                            attrValue = attrValue.replace(/[^0-9 TGBtgb]/g, '').toUpperCase().trim();
                        }
    
                        if (attrName === "İşlemci Tipi") {
                            attrName = "İşlemci";
                            attrValue = attrValue.toLocaleUpperCase();
                        }
    
                        if (attrName === "İşlemci") {
                            attrName = "İşlemci Model";
                            attrValue = attrValue.toLocaleUpperCase();
                        }
    
                        if (attrName === "Ekran Boyutu") {
                            attrName = "Ekran Boyutu";
                            attrValue = attrValue.replace(/[^0-9.,]/g, '').replace(/,/g, '.');
                        }
    
                        attributes.push({
                            "attributeName": attrName,
                            "attributeValue": attrValue
                        });
                    });
                }

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

export default Gittigidiyor;