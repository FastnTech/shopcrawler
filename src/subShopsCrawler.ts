import BrowserManager from "./core/BrowserManager";
import Hepsiburada from './shops/Hepsiburada';
import n11 from './shops/n11';
import Trendyol from './shops/Trendyol';
import './database';
import {IProduct} from "./interfaces/IProduct";
import ShopProduct, {IShopProduct} from "./entities/ShopProduct";
import Shop from './abstract/Shop';

(async () => {
    let browserManager: BrowserManager = new BrowserManager();

    let browser = await browserManager.startBrowser();
    let page = await browser.newPage();

    let currentCategory = "Laptop";
    let hepsi = new Hepsiburada();
    let mainShopProducts: IShopProduct[] = await hepsi.getAllProductsFromDatabase();

    let nonbir = new n11();
    let trendyol = new Trendyol();

    let shops: Shop[] = [
        trendyol,
        nonbir,
    ];

    for (let i = 0; i < shops.length; i++) {
        let shop: Shop = shops[i];

        for (let shopProduct of mainShopProducts) {
            let _products: IProduct[] = await shop.getRelatedProductsFromSearching(shopProduct.name, currentCategory, page);

            for (let product of _products) {
                if (product && typeof product["id"] !== "undefined" && product["id"] !== "") {
                    product.mainId = shopProduct.id;
                    await shop.updateAndCreateProducts([product]);
                }
            }
        }
    }

    console.log("Crawl Finished");

    page.close();
    browserManager.destroyBrowser();

    process.exit();
})();