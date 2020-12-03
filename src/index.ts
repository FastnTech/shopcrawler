import BrowserManager from "./core/BrowserManager";
import Hepsiburada from './shops/Hepsiburada';
import './database';
import {IProduct} from "./interfaces/IProduct";
import ShopProduct from "./entities/ShopProduct";

(async () => {
    let browserManager: BrowserManager = new BrowserManager();

    let browser = await browserManager.startBrowser();
    let page = await browser.newPage();

    let hepsi = new Hepsiburada();

    let categoryPageUri = 'https://www.hepsiburada.com/laptop-notebook-dizustu-bilgisayarlar-c-98';
    let products: IProduct[] = await hepsi.getProductsFromCategoryPage(categoryPageUri, page);

    for (let product of products) {
        let _product: IProduct = await hepsi.getProductDetailFromProductPage(product.url, "Laptop", page);

        if (product.id != "") {
            hepsi.updateAndCreateProducts([_product]);
        }
    }

    console.log("Finish");

    page.close();
    browserManager.destroyBrowser();

    process.exit();
})();