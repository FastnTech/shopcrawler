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
    let categoryPageUri = 'https://www.hepsiburada.com/laptop-notebook-dizustu-bilgisayarlar-c-98';
    let shopProducts: IProduct[] = await hepsi.getProductsFromCategoryPage(categoryPageUri, page);

    for (let shopProduct of shopProducts) {
        let _product: IProduct = await hepsi.getProductDetailFromProductPage(shopProduct.url, "Laptop", page);

        if (_product && _product.id !== "") {
            _product.mainId = shopProduct.id;
            await hepsi.updateAndCreateProducts([_product], true);
        }
    }

    console.log("Finish");

    page.close();
    browserManager.destroyBrowser();

    process.exit();
})();