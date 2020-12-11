import BrowserManager from "./core/BrowserManager";
import Hepsiburada from './shops/Hepsiburada';
import n11 from './shops/n11';
import './database';
import {IProduct} from "./interfaces/IProduct";
import ShopProduct, {IShopProduct} from "./entities/ShopProduct";

(async () => {
    let browserManager: BrowserManager = new BrowserManager();

    let browser = await browserManager.startBrowser();
    let page = await browser.newPage();

    let hepsi = new Hepsiburada();
    let nonbir = new n11();

    let shopProducts: IShopProduct[] = await hepsi.getAllProductsFromDatabase();

    for (let shopProduct of shopProducts) {
        let _products: IProduct[] = await nonbir.getRelatedProductsFromSearching(shopProduct.name, "Laptop", page);

        for (let product of _products) {
            if (product && typeof product["id"] !== "undefined" && product["id"] !== "") {
                product.mainId = shopProduct.id;
                await nonbir.updateAndCreateProducts([product]);
            }
        }
    }

    console.log("Finish");

    page.close();
    browserManager.destroyBrowser();

    process.exit();
})();